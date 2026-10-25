let shoppingList = loadList();
const sectorsContainer = document.getElementById('sectors-container');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const btnClear = document.getElementById('btn-clear');
const btnWhatsApp = document.getElementById('btn-whatsapp');

function saveData() {
  localStorage.setItem('mariana_shopping_list', JSON.stringify(shoppingList));
}

function updateProgress() {
  const total = shoppingList.length;
  const checkedCount = shoppingList.filter(i => i.checked).length;
  const percentage = total === 0 ? 0 : Math.round((checkedCount / total) * 100);
  progressBarFill.style.width = percentage + '%';
  progressText.textContent = total === 0 ? 'Nenhum item cadastrado' : `${percentage}% concluído (${checkedCount} de ${total})`;
}

function renderShoppingList() {
  sectorsContainer.innerHTML = '';

  if (shoppingList.length === 0) {
    sectorsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Sua lista está vazia.</p>';
    updateProgress();
    return;
  }

  groupByCategory(shoppingList).forEach(([cat, items]) => {
    const card = document.createElement('section');
    card.className = 'sector-card';
    const itemsHTML = items.map(item => `
      <li>
        <input type="checkbox" id="check-${item.id}" data-id="${item.id}" ${item.checked ? 'checked' : ''}>
        <label for="check-${item.id}" class="item-text">${escapeHTML(item.name)}</label>
        ${item.qty ? `<span class="quantity">${escapeHTML(item.qty)}</span>` : ''}
      </li>`).join('');
    card.innerHTML = `<h2>${escapeHTML(cat)}</h2><ul class="item-list">${itemsHTML}</ul>`;
    sectorsContainer.appendChild(card);
  });

  updateProgress();
}

sectorsContainer.addEventListener('change', (e) => {
  if (!e.target.matches('input[type="checkbox"]')) return;
  const item = shoppingList.find(i => i.id === Number(e.target.dataset.id));
  if (item) {
    item.checked = e.target.checked;
    saveData();
    updateProgress();
  }
});

btnClear.addEventListener('click', () => {
  if (confirm('Encerrar as compras e limpar a lista toda?')) {
    shoppingList = [];
    saveData();
    renderShoppingList();
  }
});

btnWhatsApp.addEventListener('click', () => {
  if (shoppingList.length === 0) {
    alert('Sua lista está vazia!');
    return;
  }
  let message = '*🛒 LISTA DE COMPRAS - LISTA DA MARY*\n\n';
  groupByCategory(shoppingList).forEach(([cat, items]) => {
    message += `*${cat.toUpperCase()}*\n`;
    items.forEach(item => {
      message += `${item.checked ? '✅' : '⏹️'} ${item.name}${item.qty ? ' - ' + item.qty : ''}\n`;
    });
    message += '\n';
  });
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
});

renderShoppingList();
