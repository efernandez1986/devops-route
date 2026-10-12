// DevOps Route — SPA sin build. Progreso en localStorage (por navegador).
const KEY = "estiba.v1";
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ico = n => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"/></svg>`;

let S = { steps: {}, quiz: {}, dq: {}, exam: null };
try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

// Guías de práctica por día (script text/plain en index.html): "## n", "- paso", "> listo cuando"
const GUIDE = {};
(() => {
  const t = document.getElementById("guias"); if (!t) return;
  let cur;
  t.textContent.split("\n").forEach(l => {
    const m = l.match(/^## (\d+)/);
    if (m) cur = GUIDE[m[1]] = { p: [], l: "" };
    else if (cur && l.startsWith("- ")) cur.p.push(l.slice(2));
    else if (cur && l.startsWith("> ")) cur.l = l.slice(2);
  });
})();
const stepLine = line => {
  const i = line.indexOf("$ ");
  if (i < 0) return esc(line);
  const pre = line.slice(0, i), parts = line.slice(i + 2).split(/\s{3,}/), cmd = parts.shift();
  return (pre ? esc(pre) : "") + `<code class="cmd" tabindex="0" role="button" title="Clic para copiar" data-copy="${esc(cmd)}">${esc(cmd)}</code>` + (parts.length ? ` <span class="muted">${esc(parts.join(" "))}</span>` : "");
};
const guideHTML = (x, i) => {
  const g = GUIDE[x.n] || { p: [], l: "" };
  if (i === 0) return `<div class="guide"><p>Mira el video de abajo (${(VIDEO_META[x.vid] || [0, 0, "?"])[2]} min) y domina estas ideas; luego explícalas en voz alta sin mirar:</p><ul>${x.study.split(/,\s+/).map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>`;
  if (i === 1) return g.p.length ? `<div class="guide"><p>Hazlo en este orden (clic en un comando para copiarlo):</p><ol class="cmds">${g.p.map(p => `<li>${stepLine(p)}</li>`).join("")}</ol></div>` : "";
  return g.l ? `<div class="guide"><p><b>Listo cuando:</b> ${esc(g.l)}</p></div>` : "";
};
const dayToggle = n => `<button type="button" class="tick tg${isDone(n) ? " on" : ""}" data-day="${n}" aria-pressed="${isDone(n)}" aria-label="Día ${n}: ${isDone(n) ? "completado, tocar para desmarcar" : "pendiente, tocar para marcar como completado"}" title="${isDone(n) ? "Completado (tocar para desmarcar)" : "Pendiente (tocar para marcar completo)"}">${ico("check")}</button>`;
const onColor = hex => { const n = parseInt(hex.slice(1), 16), l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)); return l > 150 ? "#16202a" : "#fff"; };
const modStyle = m => `--c:${m.color};--on:${onColor(m.color)}`;
const stepsOf = n => S.steps[n] || [false, false, false];
const dqBadge = n => S.dq && S.dq[n] ? ` <span class="dqb num">· prueba ${S.dq[n].score}/${S.dq[n].total}</span>` : "";
const isDone = n => stepsOf(n).every(Boolean);
const modDone = m => m.days.filter(x => isDone(x.n)).length;
const totalDone = () => DAYS.filter(x => isDone(x.n)).length;
const today = () => DAYS.find(x => !isDone(x.n)) || DAYS[DAYS.length - 1];
const mod = id => MODULES.find(m => m.id === id);

const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const normQ = (r, m) => ({ q: r[0], opts: shuffle([{ t: r[1], ok: true }, { t: r[2] }, { t: r[3] }, { t: r[4] }]), why: r[5], m: m.id });

/* ---------- vistas ---------- */
const bayHTML = () => `<div class="bays">${MODULES.map(m => `
  <section class="bay" style="${modStyle(m)}">
    <h3><span class="chip">${m.code}</span><a href="#/modulo/${m.id}">${esc(m.name)}</a><span class="num">${modDone(m)}/${m.days.length}</span></h3>
    <div class="slots">${m.days.map(x => `<a class="slot num${isDone(x.n) ? " is-done" : ""}${x.n === today().n ? " is-today" : ""}" href="#/dia/${x.n}" title="Día ${x.n}: ${esc(x.t)}" aria-label="Día ${x.n}: ${esc(x.t)}${isDone(x.n) ? ", completado" : ""}">${x.n}</a>`).join("")}</div>
  </section>`).join("")}</div>
  <div class="legend"><span><i></i>Pendiente</span><span><i class="f"></i>Completado</span><span>Marcador ▾ = hoy</span></div>`;

function courseCard(m) {
  const q = S.quiz[m.id], p = Math.round(100 * modDone(m) / m.days.length), a = m.days[0].n, b = m.days[m.days.length - 1].n;
  return `<a class="course" href="#/modulo/${m.id}" style="${modStyle(m)}">
    <div class="top door" style="border-radius:0"><b>${m.code}</b><span class="num">DÍAS ${a}–${b}</span></div>
    <div class="body"><h3>${esc(m.name)}</h3><p>${esc(m.tagline)}</p>
      <div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso ${esc(m.name)}"><i style="width:${p}%"></i></div>
      <div class="meta num"><span>${modDone(m)}/${m.days.length} días</span><span>${m.videos.length} video${m.videos.length > 1 ? "s" : ""}</span><span>Quiz ${q ? q.score + "/" + q.total : "—"}</span></div>
    </div></a>`;
}

function vDash() {
  const t = today(), m = MODULES[t.mod], done = totalDone(), all = done === TOTAL_DAYS;
  return `<section class="door continue" style="${modStyle(m)}">
    <span class="mark num" aria-hidden="true">${m.code} U ${String(t.n).padStart(4, "0")} 0</span>
    <small>${all ? "Ruta completada" : done ? "Continúa donde lo dejaste" : "Empieza aquí"} · ${esc(m.name)}</small>
    <h1>${all ? "Ruta completada" : `Día ${t.n}: ${esc(t.t)}`}</h1>
    <p>${all ? "Haz el examen integrador y publica tu proyecto final." : esc(t.study) + "."}</p>
    <div class="bar" role="progressbar" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${TOTAL_DAYS}" aria-label="Progreso total"><i style="width:${100 * done / TOTAL_DAYS}%"></i></div>
    <small class="num">${done} de ${TOTAL_DAYS} días completados</small>
    <div class="row"><a class="btn light" href="#/${all ? "evaluacion" : "dia/" + t.n}">${all ? "Ir al examen" : done ? "Continuar día " + t.n : "Empezar día 1"}</a><a class="btn line" href="#/metodo">Cómo funciona la ruta</a></div>
  </section>
  <h2>Tu ruta, día a día</h2>
  <p class="muted">Cada contenedor es un día. Complétalo para cargarlo en el barco. Los módulos van en orden de dependencia: lo que viene después usa lo anterior.</p>
  ${bayHTML()}
  <h2>Módulos</h2>
  <div class="catalog">${MODULES.map(courseCard).join("")}</div>`;
}

function vMethod() {
  return `<div class="page-h"><h1>Ingeniería inversa del maestro</h1>
    <p>Qué hizo alguien con 20 años de DevOps para llegar ahí, y cómo comprimirlo en 90 días de práctica enfocada.</p></div>
  <h2>Los seis movimientos</h2>
  <dl class="dl">${METHOD.reverse.map(r => `<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join("")}</dl>
  <h2>Un día típico (≈ 3 horas)</h2>
  <ul class="sched">${METHOD.schedule.map(s => `<li><b>${s[0]}</b><span>${esc(s[1])}</span></li>`).join("")}</ul>
  <h2>Después del día 90</h2>
  <ul>${METHOD.after.map(a => `<li>${esc(a)}</li>`).join("")}</ul>
  <h2>La verdad incómoda</h2>
  <p class="note">${esc(METHOD.honest)}</p>
  <h2>Cómo usar la plataforma</h2>
  <ul><li>Cada día tiene tres pasos: <b>Entender</b>, <b>Practicar</b> y <b>Evidencia</b>. Márcalos al completarlos.</li>
  <li>Cada módulo tiene una explicación profunda (analogía, mundo real, contraejemplo, perspectivas) y un cuestionario.</li>
  <li>Tu progreso se guarda en este navegador. Expórtalo en <a href="#/descargas">Descargas</a> para no perderlo.</li></ul>`;
}

const ytLink = id => `<a class="yt" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${id}">Abrir en YouTube ${ico("ext")}</a>`;
const vmeta = id => { const m = VIDEO_META[id] || ["Video", "YouTube", 0]; return `<p class="vmeta"><b>${esc(m[0])}</b><span class="muted"> · ${esc(m[1])} · <span class="num">${m[2]} min</span></span> ${ytLink(id)}</p>`; };
const OFFLINE = location.protocol === "file:";
// El servidor local se apaga solo cuando deja de recibir ping (al cerrar la pestaña).
if (location.hostname === "localhost") setInterval(() => fetch("/ping").catch(() => {}), 30000);
// Si el servidor local ya corre, pasa a él: YouTube solo se deja incrustar desde http(s).
if (OFFLINE) fetch("http://localhost:8137/favicon.svg", { mode: "no-cors" }).then(() => location.replace("http://localhost:8137/" + location.hash)).catch(() => {});
const vidHTML = (id, label) => OFFLINE
  ? `<a class="vid" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${id}" style="background-image:url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)" aria-label="Ver en YouTube: ${esc(label)}"><span class="pb"><span>${ico("play")}</span></span></a>`
  : vidHTML2(id, label);
const vidHTML2 = (id, label) => `<button class="vid" type="button" data-vid="${id}" style="background-image:url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)" aria-label="Reproducir: ${esc(label)}"><span class="pb"><span>${ico("play")}</span></span></button>`;
const resHTML = list => `<ul class="res">${list.map(r => `<li><span class="t">${r[2]}</span><div><a href="${r[1]}" target="_blank" rel="noopener">${esc(r[0])}</a> ${ico("ext")}<p>${esc(r[3])}</p></div></li>`).join("")}</ul>`;

function vModule(id) {
  const m = mod(id); if (!m) return vNotFound();
  const c = m.concept, p = Math.round(100 * modDone(m) / m.days.length), q = S.quiz[m.id];
  return `<header class="door banner" style="${modStyle(m)}">
    <span class="mark num" aria-hidden="true">${m.code} U ${String(m.days[0].n).padStart(4, "0")} 0</span>
    <div class="crumbs"><a href="#/">Plan</a> / ${esc(m.code)}</div>
    <h1>${esc(m.name)}</h1><p>${esc(m.tagline)}</p>
    <div class="stats num"><span>${m.days.length} días (${m.days[0].n}–${m.days[m.days.length - 1].n})</span><span>${m.videos.length} videos</span><span>${m.resources.length} recursos</span><span>${m.quiz.length} preguntas</span></div>
    <div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso"><i style="width:${p}%"></i></div>
  </header>
  <nav class="tabs" aria-label="Secciones"><a href="#" data-go="entender">Entender</a><a href="#" data-go="dias">Días</a><a href="#" data-go="videos">Videos</a><a href="#" data-go="recursos">Recursos</a><a href="#" data-go="evalua">Evalúate</a></nav>
  <h2 id="entender">Entender</h2>
  <dl class="dl">
    <div><dt>Analogía</dt><dd>${esc(c.analogy)}</dd></div>
    <div><dt>En el mundo real</dt><dd>${esc(c.real)}</dd></div>
    <div><dt>Contraejemplo</dt><dd>${esc(c.counter)}</dd></div>
  </dl>
  <ul class="views">${c.views.map(v => `<li><b>${esc(v[0])}</b><span>${esc(v[1])}</span></li>`).join("")}</ul>
  <h2 id="dias">Días</h2>
  <ol class="days" style="list-style:none">${m.days.map(x => `<li><a href="#/dia/${x.n}"><span class="n num">${String(x.n).padStart(2, "0")}</span><span>${esc(x.t)}${dqBadge(x.n)}<br><span class="muted">${esc(x.lab)}</span></span></a>${dayToggle(x.n)}</li>`).join("")}</ol>
  <h2 id="videos">Videos</h2>
  <div class="vids">${m.videos.map((v, i) => `<div>${vidHTML(v, `${m.name} ${i + 1}`)}${vmeta(v)}</div>`).join("")}</div>
  <p class="muted">Introducciones cortas al módulo. Cada día trae además su propio video, específico del tema, dentro de la lección.</p>
  <h2 id="recursos">Recursos y manuales</h2>
  ${resHTML(m.resources)}
  <p><button class="btn ghost" data-dl="cheat:${m.id}">${ico("down")}Descargar hoja de referencia (.md)</button></p>
  <h2 id="evalua">Evalúate${q ? ` <span class="muted num">· último: ${q.score}/${q.total}</span>` : ""}</h2>
  <div id="quiz"></div>`;
}

function vDay(n) {
  const x = DAYS[n - 1]; if (!x) return vNotFound();
  const m = MODULES[x.mod], prev = DAYS[n - 2], next = DAYS[n], st = stepsOf(n);
  const steps = [["Entender", x.study], ["Practicar", x.lab], ["Evidencia", x.proof]];
  return `<header class="door banner" style="${modStyle(m)}">
    <span class="mark num" aria-hidden="true">${m.code} U ${String(n).padStart(4, "0")} 0</span>
    <div class="crumbs"><a href="#/">Plan</a> / <a href="#/modulo/${m.id}">${esc(m.name)}</a> / Día ${n}</div>
    <h1>${esc(x.t)}</h1>
    <div class="stats num"><span>Día ${n} de ${TOTAL_DAYS}</span><span>≈ 3 h</span><span>${st.filter(Boolean).length}/3 pasos</span></div>
  </header>
  <div class="lesson">
    <div>
      <div class="vids" style="grid-template-columns:1fr">${vidHTML(x.vid, x.t)}</div>
      ${vmeta(x.vid)}
      <p class="muted">¿No carga? Abre el sitio con <code>Abrir DevOps Route.vbs</code> o usa «Abrir en YouTube».</p>
      <h2>Qué hacer hoy</h2>
      <ul class="steps">${steps.map((s, i) => `<li><label class="step"><input type="checkbox" data-step="${i}" ${st[i] ? "checked" : ""}><span><b>${s[0]}</b><p>${esc(s[1])}</p></span></label>${guideHTML(x, i)}</li>`).join("")}</ul>
      <div class="row" style="margin-top:1rem"><button class="btn ghost" data-all="${isDone(n) ? 0 : 1}">${isDone(n) ? "Desmarcar día" : "Marcar todo como hecho"}</button></div>
      <h2 id="prueba">Prueba del día${S.dq && S.dq[n] ? ` <span class="muted num">· último: ${S.dq[n].score}/${S.dq[n].total}</span>` : ""}</h2>
      <p class="muted">3 preguntas para consolidar lo de hoy. Respóndelas sin mirar los apuntes.</p>
      <div id="dayquiz"></div>
      <h2>Recursos del módulo</h2>
      ${resHTML(m.resources.slice(0, 3))}
      <div class="pager">${prev ? `<a class="btn ghost" href="#/dia/${prev.n}">← Día ${prev.n}</a>` : "<span></span>"}${next ? `<a class="btn" href="#/dia/${next.n}">Día ${next.n} →</a>` : `<a class="btn" href="#/evaluacion">Ir al examen integrador</a>`}</div>
    </div>
    <aside class="syll" aria-label="Temario del módulo"><h2>${esc(m.name)}</h2><p class="syll-note muted">Toca el círculo para marcar o desmarcar un día completo.</p>
      <ol>${m.days.map(y => `<li><a href="#/dia/${y.n}"${y.n === n ? ' aria-current="page"' : ""}><span class="n num">${y.n}</span><span>${esc(y.t)}${dqBadge(y.n)}</span></a>${dayToggle(y.n)}</li>`).join("")}</ol>
    </aside>
  </div>`;
}

function vResources() {
  return `<div class="page-h"><h1>Biblioteca de recursos</h1><p>Todo gratuito. Filtra por módulo, tipo o texto.</p></div>
  <div class="filters"><input type="search" id="rq" placeholder="Buscar…" aria-label="Buscar"><select id="rm" aria-label="Módulo"><option value="">Todos los módulos</option>${MODULES.map(m => `<option value="${m.id}">${esc(m.name)}</option>`).join("")}</select>
  <select id="rt" aria-label="Tipo"><option value="">Todos los tipos</option>${["curso", "libro", "lab", "doc"].map(t => `<option>${t}</option>`).join("")}</select></div>
  <div id="rl"></div>`;
}
function fillResources() {
  const q = $("#rq").value.toLowerCase(), mid = $("#rm").value, t = $("#rt").value;
  const items = MODULES.filter(m => !mid || m.id === mid).flatMap(m => m.resources.map(r => [...r, m]))
    .filter(r => (!t || r[2] === t) && (!q || (r[0] + r[3]).toLowerCase().includes(q)));
  $("#rl").innerHTML = items.length ? `<ul class="res">${items.map(r => `<li><span class="t">${r[2]}</span><div><a href="${r[1]}" target="_blank" rel="noopener">${esc(r[0])}</a> ${ico("ext")} <span class="chip" style="${modStyle(r[4])}">${r[4].code}</span><p>${esc(r[3])}</p></div></li>`).join("")}</ul>` : `<p class="empty">Sin resultados.</p>`;
}

function vExam() {
  const rows = MODULES.map(m => { const q = S.quiz[m.id]; return `<li style="${modStyle(m)}"><span class="chip">${m.code}</span><a href="#/modulo/${m.id}">${esc(m.name)}</a><div class="bar"><i style="width:${q ? 100 * q.score / q.total : 0}%"></i></div><span class="score">${q ? `${q.score}/${q.total}` : "—"}</span></li>`; }).join("");
  return `<div class="page-h"><h1>Evaluación</h1><p>Mide tu avance. Los cuestionarios por módulo están dentro de cada módulo; aquí tienes el examen integrador, que mezcla preguntas de todos.</p></div>
  <h2>Por módulo</h2><ul class="scores">${rows}</ul>
  <h2>Examen integrador${S.exam ? ` <span class="muted num">· mejor: ${S.exam.score}/${S.exam.total}</span>` : ""}</h2>
  <p>24 preguntas aleatorias, 2 por módulo. Responde sin ayuda; el resultado te mostrará dónde reforzar.</p>
  <div id="quiz"><button class="btn" id="start-exam">Empezar examen</button></div>`;
}

function vDownloads() {
  return `<div class="page-h"><h1>Descargas</h1><p>Hojas de referencia por módulo, el plan completo y tu progreso.</p></div>
  <h2>Hojas de referencia</h2>
  <ul class="res">${MODULES.map(m => `<li style="${modStyle(m)}"><span class="t">${m.code}</span><div><b>${esc(m.name)}</b><p><button class="btn ghost" data-dl="cheat:${m.id}">${ico("down")}Descargar .md</button></p></div></li>`).join("")}</ul>
  <h2>Plan completo</h2>
  <div class="row"><button class="btn" data-dl="plan">${ico("down")}Plan de 90 días (.md)</button><button class="btn ghost" id="print">Imprimir plan</button></div>
  <h2>Tu progreso</h2>
  <p class="muted">Se guarda solo en este navegador. Expórtalo para respaldarlo o moverlo a otro equipo.</p>
  <div class="row"><button class="btn ghost" data-dl="progress">${ico("down")}Exportar progreso (.json)</button><label class="btn ghost" style="cursor:pointer">Importar<input id="imp" type="file" accept="application/json" hidden></label><button class="btn ghost" id="reset">Reiniciar todo</button></div>`;
}

const vNotFound = () => `<div class="page-h"><h1>No encontrado</h1><p><a href="#/">Volver al plan</a></p></div>`;

/* ---------- cuestionario ---------- */
function runQuiz(box, qs, onDone, again) {
  box.innerHTML = `<form>${qs.map((q, i) => `<fieldset class="q" style="border:0;margin:0;padding:1.1rem 0"><legend>${i + 1}. ${esc(q.q)}</legend>${q.opts.map((o, j) => `<label class="opt"><input type="radio" name="q${i}" value="${j}" required><span>${esc(o.t)}</span></label>`).join("")}<div class="why" hidden></div></fieldset>`).join("")}
    <div class="row"><button class="btn" type="submit">Comprobar respuestas</button></div></form>`;
  const f = $("form", box);
  f.addEventListener("submit", e => {
    e.preventDefault();
    let score = 0; const weak = {};
    qs.forEach((q, i) => {
      const fs = f.children[i], pick = +new FormData(f).get("q" + i);
      fs.querySelectorAll(".opt").forEach((l, j) => { l.classList.toggle("ok", !!q.opts[j].ok); if (j === pick && !q.opts[j].ok) l.classList.add("no"); });
      fs.querySelectorAll("input").forEach(x => x.disabled = true);
      const why = $(".why", fs); why.hidden = false; why.textContent = (q.opts[pick].ok ? "Correcto. " : "Incorrecto. ") + q.why;
      if (q.opts[pick].ok) score++; else weak[q.m] = (weak[q.m] || 0) + 1;
    });
    $("button[type=submit]", f).remove();
    const total = qs.length, ws = Object.keys(weak);
    const res = document.createElement("div"); res.setAttribute("aria-live", "polite");
    res.innerHTML = `<p class="result num">Resultado: ${score} / ${total}</p>` + (ws.length ? `<p>A reforzar:</p><ul class="weak">${ws.map(id => `<li><a href="#/modulo/${id}">${esc(mod(id).name)}</a> <span class="muted">(${weak[id]} fallo${weak[id] > 1 ? "s" : ""})</span></li>`).join("")}</ul>` : `<p>Sin fallos. Pasa al siguiente módulo.</p>`);
    if (score < total && again) {
      res.insertAdjacentHTML("beforeend", `<p class="muted">Fallar no resta nada: tu progreso no depende de la nota. Lee las explicaciones y vuelve a intentarlo.</p><div class="row"><button class="btn" type="button">Intentar de nuevo</button></div>`);
      $("button", res).onclick = () => { runQuiz(box, again(), onDone, again); box.scrollIntoView({ block: "start" }); };
    }
    f.appendChild(res); res.scrollIntoView({ block: "nearest" });
    onDone(score, total);
  });
}

/* ---------- descargas ---------- */
function download(name, text, type = "text/markdown") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: type + ";charset=utf-8" }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
const planMD = () => "# Plan DevOps de 90 días\n\n" + MODULES.map(m => `## ${m.name} (días ${m.days[0].n}–${m.days[m.days.length - 1].n})\n\n` + m.days.map(x => `### Día ${x.n}: ${x.t}\n- Entender: ${x.study}\n- Practicar: ${x.lab}\n- Evidencia: ${x.proof}\n`).join("\n")).join("\n");

/* ---------- router ---------- */
const NAV = [["#/", "Plan", "plan"], ["#/metodo", "Método", "metodo"], ["#/evaluacion", "Evaluación", "evaluacion"], ["#/recursos", "Recursos", "recursos"], ["#/descargas", "Descargas", "descargas"]];
function paint() {
  const [r, a] = (location.hash.replace(/^#\/?/, "") || "").split("/");
  const view = $("#view"), key = r || "plan";
  const html = { "": vDash, plan: vDash, metodo: vMethod, modulo: () => vModule(a), dia: () => vDay(+a), evaluacion: vExam, recursos: vResources, descargas: vDownloads }[r];
  view.innerHTML = (OFFLINE ? `<div class="note warn" role="alert"><b>Los videos no se pueden incrustar así.</b> Abriste el sitio como archivo (<code>file://</code>) y YouTube lo bloquea. Haz doble clic en <code>Abrir DevOps Route.vbs</code> (no necesita instalar nada) para verlos aquí dentro; mientras tanto, cada video abre en YouTube.</div>` : "") + (html || vNotFound)();
  const cur = key === "modulo" || key === "dia" ? "plan" : key;
  $("#nav").innerHTML = NAV.map(n => `<a href="${n[0]}"${n[2] === cur ? ' aria-current="page"' : ""}><svg class="ico" aria-hidden="true"><use href="#n-${n[2]}"/></svg>${n[1]}</a>`).join("");
  const done = totalDone(), pct = Math.round(100 * done / TOTAL_DAYS);
  $("#meter").style.width = pct + "%"; $("#meter-bar").setAttribute("aria-valuenow", pct); $("#meter-txt").textContent = `${done} de ${TOTAL_DAYS} días · ${pct}%`;
  if (r === "modulo" && mod(a)) {
    const m = mod(a);
    runQuiz($("#quiz"), shuffle(m.quiz).map(q => normQ(q, m)), (score, total) => { S.quiz[m.id] = { score, total, at: Date.now() }; save(); }, () => shuffle(m.quiz).map(q => normQ(q, m)));
  }
  if (r === "dia" && DAY_QUIZ[+a]) {
    const n = +a, box = $("#dayquiz");
    if (keptQuiz && keptQuiz.dataset.day === String(n)) box.replaceWith(keptQuiz);
    else {
      box.dataset.day = String(n);
      const mk = () => shuffle(DAY_QUIZ[n]).map(q => normQ(q, MODULES[DAYS[n - 1].mod]));
      runQuiz(box, mk(), (score, total) => { S.dq[n] = { score, total }; save(); const hd = $("#prueba"); if (hd) hd.innerHTML = `Prueba del día <span class="muted num">· último: ${score}/${total}</span>`; }, mk);
    }
    keptQuiz = null;
  }
  if (r === "recursos") { ["#rq", "#rm", "#rt"].forEach(s => $(s).addEventListener("input", fillResources)); fillResources(); }
  if (r === "descargas") {
    $("#print").onclick = () => { $("#view").insertAdjacentHTML("beforeend", `<div id="pp">${MODULES.map(m => `<h2>${esc(m.name)}</h2><ol start="${m.days[0].n}">${m.days.map(x => `<li><b>${esc(x.t)}</b> — ${esc(x.lab)}</li>`).join("")}</ol>`).join("")}</div>`); window.print(); $("#pp").remove(); };
    $("#reset").onclick = () => { if (confirm("¿Borrar todo tu progreso?")) { S = { steps: {}, quiz: {}, dq: {}, exam: null }; save(); paint(); } };
    $("#imp").onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { const o = JSON.parse(t); if (typeof o !== "object" || !o.steps) throw 0; S = Object.assign({ steps: {}, quiz: {}, dq: {}, exam: null }, o); save(); paint(); } catch (x) { alert("Archivo inválido."); } }); };
  }
  if (r === "evaluacion") $("#start-exam").onclick = () => {
    const qs = shuffle(MODULES.flatMap(m => shuffle(m.quiz).slice(0, 2).map(q => normQ(q, m))));
    runQuiz($("#quiz"), qs, (score, total) => { if (!S.exam || score > S.exam.score) S.exam = { score, total }; save(); });
  };
}

document.addEventListener("click", e => {
  const t = e.target.closest("[data-vid],[data-dl],[data-go]"); if (!t) return;
  if (t.dataset.vid) { const b = t; b.outerHTML = `<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.vid}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`; }
  else if (t.dataset.go) { e.preventDefault(); const el = document.getElementById(t.dataset.go); el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth", block: "start" }); }
  else {
    const [k, id] = t.dataset.dl.split(":");
    if (k === "cheat") download(`${id}-hoja-referencia.md`, mod(id).cheat);
    else if (k === "plan") download("plan-devops-90-dias.md", planMD());
    else download("devops-route-progreso.json", JSON.stringify(S, null, 2), "application/json");
  }
});
document.addEventListener("change", e => {
  const c = e.target.closest("[data-step]"); if (!c) return;
  const n = +location.hash.split("/")[2], st = stepsOf(n).slice(); st[+c.dataset.step] = c.checked; S.steps[n] = st; save(); keepScroll();
});
document.addEventListener("click", e => {
  const b = e.target.closest("[data-all]"); if (!b) return;
  S.steps[+location.hash.split("/")[2]] = [!!+b.dataset.all, !!+b.dataset.all, !!+b.dataset.all]; save(); keepScroll();
});
let keptQuiz = null;
function keepScroll() { const y = scrollY; keptQuiz = $("#dayquiz"); if (keptQuiz) keptQuiz.remove(); paint(); scrollTo(0, y); }

$("#theme").onclick = () => {
  const dark = matchMedia("(prefers-color-scheme:dark)").matches, cur = document.documentElement.dataset.theme || (dark ? "dark" : "light");
  const nxt = cur === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = nxt;
  try { localStorage.setItem("estiba.theme", nxt); } catch (e) {}
};
let last = "";
addEventListener("hashchange", () => { paint(); if (location.hash !== last) { scrollTo(0, 0); $("#view").focus({ preventScroll: true }); } last = location.hash; });
paint();

document.addEventListener("click", e => {
  const b = e.target.closest("[data-day]");
  if (b) {
    const n = +b.dataset.day, v = !isDone(n);
    S.steps[n] = [v, v, v]; save();
    if (location.hash.startsWith("#/dia/")) keepScroll(); else { const y = scrollY; paint(); scrollTo(0, y); }
    return;
  }
  const c = e.target.closest("[data-copy]");
  if (c && navigator.clipboard) navigator.clipboard.writeText(c.dataset.copy).then(() => { const o = c.title; c.title = "¡Copiado!"; c.classList.add("copied"); setTimeout(() => { c.title = o; c.classList.remove("copied"); }, 1200); }).catch(() => {});
});
document.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[data-copy]")) { e.preventDefault(); e.target.click(); } });
