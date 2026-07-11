const dots = document.querySelectorAll('.dot-nav .dot');
const sections = document.querySelectorAll('.section');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      dots.forEach(d => d.classList.remove('active'));
      const match = document.querySelector(`.dot-nav .dot[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
sections.forEach(s => revealObserver.observe(s));

const coloresGlobo = ['#E88CA0', '#D9A441', '#7FB6C4', '#7A2C42', '#F1A8AE'];
const globosCont = document.getElementById('globos');
const NUM_GLOBOS = 9;
for (let i = 0; i < NUM_GLOBOS; i++) {
  const g = document.createElement('div');
  g.className = 'globo';
  g.style.left = Math.random() * 96 + '%';
  g.style.background = coloresGlobo[i % coloresGlobo.length];
  const duracion = 14 + Math.random() * 10;
  g.style.animationDuration = duracion + 's';
  g.style.animationDelay = (-Math.random() * duracion) + 's';
  g.style.width = (36 + Math.random() * 20) + 'px';
  g.style.height = g.style.width;
  globosCont.appendChild(g);
}

const canvas = document.getElementById('confeti-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const coloresConfeti = ['#E88CA0', '#D9A441', '#7FB6C4', '#7A2C42', '#FFF3C4'];
let piezas = [];

function crearPiezas(cantidad){
  for (let i = 0; i < cantidad; i++) {
    piezas.push({
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.5,
      w: 6 + Math.random() * 5,
      h: 8 + Math.random() * 6,
      color: coloresConfeti[Math.floor(Math.random() * coloresConfeti.length)],
      velY: 1.2 + Math.random() * 1.8,
      velX: (Math.random() - 0.5) * 1.2,
      rot: Math.random() * 360,
      velRot: (Math.random() - 0.5) * 6,
      vida: 0,
      vidaMax: 500 + Math.random() * 300
    });
  }
}
crearPiezas(90);

let confetiActivo = true;
function animarConfeti(){
  ctx.clearRect(0, 0, W, H);
  piezas.forEach(p => {
    p.x += p.velX;
    p.y += p.velY;
    p.rot += p.velRot;
    p.vida++;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, 1 - p.vida / p.vidaMax);
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  piezas = piezas.filter(p => p.vida < p.vidaMax && p.y < H + 40);
  if (confetiActivo && piezas.length < 40) crearPiezas(6);
  requestAnimationFrame(animarConfeti);
}
animarConfeti();
setTimeout(() => { confetiActivo = false; }, 6000);

function estallarConfeti(x, y){
  for (let i = 0; i < 60; i++) {
    const ang = Math.random() * Math.PI * 2;
    const vel = 2 + Math.random() * 4;
    piezas.push({
      x, y,
      w: 6 + Math.random() * 5,
      h: 8 + Math.random() * 6,
      color: coloresConfeti[Math.floor(Math.random() * coloresConfeti.length)],
      velY: Math.sin(ang) * vel - 2,
      velX: Math.cos(ang) * vel,
      rot: Math.random() * 360,
      velRot: (Math.random() - 0.5) * 10,
      vida: 0,
      vidaMax: 260 + Math.random() * 200
    });
  }
}

function renderCanciones(){
  const ul = document.getElementById('lista-canciones');
  if (!CANCIONES || CANCIONES.length === 0) {
    ul.innerHTML = `<li class="cancion-vacio">todavía no agregaste canciones — edita js/songs.js</li>`;
    return;
  }
  ul.innerHTML = CANCIONES.map((c, i) => `
    <li class="cancion">
      <span class="cancion-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="cancion-info">
        <div class="cancion-titulo">${c.titulo}</div>
        <div class="cancion-artista">${c.artista || ''}</div>
        ${c.razon ? `<div class="cancion-razon">${c.razon}</div>` : ''}
      </div>
      ${c.link ? `<a class="cancion-link" href="${c.link}" target="_blank" rel="noopener">escuchar</a>` : ''}
    </li>
  `).join('');
}
renderCanciones();

const carrusel = document.getElementById('carrusel');
const slides = carrusel.querySelectorAll('.slide');
const dotsCont = document.getElementById('carrusel-dots');

slides.forEach((_, i) => {
  const d = document.createElement('div');
  d.className = 'cdot' + (i === 0 ? ' active' : '');
  d.addEventListener('click', () => irASlide(i));
  dotsCont.appendChild(d);
});
const cdots = dotsCont.querySelectorAll('.cdot');

function irASlide(i){
  slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function actualizarDots(){
  const centro = carrusel.scrollLeft + carrusel.clientWidth / 2;
  let idx = 0, distMin = Infinity;
  slides.forEach((s, i) => {
    const dist = Math.abs((s.offsetLeft + s.clientWidth / 2) - centro);
    if (dist < distMin) { distMin = dist; idx = i; }
  });
  cdots.forEach((d, i) => d.classList.toggle('active', i === idx));
}
carrusel.addEventListener('scroll', () => { window.requestAnimationFrame(actualizarDots); });

document.getElementById('btn-izq').addEventListener('click', () => { carrusel.scrollBy({ left: -carrusel.clientWidth * 0.65, behavior: 'smooth' }); });
document.getElementById('btn-der').addEventListener('click', () => { carrusel.scrollBy({ left: carrusel.clientWidth * 0.65, behavior: 'smooth' }); });

const pastel = document.getElementById('pastel');
const cartaPapel = document.getElementById('carta-papel');
const pastelHint = document.getElementById('pastel-hint');

function apagarVela(){
  if (pastel.classList.contains('apagado')) return;
  pastel.classList.add('apagado');
  const rect = pastel.getBoundingClientRect();
  estallarConfeti(rect.left + rect.width / 2, rect.top + 30);
  pastelHint.textContent = 'hiciste tu pedido — aquí está tu carta';
  cartaPapel.classList.remove('oculta');
  setTimeout(() => cartaPapel.classList.add('mostrar'), 200);
  setTimeout(() => cartaPapel.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
}
pastel.addEventListener('click', apagarVela);
pastel.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apagarVela(); } });

document.getElementById('fecha-hoy').textContent = new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });