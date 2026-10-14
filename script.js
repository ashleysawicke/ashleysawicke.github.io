(() => {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.getElementById('primary-links');
  if(toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = open ? 'Close <span aria-hidden="true">×</span>' : 'Menu <span aria-hidden="true">☰</span>';
    });
    links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = 'Menu <span aria-hidden="true">☰</span>';
    }));
  }
  const year = document.getElementById('year'); if(year) year.textContent = new Date().getFullYear();
  const print = document.getElementById('print-resume');
  if(print) print.addEventListener('click', () => window.print());
  const map = document.getElementById('mindmap');
  const svg = document.getElementById('thread-lines');
  const origin = document.getElementById('thread-origin');
  if(!map || !svg || !origin) return;
  const cards = [...map.querySelectorAll('.thought')];
  const ns = 'http://www.w3.org/2000/svg';
  function drawThreads() {
    svg.replaceChildren();
    if(window.matchMedia('(max-width: 740px)').matches) return;
    const base = map.getBoundingClientRect();
    const dot = origin.getBoundingClientRect();
    const startX = dot.left + dot.width / 2 - base.left;
    const startY = dot.top + dot.height / 2 - base.top;
    svg.setAttribute('viewBox', '0 0 ' + base.width + ' ' + base.height);
    cards.forEach((card, i) => {
      const box = card.getBoundingClientRect();
      const x = box.left + box.width / 2 - base.left;
      const y = box.top + box.height / 2 - base.top;
      const dx = x - startX;
      const dy = y - startY;
      const lift = (i % 2 ? -1 : 1) * Math.min(105, Math.abs(dx) * .17);
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', 'M ' + startX + ' ' + startY + ' C ' + (startX+dx*.25+lift) + ' ' + (startY+dy*.13) + ', ' + (startX+dx*.69-lift*.6) + ' ' + (startY+dy*.88) + ', ' + x + ' ' + y);
      path.setAttribute('stroke', card.dataset.thread || '#bb443f');
      svg.appendChild(path);
      card.addEventListener('mouseenter', () => path.classList.add('active'));
      card.addEventListener('mouseleave', () => path.classList.remove('active'));
      card.addEventListener('focus', () => path.classList.add('active'));
      card.addEventListener('blur', () => path.classList.remove('active'));
    });
  }
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(drawThreads);
  window.addEventListener('load', drawThreads, {once:true});
  window.addEventListener('resize', () => window.requestAnimationFrame(drawThreads));
  drawThreads();
})();