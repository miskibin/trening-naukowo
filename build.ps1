param(
    [string] $SdkRoot,
    [string] $BuildToolsVersion,
    [int] $TargetSdk = 0,
    [switch] $EnableWebViewDebug
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Invoke-Native {
    param(
        [Parameter(Mandatory = $true)][string] $Executable,
        [Parameter(Mandatory = $true)][string[]] $Arguments
    )

    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $Executable $($Arguments -join ' ')"
    }
}

function Resolve-AndroidSdk {
    param([string] $RequestedPath)

    $candidates = @()
    if ($RequestedPath) { $candidates += $RequestedPath }
    if ($env:ANDROID_SDK_ROOT) { $candidates += $env:ANDROID_SDK_ROOT }
    if ($env:ANDROID_HOME) { $candidates += $env:ANDROID_HOME }
    if ($env:LOCALAPPDATA) { $candidates += (Join-Path $env:LOCALAPPDATA 'Android\Sdk') }
    foreach ($candidate in $candidates) {
        if ($candidate -and (Test-Path -LiteralPath (Join-Path $candidate 'platforms'))) {
            return (Resolve-Path -LiteralPath $candidate).Path
        }
    }
    throw 'Android SDK not found. Pass -SdkRoot or set ANDROID_SDK_ROOT.'
}

function Add-AndroidAssets {
    param(
        [Parameter(Mandatory = $true)][string] $ApkPath,
        [Parameter(Mandatory = $true)][string] $AssetDirectory
    )

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $assetRoot = (Resolve-Path -LiteralPath $AssetDirectory).Path.TrimEnd('\') + '\'
    $assets = @(Get-ChildItem -LiteralPath $AssetDirectory -File -Recurse -Force)
    $archive = [System.IO.Compression.ZipFile]::Open($ApkPath, [System.IO.Compression.ZipArchiveMode]::Update)
    try {
        foreach ($asset in $assets) {
            $relativePath = $asset.FullName.Substring($assetRoot.Length).Replace('\', '/')
            $entry = $archive.CreateEntry("assets/$relativePath", [System.IO.Compression.CompressionLevel]::Optimal)
            $input = [System.IO.File]::OpenRead($asset.FullName)
            $output = $entry.Open()
            try {
                $input.CopyTo($output)
            } finally {
                $output.Dispose()
                $input.Dispose()
            }
        }
    } finally {
        $archive.Dispose()
    }
    return $assets.Count
}

$sdk = Resolve-AndroidSdk -RequestedPath $SdkRoot
$platformsPath = Join-Path $sdk 'platforms'
$platforms = @(Get-ChildItem -LiteralPath $platformsPath -Directory | Where-Object { $_.Name -match '^android-(\d+)$' })
if ($platforms.Count -eq 0) { throw "No Android platforms found under $platformsPath." }
$platformNumbers = @($platforms | ForEach-Object { [int]($_.Name -replace '^android-', '') } | Sort-Object -Unique)
$compileSdk = $platformNumbers[-1]
if ($TargetSdk -eq 0) {
    $supportedDefaults = @($platformNumbers | Where-Object { $_ -le 35 })
    if ($supportedDefaults.Count -gt 0) {
        $TargetSdk = $supportedDefaults[-1]
    } else {
        $TargetSdk = $compileSdk
    }
}
if ($TargetSdk -lt 26) { throw 'TargetSdk must be at least 26.' }
if ($platformNumbers -notcontains $TargetSdk) { throw "Platform android-$TargetSdk is not installed in $sdk." }

$buildToolsPath = Join-Path $sdk 'build-tools'
$buildToolDirs = @(Get-ChildItem -LiteralPath $buildToolsPath -Directory)
if ($BuildToolsVersion) {
    $selectedBuildTools = Join-Path $buildToolsPath $BuildToolsVersion
    if (-not (Test-Path -LiteralPath $selectedBuildTools)) { throw "Build tools $BuildToolsVersion are not installed." }
} else {
    $selectedBuildTools = $buildToolDirs |
        Sort-Object { try { [version]$_.Name } catch { [version]'0.0' } } -Descending |
        Select-Object -First 1 -ExpandProperty FullName
}
if (-not $selectedBuildTools) { throw "No Android build tools found under $buildToolsPath." }

$androidDir = Join-Path $PSScriptRoot 'android'
$mainDir = Join-Path $androidDir 'app\src\main'
$manifest = Join-Path $mainDir 'AndroidManifest.xml'
$resDir = Join-Path $mainDir 'res'
$assetsDir = Join-Path $mainDir 'assets'
$sourceDir = Join-Path $mainDir 'java'
if (-not (Test-Path -LiteralPath $manifest)) { throw "Missing Android manifest: $manifest" }
if (-not (Test-Path -LiteralPath (Join-Path $assetsDir 'index.html'))) {
    throw "Missing offline app entry point: $(Join-Path $assetsDir 'index.html')"
}

$java = (Get-Command 'java' -ErrorAction SilentlyContinue).Source
$javac = (Get-Command 'javac' -ErrorAction SilentlyContinue).Source
$jar = (Get-Command 'jar' -ErrorAction SilentlyContinue).Source
$keytool = (Get-Command 'keytool' -ErrorAction SilentlyContinue).Source
foreach ($tool in @(@{Name='java'; Path=$java}, @{Name='javac'; Path=$javac}, @{Name='jar'; Path=$jar}, @{Name='keytool'; Path=$keytool})) {
    if (-not $tool.Path) { throw "Required JDK command not found: $($tool.Name)" }
}

$aapt2 = Join-Path $selectedBuildTools 'aapt2.exe'
$d8 = Join-Path $selectedBuildTools 'd8.bat'
$zipalign = Join-Path $selectedBuildTools 'zipalign.exe'
$apksigner = Join-Path $selectedBuildTools 'apksigner.bat'
foreach ($toolPath in @($aapt2, $d8, $zipalign, $apksigner)) {
    if (-not (Test-Path -LiteralPath $toolPath)) { throw "Required Android build tool is missing: $toolPath" }
}

$androidJar = Join-Path $sdk "platforms\android-$compileSdk\android.jar"
if (-not (Test-Path -LiteralPath $androidJar)) { throw "Missing Android framework jar: $androidJar" }

$buildDir = Join-Path $androidDir 'build'
$null = New-Item -ItemType Directory -Force -Path $buildDir
$workDir = Join-Path $buildDir ('work-' + [Guid]::NewGuid().ToString('N'))
$null = New-Item -ItemType Directory -Force -Path $workDir
$resZip = Join-Path $workDir 'compiled-resources.zip'
$generatedDir = Join-Path $workDir 'generated'
$classDir = Join-Path $workDir 'classes'
$dexDir = Join-Path $workDir 'dex'
foreach ($directory in @($generatedDir, $classDir, $dexDir)) {
    $null = New-Item -ItemType Directory -Force -Path $directory
}
$unsignedApk = Join-Path $workDir 'unsigned.apk'
$alignedApk = Join-Path $workDir 'aligned.apk'
$classesJar = Join-Path $workDir 'classes.jar'
$outputApk = Join-Path $buildDir 'TreningNaukowo.apk'
$keystore = Join-Path $buildDir 'debug.keystore'

try {
    Invoke-Native -Executable $aapt2 -Arguments @('compile', '--dir', $resDir, '-o', $resZip)

    $linkArgs = @(
        'link', '-o', $unsignedApk,
        '--manifest', $manifest,
        '-I', $androidJar,
        '--min-sdk-version', '26',
        '--target-sdk-version', [string]$TargetSdk,
        '--version-code', '6',
        '--version-name', '1.5.0',
        '--java', $generatedDir,
        '-R', $resZip
    )
    if ($EnableWebViewDebug) { $linkArgs += '--debug-mode' }
    Invoke-Native -Executable $aapt2 -Arguments $linkArgs
    $assetCount = Add-AndroidAssets -ApkPath $unsignedApk -AssetDirectory $assetsDir
    Write-Host "Packaged $assetCount offline asset files."

    $buildConfigPath = Join-Path $generatedDir 'pl\trening\naukowo\BuildConfig.java'
    $null = New-Item -ItemType Directory -Force -Path (Split-Path -Parent $buildConfigPath)
    $debugValue = if ($EnableWebViewDebug) { 'true' } else { 'false' }
    $buildConfigSource = "package pl.trening.naukowo;`npublic final class BuildConfig { public static final boolean DEBUG = $debugValue; private BuildConfig() {} }`n"
    [System.IO.File]::WriteAllText($buildConfigPath, $buildConfigSource, [System.Text.UTF8Encoding]::new($false))

    $javaSources = @(
        Get-ChildItem -LiteralPath $sourceDir -Filter '*.java' -File -Recurse | ForEach-Object { $_.FullName }
        Get-ChildItem -LiteralPath $generatedDir -Filter '*.java' -File -Recurse | ForEach-Object { $_.FullName }
    )
    if ($javaSources.Count -eq 0) { throw "No Java sources found under $sourceDir." }
    Invoke-Native -Executable $javac -Arguments (@('-encoding', 'UTF-8', '-source', '8', '-target', '8', '-Xlint:-options', '-classpath', $androidJar, '-d', $classDir) + $javaSources)
    Invoke-Native -Executable $jar -Arguments @('cf', $classesJar, '-C', $classDir, '.')
    Invoke-Native -Executable $d8 -Arguments @('--min-api', '26', '--lib', $androidJar, '--output', $dexDir, $classesJar)
    Invoke-Native -Executable $jar -Arguments @('uf', $unsignedApk, '-C', $dexDir, 'classes.dex')
    Invoke-Native -Executable $zipalign -Arguments @('-f', '-p', '4', $unsignedApk, $alignedApk)

    if (-not (Test-Path -LiteralPath $keystore)) {
        Invoke-Native -Executable $keytool -Arguments @(
            '-genkeypair', '-keystore', $keystore,
            '-storepass', 'android', '-alias', 'androiddebugkey', '-keypass', 'android',
            '-dname', 'CN=Android Debug,O=Android,C=US', '-keyalg', 'RSA',
            '-keysize', '2048', '-validity', '10000', '-noprompt'
        )
    }
    Invoke-Native -Executable $apksigner -Arguments @('sign', '--ks', $keystore, '--ks-pass', 'pass:android', '--key-pass', 'pass:android', '--out', $outputApk, $alignedApk)
    Invoke-Native -Executable $apksigner -Arguments @('verify', '--verbose', $outputApk)

    $apkInfo = Get-Item -LiteralPath $outputApk
    Write-Host "Built $($apkInfo.FullName) ($([Math]::Round($apkInfo.Length / 1KB)) KB)"
    Write-Host "compileSdk=$compileSdk targetSdk=$TargetSdk minSdk=26 buildTools=$((Split-Path $selectedBuildTools -Leaf)) debugWebView=$([bool]$EnableWebViewDebug)"
} finally {
    $resolvedBuildDir = (Resolve-Path -LiteralPath $buildDir).Path.TrimEnd('\') + '\'
    $resolvedWorkDir = (Resolve-Path -LiteralPath $workDir).Path
    if ($resolvedWorkDir.StartsWith($resolvedBuildDir, [System.StringComparison]::OrdinalIgnoreCase)) {
        Remove-Item -LiteralPath $resolvedWorkDir -Recurse -Force
    }
}
