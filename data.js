// Contenido de la plataforma. Orden de preguntas: [pregunta, CORRECTA, mala1, mala2, mala3, explicación] (se barajan al mostrar).
const d = (t, study, lab, proof) => ({ t, study, lab, proof });

const MODULES = [
{
  id: "lnx", code: "LNX", name: "Linux y la shell", color: "#b23a2a",
  tagline: "El sistema operativo donde corre casi todo. Sin esto, todo lo demás es magia.",
  concept: {
    analogy: "Linux es el puerto en sí: el kernel es la autoridad portuaria que decide qué barco (proceso) atraca, cuánto muelle (memoria) usa y quién puede tocar qué carga (permisos). La shell es la radio VHF: lenguaje corto, preciso, y los pipes son la cinta transportadora que encadena grúas pequeñas y especializadas.",
    real: "Netflix, Google y AWS ejecutan Linux. Cuando un pod de Kubernetes muere por OOM, el que mata es el kernel de Linux (cgroups). Un SRE que lee /proc diagnostica en 2 minutos lo que una GUI no muestra jamás.",
    counter: "«Todo es un archivo» tiene excepciones: los sockets de red no tienen ruta en el FS, y los dispositivos de red (eth0) no aparecen en /dev. Y «Linux es gratis» ignora el costo operativo: parches, hardening y conocimiento.",
    views: [
      ["Desarrollo", "Quiere el mismo entorno en su laptop y producción; Linux (vía contenedores) es el denominador común."],
      ["Operaciones", "Ve procesos, descriptores, señales y cuotas: cada recurso es observable y limitable."],
      ["Seguridad", "Ve una superficie: usuarios, SUID, puertos, módulos del kernel. Menos es más."]
    ]
  },
  videos: ["hZDaS9xyINI","BZN7Tqeu8eA"],
  resources: [
    ["Linux Journey", "https://linuxjourney.com/", "curso", "Ruta guiada y gratuita de básico a avanzado."],
    ["The Linux Command Line (libro)", "https://linuxcommand.org/tlcl.php", "libro", "Libro completo gratuito en PDF."],
    ["OverTheWire: Bandit", "https://overthewire.org/wargames/bandit/", "lab", "Juego por SSH para dominar la shell."],
    ["explainshell", "https://explainshell.com/", "doc", "Pega un comando y te explica cada flag."],
    ["man7.org (páginas man)", "https://man7.org/linux/man-pages/", "doc", "La referencia oficial, siempre consultable."]
  ],
  cheat: "# Linux — hoja de referencia\n\n## Archivos\n- `ls -lah`, `cd`, `cp -a`, `mv`, `rm -rf` (¡cuidado!)\n- `find / -type f -size +100M 2>/dev/null`\n- `du -sh * | sort -h`  ·  `df -h`  ·  `df -i` (inodos)\n\n## Texto\n- `grep -rn \"patrón\" .`  ·  `sed -n '1,20p'`  ·  `awk '{print $1}'`\n- `sort | uniq -c | sort -rn | head`\n\n## Procesos\n- `ps aux`, `top`/`htop`, `kill -15 PID`, `kill -9 PID`\n- `systemctl status|start|enable servicio`  ·  `journalctl -u servicio -f`\n\n## Permisos\n- `chmod 640 f`  ·  `chown user:grupo f`  ·  `umask 022`\n\n## SSH\n- `ssh-keygen -t ed25519`  ·  `ssh -L 8080:localhost:80 host`\n",
  days: [
    d("Anatomía de Linux", "Kernel vs userland, procesos, jerarquía FHS (/etc /var /proc /usr)", "Instala Ubuntu en VM o WSL2 y recorre cada directorio raíz con ls y cat", "Dibuja de memoria el árbol FHS y qué vive en cada rama"),
    d("Archivos, pipes y redirecciones", "stdin/stdout/stderr, |, >, >>, 2>&1", "Encuentra los 10 archivos más grandes de /var con find, sort y head", "Un one-liner guardado en tu repo de notas"),
    d("Permisos, usuarios y grupos", "rwx, octal, umask, sudo, SUID, sticky bit", "Crea 2 usuarios y un directorio compartido por grupo con sticky bit", "Tabla de permisos que probaste y el resultado de cada uno"),
    d("Procesos, señales y systemd", "Estados de proceso, SIGTERM vs SIGKILL, unidades systemd", "Escribe un servicio systemd propio que reinicie al morir", "El .service y el log de journalctl que muestra el reinicio"),
    d("Texto: grep, sed, awk", "Regex básicas y extendidas, cut, sort, uniq", "Parsea un access.log: top 10 IPs y conteo de códigos 5xx", "Script de 5 líneas con la salida real"),
    d("Paquetes y almacenamiento", "apt, particiones, mount, inodos, LVM (concepto)", "Llena un disco loop y diagnostica «No space left» por bloques vs inodos", "Explicación de cuándo df -h y df -i divergen"),
    d("SSH y endurecimiento básico", "Claves, sshd_config, ufw, fail2ban", "Deshabilita password y root login; abre un túnel con -L", "Diff de sshd_config antes/después"),
    d("Repaso y Bandit", "Repasa tus notas de los días 1–7", "Resuelve Bandit niveles 0–10", "Lista de 20 comandos que ya no necesitas googlear")
  ],
  quiz: [
    ["Un servicio falla con «No space left on device» pero df -h muestra 40% libre. ¿Causa más probable?", "Inodos agotados (revisar df -i)", "Cuota del journald", "Swap llena", "Fallo del controlador de disco", "Muchos archivos pequeños agotan la tabla de inodos antes que los bloques."],
    ["Load average 25 en una máquina de 4 vCPU con CPU al 5%. ¿Qué sospechas primero?", "Procesos en estado D esperando I/O", "Un bug de top", "Falta de swap", "Un proceso zombi consumiendo CPU", "El load cuenta procesos ejecutables y en espera ininterrumpible (I/O); con CPU baja, apunta a disco/NFS."],
    ["`cmd1 | cmd2`: cmd1 falla pero el script continúa «con éxito». ¿Qué lo corrige?", "set -o pipefail", "set -u", "set -x", "trap EXIT", "Por defecto el status del pipe es el del último comando; pipefail propaga el primer fallo."],
    ["¿Qué es un proceso zombi?", "Terminó pero su padre aún no hizo wait() para recoger su estado", "Un proceso bloqueado en I/O", "Un proceso sin padre ejecutándose", "Un hilo huérfano del kernel", "Solo ocupa una entrada en la tabla de procesos; se limpia cuando el padre lo recoge o muere (init lo adopta)."]
  ]
},
{
  id: "net", code: "NET", name: "Redes y protocolos", color: "#1f5f9e",
  tagline: "El 70% de los incidentes «raros» son DNS, certificados o MTU.",
  concept: {
    analogy: "Una petición HTTP es un contenedor que viaja por el mundo: DNS es el directorio que traduce el nombre del consignatario a una dirección de muelle; TCP es la garantía de entrega con acuse de recibo por cada bulto; TLS es el precinto con sello verificable; los routers son transbordos donde nadie conoce el destino final, solo el siguiente salto.",
    real: "Cloudflare, tu CDN y tu balanceador son L7 sobre la misma pila. Cuando «internet está lento», el SRE mide RTT, retransmisiones y handshakes antes de culpar al código.",
    counter: "«Más ancho de banda = más rápido» es falso: la latencia domina en peticiones cortas (BDP). Y «HTTPS es lento»: con TLS 1.3 y reanudación la penalización es mínima.",
    views: [
      ["Desarrollo", "Ve peticiones y timeouts; necesita saber qué reintentar y qué no."],
      ["Operaciones", "Ve rutas, MTU, balanceadores y firewalls; diagnostica capa por capa."],
      ["Seguridad", "Ve el perímetro: qué puertos, qué cifrado, qué certificados caducan."]
    ]
  },
  videos: ["_JNPvSxG6oM","7XjJqUM0dvg"],
  resources: [
    ["Cloudflare Learning Center", "https://www.cloudflare.com/learning/", "doc", "Explicaciones claras de DNS, TLS, DDoS, CDN."],
    ["High Performance Browser Networking", "https://hpbn.co/", "libro", "Libro gratuito online sobre TCP, TLS y HTTP/2."],
    ["Wizard Zines (Julia Evans)", "https://wizardzines.com/", "doc", "Zines visuales de DNS, HTTP, tcpdump; varios gratis."],
    ["Cisco Networking Academy", "https://www.netacad.com/", "curso", "Cursos gratuitos de redes e introducción a ciberseguridad."]
  ],
  cheat: "# Redes — hoja de referencia\n\n- `ip a`, `ip r`, `ss -tulpn`\n- `dig +trace dominio.com`  ·  `dig @1.1.1.1 A dominio.com`\n- `curl -v https://sitio` · `curl -I` · `curl --resolve host:443:IP`\n- `openssl s_client -connect host:443 -servername host`\n- `traceroute`/`mtr host`  ·  `nc -zv host 443`\n- `tcpdump -i any port 53 -nn`\n\n## Subredes\n- /24 = 256 IPs · /16 = 65 536 · /28 = 16\n- Privadas: 10/8, 172.16/12, 192.168/16\n",
  days: [
    d("TCP/IP y OSI pragmático", "Encapsulación, handshake TCP, MTU/MSS", "Captura un 3-way handshake con tcpdump o Wireshark", "Captura anotada con SYN, SYN-ACK, ACK"),
    d("IP, subredes y CIDR", "Máscaras, NAT, rutas, enrutamiento por defecto", "Diseña un plan de direccionamiento /16 para dev/stage/prod", "Tabla con CIDR, rango y propósito de cada subred"),
    d("DNS a fondo", "A, CNAME, NS, TTL, resolución recursiva vs autoritativa", "dig +trace de un dominio y explica cada salto", "Diagrama del recorrido de la resolución"),
    d("HTTP y TLS", "Métodos, cabeceras, HTTP/2, certificados, SNI", "curl -v y openssl s_client a un sitio; inspecciona la cadena", "Fecha de expiración y emisor de 3 sitios"),
    d("Proxies, balanceadores, firewalls", "L4 vs L7, health checks, reverse proxy", "Monta nginx con 2 backends round-robin y health checks", "nginx.conf funcionando con prueba curl en bucle"),
    d("Troubleshooting de red", "Metodología por capas, ss, mtr, nc", "Rompe a propósito DNS, un puerto y una ruta; diagnostícalos", "Runbook de 1 página: síntoma → comando → causa")
  ],
  quiz: [
    ["Usuarios tras una VPN: los sitios pequeños cargan pero los grandes se cuelgan. ¿Causa clásica?", "Black hole de PMTU / MTU (falta MSS clamping)", "DNS con TTL alto", "Certificado expirado", "Puerto 443 cerrado", "Paquetes grandes con DF son descartados y el ICMP «frag needed» no vuelve; se corrige con MSS clamping."],
    ["Vas a migrar la IP de un servicio con TTL de 86400. ¿Mejor práctica?", "Bajar el TTL con antelación ≥ al TTL anterior, migrar y luego subirlo", "Cambiar la IP y esperar", "Reiniciar los resolvers", "Usar CNAME en el apex", "Los resolvers cachean hasta TTL; hay que reducirlo antes del cambio."],
    ["¿Qué permite servir varios certificados distintos en la misma IP:443?", "SNI (Server Name Indication)", "ALPN", "HSTS", "OCSP stapling", "El cliente envía el hostname en el ClientHello para que el servidor elija el certificado."],
    ["Necesitas enrutar /api al servicio A y /web al B. ¿Qué balanceador?", "L7 (aplicación)", "L4 (transporte)", "Un NAT", "Un switch", "Solo L7 entiende paths y cabeceras HTTP."]
  ]
},
{
  id: "git", code: "GIT", name: "Git y flujos de trabajo", color: "#2f7d57",
  tagline: "El historial es el sistema de registro de tu infraestructura.",
  concept: {
    analogy: "Git es el manifiesto de carga inalterable: cada entrada se identifica por el hash de su contenido; no se «edita» una línea, se emite un nuevo manifiesto que apunta al anterior. Las ramas son punteros de papel pegados a un manifiesto; no cuestan nada, por eso crearlas es gratis.",
    real: "GitOps (Argo CD, Flux) trata a Git como la fuente de verdad: el cluster converge a lo que dice el repo. Un revert es tu máquina del tiempo de producción.",
    counter: "«Git guarda diferencias» es falso: guarda snapshots (objetos). Y «rebase es peligroso»: lo peligroso es reescribir historia ya publicada y compartida.",
    views: [
      ["Desarrollo", "Ramas cortas, PRs pequeños, historial legible."],
      ["Operaciones", "Quién cambió qué y cuándo; rollback = revert, no pánico."],
      ["Seguridad/negocio", "Auditoría, firmas de commits, protección de ramas, trazabilidad regulatoria."]
    ]
  },
  videos: ["mCVQgSyjCkI","vlCXdvcgiE0"],
  resources: [
    ["Pro Git (ES)", "https://git-scm.com/book/es/v2", "libro", "El libro oficial, gratuito, en español, descargable en PDF."],
    ["Learn Git Branching", "https://learngitbranching.js.org/?locale=es_ES", "lab", "Visualiza ramas, rebase y cherry-pick de forma interactiva."],
    ["GitHub Skills", "https://skills.github.com/", "curso", "Cursos prácticos gratuitos dentro de GitHub."],
    ["Oh Shit, Git!", "https://ohshitgit.com/es", "doc", "Cómo salir de los líos típicos."]
  ],
  cheat: "# Git — hoja de referencia\n\n- `git switch -c rama` · `git restore f` · `git stash -u`\n- `git log --oneline --graph --all`\n- `git rebase -i HEAD~5` (solo historia local)\n- `git reflog` → recupera commits «perdidos»\n- `git cherry-pick SHA` · `git revert SHA`\n- `git bisect start; git bisect bad; git bisect good SHA`\n- `git commit --amend --no-edit`\n- `git push --force-with-lease` (nunca --force a secas)\n",
  days: [
    d("Modelo interno de Git", "Blobs, trees, commits, DAG, refs", "Explora .git y crea un commit con plumbing (hash-object, update-ref)", "Explica con tus palabras qué es un commit"),
    d("Ramas, merge y rebase", "Fast-forward, 3-way merge, rebase", "Provoca un conflicto y resuélvelo; limpia historial con rebase -i", "Antes/después del historial"),
    d("Flujos: trunk-based, GitFlow, PRs", "Ramas de vida corta, feature flags, protección de ramas", "Simula un PR con revisión y protege main", "Reglas de protección aplicadas"),
    d("Git avanzado", "reflog, bisect, cherry-pick, hooks", "Recupera un commit perdido; crea un pre-commit hook", "Bisect que encuentra un bug plantado"),
    d("Versionado y mensajes", "SemVer, Conventional Commits, tags, releases", "Genera un CHANGELOG automático", "Release v0.1.0 publicado")
  ],
  quiz: [
    ["Hiciste `git reset --hard HEAD~3` por error. ¿Cómo recuperas los commits?", "git reflog y reset al SHA anterior", "No se puede", "git fsck --lost-found siempre falla", "Clonar de nuevo el repo local", "El reflog registra los movimientos de HEAD por un tiempo; los objetos siguen existiendo."],
    ["¿Cuándo NO debes hacer rebase?", "Sobre ramas ya publicadas y usadas por otros", "En ramas locales sin publicar", "Antes de abrir un PR", "Para limpiar commits WIP", "Reescribir historia compartida obliga a todos a reconciliarla."],
    ["¿Qué identifica de forma única a un commit?", "El hash de su contenido: tree, padres y metadatos", "Su número secuencial", "El nombre de la rama", "La fecha", "El SHA se calcula sobre el contenido; cambiarlo cambia el hash y todos los descendientes."],
    ["¿Para qué sirve git bisect?", "Búsqueda binaria del commit que introdujo un bug", "Dividir un commit en dos", "Comparar ramas", "Comprimir el repo", "Marcas bueno/malo y Git baja de O(n) a O(log n) los commits a probar."]
  ]
},
{
  id: "scr", code: "SCR", name: "Scripting: Bash y Python", color: "#d9a21b",
  tagline: "Automatiza todo lo que hagas más de dos veces.",
  concept: {
    analogy: "Un script es la grúa pórtico del puerto: programada, repetible, no se cansa. Pero una grúa que mueve un contenedor dos veces cuando se le ordena dos veces es un desastre: por eso la propiedad más importante de un script de operaciones es la idempotencia.",
    real: "Cada pipeline es un script con presupuesto de tiempo. Las herramientas internas de equipos de plataforma (CLIs de despliegue, limpiadores de recursos, generadores de reportes) son Python y Bash disciplinados.",
    counter: "«Bash para todo» falla en cuanto necesitas estructuras de datos, errores finos o tests: pasa a Python. «Python para todo» falla cuando solo encadenas comandos de 5 líneas: Bash gana.",
    views: [
      ["Desarrollo", "Quiere un CLI con ayuda, tests y mensajes de error claros."],
      ["Operaciones", "Quiere logs, códigos de salida, idempotencia y cron/timers confiables."],
      ["Seguridad", "Teme inyección por shell, secretos en argumentos y permisos amplios."]
    ]
  },
  videos: ["RQEh8XW0wLk","0tIZhTAuNuU"],
  resources: [
    ["Bash Guide (Greg's Wiki)", "https://mywiki.wooledge.org/BashGuide", "doc", "La guía de referencia, estricta y correcta."],
    ["ShellCheck", "https://www.shellcheck.net/", "lab", "Linter que te enseña a escribir Bash seguro."],
    ["Automate the Boring Stuff", "https://automatetheboringstuff.com/", "libro", "Libro de Python gratuito, muy práctico."],
    ["Exercism: Bash y Python", "https://exercism.org/", "lab", "Ejercicios con mentoría gratuita."]
  ],
  cheat: "# Scripting — hoja de referencia\n\n```bash\n#!/usr/bin/env bash\nset -euo pipefail\ntrap 'echo \"fallo en línea $LINENO\" >&2' ERR\n\nmain() {\n  local dir=\"${1:?uso: $0 DIR}\"\n  [[ -d \"$dir\" ]] || { echo \"no existe $dir\" >&2; exit 1; }\n}\nmain \"$@\"\n```\n\n## Python\n- `python -m venv .venv && . .venv/bin/activate`\n- `subprocess.run([\"ls\", \"-l\"], check=True, capture_output=True, text=True)`\n- `argparse` o `click` para CLIs · `pytest` para tests\n",
  days: [
    d("Bash robusto", "set -euo pipefail, quoting, funciones, trap", "Script de backup con rotación y logs; pásalo por ShellCheck", "Script sin avisos de ShellCheck"),
    d("Argumentos y planificación", "getopts, códigos de salida, cron y systemd timers", "Programa tu backup con un timer", "Salida de systemctl list-timers"),
    d("Python para operaciones", "Tipos, módulos, venv, pip, manejo de JSON", "Script que lee JSON y resume métricas", "Script versionado en tu repo"),
    d("Python: subprocess y requests", "Ejecución segura de comandos, HTTP, reintentos", "Healthcheck multi-URL con reintentos y timeouts", "Salida del script contra 5 URLs"),
    d("Python y APIs cloud", "boto3 o SDK equivalente, argparse/click", "CLI que lista recursos sin etiquetas", "README con ejemplo de uso"),
    d("Calidad: tests y linters", "pytest, ruff, pre-commit", "Agrega tests a tu CLI y un pre-commit", "CI local verde"),
    d("Mini-proyecto de operaciones", "Alcance, README, empaquetado, releases", "Publica tu herramienta en GitHub con tests y release", "URL del repo y release v0.1")
  ],
  quiz: [
    ["En Bash, `[ $x = \"a\" ]` falla con «unary operator expected» cuando x está vacía. Solución robusta:", "Entrecomillar: [[ \"$x\" = \"a\" ]]", "Usar eval", "Quitar set -u", "Exportar x", "Sin comillas la variable vacía desaparece y el test queda mal formado; [[ ]] y comillas lo evitan."],
    ["¿Qué significa que un script sea idempotente?", "Ejecutarlo varias veces deja el mismo estado final", "Corre muy rápido", "No usa red", "Solo corre una vez al día", "Es la base de la automatización segura y de la IaC."],
    ["¿Por qué usar subprocess.run([...], check=True) sin shell=True?", "Evita inyección de comandos y detecta fallos", "Es más rápido siempre", "Permite pipes", "Evita instalar paquetes", "Pasar lista evita interpretación por shell; check lanza excepción ante código ≠ 0."],
    ["Un cron cada minuto tarda 3 min y se solapa consigo mismo. ¿Mejor corrección?", "Bloqueo con flock o un timer sin solapamiento", "Aumentar la CPU", "Ejecutarlo en 3 hosts", "Quitar logs", "Hay que garantizar exclusión mutua, no solo más recursos."]
  ]
},
{
  id: "doc", code: "DOC", name: "Docker y contenedores", color: "#1b8a93",
  tagline: "Empaqueta una vez, ejecuta en cualquier parte, entiende por qué funciona.",
  concept: {
    analogy: "El contenedor ISO estandarizó la carga: grúas, barcos y trenes lo manejan sin saber qué hay dentro. Docker hizo lo mismo con el software. Una imagen es la carga sellada e inmutable; el contenedor es esa carga en tránsito; el kernel es el barco compartido; namespaces y cgroups son las mamparas y los límites de peso.",
    real: "Prácticamente todo despliegue moderno distribuye imágenes OCI. Los builds reproducibles en CI y la escalabilidad horizontal salen de esta unidad estándar.",
    counter: "Un contenedor NO es una VM: comparte kernel, así que un exploit de kernel cruza fronteras. Y «funciona en mi contenedor» no garantiza seguridad: correr como root dentro es correr con privilegios amplios.",
    views: [
      ["Desarrollo", "Entorno idéntico y arranque en segundos."],
      ["Operaciones", "Unidad de despliegue, recursos limitados, imágenes versionadas."],
      ["Seguridad", "Superficie: CVEs en capas base, secretos en imágenes, privilegios."]
    ]
  },
  videos: ["OEvHEeDpg_o","6idFknRIOp4"],
  resources: [
    ["Docker: Get started", "https://docs.docker.com/get-started/", "doc", "Documentación oficial paso a paso."],
    ["Play with Docker", "https://labs.play-with-docker.com/", "lab", "Terminal Docker gratuita en el navegador."],
    ["Dockerfile best practices", "https://docs.docker.com/build/building/best-practices/", "doc", "Guía oficial de buenas prácticas."],
    ["dive", "https://github.com/wagoodman/dive", "lab", "Explora capas y desperdicio de tus imágenes."]
  ],
  cheat: "# Docker — hoja de referencia\n\n- `docker run -d --name web -p 8080:80 nginx`\n- `docker ps -a` · `docker logs -f web` · `docker exec -it web sh`\n- `docker build -t app:1.0 .` · `docker history app:1.0`\n- `docker inspect web | jq '.[0].State'`\n- `docker system df` · `docker system prune`\n- `docker compose up -d` · `docker compose logs -f`\n\n## Dockerfile multi-stage\n```dockerfile\nFROM node:22 AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:22-slim\nUSER node\nCOPY --from=build /app/dist /app\nCMD [\"node\",\"/app/server.js\"]\n```\n",
  days: [
    d("Qué es un contenedor de verdad", "Namespaces, cgroups, union filesystem", "Aísla un proceso con unshare y chroot sin Docker", "Los comandos y qué aísla cada namespace"),
    d("Imágenes, capas y registries", "OCI, layers, digest, tags", "pull + inspect; analiza capas con dive", "Una imagen con 3 optimizaciones propuestas"),
    d("Dockerfile bien hecho", "Cache de capas, multi-stage, usuario no root", "Contenedoriza una app y reduce la imagen >70%", "Tamaños antes/después"),
    d("Redes y volúmenes", "bridge, host, DNS interno, bind mounts, volumes", "App + base de datos con red propia y datos persistentes", "Prueba: borras el contenedor y los datos siguen"),
    d("Docker Compose", "Servicios, healthchecks, depends_on, .env", "Stack web + db + caché con healthchecks", "compose.yaml funcionando"),
    d("Seguridad de imágenes", "CVEs, Trivy, SBOM, rootless, secretos", "Escanea y corrige CVEs críticas de tu imagen", "Reporte antes/después"),
    d("Registries y versionado", "GHCR/Docker Hub, tags inmutables, digests", "Publica una imagen versionada y fíjala por digest", "Enlace al paquete publicado"),
    d("Troubleshooting de contenedores", "logs, exec, inspect, OOM, exit codes", "Provoca OOMKill y exit 137; diagnostica", "Runbook con 5 síntomas típicos")
  ],
  quiz: [
    ["¿Qué es un contenedor?", "Un proceso aislado con namespaces y limitado por cgroups", "Una VM ligera con su propio kernel", "Un paquete .deb", "Un emulador de CPU", "Comparte el kernel del host; el aislamiento es lógico, no por hipervisor."],
    ["Para aprovechar el cache de capas en un Dockerfile Node, ¿qué orden usas?", "COPY package*.json → npm ci → COPY código", "COPY . . → npm ci", "npm ci → COPY package.json", "Da igual", "Las capas que menos cambian van primero para no invalidar el cache."],
    ["¿Por qué es riesgoso usar la etiqueta `latest` en producción?", "Es mutable: no garantiza reproducibilidad", "Es más lenta", "Impide escalar", "Consume más RAM", "Fija por digest o tag inmutable para builds y rollbacks reproducibles."],
    ["Un contenedor termina con código 137. ¿Qué significa típicamente?", "SIGKILL, a menudo por OOM killer", "Éxito", "Error de sintaxis", "Puerto ocupado", "137 = 128 + 9 (SIGKILL); revisa límites de memoria."]
  ]
},
{
  id: "cic", code: "CIC", name: "CI/CD", color: "#d2691e",
  tagline: "Desplegar es un no-evento cuando el pipeline es confiable.",
  concept: {
    analogy: "Un pipeline es la línea de inspección aduanera: cada contenedor pasa por escáner, pesaje y sellado antes de embarcar. Si un control falla, la grúa se detiene. Un pipeline lento o poco confiable es una aduana con filas: la gente aprende a evadirla.",
    real: "Los equipos de élite (según DORA) despliegan múltiples veces al día con baja tasa de fallos y recuperación en minutos; el pipeline es el mecanismo que lo hace seguro.",
    counter: "«CI/CD = Jenkins» confunde práctica con herramienta. Y automatizar un proceso malo solo lo hace fallar más rápido. Desplegar más seguido sin observabilidad ni rollback es apostar.",
    views: [
      ["Desarrollo", "Feedback rápido: tests en minutos, no en horas."],
      ["Operaciones", "Despliegues repetibles, auditables y reversibles."],
      ["Negocio", "Menor lead time, menor riesgo por cambio, más experimentos."]
    ]
  },
  videos: ["6eRkCnFhHRg","M4CXOocovZ4"],
  resources: [
    ["GitHub Actions docs", "https://docs.github.com/es/actions", "doc", "Referencia oficial de workflows."],
    ["GitLab CI/CD docs", "https://docs.gitlab.com/ee/ci/", "doc", "Stages, rules, includes, entornos."],
    ["Jenkins docs", "https://www.jenkins.io/doc/", "doc", "Pipelines declarativos y arquitectura."],
    ["DORA", "https://dora.dev/", "doc", "Las 4 métricas y la investigación detrás."]
  ],
  cheat: "# CI/CD — hoja de referencia\n\n```yaml\nname: ci\non: [pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 22, cache: npm }\n      - run: npm ci && npm test\n```\n\n## DORA\n- Frecuencia de despliegue · Lead time · Tasa de fallo de cambios · Tiempo de recuperación\n\n## Estrategias\n- Rolling · Blue/green · Canary · Feature flags\n",
  days: [
    d("Principios y métricas DORA", "CI vs CD vs continuous deployment, 4 métricas", "Mapea el flujo de tu proyecto y mide tu lead time actual", "Diagrama del flujo con tiempos"),
    d("GitHub Actions: lo esencial", "Workflows, jobs, steps, runners, eventos", "CI que hace lint y test en cada PR", "PR con checks verdes"),
    d("Matrices, caché y artefactos", "Matrix, cache, upload-artifact", "Matriz de versiones con caché de dependencias", "Tiempo antes/después del caché"),
    d("Build y publicación de imágenes", "Secretos, OIDC, GHCR", "Pipeline que construye y publica tu imagen", "Imagen publicada con tag del commit"),
    d("Despliegue continuo", "Entornos, aprobaciones, rolling, blue-green, canary", "Despliegue con aprobación manual a un VPS o Cloud Run", "Registro del despliegue y del rollback"),
    d("GitLab CI", "stages, rules, includes, caches", "Porta tu pipeline a .gitlab-ci.yml", "Pipeline equivalente verde"),
    d("Jenkins esencial", "Jenkinsfile declarativo, agentes", "Jenkins en Docker con un pipeline básico", "Jenkinsfile en el repo"),
    d("El pipeline como producto", "Flaky tests, tiempos, observabilidad de pipelines", "Reduce el tiempo de tu pipeline un 30%", "Métricas antes/después y qué cambiaste")
  ],
  quiz: [
    ["¿Cuáles son las 4 métricas DORA?", "Frecuencia de despliegue, lead time, tasa de fallos de cambio, tiempo de recuperación", "Cobertura, bugs, velocidad, burndown", "CPU, RAM, disco, red", "MTBF, uptime, latencia, throughput", "Miden velocidad y estabilidad de la entrega."],
    ["¿Qué ventaja tiene un canary sobre blue-green?", "Expone un porcentaje pequeño de tráfico y valida con datos reales antes de ampliar", "No necesita monitoreo", "Duplica el costo siempre", "Elimina rollbacks", "Reduce el radio de impacto; blue-green cambia todo de golpe con rollback instantáneo."],
    ["¿Cómo autenticas un workflow de CI contra la nube sin claves de larga vida?", "OIDC federado con credenciales efímeras", "Guardar la clave en el repo cifrada en base64", "Una clave compartida del equipo", "Variables de entorno en el runner permanente", "El proveedor confía en la identidad del workflow y emite tokens de corta duración."],
    ["Un test es intermitente (flaky). ¿Qué haces?", "Aislarlo, investigar la causa raíz y repararlo; no reintentar ciegamente", "Reintentar 5 veces siempre", "Borrarlo", "Ignorar el pipeline rojo", "Los flaky erosionan la confianza en el pipeline."]
  ]
},
{
  id: "cld", code: "CLD", name: "Cloud (AWS)", color: "#7058a8",
  tagline: "Alquila capacidad, paga por uso, y aprende a no regalar dinero.",
  concept: {
    analogy: "La nube es el puerto público global: no construyes muelle, alquilas atraque por hora. Pero la autoridad portuaria (proveedor) solo asegura el muelle; la carga, sus precintos y quién tiene llave son tuyos. Ese es el modelo de responsabilidad compartida.",
    real: "Startups lanzan en horas; grandes empresas combinan regiones para resiliencia. La mayoría de incidentes cloud vienen de IAM mal configurado y de costos sin gobierno.",
    counter: "«La nube es más barata» no siempre: cargas estables y predecibles pueden ser más baratas on-prem. «Multi-cloud da resiliencia» a menudo agrega complejidad que reduce la fiabilidad.",
    views: [
      ["Desarrollo", "APIs para todo; velocidad de experimentación."],
      ["Operaciones", "Redes, IAM, cuotas y límites de servicio."],
      ["Finanzas", "Gasto variable que requiere etiquetas, presupuestos y FinOps."]
    ]
  },
  videos: ["VR8aXePkQ5M","ym_oHKnoneE"],
  resources: [
    ["AWS Free Tier", "https://aws.amazon.com/free/", "lab", "Capa gratuita para practicar (configura alertas de presupuesto)."],
    ["AWS Skill Builder (gratis)", "https://skillbuilder.aws/", "curso", "Cientos de cursos digitales gratuitos."],
    ["AWS Well-Architected", "https://aws.amazon.com/architecture/well-architected/", "doc", "Los 6 pilares, base de toda revisión de arquitectura."],
    ["Google Cloud Skills Boost", "https://www.cloudskillsboost.google/", "curso", "Laboratorios con créditos gratuitos iniciales."]
  ],
  cheat: "# AWS — hoja de referencia\n\n- `aws sts get-caller-identity`\n- `aws s3 ls` · `aws s3 sync ./site s3://bucket`\n- `aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId'`\n- `aws iam simulate-principal-policy ...`\n\n## Principios\n- Mínimo privilegio · Multi-AZ · Cifrado en reposo y tránsito\n- Etiquetas obligatorias · Alertas de presupuesto desde el día 1\n",
  days: [
    d("Modelo cloud y seguridad de la cuenta", "IaaS/PaaS/SaaS, responsabilidad compartida, regiones y AZ", "Crea cuenta, activa MFA y una alerta de presupuesto", "Captura de MFA y budget activos"),
    d("IAM a fondo", "Usuarios, roles, políticas, deny explícito", "Escribe una política de mínimo privilegio y pruébala con el simulador", "JSON de la política y prueba"),
    d("Cómputo: EC2", "AMI, tipos, security groups, user-data", "Lanza una instancia con nginx vía user-data", "URL pública respondiendo"),
    d("Almacenamiento: S3 y EBS", "Clases, versionado, ciclo de vida, cifrado", "Sitio estático en S3 con política de ciclo de vida", "Bucket con política documentada"),
    d("Redes: VPC", "Subredes, IGW, NAT, tablas de rutas", "VPC pública/privada desde cero", "Diagrama y prueba de salida desde la privada"),
    d("Bases de datos y mensajería", "RDS, DynamoDB, SQS", "App con cola y worker", "Mensaje enviado, consumido y registrado"),
    d("Balanceo y autoescalado", "ALB, target groups, ASG, health checks", "ASG detrás de un ALB; termina una instancia y observa", "Línea de tiempo del evento"),
    d("Costos y Well-Architected", "FinOps, etiquetas, Savings Plans (concepto)", "Estima el costo mensual de tu arquitectura y propone 3 ahorros", "Hoja con estimación y ahorros"),
    d("Serverless", "Lambda, API Gateway, EventBridge", "API serverless; compara costo y latencia vs EC2", "Tabla comparativa")
  ],
  quiz: [
    ["En el modelo de responsabilidad compartida, ¿quién parchea el SO de una instancia EC2?", "El cliente", "AWS", "El proveedor del AMI siempre", "Nadie", "En IaaS el SO invitado es responsabilidad del cliente."],
    ["En IAM, ¿qué gana cuando hay un Allow y un Deny explícito aplicables?", "El Deny explícito", "El Allow más específico", "El más reciente", "Depende de la región", "Deny explícito siempre prevalece."],
    ["Para alta disponibilidad real de una app en una región:", "Distribuir entre varias zonas de disponibilidad", "Muchas instancias en una sola AZ", "Un tipo de instancia mayor", "Más EBS", "Una AZ es el dominio de falla; hay que cruzarlas."],
    ["Fuente típica de facturas sorpresa:", "Transferencia de datos y NAT Gateways sin vigilancia", "Los security groups", "Las etiquetas", "Los roles IAM", "El egreso y los NAT cobran por GB procesado."]
  ]
},
{
  id: "iac", code: "IAC", name: "Infraestructura como código", color: "#a23a55",
  tagline: "Si no está en código, no existe; si no se puede reconstruir, no es infraestructura.",
  concept: {
    analogy: "IaC es el plano de estiba: describes dónde va cada contenedor y la terminal ejecuta. Terraform compara el plano contra el patio real (state) y calcula solo los movimientos necesarios. Si alguien mueve un contenedor a mano (drift), el siguiente plan lo detecta y lo corrige.",
    real: "Equipos recrean entornos completos en minutos, aplican revisiones de seguridad sobre un plan antes de ejecutarlo y recuperan desastres desde Git.",
    counter: "«Todo en Terraform» genera monolitos de estado frágiles. Y IaC no sustituye el diseño: describir una mala arquitectura de forma reproducible solo la hace repetible.",
    views: [
      ["Desarrollo", "Entornos efímeros por PR."],
      ["Operaciones", "Revisiones de cambios, drift, estado y módulos."],
      ["Seguridad", "Políticas como código antes de aplicar; el state contiene secretos."]
    ]
  },
  videos: ["3zX2o3NjbnM","e8ke3pi1ROI"],
  resources: [
    ["Terraform Tutorials", "https://developer.hashicorp.com/terraform/tutorials", "curso", "Rutas oficiales gratuitas por proveedor."],
    ["Terraform Registry", "https://registry.terraform.io/", "doc", "Proveedores y módulos públicos."],
    ["OpenTofu", "https://opentofu.org/docs/", "doc", "Fork de código abierto, compatible con Terraform."],
    ["Checkov", "https://www.checkov.io/", "lab", "Escáner de políticas para IaC."]
  ],
  cheat: "# Terraform — hoja de referencia\n\n- `terraform init` · `fmt` · `validate` · `plan -out=tf.plan` · `apply tf.plan`\n- `terraform state list|show|mv|rm`\n- `terraform import aws_s3_bucket.b mi-bucket`\n- `terraform plan -refresh-only` (detectar drift)\n\n```hcl\nterraform {\n  backend \"s3\" { bucket = \"mi-tfstate\" key = \"app/terraform.tfstate\" use_lockfile = true }\n}\n```\n",
  days: [
    d("Por qué IaC", "Declarativo vs imperativo, idempotencia, inmutabilidad", "Reconstruye con Terraform la VPC que hiciste a mano", "Repo con código y plan"),
    d("HCL, providers y recursos", "Variables, outputs, locals, data sources", "EC2 + SG parametrizados", "terraform apply y destroy limpios"),
    d("Estado y backends", "tfstate, bloqueo, backend remoto", "Configura backend remoto con bloqueo", "Explicación de qué pasa sin lock"),
    d("Módulos", "Entradas, salidas, versionado", "Extrae tu VPC a un módulo reutilizable", "Módulo usado desde 2 raíces"),
    d("Entornos", "Workspaces vs directorios, composición", "dev y stage con el mismo módulo", "Comparación de planes"),
    d("Terraform en CI", "plan en PR, apply controlado, OIDC", "Pipeline con plan comentado en el PR y apply tras aprobación", "PR con plan visible"),
    d("Políticas y calidad", "tflint, checkov, políticas como código", "Bloquea un bucket público con una política", "Pipeline rojo y luego verde"),
    d("Drift, import y refactor", "Import, moved blocks, prevent_destroy", "Importa un recurso creado a mano y detecta drift", "Antes/después del state")
  ],
  quiz: [
    ["¿Qué es el drift?", "La diferencia entre el estado real y el declarado", "Un tipo de módulo", "Un backend", "Un error de sintaxis", "Cambios manuales o externos que el código no refleja."],
    ["¿Por qué un backend remoto con bloqueo?", "Evita aplicaciones concurrentes que corrompen el estado y permite compartirlo", "Es más rápido", "Elimina el plan", "Cifra el código", "Dos applies a la vez pueden dañar el estado."],
    ["`plan` muestra destroy/recreate de una base de datos por renombrar un recurso. ¿Qué haces?", "Usar moved block / state mv y proteger con prevent_destroy", "Aplicar y rezar", "Borrar el state", "Cambiar de proveedor", "Un renombre es un movimiento de dirección, no un reemplazo."],
    ["¿Qué riesgo de seguridad tiene el tfstate?", "Puede contener secretos en texto claro", "Ninguno", "Es público por defecto", "Solo guarda nombres", "Cifra el backend y restringe su acceso."]
  ]
},
{
  id: "ans", code: "ANS", name: "Gestión de configuración: Ansible", color: "#7a8791",
  tagline: "Del servidor creado al servidor configurado, sin tocar la consola.",
  concept: {
    analogy: "Terraform construye el muelle; Ansible es el capataz que llega a cada muelle, revisa la lista y solo mueve lo que difiere. Sin agentes: entra por SSH, ejecuta y se va.",
    real: "Parches de flota, hardening masivo y configuración de bastiones y hosts bare-metal siguen siendo territorio de Ansible.",
    counter: "En un mundo de contenedores inmutables, configurar servidores «en vivo» es antipatrón; úsalo para hosts, no para parchear apps en caliente.",
    views: [
      ["Desarrollo", "Un playbook legible es documentación ejecutable."],
      ["Operaciones", "Orquestación y remediación en lote."],
      ["Seguridad", "Aplicar baselines CIS de forma uniforme."]
    ]
  },
  videos: ["slNIwBPeQvE","uqMkIdLE0AQ"],
  resources: [
    ["Ansible docs", "https://docs.ansible.com/", "doc", "Guías y referencia de módulos."],
    ["Ansible Galaxy", "https://galaxy.ansible.com/", "doc", "Roles y colecciones comunitarias."],
    ["Jeff Geerling en GitHub", "https://github.com/geerlingguy", "doc", "Roles de producción ejemplares para leer."]
  ],
  cheat: "# Ansible — hoja de referencia\n\n- `ansible all -i inventory -m ping`\n- `ansible-playbook -i inventory site.yml --check --diff`\n- `ansible-vault encrypt_string 's3cr3t' --name db_password`\n\n```yaml\n- hosts: web\n  become: true\n  tasks:\n    - name: nginx instalado\n      ansible.builtin.apt: { name: nginx, state: present, update_cache: true }\n      notify: reiniciar nginx\n  handlers:\n    - name: reiniciar nginx\n      ansible.builtin.service: { name: nginx, state: restarted }\n```\n",
  days: [
    d("Modelo agentless e inventario", "SSH, inventario estático y dinámico, módulos", "Inventario y ping a 2 VMs", "Salida de ansible -m ping"),
    d("Playbooks y handlers", "Tareas, idempotencia, handlers, check/diff", "Instala y configura nginx de forma idempotente", "Segunda ejecución con 0 cambios"),
    d("Variables, plantillas y Vault", "Jinja2, precedencia, ansible-vault", "Plantilla de configuración con secretos cifrados", "Repo sin secretos en claro"),
    d("Roles y Galaxy", "Estructura de roles, defaults, meta", "Convierte tu playbook en un rol reutilizable", "Rol usado desde 2 playbooks"),
    d("Terraform + Ansible", "Provisión vs configuración, inventario dinámico", "Terraform crea la VM y Ansible la configura", "Un comando levanta todo")
  ],
  quiz: [
    ["¿Qué significa «agentless» en Ansible?", "Se conecta por SSH y no requiere agente instalado en los nodos", "No necesita Python", "No usa red", "No tiene inventario", "El nodo solo necesita SSH y Python."],
    ["¿Cuándo se ejecuta un handler?", "Al final del play y solo si alguna tarea notificó un cambio", "Siempre al inicio", "Cada tarea", "Solo con --force", "Evita reinicios innecesarios."],
    ["¿Terraform o Ansible para crear una VPC? ¿y para configurar nginx dentro de la VM?", "Terraform para la VPC; Ansible para la configuración", "Ansible para ambos", "Terraform para ambos", "Ninguno", "Terraform aprovisiona recursos; Ansible gestiona la configuración del SO y software."],
    ["¿Para qué sirve ansible-vault?", "Cifrar variables o archivos sensibles dentro del repo", "Hacer copias de seguridad", "Gestionar usuarios", "Acelerar playbooks", "Permite versionar secretos cifrados."]
  ]
},
{
  id: "k8s", code: "K8S", name: "Kubernetes", color: "#8a5a2b",
  tagline: "Un sistema operativo de clúster: declaras el estado, él lo mantiene.",
  concept: {
    analogy: "Kubernetes es la terminal automatizada completa: tú entregas un plan de estiba (YAML) y el sistema decide en qué grúa (nodo) va cada contenedor (pod), reubica si una grúa falla, y mantiene el número de contenedores en cola. El controlador es el supervisor que compara plan vs realidad cada segundo.",
    real: "Spotify, Airbnb y bancos operan miles de servicios con Kubernetes: autoescalado, despliegues progresivos y recuperación automática.",
    counter: "Kubernetes agrega complejidad enorme: para 3 servicios, un PaaS o Compose suele ser mejor. «Kubernetes es seguro por defecto» es falso: RBAC y policies requieren trabajo.",
    views: [
      ["Desarrollo", "Un contrato: Deployment, Service, probes, límites."],
      ["Operaciones", "Plano de control, nodos, red, almacenamiento, upgrades."],
      ["Seguridad", "RBAC, NetworkPolicies, PSA, supply chain."]
    ]
  },
  videos: ["VnvRFRk_51k","r2zuL9MW6wc"],
  resources: [
    ["Kubernetes Tutorials", "https://kubernetes.io/es/docs/tutorials/", "curso", "Rutas oficiales gratuitas."],
    ["Killercoda", "https://killercoda.com/", "lab", "Laboratorios y escenarios de CKA gratuitos en el navegador."],
    ["Kubernetes The Hard Way", "https://github.com/kelseyhightower/kubernetes-the-hard-way", "lab", "Construye un clúster pieza a pieza."],
    ["kind", "https://kind.sigs.k8s.io/", "lab", "Clúster local en Docker."],
    ["Helm docs", "https://helm.sh/docs/", "doc", "Gestor de paquetes para Kubernetes."]
  ],
  cheat: "# Kubernetes — hoja de referencia\n\n- `kubectl get po,svc,deploy -A -o wide`\n- `kubectl describe pod X` · `kubectl logs X --previous`\n- `kubectl rollout status|undo deploy/X`\n- `kubectl top pod` · `kubectl get events --sort-by=.lastTimestamp`\n- `kubectl auth can-i list pods --as=usuario`\n- `kubectl debug -it pod/X --image=busybox`\n\n## Diagnóstico rápido\n- Pending → recursos/taints/PVC · ImagePullBackOff → imagen/credenciales\n- CrashLoopBackOff → logs --previous · Service sin endpoints → selector vs labels\n",
  days: [
    d("Arquitectura de Kubernetes", "API server, etcd, scheduler, controllers, kubelet", "Levanta un clúster kind y explica cada componente", "Diagrama del plano de control"),
    d("Pods, ReplicaSets, Deployments", "Ciclo de vida, rolling update, rollback", "3 réplicas; actualiza y revierte", "Historial de rollout"),
    d("Servicios y red", "ClusterIP, NodePort, LoadBalancer, DNS, CNI", "Expón una app y resuelve nombres internos", "Prueba curl desde otro pod"),
    d("Ingress y Gateway API", "Reglas por host y path, TLS", "Ingress con 2 rutas", "Ambas rutas respondiendo"),
    d("Configuración y secretos", "ConfigMaps, Secrets, variables vs volúmenes", "Inyecta configuración y discute los riesgos de Secrets", "Manifiestos y nota de riesgos"),
    d("Almacenamiento", "PV, PVC, StorageClass, StatefulSet", "Base de datos con StatefulSet y PVC", "Datos sobreviven al reinicio del pod"),
    d("Scheduling y recursos", "requests/limits, QoS, taints, afinidad", "Provoca un OOMKill y un Pending por recursos", "Eventos explicados"),
    d("Salud y autoescalado", "Liveness, readiness, startup, HPA", "HPA bajo carga con hey o k6", "Gráfico de réplicas vs carga"),
    d("RBAC", "Roles, bindings, ServiceAccounts", "Usuario de solo lectura en un namespace", "Pruebas auth can-i"),
    d("NetworkPolicies y seguridad de pods", "Default deny, PSA, securityContext", "Aplica default-deny y permite solo lo necesario", "Matriz de conectividad"),
    d("Helm", "Charts, values, releases", "Chart propio con values por entorno", "helm template y helm upgrade"),
    d("GitOps", "Argo CD o Flux, reconciliación", "Despliega vía Argo CD desde Git", "Un cambio en Git llega al clúster"),
    d("Troubleshooting", "describe, events, logs, debug", "5 fallas inyectadas y diagnosticadas", "Runbook por síntoma"),
    d("Simulacro estilo CKA", "Currículo CKA de la CNCF", "Escenarios de Killercoda cronometrados (2 h)", "Lista de lo que fallaste y por qué")
  ],
  quiz: [
    ["Pod en CrashLoopBackOff: ¿primer paso?", "kubectl logs --previous y describe para ver el último fallo", "Borrar el nodo", "Aumentar réplicas", "Reiniciar el clúster", "El contenedor ya murió: necesitas el log del intento anterior y los eventos."],
    ["Diferencia entre liveness y readiness:", "Liveness reinicia el contenedor; readiness lo saca del Service sin reiniciarlo", "Son iguales", "Readiness reinicia", "Liveness solo al inicio", "Readiness controla recepción de tráfico."],
    ["¿Cómo se comportan requests y limits?", "El scheduler usa requests; superar el límite de CPU se estrangula y el de memoria provoca OOMKill", "Limits se usan para agendar", "Requests limitan la CPU", "Son decorativos", "Requests reservan; limits topan."],
    ["Un Service no tiene endpoints. ¿Causa más probable?", "El selector no coincide con las labels de los pods o no están Ready", "Falta un Ingress", "El etcd está lleno", "Falta Helm", "Los endpoints se construyen de los pods Ready que cumplen el selector."]
  ]
},
{
  id: "obs", code: "OBS", name: "Observabilidad y SRE", color: "#6a9a2a",
  tagline: "No se puede arreglar lo que no se ve; no se debe alertar por todo.",
  concept: {
    analogy: "La torre de control del puerto: métricas son los instrumentos (qué tanto), logs son la bitácora de eventos (qué pasó), trazas siguen un contenedor concreto por todas las etapas (dónde se retrasó). SLO es el acuerdo de nivel de servicio con el cliente; el presupuesto de error es cuánta tardanza puedes permitir antes de frenar las salidas.",
    real: "Google popularizó SRE: se negocian SLO, se mide el presupuesto de error y se decide entre lanzar funciones o invertir en fiabilidad.",
    counter: "«Más dashboards = más observabilidad» es falso: sin preguntas claras, es ruido. Y «100% de disponibilidad» es un objetivo imposible y antieconómico.",
    views: [
      ["Desarrollo", "Instrumenta con intención: eventos de negocio y trazas."],
      ["Operaciones", "Alertas accionables, runbooks, guardias sostenibles."],
      ["Negocio", "Fiabilidad como característica con costo y compensaciones."]
    ]
  },
  videos: ["VSddZh0V8dE","m7VinvdhIlQ"],
  resources: [
    ["Google SRE Books", "https://sre.google/books/", "libro", "Los libros de SRE, gratuitos online."],
    ["Prometheus docs", "https://prometheus.io/docs/introduction/overview/", "doc", "Arquitectura, PromQL, alertas."],
    ["Grafana tutorials", "https://grafana.com/tutorials/", "curso", "Tutoriales oficiales gratuitos."],
    ["OpenTelemetry docs", "https://opentelemetry.io/docs/", "doc", "Estándar abierto para trazas, métricas y logs."]
  ],
  cheat: "# Observabilidad — hoja de referencia\n\n## PromQL\n- `rate(http_requests_total[5m])`\n- `sum by (status) (rate(http_requests_total[5m]))`\n- `histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))`\n\n## Métodos\n- RED: Rate, Errors, Duration (servicios)\n- USE: Utilization, Saturation, Errors (recursos)\n- 4 señales de oro: latencia, tráfico, errores, saturación\n\n## SLO\n- 99.9% mensual ≈ 43 min de presupuesto de error\n",
  days: [
    d("Monitoreo vs observabilidad", "Métricas, logs, trazas, cardinalidad", "Instrumenta una app con /metrics", "Endpoint con métricas útiles"),
    d("Prometheus y PromQL", "Scrape, series, rate, histogramas, alertas", "Consultas de tasa y percentiles", "5 consultas PromQL y qué responden"),
    d("Grafana: RED y USE", "Dashboards con propósito, variables", "Dashboard RED y una alerta accionable", "JSON del dashboard"),
    d("Logging centralizado", "Logs estructurados, Loki o ELK", "Envía logs de tu app y consúltalos", "Consulta que halla un error"),
    d("Trazas y OpenTelemetry", "Spans, contexto, muestreo", "Traza una petición entre 2 servicios", "Captura de la traza"),
    d("SRE: SLO y postmortems", "SLI, SLO, presupuesto de error, postmortem sin culpables", "Define un SLO y escribe un postmortem de un incidente simulado", "Documento de postmortem")
  ],
  quiz: [
    ["¿Por qué usar percentiles y no el promedio de latencia?", "El promedio oculta la cola; los percentiles muestran la experiencia de los peores casos", "El promedio es más caro", "Prometheus no soporta promedios", "Los percentiles son siempre menores", "Unos pocos usuarios muy lentos desaparecen en un promedio."],
    ["¿Qué problema causa una alta cardinalidad de labels en Prometheus?", "Explosión de series, memoria y costo", "Nada", "Pérdida de precisión", "Falla de TLS", "Cada combinación única crea una serie temporal."],
    ["SLO de 99.9% mensual: ¿presupuesto de error aproximado?", "≈ 43 minutos", "≈ 7 horas", "≈ 4 minutos", "≈ 2 días", "0.1% de 30 días ≈ 43.2 minutos."],
    ["¿Qué conviene alertar?", "Síntomas que afectan al usuario (burn rate del SLO)", "Cualquier uso de CPU > 70%", "Todos los errores", "Reinicios de pods siempre", "Las alertas deben ser accionables y reflejar impacto."]
  ]
},
{
  id: "sec", code: "SEC", name: "DevSecOps y proyecto final", color: "#4a6076",
  tagline: "Seguridad desplazada a la izquierda y un portafolio que demuestra todo lo anterior.",
  concept: {
    analogy: "La seguridad del puerto no es una verja al final: es el escáner de rayos X en cada paso, el sello a prueba de manipulación y el registro de quién tocó qué. La cadena de suministro es la ruta del contenedor desde la fábrica; si el origen está comprometido, ningún muelle seguro te salva.",
    real: "Incidentes como SolarWinds o Log4Shell mostraron que la cadena de suministro es el vector; SBOM, firmas y escaneo en CI son ahora requisito en muchas industrias.",
    counter: "«Más herramientas = más seguridad» es falso: sin triage, es ruido. Y «shift-left» no elimina la necesidad de controles en runtime y respuesta a incidentes.",
    views: [
      ["Desarrollo", "Feedback de seguridad en el PR, con falsos positivos mínimos."],
      ["Operaciones", "Parcheo, secretos, mínimos privilegios, detección."],
      ["Negocio", "Cumplimiento, reputación y costo de una brecha."]
    ]
  },
  videos: ["zh-YEP7jO_s","BmNclZzXXjc"],
  resources: [
    ["OWASP Top 10", "https://owasp.org/www-project-top-ten/", "doc", "Riesgos principales de aplicaciones web."],
    ["Trivy", "https://trivy.dev/", "lab", "Escáner de imágenes, IaC y dependencias."],
    ["SLSA", "https://slsa.dev/", "doc", "Marco para integridad de la cadena de suministro."],
    ["Sigstore / cosign", "https://www.sigstore.dev/", "doc", "Firma y verificación de artefactos."],
    ["roadmap.sh DevOps", "https://roadmap.sh/devops", "doc", "Mapa de referencia y proyectos."]
  ],
  cheat: "# DevSecOps — hoja de referencia\n\n- `trivy image app:1.0` · `trivy config .` · `trivy fs .`\n- `cosign sign --yes imagen@sha256:...` · `cosign verify ...`\n- `gitleaks detect` · `semgrep --config auto`\n\n## Reglas\n- Secreto filtrado: rotar primero, limpiar historial después\n- Mínimo privilegio, imágenes mínimas, usuario no root\n- SBOM por build y política de admisión en el clúster\n",
  days: [
    d("Amenazas y shift-left", "OWASP Top 10, SAST, DAST, SCA", "Agrega Trivy y Semgrep a tu pipeline", "Pipeline que falla con una vulnerabilidad plantada"),
    d("Secretos y cadena de suministro", "Gestión de secretos, SLSA, firmas, SBOM", "Firma tu imagen con cosign y verifica", "Verificación exitosa y fallida"),
    d("Proyecto final I: diseño", "Arquitectura, alcance y criterios de éxito", "App de 2 servicios, diagrama y plan en un repo", "README con arquitectura y decisiones"),
    d("Proyecto final II: IaC y CI/CD", "Combina Terraform, contenedores y pipelines", "Infraestructura reproducible y despliegue automatizado", "Un push despliega a un entorno"),
    d("Proyecto final III: K8s, observabilidad y seguridad", "Combina Kubernetes, métricas, SLO y escaneos", "Despliega en Kubernetes con dashboards, alertas y policies", "Dashboard y política activos"),
    d("Proyecto final IV: portafolio", "Documentación, runbooks, postmortem y demo", "Graba un demo de 5 min y publica el repo", "Enlace público + CV actualizado")
  ],
  quiz: [
    ["¿Qué significa shift-left en seguridad?", "Detectar y corregir defectos de seguridad lo antes posible en el ciclo", "Mover servidores a otra región", "Cifrar solo el código", "Auditar al final", "Cuanto antes se detecta, más barato es corregir."],
    ["¿Qué es un SBOM?", "Un inventario de componentes y dependencias de un artefacto", "Un firewall", "Un certificado", "Un plan de pruebas", "Permite saber si una CVE nueva te afecta."],
    ["Un secreto se filtró en un commit público. ¿Primer paso?", "Rotar y revocar el secreto, luego limpiar el historial", "Borrar el commit y listo", "Hacer el repo privado", "Esperar", "Hay que asumir que ya fue copiado."],
    ["¿Para qué firmar imágenes con cosign?", "Verificar procedencia e integridad antes de desplegar", "Reducir su tamaño", "Cifrar su contenido", "Acelerar el pull", "Un admission controller puede rechazar imágenes sin firma válida."]
  ]
}
];

// Asigna número global de día y módulo a cada día.
let _n = 0;
MODULES.forEach((m, mi) => m.days.forEach((x, i) => { x.n = ++_n; x.mod = mi; x.i = i; x.v = i % m.videos.length; }));
const TOTAL_DAYS = _n;
const DAYS = MODULES.flatMap(m => m.days);

const METHOD = {
  reverse: [
    ["Cimientos antes que herramientas", "Quien lleva 20 años no empezó por Kubernetes: empezó por Unix, redes y control de versiones. Las herramientas cambian cada 3 años; los cimientos, cada 30."],
    ["Construir, romper, arreglar", "El conocimiento operativo se forma en incidentes. Aquí cada módulo pide romper algo a propósito y diagnosticarlo con método."],
    ["Del problema a la herramienta", "Entiende qué dolor resuelve cada tecnología (por qué existe Docker, por qué Terraform) y retendrás el porqué, no solo el cómo."],
    ["Enseñar y documentar", "Escribir un runbook o un postmortem fija el aprendizaje mejor que releer. Cada día termina con una evidencia."],
    ["Profundidad en T", "Amplitud en toda la cadena y profundidad en una especialidad: se elige después del día 90."],
    ["Repetición espaciada", "Las preguntas de cada módulo se repiten en el examen integrador para pelear contra el olvido."]
  ],
  schedule: [
    ["40 min", "Entender: video o lectura del tema"],
    ["90 min", "Practicar: laboratorio práctico, sin copiar y pegar a ciegas"],
    ["30 min", "Evidenciar: notas, diagrama o commit en tu repo"],
    ["20 min", "Repasar: 3 preguntas de días anteriores"]
  ],
  after: [
    "Días 91–150: elige una certificación que valide lo hecho (AWS SAA, Terraform Associate o CKA).",
    "Días 151–250: contribuye a un proyecto de código abierto o toma guardias reales (aunque sea de un servicio personal).",
    "Días 250+: escribe, da charlas internas, profundiza en una especialidad (plataforma, SRE, seguridad, datos)."
  ],
  honest: "Una ruta de 90 días te da una base operativa sólida y un portafolio. La seniority real se forma con incidentes reales, escala y años de decisiones. Este plan comprime la exposición, no sustituye la experiencia: úsalo para llegar al primer trabajo o al siguiente nivel lo más rápido posible."
};

// Metadatos de video [título, canal, minutos]. IDs verificados con oEmbed (incrustables).
const VIDEO_META = {"LUitZgkuj9I":["Estructura de Directorios en Linux | FHS","FernuDev",22],"zMKacHGuIHI":["Linux Crash Course - Data Streams (stdin, stdout & stderr)","Learn Linux TV",17],"QDTdK9gQJH4":["Cómo Funcionan los PERMISOS de LINUX: Explicación FÁCIL! #08","TheGoodHacker",17],"L4nve-5tuco":["Los Procesos | Curso de Linux 4 | Como monitorearlos y administrarlos, comandos ps top kill y htop","Computadoras y Sensores",9],"oBUAtZ_3db4":["👉 Cómo Utilizar las Expresiones Regulares en LINUX | Awk, Tr, Sed 🐧","El Pingüino de Mario",12],"6KjMlm8hhFA":["Linux inodes Explained","tutoriaLinux",9],"Xa7ba6N2B7M":["Asegura tu Servidor SSH en GNU/Linux: Hardening Paso a Paso","JuncoTIC",22],"6KCkoITQz8U":["Aprende LINUX de forma divertida y rapida con OverTheWire. Conviértete en un PRO.","y4nbow",26],"CabgHWBJFaM":["TCP Establecimiento de la conexión 3 way handshake SYN-SYN+ACK,ACK con wireshark","Mit Lomasdelmirador",9],"SHbBso63X38":["Direccionamiento IPv4 y Subredes (Explicado)","Gabriel Marcano",18],"SRfU9meXlC8":["¿Qué es el DNS (Sistema de Nombres de Dominio)? Servidor y servicio DNS | Alberto López","AlbertoLopez TECH TIPS",9],"6HJAWFenYx8":["SSL, TLS, HTTPS, HTTP - Explicado Fácilmente","Profe Sang",9],"o7DSHPji1m0":["Enrutamiento y Balanceo de carga con NGINX para tus aplicaciones de Microservicios","NullSafe Architect",18],"jztpCEiV8xI":["📢TUTORIAL comando MTR 💻 Herramienta de diagnóstico de RED y resolución de ERRORES","Redes Plus",12],"LjwR--_ZUt8":["La GENIALIDAD de GIT! Así es como FUNCIONA por DENTRO.","Antonio Sarosi",13],"gctc2Un5iRY":["📣 TUTORIAL DE GIT: Merge y Rebase - ¿Cuándo usar cuál? - Explicación SIMPLE","Código y Café",9],"-73RVTQxUhs":["Trunk-Based Development: Simplificando Git 📍| Flujos de trabajo con Git 5/7","CodelyTV - Redescubre la programación",7],"5ecEx-4QeTA":["Cómo RECUPERAR COMMITS borrados en #Git","CodelyTV - Redescubre la programación",13],"SigVVJmUGv8":["Haz tus mensajes de GIT Commit PROFESIONALES con CONVENTIONAL COMMITS","Carlos Azaustre - AprendiendoDEV",13],"UJz-WUw-yyc":["👉 CURSO DE BASH SCRIPTING - Cómo CREAR un SCRIPT en BASH 🐧","El Rincón del Hacker",6],"2XuDmdNX6zU":["How to Use Systemd Timers","Luke",6],"PK624PcZKUY":["Archivos JSON en Python 😎 - Curso de Python desde cero","Argueta Lab",9],"2Fp1N6dof0Y":["Python Tutorial: Calling External Commands Using the Subprocess Module","Corey Schafer",19],"3DRiruDUhiA":["Using Python to Automate AWS Services | Lambda and EC2","Travis Media",24],"JZ0TMkwMgp8":["PyTest: Pruebas Unitarias en Python 🐍 | Unit Tests | Testing Automatizado con Python ✅","UskoKruM2010",20],"OxpBMNalsDM":["24. Command line argument processing using argparse [Python 3 Programming Tutorials]","codebasics",15],"el7768BNUPw":["Containers: cgroups, Linux kernel namespaces, ufs, Docker, and intro to Kubernetes pods","Sean",4],"9eTVZwMZJsA":["Docker - La explicación que querías","Ringa Tech",19],"z0TITJFlukI":["Docker, buenas prácticas","mkdev, en Español",13],"DIDel70dFlI":["Volúmenes y redes en Docker","Programación en español",19],"DM65_JyGxCo":["Docker Compose will BLOW your MIND!! (a tutorial)","NetworkChuck",16],"dwce6Yl9N9Q":["Trivy Vulnerability Scanner Tool For DevSecOps 🔥🔥","DevOps Shack",15],"RgZyX-e6W9E":["Push Docker Images to GitHub Container Registry • #docker  #containers #github  #githubactions","Brian Morrison",15],"tLK9nNFHWH8":["Debugging Docker Containers with docker exec and docker logs || Docker Tutorial 5","TechWorld with Nana",10],"YOvEIFLWz3I":["DORA Metrics Explained","Sleuth TV",8],"MNBf-ylhtK0":["Github Actions - CI/CD Gratuito y fácil en Github","Pelado Nerd",13],"7PVUjRXUY0o":["Cache Management with GitHub actions","Mickey Gousset",12],"x7f9x30W_dI":["Build and Push Docker Images with GitHub Actions","Rishab in Cloud",13],"otGZGyhKpy0":["Cómo hacer un deploy a escala sin downtime: Rolling vs Blue-green vs Canary vs Feature toggles","CodelyTV - Redescubre la programación",13],"z7nLsJvEyMY":["GitLab CI/CD Pipeline Tutorial for Beginners","Valentin Despa",20],"ZO3nCHEK5RI":["CÓMO CREAR UN PIPELINE EN JENKINS","OpenWebinars",6],"BDQivAobxKA":["Caching Dependencies to SPEED UP Workflows in GitHub Actions","CoderDave",6],"4Ik1OcQR2BE":["Crea tu Cuenta en AWS Gratis y algunos tips","My IT Mentors",11],"PjKvwxTTSUk":["Overview of Users, Groups, Roles and Policies | AWS IAM","Digital Cloud Training",8],"dViSyZ2HCr8":["EC2 (Elastic Compute Service - AWS): ¿Cómo se configura y cómo se crea instancias EC2?","Rubén Carvajal",19],"VyHtPlSlTzY":["TU SITIO WEB EN MINUTOS CON S3 - Cómo hostear web estáticas con AWS S3","milunadev",11],"35zd1FAMrjA":["🚀 [CURSO AWS] - VPC, Subnets, Internet y NAT Gateways","Ruben J GarcIA",15],"MH01PNZLR98":["Simple Queue Service (SQS) Basics | AWS Cloud Computing Tutorial for Beginners","Tiny Technical Tutorials",11],"fZuxp_pOzgI":["AWS Tutorial to create Application Load Balancer and Auto Scaling Group","Cloud Champ",13],"MpDJ6TCWKjk":["What is the AWS Well-Architected Framework? (and why you need to learn about it)","Tech With Lucy",9],"E8Ra3lVzCHQ":["CREANDO primer función en AWS Lambda Python + AWS + API GATEWAY","Lambda Coding",11],"e8ke3pi1ROI":["Aprendé Terraform en minutos: Explicado más simple, imposible! - IaC Series, Parte 2","Alex Manuelian",6],"6RwDAu05dbU":["Resource, variables y outputs Como crear un recurso en Terraform  | VIDEO 2 | CURSO TERRAFORM 2023","Cultura DevOps",15],"MxdvSgoWK7E":["Terraform state locking using DynamoDB(LockID) and S3 Bucket - Part 14","Rahul Wagh",16],"0uxcZEFjizo":["Terraform Modules Explained with Real AWS Example | Complete Tutorial for Beginners","CodeCraft Academy",5],"JmfEKEYdxKU":["Workspaces | Terraform Tutorial | #16","Will Brock",19],"AV0VG3cBntw":["GitHub Actions Deploy Terraform | GitHub Actions Workflows | GitHub Actions Demo","Java Home Cloud",9],"0e4t588Lv1Y":["Scan Terraform Code for Security Issues with Checkov | Automate IaC Security in CI/CD","Cloudamy",8],"TJlbXUKgBHg":["Terraform Import Got WAY Easier! (Here's How)","TeKanAid - Platform Engineering and AI",14],"7KOGXk9eJok":["04-Curso ANSIBLE desde CERO. Un ejemplo ficheros de inventarios","Apasoft Training",4],"Wuv0ZPOMLf0":["Ansible – 6. Redactando un playbook","makigas",9],"MkWS9oFxRh4":["Ansible JINJA2 (template) Tutorial - Complete Beginners Guide - 2022","LondonIAC / Dennis McCarthy / Automation Engineer",11],"p9bda0-TIRc":["Ansible Playbook Basics - FINALLY Explained Clearly!","Alta3 Research",13],"QxgJlJgGA0E":["Terraform Ansible Integration | Terraform Ansible AWS Example","Anton Putra",9],"TlHvYWVUZyc":["Kubernetes Explained in 6 Minutes | k8s Architecture","ByteByteGo",6],"iC-WxZGhFqs":["Kubernetes Pods, ReplicaSets, and Deployments in 5 Minutes","Containers from the Couch",5],"T4Z7visMM4E":["Kubernetes Services explained | ClusterIP vs NodePort vs LoadBalancer vs Headless Service","TechWorld with Nana",24],"80Ew_fsV4rM":["Kubernetes Ingress Tutorial for Beginners | simply explained  | Kubernetes Tutorial 22","TechWorld with Nana",23],"FAnQTgr04mU":["Kubernetes ConfigMap and Secret as Kubernetes Volumes | Demo","TechWorld with Nana",17],"0swOh5C3OVM":["Kubernetes Volumes explained | Persistent Volume, Persistent Volume Claim & Storage Class","TechWorld with Nana",21],"xTTJg1aJ4kg":["MANEJA LOS RECURSOS DE TUS PODS EN KUBERNETES - Requests y Limits","Pelado Nerd",8],"5gSc1ouW8rM":["LIVENESS Y READINESS PROBES en KUBERNETES!","Pelado Nerd",14],"VTADZjL_psI":["MANEJA PERMISOS en tu cluster de KUBERNETES con RBAC!","Pelado Nerd",13],"u1KUft3fsCk":["Kubernetes Network Policy Tutorial - yaml explained + Demo Calico","Cloud With Raj",16],"-ykwb1d0DXU":["What is Helm in Kubernetes? Helm and Helm Charts explained  | Kubernetes Tutorial 23","TechWorld with Nana",14],"e6Wmu77HoV8":["ArgoCD - LA MEJOR herramienta para CD en KUBERNETES","Pelado Nerd",12],"1q7VwfApOLY":["Kubernetes pod debugging crashloopbackoff imagepullbackoff pending & error | Real time debugging","TechWiseRahul",18],"8LJibrSurKA":["CKA Exam Tips: How To Crack The Exam In 2023 | Certified Kubernetes Administrator | KodeKloud","KodeKloud",10],"k8n4gOsTK6g":["Métricas, Alertas, Traicing... ¿CÓMO hace GRAFANA la OBSERVABILIDAD?","CodelyTV - Redescubre la programación",9],"h4Sl21AKiDg":["How Prometheus Monitoring works | Prometheus Architecture explained","TechWorld with Nana",22],"EGgtJUjky8w":["Creating Grafana Dashboards for Prometheus | Grafana Setup & Simple Dashboard (Chart, Gauge, Table)","Prometheus Monitoring with Julius | PromLabs",14],"7afEzVnHY7o":["Centraliza los logs de tu cluster | Loki, Fluentd y Grafana","Achetronic",9],"83kYDv82hWE":["Aprende a recopilar las trazas de tu aplicación con Open Telemetry y Jaeger","NullSafe Architect",20],"Akri1BlGp10":["SLO vs SLI vs SLA vs Error Budget | Google SRE in Plain English","Tech Tutorials with Piyush",19],"Wact-Ja9CDI":["¿Qué es DevSecOps? DevSecOps explicado en 8 minutos","Joan Amengual",8],"HLb1Q086u6M":["Signing and Verifying Container Images With Sigstore Cosign and Kyverno","DevOps & AI Toolkit",14],"bmAs4806Nbg":["7 proyectos AWS para conseguir trabajo en 2026 (guía real para tu portafolio)","Marcia en Desplegando Cloud",15],"BD87cPRkXpc":["Despliega toda tu infraestructura con Github Actions y Terraform","Amin Espinoza",23],"_mJPvzMStPI":["Monitoreo con GRAFANA y PROMETHEUS en Kubernetes! - Prometheus parte 2","Pelado Nerd",10],"jUpEAETSf1s":["Como crear porfolio para DevOps juniors","DaveOps",11],"hZDaS9xyINI":["¿Qué es Linux? - La mejor explicación en español","EDteam",19],"BZN7Tqeu8eA":["Comandos básicos de Linux, nivel iniciante (Debian, Ubuntu, Mint) - Primera parte","Locos por Linux",10],"_JNPvSxG6oM":["¡Aprende los conceptos básicos de redes en menos de 15 minutos!","Amin Espinoza",14],"7XjJqUM0dvg":["Qué es y para qué sirve un DNS. Curso de redes desde 0 | Cap 4 |","NASeros",9],"mCVQgSyjCkI":["💥 ¿Qué es GIT? ¿Qué son los REPOSITORIOS?🗄️| EXPLICACIÓN FÁCIL 🚀 | Introducción a GIT #1","TodoCode",5],"vlCXdvcgiE0":["Aprende Git en 15 Minutos","deivchoi",15],"RQEh8XW0wLk":["Python or Bash for scripting? Which is best?","Mashed",10],"0tIZhTAuNuU":["¿Qué es Bash y para que sirven los Bash Scripts?","Fazt",5],"OEvHEeDpg_o":["¿Qué es DOCKER? 🐋 🚚 | EXPLICACIÓN FÁCIL","TodoCode",9],"6idFknRIOp4":["Aprende Docker en 14 minutos 🐳","Pelado Nerd",14],"6eRkCnFhHRg":["¿QUE ES CI/CD?","Pelado Nerd",7],"M4CXOocovZ4":["CI/CD Explained | How DevOps Use Pipelines for Automation","Akamai Developers",7],"VR8aXePkQ5M":["📌CLOUD COMPUTING ¿Qué es IaaS, PaaS y Saas? | Modelos de Servicio Cloud","AlbertoLopez TECH TIPS",7],"ym_oHKnoneE":["Top 25 servicios de Amazon Web Services ☁️ ¿Qué es AWS?","Programador X",15],"3zX2o3NjbnM":["Infraestructura como código en 10 minutos | Introducción","NetMentor",12],"slNIwBPeQvE":["Ansible – 1. ¿Qué es Ansible?","makigas",6],"uqMkIdLE0AQ":["QUÉ ES ANSIBLE","OpenWebinars",7],"VnvRFRk_51k":["What is Kubernetes | Kubernetes explained in 15 mins","TechWorld with Nana",14],"r2zuL9MW6wc":["Kubernetes Explained in 15 Minutes | Hands On","Travis Media",15],"VSddZh0V8dE":["Observabilidad: Qué es y por qué es MUCHO más que Monitorización","DanielLop",8],"m7VinvdhIlQ":["¿Qué es un SRE?","Minuto DevOps",15],"zh-YEP7jO_s":["✅¿Que es DevSecOps?. 🔥Cuales son sus diferencias con DevOps. Seguridad Informática. Ciberseguridad.","Alvaro Chirou",10],"BmNclZzXXjc":["¿Cómo aprender DevOps? - La ruta para aprender DevOps (Roadmap)","Fazt",18]};
// Un video corto y específico por día.
const DAY_VIDEOS = {"1":"LUitZgkuj9I","2":"zMKacHGuIHI","3":"QDTdK9gQJH4","4":"L4nve-5tuco","5":"oBUAtZ_3db4","6":"6KjMlm8hhFA","7":"Xa7ba6N2B7M","8":"6KCkoITQz8U","9":"CabgHWBJFaM","10":"SHbBso63X38","11":"SRfU9meXlC8","12":"6HJAWFenYx8","13":"o7DSHPji1m0","14":"jztpCEiV8xI","15":"LjwR--_ZUt8","16":"gctc2Un5iRY","17":"-73RVTQxUhs","18":"5ecEx-4QeTA","19":"SigVVJmUGv8","20":"UJz-WUw-yyc","21":"2XuDmdNX6zU","22":"PK624PcZKUY","23":"2Fp1N6dof0Y","24":"3DRiruDUhiA","25":"JZ0TMkwMgp8","26":"OxpBMNalsDM","27":"el7768BNUPw","28":"9eTVZwMZJsA","29":"z0TITJFlukI","30":"DIDel70dFlI","31":"DM65_JyGxCo","32":"dwce6Yl9N9Q","33":"RgZyX-e6W9E","34":"tLK9nNFHWH8","35":"YOvEIFLWz3I","36":"MNBf-ylhtK0","37":"7PVUjRXUY0o","38":"x7f9x30W_dI","39":"otGZGyhKpy0","40":"z7nLsJvEyMY","41":"ZO3nCHEK5RI","42":"BDQivAobxKA","43":"4Ik1OcQR2BE","44":"PjKvwxTTSUk","45":"dViSyZ2HCr8","46":"VyHtPlSlTzY","47":"35zd1FAMrjA","48":"MH01PNZLR98","49":"fZuxp_pOzgI","50":"MpDJ6TCWKjk","51":"E8Ra3lVzCHQ","52":"e8ke3pi1ROI","53":"6RwDAu05dbU","54":"MxdvSgoWK7E","55":"0uxcZEFjizo","56":"JmfEKEYdxKU","57":"AV0VG3cBntw","58":"0e4t588Lv1Y","59":"TJlbXUKgBHg","60":"7KOGXk9eJok","61":"Wuv0ZPOMLf0","62":"MkWS9oFxRh4","63":"p9bda0-TIRc","64":"QxgJlJgGA0E","65":"TlHvYWVUZyc","66":"iC-WxZGhFqs","67":"T4Z7visMM4E","68":"80Ew_fsV4rM","69":"FAnQTgr04mU","70":"0swOh5C3OVM","71":"xTTJg1aJ4kg","72":"5gSc1ouW8rM","73":"VTADZjL_psI","74":"u1KUft3fsCk","75":"-ykwb1d0DXU","76":"e6Wmu77HoV8","77":"1q7VwfApOLY","78":"8LJibrSurKA","79":"k8n4gOsTK6g","80":"h4Sl21AKiDg","81":"EGgtJUjky8w","82":"7afEzVnHY7o","83":"83kYDv82hWE","84":"Akri1BlGp10","85":"Wact-Ja9CDI","86":"HLb1Q086u6M","87":"bmAs4806Nbg","88":"BD87cPRkXpc","89":"_mJPvzMStPI","90":"jUpEAETSf1s"};
DAYS.forEach(x => { x.vid = DAY_VIDEOS[x.n]; });
