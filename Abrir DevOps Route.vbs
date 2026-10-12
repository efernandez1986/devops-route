' Doble clic: arranca el servidor local en segundo plano (sin ventana) y abre el sitio.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
sh.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & dir & "\server.ps1""", 0, False
WScript.Sleep 1500
sh.Run "http://localhost:8137/"
