const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme;
try { savedTheme = localStorage.getItem('malika-theme'); } catch { /* Theme still works when storage is unavailable. */ }

function applyTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === 'dark';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  themeButton.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
  themeButton.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#101724' : '#f8f9fc';
}

applyTheme(['light', 'dark'].includes(savedTheme) ? savedTheme : (systemTheme.matches ? 'dark' : 'light'));
themeButton.addEventListener('click', () => {
  savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(savedTheme);
  try { localStorage.setItem('malika-theme', savedTheme); } catch { /* Persistence is optional. */ }
});
systemTheme.addEventListener('change', event => {
  if (!savedTheme) applyTheme(event.matches ? 'dark' : 'light');
});

document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  root.classList.add('js-animate');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const links = [...document.querySelectorAll('nav a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  const updateNavigation = () => {
    let current = '';
    const marker = window.innerHeight * 0.4;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= marker) current = `#${section.id}`;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5) current = '#contact';
    links.forEach(link => {
      const active = link.getAttribute('href') === current;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateNavigation(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();
}

const projectDetails = {
  python: {
    title: 'Python programming projects',
    description: 'My Python programming projects are part of my journey into writing clear, useful code. This collection is a place to share programming practice, problem-solving approaches, and what I learn from building with Python.'
  },
  cpp: {
    title: 'C++ exercises',
    description: 'My C++ exercises support my learning in programming and object-oriented design. This collection is a place to explore fundamentals, practice logical thinking, and reflect on how classes and objects help structure code.'
  }
};
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const details = projectDetails[button.dataset.project];
    document.querySelector('#dialog-title').textContent = details.title;
    document.querySelector('#dialog-description').textContent = details.description;
    dialog.showModal();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
