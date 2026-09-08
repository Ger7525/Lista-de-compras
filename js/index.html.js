let shoppingList = JSON.parse(localStorage.getItem('mariana_shopping_list')) || [];
const itemForm = document.getElementById('item-form');
const previewList = document.getElementById('preview-list');
const itemsCount = document.getElementById('items-count');

function saveData() {
  localStorage.setItem('mariana_shopping_list', JSON.stringify(shoppingList));
}

function renderPreview() {
  previewList.innerHTML = '';
  itemsCount.textContent = shoppingList.length;

  if (shoppingList.length === 0) {
    previewList.innerHTML = '<li style="color: var(--text-muted); justify-content: center;">Nenhum item cadastrado.</li>';
    return;
  }

  shoppingList.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${item.name}</strong> <small style="color:var(--text-muted)">(${item.category})</small></span>
      <span class="quantity">${item.qty}</span>
    `;
    previewList.appendChild(li);
  });
}

if (itemForm) {
  itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('item-name').value.trim();
    const qty = document.getElementById('item-qty').value.trim();
    const category = document.getElementById('item-category').value;

    if (name && qty) {
      shoppingList.push({ id: Date.now(), name, qty, category, checked: false });
      saveData();
      itemForm.reset();
      renderPreview();
    }
  });
}

renderPreview();