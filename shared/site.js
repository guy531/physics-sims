/* Renders the home page and the course catalog pages from CATALOG (shared/catalog.js).
   <body data-page="home" data-root="">  or  <body data-page="course" data-course="<slug>" data-root="../../"> */
"use strict";
(function(){
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const body = document.body, root = body.dataset.root || '';
  const TXT = {
    he: {home:'סימולציות בפיסיקה', homeIntro:'סימולציות אינטראקטיביות לקורסי פיסיקה: מזיזים פרמטרים, צופים בגרפים ובאנימציות, ומשווים בין פתרון מדויק לקירובים.',
         allCourses:'→ כל הקורסים', sims:n => n === 1 ? 'סימולציה אחת' : n + ' סימולציות', soon:'בקרוב', empty:'הסימולציות לקורס הזה יתווספו בקרוב.',
         open:'נפתח בלשונית חדשה', dark:'תצוגה כהה', courseNo:'קורס'},
    en: {allCourses:'← All courses', sims:n => n === 1 ? '1 simulation' : n + ' simulations', soon:'Coming soon', empty:'Simulations for this course will be added soon.',
         open:'Opens in a new tab', dark:'Dark mode', courseNo:'Course'}
  };
  const header = (lang, title, intro, back) => `
    <header class="top">
      <div>
        ${back ? `<a class="navlink crumb" href="${root}index.html">${esc(TXT[lang].allCourses)}</a>` : ''}
        <h1>${title}</h1>
        ${intro ? `<p>${esc(intro)}</p>` : ''}
      </div>
      <div class="hbtns"><button id="theme"></button></div>
    </header>`;
  const num = c => c.number ? `<span class="num">${esc(c.number)}</span>` : '';

  function home(){
    const L = TXT.he;
    document.documentElement.lang = 'he'; document.documentElement.dir = 'rtl';
    document.title = L.home;
    const tiles = CATALOG.courses.map(c => {
      const n = c.sims.length;
      return `<a class="tile${n ? '' : ' soon'}" href="courses/${esc(c.slug)}/index.html">
        <div class="band"></div>
        <div class="body">
          <h2 lang="${esc(c.lang)}" dir="${c.lang === 'he' ? 'rtl' : 'ltr'}">${esc(c.title)}${num(c)}</h2>
          <div class="meta">${n ? L.sims(n) : L.soon}</div>
        </div></a>`;
    }).join('');
    $('app').innerHTML = `${header('he', esc(L.home), L.homeIntro, false)}<div class="site"><div class="cards">${tiles}</div></div>`;
    initThemeNotes({dark:L.dark});
  }

  function course(){
    const c = CATALOG.courses.find(x => x.slug === body.dataset.course);
    if (!c){ $('app').textContent = 'Unknown course: ' + body.dataset.course; return; }
    const lang = c.lang === 'he' ? 'he' : 'en', L = TXT[lang];
    document.documentElement.lang = lang; document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.title = c.title;
    const tiles = c.sims.map(s => `
      <a class="tile" href="${esc(s.file)}" target="_blank" rel="noopener" title="${esc(L.open)}">
        <div class="thumb">${s.thumb ? `<img src="${root}${esc(s.thumb)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</div>
        <div class="body">
          ${s.topic ? `<span class="tag">${esc(s.topic)}</span>` : ''}
          <h2>${esc(s.title)}</h2>
          <p>${esc(s.summary)}</p>
        </div></a>`).join('');
    const title = esc(c.title) + num(c);
    $('app').innerHTML = `${header(lang, title, '', true)}<div class="site">` +
      (c.sims.length ? `<div class="cards">${tiles}</div>` : `<div class="empty">${esc(L.empty)}</div>`) + `</div>`;
    initThemeNotes({dark:L.dark});
  }

  (body.dataset.page === 'course' ? course : home)();
})();
