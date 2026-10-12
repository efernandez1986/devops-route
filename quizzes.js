// Prueba diaria: 3 preguntas por día. Formato: [pregunta, CORRECTA, mala1, mala2, mala3, explicación]. Se barajan al mostrar.
const DAY_QUIZ = {
1: [
 ["¿Qué directorio guarda por convención la configuración del sistema?", "/etc", "/var", "/proc", "/usr/bin", "FHS: /etc contiene configuración; /var datos variables; /usr/bin ejecutables."],
 ["¿Qué es /proc?", "Un sistema de archivos virtual que expone información del kernel y de los procesos", "El directorio de procesos zombi", "La partición de arranque", "Una caché de paquetes", "No ocupa disco: el kernel genera su contenido al leerlo."],
 ["¿Qué diferencia hay entre kernel y userland?", "El kernel gestiona hardware, memoria y procesos; userland son los programas que corren sobre él", "El kernel es la interfaz gráfica y userland el disco", "Son lo mismo con distinto nombre", "Userland es el espacio privilegiado", "Los programas piden servicios al kernel mediante llamadas al sistema."]
],
2: [
 ["¿Qué hace `cmd 2>&1 | grep error`?", "Envía stderr a donde va stdout para que también pase por el pipe", "Descarta los errores", "Guarda el error en un archivo", "Ejecuta cmd dos veces", "El pipe solo conecta stdout; 2>&1 une stderr a él."],
 ["Diferencia entre `>` y `>>`:", "`>` sobrescribe el archivo; `>>` añade al final", "`>` añade y `>>` sobrescribe", "Ninguna", "`>>` redirige stderr", "Usar `>` por error pierde el contenido previo."],
 ["En `find /var -type f 2>/dev/null`, ¿para qué sirve `2>/dev/null`?", "Descartar mensajes de error como «Permission denied»", "Acelerar la búsqueda", "Buscar en dispositivos", "Guardar la salida", "El descriptor 2 es stderr; /dev/null lo descarta."]
],
3: [
 ["¿Qué permisos da `chmod 640 f`?", "Dueño rw-, grupo r--, otros sin acceso", "Dueño rwx, grupo r-x, otros r--", "Todos pueden leer y escribir", "Dueño r--, grupo rw-, otros ---", "6=rw, 4=r, 0=nada."],
 ["Un directorio con sticky bit permite:", "Borrar un archivo solo a su dueño (o root), aunque otros puedan escribir en el directorio", "Que cualquiera borre todo", "Que los archivos se ejecuten como root", "Ocultar el directorio", "Es lo que protege /tmp."],
 ["Con `umask 022`, un archivo nuevo se crea con modo:", "644", "755", "600", "777", "666 menos 022 = 644 (los archivos no nacen ejecutables)."]
],
4: [
 ["Diferencia entre SIGTERM y SIGKILL:", "SIGTERM puede capturarse para cerrar limpio; SIGKILL no se puede capturar ni ignorar", "SIGKILL permite limpieza", "Son iguales", "SIGTERM no se puede enviar a servicios", "Por eso se prueba primero SIGTERM."],
 ["`Restart=on-failure` en una unidad systemd:", "Reinicia el servicio si termina con error", "Lo reinicia cada minuto", "Lo desactiva al fallar", "Solo aplica al arranque", "Es la base de la auto-recuperación de servicios."],
 ["¿Cómo ves los logs de un servicio systemd?", "`journalctl -u nombre`", "`cat /proc/nombre`", "`ps -u nombre`", "`systemctl logs`", "journald centraliza los logs por unidad."]
],
5: [
 ["¿Qué obtiene `awk '{print $1}' access.log | sort | uniq -c | sort -rn | head`?", "Las IPs que más peticiones hacen", "Los códigos de estado", "Los archivos más grandes", "Las URL más lentas", "$1 es la primera columna (IP) en el formato común."],
 ["¿Por qué `sort` va antes de `uniq`?", "uniq solo colapsa líneas iguales adyacentes", "uniq no funciona sin sort por licencia", "Para cifrar", "Para acelerar awk", "Sin ordenar, los duplicados no quedan juntos."],
 ["`grep -E ' 5[0-9]{2} ' access.log` busca:", "Respuestas HTTP 5xx", "Puertos 50–59", "Archivos de 5 bytes", "IPs que empiezan por 5", "Expresión regular extendida: un 5 seguido de dos dígitos."]
],
6: [
 ["¿Qué muestra `df -i`?", "El uso de inodos por sistema de archivos", "El uso de bloques", "La velocidad de disco", "Los inodos de un archivo", "Puedes quedarte sin inodos con espacio libre."],
 ["Un dispositivo loop sirve para:", "Usar un archivo como si fuera un dispositivo de bloques (disco)", "Repetir comandos", "Duplicar un disco real", "Acelerar el swap", "Útil para practicar con discos sin hardware extra."],
 ["Montas un FS sobre un directorio que ya tenía archivos. ¿Qué pasa?", "El contenido original queda oculto mientras esté montado", "Se borra", "Se fusionan", "El montaje falla", "Reaparece al desmontar."]
],
7: [
 ["`PasswordAuthentication no` en sshd_config:", "Obliga a autenticarse con claves", "Quita la contraseña de root", "Desactiva SSH", "Cifra las contraseñas", "Elimina el ataque por fuerza bruta de contraseñas."],
 ["`ssh -L 8080:localhost:80 host` hace:", "Reenvía tu puerto local 8080 al puerto 80 visto desde host", "Expone tu puerto 80 en host", "Abre un proxy SOCKS", "Copia archivos", "-L es reenvío local."],
 ["¿Qué permisos debe tener tu clave privada?", "600 (solo lectura/escritura del dueño)", "644", "777", "400 para el grupo", "SSH rechaza claves privadas legibles por otros."]
],
8: [
 ["¿Cómo listas archivos ocultos?", "`ls -a`", "`ls -h`", "`ls -R`", "`ls -x`", "Los ocultos empiezan por punto."],
 ["En `find`, `-size 33c` significa:", "33 bytes", "33 caracteres UTF-8", "33 KB", "33 bloques", "El sufijo c es bytes; k son KiB."],
 ["¿Cómo lees un archivo llamado `-file`?", "`cat ./-file`", "`cat -file`", "`cat \"-file\"`", "`cat --file`", "Sin ./ el guion se interpreta como opción."]
],
9: [
 ["Orden del handshake TCP:", "SYN, SYN-ACK, ACK", "ACK, SYN, SYN-ACK", "SYN, ACK, FIN", "HELLO, ACK", "Establece números de secuencia en ambos sentidos."],
 ["¿Qué es el MSS?", "El tamaño máximo de segmento TCP que cada lado acepta", "El tamaño de la ventana", "El MTU de la red", "El tiempo de vida", "Suele ser MTU menos cabeceras IP/TCP."],
 ["Diferencia clave TCP vs UDP:", "TCP es orientado a conexión con entrega fiable; UDP no garantiza entrega ni orden", "UDP es más fiable", "TCP no usa puertos", "UDP cifra", "UDP prioriza latencia (DNS, VoIP)."]
],
10: [
 ["¿Cuántas direcciones tiene un /24?", "256 (254 usables)", "24", "65 536", "512", "32 − 24 = 8 bits de host."],
 ["De un /16, ¿cuántas subredes /24 salen?", "256", "16", "24", "65 536", "Se usan 8 bits más para subred."],
 ["¿Cuál NO es una dirección privada?", "172.32.0.1", "10.2.3.4", "192.168.1.5", "172.16.5.1", "Lo privado en 172 es 172.16.0.0–172.31.255.255."]
],
11: [
 ["¿Qué hace `dig +trace`?", "Sigue la delegación desde la raíz hasta el servidor autoritativo", "Mide latencia", "Borra la caché", "Lista registros MX", "Muestra cada salto de la resolución."],
 ["El TTL de un registro DNS indica:", "Cuánto tiempo puede cachearse la respuesta", "Cuántos saltos tiene", "Su prioridad", "Su tamaño máximo", "Bajarlo antes de migrar acelera el cambio."],
 ["¿Por qué no se permite CNAME en el apex (ej. ejemplo.com)?", "Porque convive con SOA y NS y un CNAME exige ser el único registro del nombre", "Por seguridad TLS", "Por tamaño", "Sí se permite siempre", "Por eso existen ALIAS/ANAME en algunos proveedores."]
],
12: [
 ["Un 401 frente a un 403:", "401: no autenticado; 403: autenticado pero sin permiso", "Son iguales", "403: no encontrado", "401: error de servidor", "Autenticación vs autorización."],
 ["La cadena de confianza TLS va de:", "Certificado hoja → intermedios → raíz de confianza", "Raíz → hoja solo", "Clave pública → privada", "DNS → CA", "El cliente valida hasta una raíz que ya conoce."],
 ["Con `curl -v` a un HTTPS puedes ver:", "El handshake TLS, el certificado y las cabeceras", "Solo el cuerpo", "El contenido cifrado", "Las IP internas", "Útil para depurar certificados."]
],
13: [
 ["En nginx, `proxy_pass` sirve para:", "Reenviar la petición a un backend", "Servir archivos estáticos", "Cifrar el tráfico", "Reiniciar workers", "Es la base de un reverse proxy."],
 ["Round-robin significa:", "Repartir peticiones de forma secuencial entre backends", "Enviar siempre al más rápido", "Elegir al azar", "Fijar cliente a servidor", "El más simple de los algoritmos."],
 ["Un health check pasivo:", "Marca un backend como caído tras errores en tráfico real", "Hace pings periódicos", "Reinicia el backend", "Requiere agentes", "El activo sondea; el pasivo observa."]
],
14: [
 ["Metodología de diagnóstico por capas:", "Subir desde la física/enlace hasta la aplicación descartando cada capa", "Empezar siempre por la app", "Reiniciar todo", "Cambiar el DNS primero", "Aísla dónde se rompe."],
 ["`ss -tulpn` muestra:", "Puertos TCP/UDP en escucha y su proceso", "Rutas de red", "Cache DNS", "Tráfico capturado", "Primera comprobación de «¿escucha el servicio?»."],
 ["`nc -zv host 443` sirve para:", "Probar si el puerto TCP acepta conexiones", "Capturar paquetes", "Resolver nombres", "Medir ancho de banda", "-z escanea sin enviar datos."]
],
15: [
 ["Los tres tipos de objeto básicos de Git:", "blob, tree, commit", "file, dir, branch", "add, commit, push", "diff, patch, merge", "Más los tags anotados."],
 ["Una rama en Git es:", "Un puntero (ref) a un commit", "Una copia del repositorio", "Una carpeta", "Un conjunto de parches", "Por eso crear ramas es instantáneo."],
 ["`git hash-object -w f` hace:", "Guarda el contenido como blob y devuelve su SHA", "Hace commit", "Calcula el diff", "Firma el archivo", "Es plumbing de bajo nivel."]
],
16: [
 ["Un fast-forward ocurre cuando:", "La rama destino no avanzó y basta mover su puntero", "Hay conflictos", "Se hace rebase", "Se borra la rama", "No crea commit de merge."],
 ["`git rebase` reescribe:", "Los commits (generan nuevos SHA)", "Solo los mensajes sin cambiar SHA", "El remoto automáticamente", "Nada", "Por eso no se hace sobre historia ya publicada."],
 ["Tras resolver un conflicto en un merge, haces:", "Editar, `git add` y concluir el merge/commit", "`git push -f`", "Borrar el repositorio", "`git stash drop`", "Marcar como resuelto con add."]
],
17: [
 ["Trunk-based development propone:", "Ramas de vida muy corta integradas a main con frecuencia", "Una rama por versión durante meses", "Sin ramas ni PR", "Solo forks", "Menos divergencia, menos conflictos."],
 ["La protección de rama permite:", "Exigir PR, revisiones y checks antes de fusionar", "Impedir leer la rama", "Cifrar commits", "Acelerar el CI", "Evita pushes directos a main."],
 ["Los feature flags sirven para:", "Integrar código incompleto desactivado", "Cifrar variables", "Ramificar infraestructura", "Evitar tests", "Separa despliegue de liberación."]
],
18: [
 ["`git bisect` hace:", "Búsqueda binaria del commit que introdujo un bug", "Divide un commit", "Compara ramas", "Comprime el repo", "O(log n) commits a probar."],
 ["`git cherry-pick SHA`:", "Aplica ese commit sobre la rama actual", "Borra el commit", "Cambia de rama", "Hace squash", "Crea un commit nuevo con el mismo cambio."],
 ["Un hook pre-commit se ejecuta:", "Antes de crear el commit y puede abortarlo", "Después del push", "Al clonar", "Al hacer fetch", "Ideal para linters y secretos."]
],
19: [
 ["En SemVer, un cambio incompatible sube:", "MAJOR", "MINOR", "PATCH", "BUILD", "MAJOR.MINOR.PATCH."],
 ["Un commit `feat:` en Conventional Commits indica:", "Nueva funcionalidad (sube MINOR)", "Corrección de bug", "Cambio de docs", "Refactor", "fix → PATCH; feat → MINOR; BREAKING → MAJOR."],
 ["Un tag de Git sirve para:", "Marcar un commit concreto, como una release", "Crear una rama", "Borrar historial", "Firmar el repo", "Referencia inmutable a una versión."]
],
20: [
 ["`set -u` en Bash:", "Falla al usar una variable no definida", "Desactiva errores", "Imprime comandos", "Exporta variables", "Evita typos silenciosos."],
 ["`trap 'cleanup' EXIT` sirve para:", "Ejecutar limpieza al terminar el script", "Capturar la entrada", "Ignorar errores", "Crear alias", "Se ejecuta incluso tras un error."],
 ["¿Por qué entrecomillar `\"$var\"`?", "Evita word splitting y globbing", "Es más rápido", "Convierte a número", "Oculta el valor", "Con espacios, sin comillas se parte en argumentos."]
],
21: [
 ["El cron `*/5 * * * *` ejecuta:", "Cada 5 minutos", "A las 5:00", "Cada 5 horas", "5 veces al día", "El primer campo son minutos."],
 ["Ventaja de un timer de systemd sobre cron:", "Logs en journal, dependencias y Persistent", "Es más antiguo", "No necesita unidad", "Funciona sin systemd", "Persistent recupera ejecuciones perdidas."],
 ["`systemctl list-timers` muestra:", "Los timers activos y su próxima ejecución", "Los procesos", "Las unidades fallidas", "El cron del usuario", "Útil para auditar tareas."]
],
22: [
 ["Un venv de Python sirve para:", "Aislar dependencias por proyecto", "Acelerar Python", "Compilar a binario", "Encriptar código", "Evita conflictos de versiones."],
 ["`json.load(f)` devuelve:", "Estructuras Python (dict/list) desde un archivo JSON", "Un string", "Un archivo", "Bytes", "`loads` es para strings."],
 ["`if __name__ == \"__main__\":` sirve para:", "Ejecutar código solo cuando el archivo se lanza como script", "Declarar la clase principal", "Importar módulos", "Crear hilos", "Permite reutilizar el módulo por import."]
],
23: [
 ["¿Por qué un `timeout` en requests?", "Evita bloquearse indefinidamente ante un servidor lento", "Acelera la petición", "Cifra", "Cuenta intentos", "Por defecto requests no tiene timeout."],
 ["Reintento con backoff:", "Espera un tiempo creciente entre intentos", "Reintenta sin pausa", "Reintenta una sola vez", "Cambia de URL", "Evita saturar al servidor."],
 ["`subprocess.run(..., check=True)`:", "Lanza excepción si el comando devuelve código distinto de 0", "Ignora errores", "Ejecuta en paralelo", "Captura stdout", "Fallar fuerte, no en silencio."]
],
24: [
 ["¿Cómo debe boto3 obtener credenciales?", "De perfil, variables de entorno o rol; nunca hardcodeadas", "Escritas en el código", "De un archivo del repo", "De la URL", "Evita filtrar secretos."],
 ["Un paginator en boto3 sirve para:", "Recorrer resultados paginados completos", "Acelerar la API", "Crear recursos", "Cifrar respuestas", "Muchas APIs devuelven por páginas."],
 ["Para listar recursos sin etiquetas:", "Filtrar los que no tienen la clave Tags requerida", "Listar solo los de la región", "Borrar todo", "Usar IAM", "El control de etiquetado es base de FinOps."]
],
25: [
 ["Un fixture de pytest:", "Prepara datos o estado reutilizable para pruebas", "Es un tipo de assert", "Compila el test", "Mockea red siempre", "Se inyecta por nombre de parámetro."],
 ["pre-commit sirve para:", "Ejecutar checks automáticos antes de cada commit", "Hacer push", "Desplegar", "Revisar PR", "Detecta problemas antes del CI."],
 ["`ruff` es:", "Un linter/formateador de Python muy rápido", "Un framework web", "Un gestor de paquetes", "Un intérprete", "Sustituye varias herramientas."]
],
26: [
 ["Un README mínimo útil incluye:", "Qué hace, cómo instalar y cómo usar", "Solo el nombre", "El historial", "Las claves", "Responde a las tres preguntas del recién llegado."],
 ["Un exit code distinto de 0 en un CLI:", "Indica error a quien lo invoca (scripts, CI)", "Es opcional", "Cierra la terminal", "Es un warning", "Permite encadenar y automatizar."],
 ["Una release v0.1.0 en Git es:", "Un tag que marca la primera versión publicada", "Una rama", "Un commit sin cambios", "Un fork", "Fija un punto reproducible."]
],
27: [
 ["Los namespaces aíslan:", "La vista de recursos (PID, red, mount, usuarios)", "El consumo de CPU", "El disco", "La versión del kernel", "Cada contenedor ve su propio conjunto."],
 ["Los cgroups sirven para:", "Limitar y contabilizar recursos (CPU, memoria, I/O)", "Aislar la red", "Montar discos", "Cifrar", "Aquí vive el OOM por límite de memoria."],
 ["Un `chroot` solo, comparado con un contenedor:", "Cambia la raíz del FS pero no aísla procesos, red ni recursos", "Es equivalente", "Aísla la red", "Limita CPU", "Es solo una pieza del rompecabezas."]
],
28: [
 ["Una capa de imagen es:", "Un cambio de sistema de archivos inmutable y compartible", "Un contenedor", "Una VM", "Un volumen", "Se reutilizan entre imágenes."],
 ["El digest de una imagen:", "Es un hash del contenido, inmutable", "Es un tag mutable", "Es la versión semántica", "Es el nombre", "Un tag puede apuntar a otro digest mañana."],
 ["La herramienta dive sirve para:", "Inspeccionar capas y espacio desperdiciado", "Ejecutar contenedores", "Escanear CVEs", "Orquestar", "Ayuda a optimizar tamaño."]
],
29: [
 ["Un build multi-stage permite:", "Dejar fuera del final las herramientas de compilación", "Ejecutar varios contenedores", "Compilar en paralelo siempre", "Cifrar la imagen", "Reduce tamaño y superficie."],
 ["¿Por qué `USER` no root?", "Limita el impacto si el proceso se compromete", "Mejora el rendimiento", "Es obligatorio", "Acelera el build", "Mínimo privilegio."],
 [".dockerignore evita:", "Enviar archivos innecesarios al contexto de build", "Que Docker corra", "Subir la imagen", "Que se use cache", "Reduce tiempo y filtraciones."]
],
30: [
 ["Un volumen de Docker:", "Persiste datos fuera del ciclo de vida del contenedor", "Es una imagen", "Una red", "Un registro", "Sobrevive al `docker rm`."],
 ["En una red bridge definida por el usuario:", "Los contenedores se resuelven por nombre", "No se ven entre sí", "Solo por IP", "Comparten procesos", "DNS interno de Docker."],
 ["`-p 8080:80` significa:", "Puerto 8080 del host → puerto 80 del contenedor", "80 del host → 8080 del contenedor", "Dos puertos del contenedor", "Rango", "Formato host:contenedor."]
],
31: [
 ["En Compose, `depends_on` con condición `service_healthy`:", "Espera a que el servicio pase su healthcheck", "Solo ordena el arranque", "Reinicia", "Lo escala", "Sin healthcheck no garantiza readiness."],
 ["`docker compose down -v`:", "Elimina contenedores, redes y volúmenes", "Solo detiene", "Reinicia", "Actualiza imágenes", "Cuidado: borra datos de volúmenes."],
 ["El archivo `.env` en Compose:", "Define variables para interpolar en el compose", "Cifra secretos", "Es un volumen", "Lista imágenes", "No es un gestor de secretos."]
],
32: [
 ["Un CVE es:", "Una vulnerabilidad pública identificada y catalogada", "Un tipo de imagen", "Un firewall", "Un parche", "Trivy compara tus paquetes con su base."],
 ["¿Por qué usar imágenes base slim/distroless?", "Menos paquetes, menos superficie de ataque", "Son más rápidas siempre", "Traen más herramientas", "Son obligatorias", "Menos software, menos CVEs."],
 ["Los secretos en un Dockerfile:", "No deben ir en ENV/capas; usar secrets o runtime", "Van en ENV", "Van en LABEL", "En el README", "Quedan en el historial de capas."]
],
33: [
 ["Para builds reproducibles, referencia imágenes por:", "Tag inmutable o digest", "latest", "El nombre solo", "La fecha", "latest cambia sin aviso."],
 ["Para publicar en GHCR desde CI necesitas:", "Un token con permiso de paquetes", "Una cuenta Docker Hub", "Una VPN", "Un runner propio", "GITHUB_TOKEN con packages: write."],
 ["¿Por qué etiquetar con el SHA del commit?", "Trazabilidad exacta del código que generó la imagen", "Reduce el tamaño", "Cifra", "Es obligatorio", "Facilita rollback y auditoría."]
],
34: [
 ["Para ver la salida de un contenedor:", "`docker logs`", "`docker top`", "`docker stats`", "`docker events`", "Muestra stdout/stderr."],
 ["Exit code 137 suele indicar:", "SIGKILL, a menudo OOM", "Éxito", "Error de sintaxis", "Puerto ocupado", "128 + 9."],
 ["`docker inspect` muestra:", "Configuración y estado en JSON", "Solo logs", "Uso de CPU", "El Dockerfile", "Incluye redes, montajes y exit code."]
],
35: [
 ["CI vs CD:", "CI integra y prueba cambios continuamente; CD los entrega/despliega de forma automatizada", "Son idénticos", "CI despliega, CD prueba", "CD es solo documentación", "Entrega continua vs despliegue continuo difieren en la aprobación."],
 ["Lead time for changes mide:", "El tiempo desde el commit hasta producción", "El tiempo de build", "El tiempo de reunión", "El de recuperación", "Una de las 4 métricas DORA."],
 ["Change failure rate es:", "El porcentaje de despliegues que causan fallo", "Fallos por mes", "Tiempo de caída", "Número de bugs", "Mide la calidad de los cambios."]
],
36: [
 ["`on: pull_request` dispara el workflow:", "Al abrir o actualizar un PR", "Solo al merge", "Cada hora", "Al crear un tag", "Base del CI de validación."],
 ["Diferencia entre job y step:", "Un job se ejecuta en un runner y contiene steps secuenciales", "Son lo mismo", "El step contiene jobs", "El job es un comando", "Los jobs corren en paralelo por defecto."],
 ["Un runner es:", "La máquina que ejecuta los jobs", "Un tipo de evento", "Un secreto", "Un repositorio", "Hosted o self-hosted."]
],
37: [
 ["Una `matrix` en Actions:", "Ejecuta el job para cada combinación de valores", "Une jobs", "Cifra secretos", "Cachea", "Prueba varias versiones a la vez."],
 ["Una buena clave de caché usa:", "El hash del lockfile", "La fecha", "Un número fijo", "El nombre del job", "Cambia solo cuando cambian las dependencias."],
 ["Los artefactos sirven para:", "Pasar archivos entre jobs o guardarlos tras la ejecución", "Cifrar", "Cachear dependencias", "Ejecutar en paralelo", "Distinto de la caché."]
],
38: [
 ["Para empujar a GHCR con GITHUB_TOKEN, el workflow necesita:", "`permissions: packages: write`", "Un PAT del usuario siempre", "Nada", "Acceso root", "Mínimo privilegio por job."],
 ["Los secretos en Actions:", "Se enmascaran en logs pero no deben imprimirse ni exponerse", "Son públicos", "Se guardan en el repo", "Se ven en los forks", "Enmascarar no es infalible."],
 ["Cachear capas de build en CI:", "Reduce el tiempo de construcción de imágenes", "Cambia el resultado", "Elimina la necesidad de Dockerfile", "Aumenta el tamaño", "Reusa capas sin cambios."]
],
39: [
 ["Un despliegue rolling:", "Sustituye instancias gradualmente", "Cambia todo a la vez", "Duplica el entorno", "Usa feature flags", "Mantiene capacidad durante el cambio."],
 ["Blue-green:", "Dos entornos y se cambia el tráfico de uno al otro", "Un canary del 5%", "Despliega por lotes", "Reinicia nodos", "Rollback inmediato volviendo al anterior."],
 ["Aprobación manual en Actions se logra con:", "Environments con required reviewers", "Un step de sleep", "Un secreto", "Un matrix", "Protege despliegues a producción."]
],
40: [
 ["En GitLab CI, los jobs de un mismo stage:", "Corren en paralelo", "Corren en orden", "No corren", "Corren en otro proyecto", "Los stages sí son secuenciales."],
 ["`rules:` en un job:", "Decide cuándo se ejecuta según condiciones", "Define imágenes", "Cachea", "Cifra", "Sustituye a only/except."],
 ["`include:` sirve para:", "Reutilizar configuración de otros archivos", "Importar secretos", "Crear ramas", "Instalar runners", "Evita duplicar pipelines."]
],
41: [
 ["Un Jenkinsfile declarativo es:", "Pipeline como código versionado con el proyecto", "Un plugin", "Una UI", "Un agente", "Facilita revisión y reproducibilidad."],
 ["`agent` en Jenkins:", "Indica dónde se ejecuta el pipeline o etapa", "Define credenciales", "Es un trigger", "Es un tag", "Puede ser docker, label, any."],
 ["Un multibranch pipeline:", "Crea un pipeline por rama/PR descubierta", "Corre en varios servidores", "Une ramas", "Solo corre en main", "Descubre ramas con Jenkinsfile."]
],
42: [
 ["Para reducir el tiempo de un pipeline:", "Paralelizar etapas independientes y cachear dependencias", "Quitar los tests", "Aumentar la frecuencia", "Reintentar siempre", "Medir primero dónde se va el tiempo."],
 ["Un test flaky es:", "Uno no determinista: a veces pasa y a veces falla sin cambios", "Uno lento", "Uno sin asserts", "Uno de integración", "Erosiona la confianza en el pipeline."],
 ["Antes de optimizar un pipeline conviene:", "Medir el tiempo por etapa", "Reescribirlo", "Cambiar de herramienta", "Añadir runners", "Sin datos se optimiza lo equivocado."]
],
43: [
 ["Lo primero a proteger en una cuenta cloud nueva:", "El usuario raíz con MFA", "Los buckets", "Las VPC", "Los logs", "Y no usarlo para el día a día."],
 ["Una alerta de presupuesto sirve para:", "Avisar antes de gastar de más", "Bloquear el gasto", "Reducir precios", "Cifrar", "No bloquea: notifica."],
 ["Región vs zona de disponibilidad:", "La región agrupa varias AZ aisladas entre sí", "Son lo mismo", "La AZ contiene regiones", "Una AZ es un país", "Distribuir entre AZ da alta disponibilidad."]
],
44: [
 ["Rol IAM vs usuario IAM:", "Un rol se asume con credenciales temporales; un usuario tiene credenciales de largo plazo", "Son iguales", "Los roles tienen contraseña", "Los usuarios son temporales", "Preferir roles."],
 ["Con Allow y Deny explícito aplicables:", "Gana el Deny", "Gana el Allow", "El más reciente", "Se suman", "Deny explícito siempre prevalece."],
 ["Mínimo privilegio significa:", "Dar solo los permisos necesarios para la tarea", "Dar todos los permisos", "Quitar MFA", "Usar un único rol", "Reduce el radio de impacto."]
],
45: [
 ["Un security group es:", "Un firewall con estado a nivel de instancia", "Un router", "Un rol", "Un balanceador", "Reglas de entrada y salida."],
 ["User-data en EC2:", "Un script que se ejecuta en el primer arranque", "Datos de usuario cifrados", "Un volumen", "Una política", "Para bootstrap."],
 ["Una AMI es:", "Una plantilla de imagen para lanzar instancias", "Un tipo de red", "Un volumen", "Una región", "Incluye SO y configuración."]
],
46: [
 ["Una regla de ciclo de vida en S3:", "Mueve o expira objetos automáticamente", "Cifra objetos", "Replica en otra región", "Bloquea acceso", "Reduce costos."],
 ["El versionado de S3 protege contra:", "Borrados y sobrescrituras accidentales", "Accesos externos", "Latencia", "CVEs", "Mantiene versiones previas."],
 ["Block Public Access:", "Impide exposición pública accidental de buckets", "Hace público", "Cifra", "Replica", "Salvaguarda a nivel de cuenta/bucket."]
],
47: [
 ["Una subred pública se define por:", "Tener una ruta a un Internet Gateway", "Tener IP pública", "Estar en otra región", "Tener NAT", "Es una propiedad de la tabla de rutas."],
 ["Un NAT Gateway permite:", "Salida a internet desde subredes privadas sin entrada directa", "Entrada desde internet", "VPN", "Balanceo", "Es de pago por hora y GB."],
 ["Las tablas de rutas:", "Deciden a dónde va el tráfico de una subred", "Cifran", "Filtran puertos", "Asignan IP", "Asociadas a subredes."]
],
48: [
 ["SQS sirve para:", "Desacoplar productores y consumidores con una cola", "Almacenar archivos", "Balancear", "Cachear", "Absorbe picos de carga."],
 ["Una dead-letter queue:", "Guarda mensajes que fallaron repetidamente", "Acelera", "Duplica", "Cifra", "Para análisis de fallos."],
 ["En DynamoDB, la clave de partición:", "Determina la distribución de los datos", "Es el índice secundario", "Es el cifrado", "Es la región", "Mal elegida crea hot partitions."]
],
49: [
 ["Un Auto Scaling Group:", "Mantiene el número deseado de instancias sanas y escala", "Balancea tráfico", "Cifra", "Crea VPC", "Reemplaza instancias no saludables."],
 ["Un ALB opera en la capa:", "7 (aplicación)", "2", "3", "4 solo", "Enruta por host/path."],
 ["Un health check del balanceador:", "Saca del reparto a objetivos que no responden", "Cifra", "Reinicia la AZ", "Escala", "Solo enruta a objetivos sanos."]
],
50: [
 ["Pilares de Well-Architected incluyen:", "Seguridad, fiabilidad, eficiencia, optimización de costos, excelencia operativa y sostenibilidad", "Solo costo", "Solo seguridad", "Velocidad", "Seis pilares."],
 ["Etiquetar recursos permite:", "Asignar y reportar costos por equipo o proyecto", "Aumentar el rendimiento", "Cifrar", "Escalar", "Base de FinOps."],
 ["Rightsizing es:", "Ajustar el tamaño de recursos a la carga real", "Comprar más", "Migrar región", "Cifrar discos", "Evita pagar capacidad ociosa."]
],
51: [
 ["Un cold start en Lambda es:", "La latencia extra al crear un entorno de ejecución nuevo", "Un error", "Un timeout", "Un límite", "Aparece tras inactividad o escalado."],
 ["API Gateway hace de:", "Puerta HTTP que enruta a Lambda u otros backends", "Base de datos", "Cola", "Balanceador L4", "Con auth, throttling y stages."],
 ["Serverless cobra principalmente por:", "Invocaciones y tiempo de ejecución", "Instancia por hora", "Almacenamiento", "Ancho de banda fijo", "Sin carga, casi sin costo."]
],
52: [
 ["IaC declarativo significa:", "Describes el estado deseado y la herramienta calcula cómo llegar", "Escribes cada paso", "Usas GUI", "Solo scripts bash", "Terraform compara deseado vs real."],
 ["Idempotencia en IaC:", "Aplicar varias veces da el mismo resultado", "Cada apply crea otro recurso", "Solo corre una vez", "Es más rápido", "Permite reintentar sin miedo."],
 ["`terraform plan` sirve para:", "Ver los cambios antes de aplicarlos", "Aplicar", "Destruir", "Formatear", "Revisión previa en PR."]
],
53: [
 ["Una `variable` vs un `output`:", "La variable es una entrada; el output expone un valor resultante", "Son iguales", "El output es entrada", "Variables son secretos", "Los outputs conectan módulos."],
 ["Un `provider` en Terraform:", "Es el plugin que habla con una API (AWS, GCP…)", "Un módulo", "Un archivo de estado", "Una variable", "Se declara y se inicializa con init."],
 ["`terraform destroy`:", "Elimina los recursos gestionados por la configuración", "Borra el código", "Borra el state remoto", "Solo apaga", "Úsalo con cuidado."]
],
54: [
 ["El state de Terraform:", "Mapea tu código con los recursos reales", "Es un log", "Es opcional", "Es el plan", "Sin él no sabe qué gestiona."],
 ["El locking del state evita:", "Dos applies simultáneos que lo corrompan", "Lecturas", "Cifrado", "Drift", "Con backend remoto compatible."],
 ["¿Se debe editar el state a mano?", "No: usar `terraform state` y comandos soportados", "Sí, siempre", "Solo en prod", "Sí, en JSON", "Un error corrompe la verdad de Terraform."]
],
55: [
 ["Un módulo es:", "Un conjunto reutilizable de configuración", "Un provider", "Un state", "Un workspace", "Entradas, recursos y salidas."],
 ["Los outputs de un módulo:", "Exponen valores al código que lo llama", "Cifran", "Son variables", "Se ignoran", "module.vpc.vpc_id."],
 ["Versionar módulos sirve para:", "Cambios controlados y reproducibles", "Cifrar", "Acelerar", "Evitar plan", "Pin de versión."]
],
56: [
 ["Los workspaces de Terraform:", "Mantienen varios states con el mismo código", "Crean ramas", "Son proveedores", "Son módulos", "Útiles pero con aislamiento limitado."],
 ["Directorios por entorno aportan:", "Mayor aislamiento y diferencias explícitas", "Menos código", "Más acoplamiento", "Nada", "Más duplicación, menos accidentes."],
 ["Los `.tfvars` por entorno:", "Parametrizan el mismo código con valores distintos", "Cifran", "Son módulos", "Son state", "dev.tfvars, prod.tfvars."]
],
57: [
 ["Un flujo seguro de Terraform en CI:", "plan en el PR y apply tras aprobación/merge", "apply en cada push", "apply manual local", "Sin plan", "Revisión humana del plan."],
 ["OIDC en CI permite:", "Credenciales temporales sin claves de larga vida", "Evitar IAM", "Cifrar el state", "Saltar el plan", "El proveedor confía en la identidad del workflow."],
 ["Aplicar el plan guardado asegura:", "Que se aplica exactamente lo revisado", "Más velocidad", "Cifrado", "Menos recursos", "Evita deriva entre plan y apply."]
],
58: [
 ["Checkov hace:", "Análisis estático de IaC contra políticas de seguridad", "Aplica cambios", "Corre pruebas de carga", "Crea imágenes", "Detecta buckets públicos, etc."],
 ["tflint detecta:", "Errores y malas prácticas en código Terraform", "Vulnerabilidades en imágenes", "Drift", "Costos", "Linter."],
 ["Policy as code significa:", "Reglas de cumplimiento automatizadas y versionadas", "Documentos PDF", "Revisión manual", "Firewalls", "Se aplican en CI."]
],
59: [
 ["`terraform import` sirve para:", "Traer un recurso existente al state", "Crear recursos", "Exportar", "Borrar", "Luego debes escribir su configuración."],
 ["`plan -refresh-only` permite:", "Ver el drift sin proponer cambios de configuración", "Aplicar", "Destruir", "Cambiar el state", "Compara real vs state."],
 ["Un bloque `moved` sirve para:", "Refactorizar sin destruir/recrear el recurso", "Mover archivos", "Cambiar de región", "Duplicar", "Actualiza la dirección en el state."]
],
60: [
 ["El inventario de Ansible:", "Lista los hosts y grupos a gestionar", "Contiene playbooks", "Cifra", "Es un rol", "Estático o dinámico."],
 ["`ansible all -m ping`:", "Comprueba conectividad y Python en los nodos (no ICMP)", "Hace ICMP", "Instala", "Reinicia", "Es el módulo ping de Ansible."],
 ["Agentless significa:", "Usa SSH y no requiere agente en los nodos", "No necesita red", "No necesita inventario", "No usa Python", "Menos que mantener."]
],
61: [
 ["Un playbook idempotente en la 2.ª ejecución muestra:", "changed=0", "failed", "changed=todos", "skipped=todos", "No hace cambios innecesarios."],
 ["Un handler se ejecuta:", "Al final y solo si una tarea notificó un cambio", "Siempre", "Al inicio", "Nunca", "Evita reinicios innecesarios."],
 ["`--check --diff` sirve para:", "Simular y mostrar qué cambiaría", "Aplicar rápido", "Cifrar", "Borrar", "Revisión antes de ejecutar."]
],
62: [
 ["En una plantilla Jinja2, `{{ var }}`:", "Inserta el valor de la variable", "Es un comentario", "Define un bloque", "Ejecuta un comando", "Rendereado al desplegar."],
 ["ansible-vault:", "Cifra variables o archivos sensibles", "Hace backups", "Crea usuarios", "Escanea", "Permite versionar secretos cifrados."],
 ["Variables `-e` (extra vars):", "Tienen la máxima precedencia", "La mínima", "No existen", "Solo para roles", "Sobrescriben todo."]
],
63: [
 ["Un rol de Ansible organiza:", "tasks, handlers, defaults, templates, etc., de forma reutilizable", "Solo inventario", "Un único archivo", "Una VM", "Estructura estándar."],
 ["`defaults` vs `vars` en un rol:", "defaults tiene baja precedencia y es fácil de sobrescribir", "vars es más débil", "Son iguales", "defaults es para secretos", "Para valores configurables."],
 ["Galaxy sirve para:", "Compartir y descargar roles y colecciones", "Ejecutar", "Cifrar", "Inventariar", "Repositorio comunitario."]
],
64: [
 ["Reparto típico Terraform + Ansible:", "Terraform aprovisiona, Ansible configura", "Ansible crea VPC, Terraform instala", "Son intercambiables", "Terraform solo configura", "Cada uno en lo que mejor hace."],
 ["¿Cómo conecta Ansible con VMs de Terraform?", "Inventario generado desde outputs o dinámico", "Manualmente por consola", "Con contraseñas en código", "No se puede", "Outputs → inventario."],
 ["En infraestructura inmutable (imágenes/contenedores), Ansible en vivo:", "Se usa menos: se reconstruye en vez de parchear", "Es obligatorio", "Es el único método", "No se puede", "Se prefiere reemplazar."]
],
65: [
 ["etcd en Kubernetes es:", "El almacén clave-valor con el estado del clúster", "El scheduler", "El runtime", "El balanceador", "Perder etcd es perder el clúster."],
 ["El scheduler:", "Asigna Pods a nodos según recursos y restricciones", "Ejecuta contenedores", "Guarda estado", "Expone servicios", "Decide dónde corre cada Pod."],
 ["El kubelet:", "Agente de cada nodo que asegura que los contenedores corran", "Es la API", "El DNS", "El CNI", "Reporta al API server."]
],
66: [
 ["Un Deployment gestiona:", "ReplicaSets, que a su vez gestionan Pods", "Nodos", "Volúmenes", "Ingress", "Rolling updates y rollback."],
 ["`kubectl rollout undo` hace:", "Vuelve a la revisión anterior", "Borra el Deployment", "Escala", "Reinicia nodos", "Usa el historial de ReplicaSets."],
 ["`replicas: 3` garantiza:", "Que se mantengan 3 Pods deseados", "3 nodos", "3 contenedores por Pod", "3 réplicas de etcd", "El controlador reconcilia."]
],
67: [
 ["Un Service ClusterIP:", "Es accesible solo dentro del clúster", "Es público", "Es un LB", "Es un Ingress", "Tipo por defecto."],
 ["Un Service encuentra sus Pods por:", "Selector de labels", "Nombre", "IP", "Namespace", "Si no coincide, no hay endpoints."],
 ["DNS interno de un Service:", "nombre.namespace.svc.cluster.local", "nombre.local", "ip.svc", "nombre.k8s", "Resuelto por CoreDNS."]
],
68: [
 ["Un Ingress define:", "Reglas L7 (host/path) hacia Services", "Redes", "Volúmenes", "Roles", "Entrada HTTP/S al clúster."],
 ["Para que un Ingress funcione necesitas:", "Un Ingress Controller", "Un Deployment", "Un PV", "Un HPA", "El objeto solo es declarativo."],
 ["TLS en Ingress se configura con:", "Un Secret con el certificado", "Una ConfigMap", "Un Pod", "Un Node", "tls: hosts/secretName."]
],
69: [
 ["ConfigMap vs Secret:", "ConfigMap para config no sensible; Secret para datos sensibles", "Son iguales", "Secret es público", "ConfigMap cifra", "Ambos son objetos de datos."],
 ["Un Secret en Kubernetes por defecto:", "Está codificado en base64, no cifrado", "Está cifrado fuerte", "Es inmutable", "Es privado en todo el clúster", "Habilita cifrado en reposo y RBAC."],
 ["Un ConfigMap montado como volumen:", "Se actualiza en el Pod tras un tiempo sin reiniciarlo", "Nunca cambia", "Reinicia el Pod", "Es de solo escritura", "Las variables de entorno no se actualizan."]
],
70: [
 ["Un PVC es:", "Una solicitud de almacenamiento de un Pod", "Un volumen físico", "Un nodo", "Un Service", "Se enlaza a un PV."],
 ["Un StatefulSet aporta:", "Identidad estable y almacenamiento propio por réplica", "Escalado automático", "Balanceo", "Ingress", "db-0, db-1…"],
 ["Una StorageClass permite:", "Aprovisionar volúmenes dinámicamente", "Cifrar", "Balancear", "Programar", "Define el tipo de almacenamiento."]
],
71: [
 ["El scheduler usa para decidir:", "Los requests de recursos", "Los limits", "Los logs", "Las etiquetas solo", "Requests reservan; limits topan."],
 ["Superar el limit de memoria produce:", "OOMKilled", "Throttling", "Pending", "Evicted siempre", "La CPU solo se estrangula."],
 ["Un Pod en Pending por «Insufficient cpu» indica:", "Ningún nodo tiene recursos libres suficientes para sus requests", "Imagen inexistente", "Fallo de red", "Falta un Service", "Mira `describe pod`."]
],
72: [
 ["La readiness probe controla:", "Si el Pod recibe tráfico del Service", "Si se reinicia", "El escalado", "La imagen", "Falla = sale de los endpoints."],
 ["El HPA escala según:", "Métricas como CPU o personalizadas", "El tiempo", "El número de nodos", "Los logs", "Requiere metrics-server."],
 ["startupProbe sirve para:", "Dar tiempo a apps de arranque lento antes de liveness", "Escalar", "Balancear", "Cifrar", "Evita reinicios prematuros."]
],
73: [
 ["Role vs ClusterRole:", "Role es de un namespace; ClusterRole es de todo el clúster", "Son iguales", "ClusterRole es de un pod", "Role es global", "Ambos con bindings."],
 ["Un RoleBinding:", "Asocia un rol con usuarios, grupos o ServiceAccounts", "Crea usuarios", "Cifra", "Define recursos", "Sin binding el rol no aplica."],
 ["`kubectl auth can-i`:", "Comprueba si una identidad puede realizar una acción", "Crea roles", "Lista Pods", "Autentica", "Con `--as` simulas otro usuario."]
],
74: [
 ["Una política default-deny:", "Bloquea todo el tráfico salvo lo permitido explícitamente", "Permite todo", "Cifra", "Es un firewall perimetral", "Zero trust interno."],
 ["Las NetworkPolicies requieren:", "Un CNI que las soporte", "Ingress", "Helm", "Ninguno", "Sin soporte, se ignoran."],
 ["`runAsNonRoot: true`:", "Impide que el contenedor corra como root", "Limita CPU", "Activa TLS", "Aísla red", "Parte de securityContext."]
],
75: [
 ["Un chart de Helm:", "Empaqueta los manifiestos y sus plantillas", "Es un clúster", "Un contenedor", "Un Service", "Instalable como release."],
 ["`values.yaml` sirve para:", "Parametrizar el chart", "Definir imágenes", "Crear secretos", "Escalar", "Valores por entorno con -f."],
 ["`helm rollback`:", "Vuelve a una revisión anterior de la release", "Borra el chart", "Actualiza", "Descarga", "Helm guarda el historial."]
],
76: [
 ["En GitOps, la fuente de verdad es:", "El repositorio Git", "El clúster", "La consola", "El pipeline", "El estado deseado vive en Git."],
 ["El modelo pull de Argo CD:", "Un agente dentro del clúster reconcilia con Git", "El CI empuja con kubectl", "Se hace a mano", "Usa SSH", "No expone credenciales del clúster al CI."],
 ["Un rollback en GitOps se hace:", "Revirtiendo el commit en Git", "Con kubectl edit", "Borrando Pods", "Reiniciando Argo", "El clúster converge a Git."]
],
77: [
 ["ImagePullBackOff suele deberse a:", "Imagen inexistente o credenciales de registro incorrectas", "Falta de CPU", "Probe fallida", "Selector erróneo", "Revisa nombre/tag y imagePullSecrets."],
 ["Dónde ver por qué un Pod no arranca:", "`kubectl describe pod` (Events)", "`kubectl top`", "`kubectl get node`", "`kubectl version`", "Allí aparecen scheduling y pull errors."],
 ["`kubectl debug` sirve para:", "Adjuntar un contenedor efímero de diagnóstico", "Reiniciar el clúster", "Escalar", "Crear namespaces", "Útil con imágenes distroless."]
],
78: [
 ["Para ganar velocidad en el CKA:", "Aliases, autocompletado y `--dry-run=client -o yaml`", "Memorizar YAML completos", "Usar solo GUI", "No usar docs", "Genera manifiestos rápido."],
 ["`kubectl explain pod.spec`:", "Muestra la documentación de un campo del API", "Crea un Pod", "Lista Pods", "Valida", "Disponible durante el examen."],
 ["Antes de cada tarea del examen conviene:", "Cambiar al contexto/clúster indicado", "Reiniciar", "Crear un namespace", "Borrar contextos", "Equivocarse de clúster pierde la tarea."]
],
79: [
 ["Los tres pilares de observabilidad:", "Métricas, logs y trazas", "CPU, RAM, disco", "Alertas, dashboards, tickets", "Eventos, tags, reglas", "Cada uno responde a preguntas distintas."],
 ["Observabilidad vs monitoreo:", "Observabilidad permite preguntar cosas nuevas a un sistema; monitoreo vigila lo conocido", "Son sinónimos", "Monitoreo es mejor", "Observabilidad es solo logs", "Habla de desconocidos desconocidos."],
 ["Un endpoint `/metrics` expone:", "Métricas en formato de texto para ser raspadas", "Logs", "Trazas", "Alertas", "Prometheus lo hace scrape."]
],
80: [
 ["Prometheus obtiene métricas mediante:", "Scrape (pull) de los endpoints", "Push de las apps", "Logs", "Agentes SNMP", "Con Pushgateway para jobs efímeros."],
 ["`rate(x[5m])` se aplica a:", "Counters, para obtener tasa por segundo", "Gauges", "Strings", "Logs", "Es el uso típico."],
 ["`histogram_quantile` sirve para:", "Calcular percentiles de latencia desde buckets", "Sumar", "Promediar", "Ordenar", "p99 = quantile 0.99."]
],
81: [
 ["El método RED mide:", "Rate, Errors, Duration", "Resource, Efficiency, Demand", "Read, Edit, Delete", "Requests, Events, Data", "Para servicios."],
 ["El método USE mide:", "Utilization, Saturation, Errors, para recursos", "Users, Sessions, Events", "Uptime, Speed, Errors", "Usage, Scale, Edge", "Para CPU, disco, red."],
 ["Una buena alerta es:", "Accionable y ligada a impacto en el usuario", "Cualquier umbral de CPU", "Muy sensible", "Automática sin dueño", "Evita la fatiga de alertas."]
],
82: [
 ["Un log estructurado:", "Está en un formato como JSON con campos consultables", "Es texto libre", "Es binario", "Es comprimido", "Facilita filtros y agregaciones."],
 ["Loki indexa:", "Solo las etiquetas, no el contenido completo", "Todo el texto", "Nada", "Solo timestamps", "Por eso es barato."],
 ["Un correlation/trace id sirve para:", "Seguir una petición a través de varios servicios y logs", "Cifrar", "Ordenar", "Autenticar", "Une logs con trazas."]
],
83: [
 ["Una traza está formada por:", "Spans que representan operaciones de una petición", "Logs", "Métricas", "Alertas", "Cada span tiene duración y relaciones."],
 ["La propagación de contexto:", "Pasa el trace id entre servicios para unir spans", "Cifra", "Balancea", "Muestrea", "Cabeceras tipo traceparent."],
 ["El muestreo (sampling):", "Reduce el volumen guardando solo una parte de las trazas", "Aumenta datos", "Cifra", "Elimina logs", "Compromiso costo/visibilidad."]
],
84: [
 ["SLI, SLO y SLA:", "SLI es lo que mides, SLO el objetivo y SLA el compromiso contractual", "Son lo mismo", "SLA es una métrica", "SLO es un contrato", "Con consecuencias solo en el SLA."],
 ["Error budget es:", "La cantidad de fallo permitida según el SLO", "Un presupuesto de dinero", "Los bugs abiertos", "Un límite de CPU", "Si se agota, se prioriza fiabilidad."],
 ["Un postmortem sin culpables:", "Se centra en causas sistémicas y aprendizaje", "Busca al responsable", "Se oculta", "No se documenta", "Culpar frena el reporte."]
],
85: [
 ["SAST vs DAST:", "SAST analiza el código estático; DAST prueba la app en ejecución", "Son iguales", "DAST analiza código", "SAST es en producción", "Se complementan."],
 ["SCA analiza:", "Las dependencias de terceros en busca de vulnerabilidades y licencias", "El código propio", "La red", "Las imágenes solo", "Ej. Dependabot, Trivy."],
 ["Shift-left en seguridad:", "Detectar problemas lo antes posible en el ciclo", "Mover servidores", "Auditar al final", "Cifrar más", "Más barato corregir pronto."]
],
86: [
 ["Un SBOM es:", "Un inventario de componentes de un artefacto", "Un firewall", "Un certificado", "Un test", "Permite saber si una CVE te afecta."],
 ["cosign sirve para:", "Firmar y verificar artefactos/imágenes", "Escanear CVEs", "Construir", "Orquestar", "Verificación de procedencia."],
 ["SLSA es:", "Un marco de niveles para la integridad de la cadena de suministro", "Un escáner", "Un registry", "Un lenguaje", "Define requisitos de build."]
],
87: [
 ["Un criterio de éxito de proyecto debe ser:", "Medible y verificable", "Vago", "Subjetivo", "Solo estético", "Permite saber cuándo terminaste."],
 ["Un ADR (registro de decisión de arquitectura) documenta:", "Qué se decidió, por qué y qué alternativas se descartaron", "El código", "Los bugs", "Los despliegues", "Útil para el futuro tú."],
 ["Un alcance mínimo viable:", "Entrega de punta a punta lo esencial antes de ampliar", "Hace todo", "Solo diseña", "Evita pruebas", "Reduce riesgo."]
],
88: [
 ["Un pipeline reproducible requiere:", "Versiones fijadas y configuración en código", "Pasos manuales", "Máquinas propias", "Credenciales compartidas", "Sin sorpresas entre ejecuciones."],
 ["Entornos separados (dev/stage/prod) permiten:", "Probar cambios sin afectar producción", "Ahorrar costos", "Evitar CI", "Compartir state", "Con la misma definición de IaC."],
 ["Un buen plan de rollback:", "Está definido y probado antes de desplegar", "Se improvisa", "Es opcional", "Es borrar todo", "Reduce el MTTR."]
],
89: [
 ["Un dashboard útil responde:", "Si el servicio está sano y dónde mirar si no", "Todo sobre el sistema", "Solo CPU", "Solo logs", "Pocas métricas bien elegidas."],
 ["Un SLO en el proyecto sirve para:", "Definir qué es «suficientemente bueno» y cuándo alertar", "Reemplazar tests", "Escalar", "Cifrar", "Alertas por burn rate."],
 ["Políticas de admisión en el clúster:", "Rechazan recursos que incumplen reglas antes de crearse", "Cifran", "Escalan", "Monitorean", "Ej. Kyverno, OPA."]
],
90: [
 ["Un buen README de portafolio incluye:", "Problema, arquitectura, decisiones y cómo ejecutarlo", "Solo capturas", "Solo código", "Nada", "Quien lo lee decide en 2 minutos."],
 ["Un demo corto de proyecto debe:", "Mostrar el flujo de punta a punta funcionando", "Leer el código", "Hablar de teoría", "Durar una hora", "5 minutos bastan."],
 ["Incluir un postmortem en el portafolio demuestra:", "Madurez operativa: aprendes de los fallos", "Que fallaste", "Nada", "Falta de rigor", "Es lo que valoran los equipos de plataforma."]
]
};
