import { getIngredientsList, formatInstructions } from '../modules/utils.js';
import { isFavorite, toggleFavorite } from '../modules/storage.js';
import { addToShoppingList } from '../modules/shoppingList.js';
import { renderOverlayShadow } from './overlayShadow.js';

const MODAL_CSS_URL = new URL('../../css/modal.css', import.meta.url).href;

export const renderModal = (meal, onClose) => {
  const host = document.getElementById('modal-container');
  if (!host) throw new Error('renderModal: #modal-container not found');

  const ingredients = getIngredientsList(meal);
  const fav = isFavorite(meal.idMeal);
  const instructionsHtml = formatInstructions(meal.strInstructions);

  const contentHtml = `
    <div class="head">
      <button class="fav-btn ${fav ? 'active' : ''}" title="Favorite">
        <i class="fas fa-heart"></i>
      </button>

      <h2>${meal.strMeal}</h2>

      <span class="close-modal" title="Close">
        <i class="fas fa-times"></i>
      </span>
    </div>

    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%; border-radius:10px; margin-bottom:15px;">

    <h3>Ingredients:</h3>
    <ul class="ingredient-list">
      ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>

    <h3>Instructions:</h3>
    <p>${instructionsHtml}</p>

    <button class="btn-side-download btn-add-shopping" title="Add ingredients to Shopping List">
      <i class="fas fa-cart-plus"></i>
    </button>

    <div class="modal-links">
      <a href="${meal.strYoutube}" target="_blank" rel="noopener" class="btn secondary">Watch on YouTube</a>
    </div>
  `;

  return renderOverlayShadow(host, {
    cssUrls: [MODAL_CSS_URL],
    html: contentHtml,
    onClose,
    onMount: ({ shadow }) => {
      const favBtn = shadow.querySelector('.fav-btn');
      const cartBtn = shadow.querySelector('.btn-add-shopping');

      favBtn?.addEventListener('click', () => {
        toggleFavorite(meal.idMeal);
        favBtn.classList.toggle('active');
      });

      cartBtn?.addEventListener('click', () => {
        const prev = cartBtn.innerHTML;
        cartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        addToShoppingList(ingredients, meal.strMeal);
        cartBtn.innerHTML = '<i class="fas fa-check"></i>';

        setTimeout(() => {
          cartBtn.innerHTML = prev;
        }, 2000);
      });
    },
  });
};
