$ErrorActionPreference = 'Stop'
$taskRoot = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$taskAdb = 'C:\Users\skibi\AppData\Local\Android\Sdk\platform-tools\adb.exe'
$taskApk = Join-Path $taskRoot 'TreningNaukowo-v1.1.apk'
$taskHash = (Get-FileHash -LiteralPath $taskApk -Algorithm SHA256).Hash.ToLowerInvariant()
if ($taskHash -ne '873b5a26d21f79a2615770e3047bf6fe58ffbbf4b48e84ed8b93b8d1311aea15') { throw 'Unexpected release hash' }
if ((Get-FileHash -LiteralPath (Join-Path $taskRoot 'TreningNaukowo.apk')).Hash.ToLowerInvariant() -ne $taskHash) { throw 'Root release copies differ' }
Set-Content -LiteralPath (Join-Path $taskRoot 'TreningNaukowo.apk.sha256') -Value "$taskHash  TreningNaukowo.apk" -Encoding utf8
Set-Content -LiteralPath (Join-Path $taskRoot 'TreningNaukowo-v1.1.apk.sha256') -Value "$taskHash  TreningNaukowo-v1.1.apk" -Encoding utf8
$taskOwnerFile = Join-Path $taskRoot 'qa\native\ownership-v1.1.json'
$taskOwner = Get-Content -LiteralPath $taskOwnerFile -Raw | ConvertFrom-Json
if ($taskOwner.serial -ne 'emulator-5586' -or $taskOwner.avdName -ne 'trening_native_qa') { throw 'Unexpected emulator owner' }
$taskAvdName = (& $taskAdb -s $taskOwner.serial emu avd name) -join "`n"
if ($LASTEXITCODE -ne 0 -or $taskAvdName -notmatch 'trening_native_qa') { throw 'Active AVD differs from owned AVD' }
$taskPackage = (& $taskAdb -s $taskOwner.serial shell dumpsys package pl.trening.naukowo) -join "`n"
if ($taskPackage -notmatch 'versionCode=2' -or $taskPackage -notmatch 'versionName=1.1.0') { throw 'Installed release metadata differs' }
if ($taskPackage -match 'flags=\[[^\]]*DEBUGGABLE') { throw 'Installed package is debuggable' }
$taskSockets = (& $taskAdb -s $taskOwner.serial shell cat /proc/net/unix) -join "`n"
if ($taskSockets -match 'webview_devtools_remote') { throw 'Debug socket still present' }
Set-Content -LiteralPath (Join-Path $taskRoot 'qa\native\release-package-v1.1.txt') -Value $taskPackage -Encoding utf8
$taskForwardList = (& $taskAdb forward --list) -join "`n"
if ($taskForwardList -match 'emulator-5586 tcp:9223 ') { & $taskAdb -s emulator-5586 forward --remove tcp:9223 | Out-Null; if ($LASTEXITCODE -ne 0) { throw 'Forward cleanup failed' } }
& $taskAdb -s emulator-5586 emu kill | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Owned AVD shutdown failed' }
for ($taskTry=0; $taskTry -lt 10; $taskTry++) { if (-not (Get-NetTCPConnection -LocalPort 5586,5587 -State Listen -ErrorAction SilentlyContinue)) { break }; Start-Sleep -Milliseconds 500 }
if (Get-NetTCPConnection -LocalPort 5586,5587 -State Listen -ErrorAction SilentlyContinue) { throw 'Owned emulator ports still active' }
$taskAvdHome = [IO.Path]::GetFullPath($taskOwner.avdHome)
$taskExpectedAvdHome = [IO.Path]::GetFullPath((Join-Path $taskRoot 'qa\avd'))
if ($taskAvdHome -ne $taskExpectedAvdHome -or -not $taskAvdHome.StartsWith($taskRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'AVD cleanup path outside workspace' }
if (Test-Path -LiteralPath $taskAvdHome) { Remove-Item -LiteralPath $taskAvdHome -Recurse -Force }
$taskOwner | Add-Member -NotePropertyName cleanedUpUtc -NotePropertyValue ([DateTime]::UtcNow.ToString('o')) -Force
$taskOwner | Add-Member -NotePropertyName cleanup -NotePropertyValue 'Owned emulator stopped; own forward removed; checked workspace qa/avd removed.' -Force
$taskOwner | ConvertTo-Json | Set-Content -LiteralPath $taskOwnerFile -Encoding utf8
$taskReleaseRecord = @"
Trening Naukowo 1.1.0 / versionCode 2
SHA256: $taskHash
Bytes: 35641768
Signature v2/v3 verified; certificate unchanged: 9ea2c74118a6c2c73b81bce8d7bbe43112482ada4ca46ec74969ee9994f27707
zipalign verification passed. minSdk 26 / targetSdk 35 / compileSdk 36.
All 27 APK assets match current files byte for byte (qa/final-asset-verification.json).
Native API35 airplane-mode check: all20 PNG/WebP decoded; zoom and physical Back passed (qa/native/native-check-v1.1.json).
Actual v1.0 -> v1.1 update retained interrupted lesson across force-stop/restart (qa/native/v1-update-v1.1.json).
Polish note retained exactly in storage and textarea across force-stop/restart (qa/native/text-restart-v1.1.json).
Keyboard visible; viewport resized 867 -> 578; footer above IME (qa/native/keyboard-v1.1.json).
Final non-debug release installed and launched offline; no DEBUGGABLE flag or WebView debug socket (qa/native/release-package-v1.1.txt, final-release-v1.1.png).
Full10lesson web flow and92image-screen checks passed (qa/report.json, qa/art/report.json).
Owned emulator-5586 and own9223 forward stopped; only checked workspace qa/avd removed. Other AVDs untouched.
Physical Samsung S24 Ultra was not tested.
"@
Set-Content -LiteralPath (Join-Path $taskRoot 'qa\release-verification-v1.1.txt') -Value $taskReleaseRecord -Encoding utf8
Copy-Item -LiteralPath (Join-Path $taskRoot 'qa\release-verification.txt') -Destination (Join-Path $taskRoot 'qa\release-verification-v1.0.txt') -ErrorAction Stop
Set-Content -LiteralPath (Join-Path $taskRoot 'qa\release-verification.txt') -Value $taskReleaseRecord -Encoding utf8
Write-Output "Release verified: $taskApk; 35641768 bytes; emulator cleaned up."
