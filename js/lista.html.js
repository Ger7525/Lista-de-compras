let shoppingList = JSON.parse(localStorage.getItem('mariana_shopping_list')) || [];
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
  const checkedCount = shoppingList.filter(item => item.checked).length;
  const percentage = total === 0 ? 0 : Math.round((checkedCount / total) * 100);

  if (progressBarFill && progressText) {
    progressBarFill.style.width = percentage + '%';
    progressText.textContent = total === 0 ? 'Nenhum item cadastrado' : `${percentage}% concluído (${checkedCount} de ${total})`;
  }
}

function renderShoppingList() {
  if (!sectorsContainer) return;
  sectorsContainer.innerHTML = '';

  if (shoppingList.length === 0) {
    sectorsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Sua lista está vazia.</p>';
    updateProgress();
    return;
  }

  const categories = {};
  shoppingList.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  Object.keys(categories).forEach(cat => {
    const card = document.createElement('section');
    card.className = 'sector-card';

    let itemsHTML = '';
    categories[cat].forEach(item => {
      itemsHTML += `
        <li>
          <input type="checkbox" id="check-${item.id}" ${item.checked ? 'checked' : ''} onchange="toggleCheck(${item.id})">
          <label for="check-${item.id}" class="item-text">${item.name}</label>
          <span class="quantity">${item.qty}</span>
        </li>
      `;
    });

    card.innerHTML = `<h2>${cat}</h2><ul class="item-list">${itemsHTML}</ul>`;
    sectorsContainer.appendChild(card);
  });

  updateProgress();
}

window.toggleCheck = function(id) {
  const item = shoppingList.find(i => i.id === id);
  if (item) {
    item.checked = !item.checked;
    saveData();
    updateProgress();
  }
};

if (btnClear) {
  btnClear.addEventListener('click', () => {
    if (confirm('Encerrar as compras e limpar a lista toda?')) {
      shoppingList = [];
      saveData();
      renderShoppingList();
    }
  });
}

if (btnWhatsApp) {
  btnWhatsApp.addEventListener('click', () => {
    if (shoppingList.length === 0) {
      alert('Sua lista está vazia!');
      return;
    }

    const categories = {};
    shoppingList.forEach(item => {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });

    let message = "*🛒 LISTA DE COMPRAS - GERALISTA*\n\n";

    Object.keys(categories).forEach(cat => {
      message += `*${cat.toUpperCase()}*\n`;
      categories[cat].forEach(item => {
        const status = item.checked ? "✅" : "⏹️";
        message += `${status} ${item.name} - ${item.qty}\n`;
      });
      message += "\n";
    });

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  });
}

renderShoppingList();