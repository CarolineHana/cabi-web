/* ============================
   VIEWPORT SCALING
   ============================ */
function scaleScene() {
  const scene = document.getElementById('scene');
  const sw = window.innerWidth, sh = window.innerHeight;
  const scaleX = sw / 1728, scaleY = sh / 1117;
  const scale = Math.min(scaleX, scaleY);
  const ox = (sw - 1728 * scale) / 2;
  const oy = (sh - 1117 * scale) / 2;
  scene.style.transform = `translate(${ox}px,${oy}px) scale(${scale})`;
}
window.addEventListener('resize', scaleScene);
scaleScene();

/* ============================
   CONTENT
   ============================ */
const CONTENT = {
  about: {
    heading: 'Our Story',
    text: `We are currently pursuing the joint Master in Design Engineering program between the Harvard Graduate School of Design and the Harvard John A. Paulson School of Engineering and Applied Sciences, where we first met and quickly connected through a shared interest in experimental technology, creative hardware, and hands-on making. Our collaboration grew from a mutual curiosity for how electronics, fabrication, and speculative design can expand creative practice and make technology feel more tangible, playful, and human.

Coming from distinct but complementary backgrounds, we bring different perspectives into the same creative process. Caro's expertise in hardware, embedded systems, and interactive prototyping intersects with Gabi's background in design, linguistics, spatial storytelling, and manufacturing. Together, we combine technical experimentation with design-driven thinking, developing projects that merge robotics, wearables, physical computing, and speculative objects.

Our process is grounded in rapid prototyping, iterative fabrication, and a shared enthusiasm for demystifying hardware. We approach technology not only as a functional tool, but also as a creative medium for storytelling, interaction, and exploration.

Our Mission

We believe technology should be approachable, expressive, and fun. In a culture increasingly centered around optimization and productivity, we are interested in reclaiming experimentation, play, and creativity as equally valuable ways of engaging with hardware and computational tools. Through speculative objects, wearables, robotics, and DIY electronics, we aim to create projects that invite curiosity rather than intimidation.

As women working across engineering, design, and fabrication, we are also invested in challenging the misconception that technical rigor and aesthetics exist in opposition. Too often, engineering and creative practice are treated as separate worlds, when in reality the most meaningful work often emerges through their intersection. By openly sharing our process, documentation, and knowledge, we hope to encourage more people, especially women, to explore creative technology for themselves.`,
  },
  mission: {
    heading: 'Our Mission',
    text: `We believe technology should be approachable, expressive, and fun. In a culture increasingly centered around optimization and productivity, we are interested in reclaiming experimentation, play, and creativity as equally valuable ways of engaging with hardware and computational tools. Through speculative objects, wearables, robotics, and DIY electronics, we aim to create projects that invite curiosity rather than intimidation.

As women working across engineering, design, and fabrication, we are also invested in challenging the misconception that technical rigor and aesthetics exist in opposition. Too often, engineering and creative practice are treated as separate worlds, when in reality the most meaningful work often emerges through their intersection. By openly sharing our process, documentation, and knowledge, we hope to encourage more people, especially women, to explore creative technology for themselves and to see hardware not only as a tool for productivity, but also as a medium for expression, storytelling, and play.`,
  },
  proposal: {
    heading: 'Our Proposal',
    text: `Coming soon — stay tuned for our proposal.`,
  },
};

/* ============================
   STATE MACHINE
   ============================ */
let currentState = 0; // 0=landing, 1=projects, 2=about, 3=mission, 4=proposal
let currentSection = null;

const stateMap = { about: 2, mission: 3, proposal: 4 };

function setState(n) {
  currentState = n;
  document.body.setAttribute('data-state', n);
}

/* ============================
   HOVER PEEK
   ============================ */
const peekZone  = document.getElementById('cabi-hover-zone');
const peekIcons = document.querySelectorAll('.peek-icon');

peekZone.addEventListener('mouseenter', () => {
  peekIcons.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 40);
  });
});
peekZone.addEventListener('mouseleave', () => {
  peekIcons.forEach(el => el.classList.remove('visible'));
});
peekZone.addEventListener('click', goToProjects);

/* ============================
   GO TO PROJECTS
   ============================ */
function goToProjects() {
  if (currentState !== 0) return;
  setState(1);

  // Stagger project icons in
  document.querySelectorAll('.proj-icon').forEach((el, i) => {
    el.style.transition = `opacity 0.5s ease ${i * 60}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms`;
  });

  // Labels appear slightly after icons
  document.querySelectorAll('.proj-label').forEach((el, i) => {
    el.style.transition = `opacity 0.35s ease ${300 + i * 40}ms`;
  });

  // Clear any active button state
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
}

/* ============================
   GO TO SECTION
   ============================ */
function goToSection(key) {
  currentSection = key;
  const data = CONTENT[key];

  // Update heading and body text
  document.getElementById('sec-heading').textContent = data.heading;
  document.getElementById('sec-text').textContent    = data.text;
  document.getElementById('sec-text-container').scrollTop = 0;

  // Reset fade mask
  document.getElementById('text-fade').style.opacity = '1';

  // Mark the clicked button active, unmark the rest (both nav bars)
  ['proj', 'sec'].forEach(prefix => {
    ['about', 'mission', 'proposal'].forEach(k => {
      const btn = document.getElementById(`${prefix}-btn-${k}`);
      if (btn) btn.classList.toggle('active', k === key);
    });
  });

  setState(stateMap[key]);
}

/* ============================
   BACK TO PROJECTS
   ============================ */
function backToProjects() {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  setState(1);
}

/* ============================
   SCROLL FADE MASK
   ============================ */
const textContainer = document.getElementById('sec-text-container');
const fadeMask      = document.getElementById('text-fade');

textContainer.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = textContainer;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
  fadeMask.style.opacity = atBottom ? '0' : '1';
});

/* ============================
   PROJECT ICON HOVER SCALE
   ============================ */
document.querySelectorAll('.proj-icon').forEach(icon => {
  const base = icon.style.transform || '';
  icon.addEventListener('mouseenter', () => {
    // Insert scale(1.1) while preserving existing rotation
    const scaled = base.includes('rotate')
      ? base.replace('rotate', 'scale(1.1) rotate')
      : base + ' scale(1.1)';
    icon.style.transform = scaled.replace(/scale\([^)]+\) scale/, 'scale');
  });
  icon.addEventListener('mouseleave', () => {
    icon.style.transform = base;
  });
});
