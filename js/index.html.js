let shoppingList = loadList();
const previewList = document.getElementById('preview-list');
const itemsCount = document.getElementById('items-count');
const catalogContainer = document.getElementById('catalog-container');
const btnAddSelected = document.getElementById('btn-add-selected');

function saveData() {
  localStorage.setItem('mariana_shopping_list', JSON.stringify(shoppingList));
}

function exists(name, category) {
  return shoppingList.some(i => i.category === category && i.name.toLowerCase() === name.toLowerCase());
}

/* Catálogo de itens prontos */
function renderCatalog() {
  catalogContainer.innerHTML = '';
  Object.entries(CATALOG).forEach(([cat, items]) => {
    const details = document.createElement('details');
    details.className = 'catalog-group';
    details.innerHTML = `<summary>${escapeHTML(cat)}</summary>`;
    items.forEach(name => {
      const row = document.createElement('div');
      row.className = 'catalog-row';
      const already = exists(name, cat);
      row.innerHTML = `
        <label class="catalog-label">
          <input type="checkbox" class="catalog-check" ${already ? 'disabled checked' : ''}>
          <span>${escapeHTML(name)}${already ? ' <small>(na lista)</small>' : ''}</span>
        </label>
        <input type="text" class="catalog-qty" placeholder="Qtd (opcional)" ${already ? 'disabled' : ''}>
      `;
      row.dataset.name = name;
      row.dataset.category = cat;
      details.appendChild(row);
    });
    catalogContainer.appendChild(details);
  });
}

btnAddSelected.addEventListener('click', () => {
  let added = 0;
  catalogContainer.querySelectorAll('.catalog-row').forEach(row => {
    const check = row.querySelector('.catalog-check');
    if (check.checked && !check.disabled) {
      shoppingList.push({
        id: Date.now() + added,
        name: row.dataset.name,
        qty: row.querySelector('.catalog-qty').value.trim(),
        category: row.dataset.category,
        checked: false
      });
      added++;
    }
  });
  if (added === 0) {
    alert('Selecione pelo menos um item.');
    return;
  }
  saveData();
  renderCatalog();
  renderPreview();
});

function renderPreview() {
  previewList.innerHTML = '';
  itemsCount.textContent = shoppingList.length;

  if (shoppingList.length === 0) {
    previewList.innerHTML = '<li style="color: var(--text-muted); justify-content: center;">Nenhum item cadastrado.</li>';
    return;
  }

  groupByCategory(shoppingList).forEach(([cat, items]) => {
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span><strong>${escapeHTML(item.name)}</strong> <small style="color:var(--text-muted)">(${escapeHTML(cat)})</small></span>
        <span class="preview-actions">
          ${item.qty ? `<span class="quantity">${escapeHTML(item.qty)}</span>` : ''}
          <button type="button" class="btn-remove" title="Remover" data-id="${item.id}">✕</button>
        </span>
      `;
      previewList.appendChild(li);
    });
  });
}

previewList.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-remove');
  if (!btn) return;
  shoppingList = shoppingList.filter(i => i.id !== Number(btn.dataset.id));
  saveData();
  renderCatalog();
  renderPreview();
});

renderCatalog();
renderPreview();
