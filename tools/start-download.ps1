$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
$taskDir=Join-Path $taskRoot 'qa\download'
New-Item -ItemType Directory -Force -Path $taskDir | Out-Null
if(Get-NetTCPConnection -LocalPort 8975 -State Listen -ErrorAction SilentlyContinue){throw 'Download port is already occupied'}
$taskConfig=Join-Path $taskDir 'cloudflare.yml'
Set-Content -LiteralPath $taskConfig -Value '# Dedicated anonymous APK download tunnel; no account configuration.' -Encoding utf8
$taskServer=Start-Process -FilePath 'C:\Program Files\nodejs\node.exe' -ArgumentList ('"'+(Join-Path $taskRoot 'tools\download-server.mjs')+'"') -WorkingDirectory $taskRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $taskDir 'server.out.log') -RedirectStandardError (Join-Path $taskDir 'server.err.log') -PassThru
Start-Sleep -Milliseconds 700
$taskResponse=Invoke-WebRequest -Uri 'http://127.0.0.1:8975/TreningNaukowo-v1.1.apk' -Method Head
if($taskResponse.StatusCode -ne 200 -or $taskResponse.Headers['Content-Length'] -ne '35641768'){throw 'Local download validation failed'}
$taskArgs='tunnel --config "'+$taskConfig+'" --url http://127.0.0.1:8975 --protocol http2 --no-autoupdate'
$taskTunnel=Start-Process -FilePath 'C:\Program Files (x86)\cloudflared\cloudflared.exe' -ArgumentList $taskArgs -WorkingDirectory $taskRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $taskDir 'tunnel.out.log') -RedirectStandardError (Join-Path $taskDir 'tunnel.err.log') -PassThru
@{serverPid=$taskServer.Id;tunnelPid=$taskTunnel.Id;port=8975;startedUtc=[DateTime]::UtcNow.ToString('o');apk='TreningNaukowo-v1.1.apk'} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $taskDir 'ownership.json') -Encoding utf8
Write-Output "Download server PID $($taskServer.Id); own tunnel PID $($taskTunnel.Id)."
