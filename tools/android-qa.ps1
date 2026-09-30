param(
    [string] $SdkRoot,
    [string] $RunLabel,
    [switch] $PrepareOnly,
    [switch] $UsePreparedAvd
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Invoke-Native {
    param(
        [Parameter(Mandatory = $true)][string] $Executable,
        [Parameter(Mandatory = $true)][string[]] $Arguments
    )

    $output = & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $Executable $($Arguments -join ' ')"
    }
    return ($output -join [Environment]::NewLine)
}

function Invoke-Adb {
    param([Parameter(Mandatory = $true)][string[]] $Arguments)
    return Invoke-Native -Executable $script:adb -Arguments (@('-s', $script:serial) + $Arguments)
}

function Test-ListeningPort {
    param([int] $Port)
    return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1)
}

$workspace = Split-Path -Parent $PSScriptRoot
$sdkCandidates = @()
if ($SdkRoot) { $sdkCandidates += $SdkRoot }
if ($env:ANDROID_SDK_ROOT) { $sdkCandidates += $env:ANDROID_SDK_ROOT }
if ($env:ANDROID_HOME) { $sdkCandidates += $env:ANDROID_HOME }
if ($env:LOCALAPPDATA) { $sdkCandidates += (Join-Path $env:LOCALAPPDATA 'Android\Sdk') }
$sdk = $sdkCandidates | Where-Object { $_ -and (Test-Path -LiteralPath (Join-Path $_ 'emulator\emulator.exe')) } | Select-Object -First 1
if (-not $sdk) { throw 'Android SDK emulator was not found. Pass -SdkRoot or set ANDROID_SDK_ROOT.' }
$emulator = Join-Path $sdk 'emulator\emulator.exe'
$script:adb = Join-Path $sdk 'platform-tools\adb.exe'
if (-not (Test-Path -LiteralPath $script:adb)) { throw "Missing adb executable: $script:adb" }

$avdHome = Join-Path $workspace 'qa\avd'
$androidUserHome = Join-Path $avdHome 'android-user'
$nativeQa = Join-Path $workspace 'qa\native'
$avdName = 'trening_native_qa'
$script:serial = 'emulator-5586'
$avdDir = Join-Path $avdHome ($avdName + '.avd')
$avdIni = Join-Path $avdHome ($avdName + '.ini')
$configIni = Join-Path $avdDir 'config.ini'
$imageDirectory = Join-Path $sdk 'system-images\android-35\google_apis_playstore_ps16k\x86_64'
$apkPath = Join-Path $workspace 'android\build\TreningNaukowo.apk'
$ownershipPath = Join-Path $nativeQa 'ownership.json'
if ($RunLabel) {
    if ($RunLabel -notmatch '^[a-z0-9]+(?:[.-][a-z0-9]+)*$') { throw "RunLabel must use lowercase groups separated by single dots or hyphens: $RunLabel" }
    $suffix = '-' + $RunLabel
    $ownershipPath = Join-Path $nativeQa ('ownership' + $suffix + '.json')
} else {
    $suffix = ''
}
$stdoutPath = Join-Path $nativeQa ('emulator' + $suffix + '.stdout.log')
$stderrPath = Join-Path $nativeQa ('emulator' + $suffix + '.stderr.log')

$requiredInputs = @($imageDirectory)
if (-not $PrepareOnly) { $requiredInputs += $apkPath }
foreach ($path in $requiredInputs) {
    if (-not (Test-Path -LiteralPath $path)) { throw "Required emulator QA input is missing: $path" }
}
foreach ($port in @(5586, 5587, 9223)) {
    if (Test-ListeningPort -Port $port) { throw "Required QA port $port is already in use; no emulator was started." }
}

$null = New-Item -ItemType Directory -Force -Path $avdHome,$androidUserHome,$nativeQa

$avdConfig = @(
    'AvdId=' + $avdName
    'PlayStore.enabled=true'
    'abi.type=x86_64'
    'avd.ini.displayname=Trening Naukowo Native QA'
    'avd.ini.encoding=UTF-8'
    'disk.dataPartition.size=4294967296'
    'fastboot.forceColdBoot=yes'
    'hw.accelerometer=yes'
    'hw.audioInput=yes'
    'hw.battery=yes'
    'hw.camera.back=virtualscene'
    'hw.camera.front=emulated'
    'hw.cpu.arch=x86_64'
    'hw.cpu.ncore=4'
    'hw.device.manufacturer=Google'
    'hw.device.name=pixel_7'
    'hw.gps=yes'
    'hw.gpu.enabled=yes'
    'hw.gpu.mode=swiftshader_indirect'
    'hw.initialOrientation=Portrait'
    'hw.keyboard=yes'
    'hw.lcd.density=420'
    'hw.lcd.height=2400'
    'hw.lcd.width=1080'
    'hw.ramSize=4096'
    'hw.sdCard=no'
    'hw.sensors.orientation=yes'
    'hw.sensors.proximity=yes'
    'image.sysdir.1=system-images\android-35\google_apis_playstore_ps16k\x86_64\'
    'runtime.network.latency=none'
    'runtime.network.speed=full'
    'showDeviceFrame=no'
    'skin.dynamic=yes'
    'tag.display=Google Play'
    'tag.id=google_apis_playstore_ps16k'
    'vm.heapSize=512'
)
$avdIniLines = @(
    'avd.ini.encoding=UTF-8'
    ('path=' + $avdDir)
    ('path.rel=avd/' + $avdName + '.avd')
    'target=android-35'
)
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$avdExists = (Test-Path -LiteralPath $avdIni) -or (Test-Path -LiteralPath $avdDir)
if ($avdExists) {
    if (-not $UsePreparedAvd) { throw "The isolated QA AVD already exists at $avdDir. Pass -UsePreparedAvd only for the verified workspace AVD." }
    if (-not ((Test-Path -LiteralPath $avdIni) -and (Test-Path -LiteralPath $configIni) -and (Test-Path -LiteralPath $avdDir))) {
        throw "The prepared AVD is incomplete: $avdDir"
    }
    if (Test-Path -LiteralPath $ownershipPath) { throw "An ownership record already exists at $ownershipPath; inspect the existing emulator before reuse." }
    $actualConfig = @(Get-Content -LiteralPath $configIni)
    $actualIni = @(Get-Content -LiteralPath $avdIni)
    if ((Compare-Object -ReferenceObject $avdConfig -DifferenceObject $actualConfig) -or
        (Compare-Object -ReferenceObject $avdIniLines -DifferenceObject $actualIni)) {
        throw "The prepared workspace AVD configuration differs from this script's expected API 35 configuration: $avdDir"
    }
} else {
    if ($UsePreparedAvd) { throw "-UsePreparedAvd was specified but the isolated AVD is missing: $avdDir" }
    $null = New-Item -ItemType Directory -Path $avdDir
    [System.IO.File]::WriteAllLines($configIni, $avdConfig, $utf8NoBom)
    [System.IO.File]::WriteAllLines($avdIni, $avdIniLines, $utf8NoBom)
}

$env:ANDROID_SDK_ROOT = $sdk
$env:ANDROID_AVD_HOME = $avdHome
$env:ANDROID_USER_HOME = $androidUserHome
$listedAvds = Invoke-Native -Executable $emulator -Arguments @('-list-avds')
if ($listedAvds -notmatch [regex]::Escape($avdName)) {
    throw "Emulator did not recognize the workspace AVD. Output: $listedAvds"
}
if ($PrepareOnly) {
    Write-Host "Prepared isolated workspace AVD '$avdName' at $avdDir; no emulator process was started."
    return
}

$process = Start-Process -FilePath $emulator -ArgumentList @(
    '-avd', $avdName,
    '-port', '5586',
    '-no-window',
    '-no-audio',
    '-no-boot-anim',
    '-no-snapshot-load',
    '-no-snapshot-save',
    '-gpu', 'swiftshader_indirect'
) -WorkingDirectory $workspace -WindowStyle Hidden -PassThru -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath
$ownership = [ordered]@{
    emulatorPid = $process.Id
    serial = $script:serial
    avdName = $avdName
    avdHome = $avdHome
    startedUtc = [DateTime]::UtcNow.ToString('o')
}
[System.IO.File]::WriteAllText($ownershipPath, ($ownership | ConvertTo-Json -Depth 3), $utf8NoBom)
Write-Host "Started owned emulator PID $($process.Id) on $script:serial."

$deadline = (Get-Date).AddMinutes(4)
$deviceReady = $false
while ((Get-Date) -lt $deadline) {
    if (-not (Get-Process -Id $process.Id -ErrorAction SilentlyContinue)) {
        throw "The owned emulator process $($process.Id) exited. See $stderrPath"
    }
    $state = & $script:adb -s $script:serial get-state 2>$null
    if ($LASTEXITCODE -eq 0 -and $state -eq 'device') {
        $booted = (& $script:adb -s $script:serial shell getprop sys.boot_completed 2>$null).Trim()
        if ($LASTEXITCODE -eq 0 -and $booted -eq '1') {
            $deviceReady = $true
            break
        }
    }
    Start-Sleep -Seconds 3
}
if (-not $deviceReady) { throw "Owned emulator $script:serial did not finish booting within four minutes." }

Invoke-Adb -Arguments @('shell', 'cmd', 'connectivity', 'airplane-mode', 'enable') | Out-Null
Invoke-Adb -Arguments @('shell', 'svc', 'wifi', 'disable') | Out-Null
$airplaneMode = (Invoke-Adb -Arguments @('shell', 'cmd', 'connectivity', 'airplane-mode')).Trim()
if ($airplaneMode -ne 'enabled') { throw "Could not put the owned emulator into airplane mode (reported $airplaneMode)." }

Invoke-Adb -Arguments @('install', '-r', $apkPath) | Write-Host
$launchOutput = Invoke-Adb -Arguments @('shell', 'am', 'start', '-W', '-n', 'pl.trening.naukowo/.MainActivity')
Write-Host $launchOutput
Start-Sleep -Seconds 5

$appPid = (Invoke-Adb -Arguments @('shell', 'pidof', 'pl.trening.naukowo')).Trim()
if (-not $appPid) { throw 'The application process did not remain running after launch.' }
$socketName = 'webview_devtools_remote_' + $appPid.Split(' ')[0]
$socketList = Invoke-Adb -Arguments @('shell', 'cat', '/proc/net/unix')
if (-not ($socketList -match [regex]::Escape($socketName))) {
    throw "Debug WebView socket $socketName was not found. Verify the APK used -EnableWebViewDebug."
}
Invoke-Adb -Arguments @('forward', 'tcp:9223', ('localabstract:' + $socketName)) | Write-Host

$deviceCapture = '/sdcard/trening-native-qa.png'
Invoke-Adb -Arguments @('shell', 'screencap', '-p', $deviceCapture) | Out-Null
$startupScreenshot = Join-Path $nativeQa ('startup' + $suffix + '.png')
Invoke-Adb -Arguments @('pull', $deviceCapture, $startupScreenshot) | Write-Host
$logLines = Invoke-Adb -Arguments @('logcat', '-d', '-v', 'brief')
$relevantLogs = @($logLines -split "`r?`n" | Where-Object { $_ -match 'pl\.trening\.naukowo|chromium|AndroidRuntime|WebView' })
$startupLog = Join-Path $nativeQa ('startup-logcat' + $suffix + '.txt')
[System.IO.File]::WriteAllLines($startupLog, $relevantLogs, $utf8NoBom)

$devTools = $null
for ($attempt = 0; $attempt -lt 5 -and -not $devTools; $attempt++) {
    try { $devTools = Invoke-RestMethod -Uri 'http://127.0.0.1:9223/json' -TimeoutSec 5 } catch { Start-Sleep -Seconds 1 }
}
if (-not $devTools) { throw 'The forwarded WebView DevTools endpoint did not answer on port 9223.' }

$ownership.appPid = $appPid.Split(' ')[0]
$ownership.devToolsSocket = $socketName
$ownership.devToolsForward = 'http://127.0.0.1:9223'
$ownership.offlineMode = $true
[System.IO.File]::WriteAllText($ownershipPath, ($ownership | ConvertTo-Json -Depth 3), $utf8NoBom)

Write-Host "Offline mode confirmed (airplane mode $airplaneMode)."
Write-Host "WebView DevTools target(s):"
$devTools | ForEach-Object { Write-Host ("  {0} | {1} | {2}" -f $_.type,$_.title,$_.webSocketDebuggerUrl) }
Write-Host "Screenshot: $startupScreenshot"
Write-Host "Filtered logcat: $startupLog"
Write-Host "Ownership: $ownershipPath"
Write-Host 'The owned emulator remains running for further CDP checks.'
