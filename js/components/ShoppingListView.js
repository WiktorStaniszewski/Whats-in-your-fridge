import {
  getShoppingList,
  toggleItemCheck,
  clearChecked,
  clearIngredientList,
} from '../modules/shoppingList.js';

import { renderOverlayShadow } from './overlayShadow.js';

const MODAL_CSS_URL = new URL('../../css/modal.css', import.meta.url).href;
const SHOPPING_CSS_URL = new URL('../../css/shoppingList.css', import.meta.url).href;

export function renderShoppingListShadow(host, opts = {}) {
  if (!host) throw new Error('renderShoppingListShadow: host is required');

  const {
    modalCssUrl = MODAL_CSS_URL,
    shoppingCssUrl = SHOPPING_CSS_URL,
    onClose = null,
  } = opts;

  const list = getShoppingList();

  const contentHtml = `
    <div class="head">
      <button class="btn-placeholder" style="visibility:hidden">
        <i class="fas fa-heart"></i>
      </button>

      <h2><i class="fas fa-shopping-basket"></i> Shopping List</h2>

      <span class="close-modal" title="Close">
        <i class="fas fa-times"></i>
      </span>
    </div>

    <div class="shopping-container">
      ${list.length === 0 ? '<p class="empty-msg">Your list is empty.</p>' : ''}

      <ul class="shopping-items">
        ${list.map(item => `
          <li class="${item.checked ? 'checked' : ''}" data-id="${item.id}">
            <input type="checkbox" ${item.checked ? 'checked' : ''}>
            <div class="item-info">
              <span class="item-text">${item.text}</span>
              <small class="item-recipe">from: ${item.recipe}</small>
            </div>
          </li>
        `).join('')}
      </ul>

      ${list.length > 0 ? '<button id="clear-shopping" class="btn primary">Clear Checked Items</button>' : ''}
      ${list.length > 0 ? '<button id="clear-all-shopping" class="btn primary">Clear Entire List</button>' : ''}
    </div>
  `;

  return renderOverlayShadow(host, {
    cssUrls: [modalCssUrl, shoppingCssUrl],
    html: contentHtml,
    onClose,
    onMount: ({ shadow }) => {
      const itemsList = shadow.querySelector('.shopping-items');
      const clearBtn = shadow.querySelector('#clear-shopping');
      const clearAllBtn = shadow.querySelector('#clear-all-shopping');

      itemsList?.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;

        const checkbox = li.querySelector('input[type="checkbox"]');
        const id = Number(li.dataset.id);

        if (e.target !== checkbox) checkbox.checked = !checkbox.checked;

        toggleItemCheck(id);
        li.classList.toggle('checked');
      });

      clearBtn?.addEventListener('click', () => {
        clearChecked();
        renderShoppingListShadow(host, opts);
      });

      clearAllBtn?.addEventListener('click', () => {
        clearIngredientList();
        renderShoppingListShadow(host, opts);
      });
    },
  });
}
