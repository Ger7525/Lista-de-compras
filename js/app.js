/* ===== TEMA ===== */
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('geralista_theme', theme);
  if (themeIcon && themeText) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    themeText.textContent = theme === 'light' ? 'Modo Escuro' : 'Modo Claro';
  }
}

applyTheme(localStorage.getItem('geralista_theme') || 'dark');

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ===== COMPARTILHADO ===== */
const CATALOG = {
  '🌾 Cereais': ['Feijão', 'Arroz', 'Fubá', 'Açúcar', 'Farinha', 'Granola', 'Aveia', 'Macarrão', 'Milho de pipoca', 'Maizena', 'Trigo', 'Fermento'],
  '🧀 Laticínios': ['Leite Caixa Desnatado', 'Leite Caixa Integral', 'Leite em pó Desnatado', 'Leite em pó Integral', 'Queijo Mozzarella', 'Queijo Prato', 'Queijo Coalho', 'Iogurte', 'Manteiga', 'Creme de Leite', 'Leite condensado'],
  '🧂 Temperos Secos e Especiarias': ['Sal Grosso', 'Sal refinado', 'Tempero', 'Molho pronto', 'Extrato de Tomate', 'Óleo', 'Vinagre', 'Ketchup', 'Mostarda', 'Maionese'],
  '🧼 Produtos de Limpeza e Higiene': ['Água sanitária', 'Sabão em pó', 'Sabão Líquido', 'Sabão em Barra', 'Desinfetante', 'Detergente', 'Esponja', 'Bombril', 'Creme Dental', 'Escova Dental', 'Cotonete', 'Algodão', 'Barbeador', 'Desodorante', 'Sabonete', 'Papel Higiênico'],
  '🍎 Frutas e Verduras': ['Mamão', 'Melão', 'Melancia', 'Maçã', 'Abacate', 'Laranja', 'Alface', 'Repolho', 'Tomate', 'Cebola', 'Pimentão', 'Pepino', 'Rúcula', 'Couve', 'Coentro'],
  '🥩 Carnes, Ovos e etc.': ['Carne', 'Frango', 'Peixe', 'Ovos', 'Salsicha', 'Empanado', 'Charque', 'Toscana'],
  '🛍️ Diversos': ['Vela de 7 dias', 'Vela número 8', 'Vassoura', 'Pá', 'Papel Filme', 'Papel Toalha', 'Papel Alumínio', 'Saco para lixo']
};

function loadList() {
  try {
    const data = JSON.parse(localStorage.getItem('mariana_shopping_list'));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function groupByCategory(list) {
  const order = Object.keys(CATALOG);
  const groups = {};
  list.forEach(item => (groups[item.category] = groups[item.category] || []).push(item));
  const keys = Object.keys(groups).sort((a, b) => {
    const ia = order.indexOf(a), ib = order.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  return keys.map(k => [k, groups[k]]);
}
