Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "pwsh.exe -ExecutionPolicy Bypass -WindowStyle Hidden -Command ""pm2 resurrect""", 0, False