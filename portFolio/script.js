/* ====== PREMIUM INTERACTIONS ====== */

// Custom “cube” cursor
(() => {
  const cursor = document.querySelector('.custom-cursor');
  let mx = 0, my = 0, cx = 0, cy = 0;

  const follow = () => {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) rotate(45deg)`;
    requestAnimationFrame(follow);
  };

  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  follow();

  // scale cursor a bit on interactive elements
  const pop = (el) => {
    el.addEventListener('mouseenter', () => { cursor.style.width = cursor.style.height = '18px'; cursor.style.background = '#c4b5fd'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = cursor.style.height = '14px'; cursor.style.background = '#64ffda'; });
  };
  document.querySelectorAll('a, button, .project-card, .skill').forEach(pop);
})();

/* ====== THREE.JS BACKGROUND (purple glow with floating wire shapes) ====== */
(() => {
  const mount = document.getElementById('canvas-container');
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 12);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  mount.innerHTML = '';
  mount.appendChild(renderer.domElement);

  // Light ambient glow with fog
  scene.fog = new THREE.Fog(0x000000, 18, 34);

  const geometries = [
    new THREE.BoxGeometry(1,1,1),
    new THREE.SphereGeometry(0.7, 18, 18),
    new THREE.IcosahedronGeometry(0.9),
    new THREE.TorusKnotGeometry(0.5, 0.16, 80, 10)
  ];

  const materials = [
    new THREE.MeshBasicMaterial({ color: 0xc4b5fd, wireframe: true, transparent: true, opacity: 0.6 }),
    new THREE.MeshBasicMaterial({ color: 0x9a7ff5, wireframe: true, transparent: true, opacity: 0.5 }),
    new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.35 })
  ];

  const shapes = [];
  for (let i = 0; i < 26; i++) {
    const g = geometries[Math.floor(Math.random()*geometries.length)];
    const m = materials[Math.floor(Math.random()*materials.length)];
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(
      (Math.random() - 0.5) * 24,
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 16
    );
    mesh.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01
    };
    const s = Math.random()*0.9 + 0.5;
    mesh.scale.set(s, s, s);
    scene.add(mesh);
    shapes.push(mesh);
  }

  // Parallax with mouse
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const tick = () => {
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.y * 1.0 - camera.position.y) * 0.03;
    camera.lookAt(0,0,0);

    shapes.forEach(s => {
      s.rotation.x += s.rotationSpeed.x;
      s.rotation.y += s.rotationSpeed.y;
      s.position.y += Math.sin(Date.now()*0.0006 + s.position.x) * 0.002;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
})();

/* ====== SECTION NAV + REVEALS ====== */

// Smooth scroll on “View My Work”
document.getElementById('view-work')?.addEventListener('click', (e) => {
  const target = document.querySelector('#work');
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Dots click -> scroll to section
const dots = [...document.querySelectorAll('.nav-dot')];
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const id = dot.getAttribute('data-section');
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior:'smooth', block:'start' });
  });
});

// Active dot while scrolling
const sections = [...document.querySelectorAll('section')];
const setActiveDot = () => {
  const mid = window.scrollY + window.innerHeight / 2;
  sections.forEach((sec, i) => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (mid >= top && mid < bottom) {
      dots.forEach(d => d.classList.remove('active'));
      dots[i]?.classList.add('active');
    }
  });
};
window.addEventListener('scroll', setActiveDot);

// Fade-in on view
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('fade-in'); });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.fade-target').forEach(el => io.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
