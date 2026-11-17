/* Renders the home page from CATALOG (shared/catalog.js): one card per course with direct links to its simulations. */
"use strict";
(function(){
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const T = {
    title:'סימולציות בפיסיקה',
    intro:'סימולציות אינטראקטיביות לקורסי פיסיקה: מזיזים פרמטרים, צופים בגרפים ובאנימציות, ומשווים בין פתרון מדויק לקירובים.',
    soon:{he:'בקרוב', en:'Coming soon'}, open:{he:'נפתח בלשונית חדשה', en:'Opens in a new tab'}, dark:'תצוגה כהה'
  };
  document.title = T.title;
  const courses = CATALOG.courses.map(c => {
    const lang = c.lang === 'en' ? 'en' : 'he', dir = lang === 'en' ? 'ltr' : 'rtl';
    const num = c.number ? `<span class="num">${esc(c.number)}</span>` : '';
    const list = c.sims.length
      ? `<ul class="sims">${c.sims.map(s => `
          <li><a href="courses/${esc(c.slug)}/${esc(s.file)}" target="_blank" rel="noopener" title="${esc(T.open[lang])}">${esc(s.title)}</a>
          ${s.summary ? `<span class="sum">${esc(s.summary)}</span>` : ''}</li>`).join('')}</ul>`
      : `<p class="soon">${esc(T.soon[lang])}</p>`;
    return `<section class="course${c.sims.length ? '' : ' empty'}" lang="${lang}" dir="${dir}"><h2>${esc(c.title)}${num}</h2>${list}</section>`;
  }).join('');
  $('app').innerHTML = `
    <header class="top">
      <div><h1>${esc(T.title)}</h1><p>${esc(T.intro)}</p></div>
      <div class="hbtns"><button id="theme"></button></div>
    </header>
    <div class="site">${courses}</div>`;
  initThemeNotes({dark:T.dark});
})();
