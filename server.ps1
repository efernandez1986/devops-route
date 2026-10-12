# Servidor local mínimo para DevOps Route. Usa solo componentes de Windows (sin Node ni Python).
# Se apaga solo cuando el navegador deja de hacer ping (cierras la pestaña).
param([int]$Port = 8137, [int]$IdleSeconds = 180)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$types = @{ ".html"="text/html; charset=utf-8"; ".js"="text/javascript; charset=utf-8"; ".css"="text/css; charset=utf-8"; ".svg"="image/svg+xml"; ".json"="application/json"; ".png"="image/png"; ".ico"="image/x-icon" }
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Prefixes.Add("http://127.0.0.1:$Port/")
try { $l.Start() } catch { exit 0 }   # ya hay una instancia corriendo
$last = Get-Date
while ($l.IsListening) {
  $t = $l.GetContextAsync()
  while (-not $t.AsyncWaitHandle.WaitOne(5000)) {
    if (((Get-Date) - $last).TotalSeconds -gt $IdleSeconds) { $l.Stop(); exit 0 }
  }
  $c = $t.Result; $last = Get-Date
  try {
    $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath)
    if ($p -eq "/ping") { $b = [Text.Encoding]::UTF8.GetBytes("ok"); $c.Response.ContentType = "text/plain" }
    else {
      if ($p -eq "/") { $p = "/index.html" }
      $f = [IO.Path]::GetFullPath((Join-Path $root $p.TrimStart("/")))
      $rel = $f.Substring([Math]::Min($root.Length, $f.Length))
      if (-not $f.StartsWith($root) -or $rel.Contains('\.') -or -not (Test-Path $f -PathType Leaf)) { $c.Response.StatusCode = 404; $b = [Text.Encoding]::UTF8.GetBytes("No encontrado") }
      else {
        $ext = [IO.Path]::GetExtension($f).ToLower()
        $c.Response.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" })
        $b = [IO.File]::ReadAllBytes($f)
      }
    }
    $c.Response.ContentLength64 = $b.Length
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } catch {} finally { $c.Response.Close() }
}
