const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('geralista_theme', theme);

  if (themeIcon && themeText) {
    if (theme === 'light') {
      themeIcon.textContent = '🌙';
      themeText.textContent = 'Modo Escuro';
    } else {
      themeIcon.textContent = '☀️';
      themeText.textContent = 'Modo Claro';
    }
  }
}

const savedTheme = localStorage.getItem('geralista_theme') || 'dark';
applyTheme(savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}