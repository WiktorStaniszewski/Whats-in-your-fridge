import { fetchDetailsById } from '../api.js';
import { toggleFavorite, isFavorite } from '../storage.js';
import { getIngredientsList } from '../utils.js';
import { addToShoppingList } from '../shoppingList.js';
import { renderModal } from '../../components/Modal.js';
import { loadFavorites } from '../../components/Favorites.js';

export async function handleGridClick(e, { gridContainer, view }) {
  const card = e.target.closest('.recipe-card');
  if (!card) return;

  const id = card.dataset.id;
  if (!id) return;

  const addBtn = e.target.closest('.btn-add-shopping');
  if (addBtn) {
    const prev = addBtn.innerHTML;
    addBtn.disabled = true;
    addBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
      const fullRecipe = await fetchDetailsById(id);
      const ingredients = getIngredientsList(fullRecipe);
      addToShoppingList(ingredients, fullRecipe.strMeal);

      addBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => (addBtn.innerHTML = prev), 1200);
    } catch {
      addBtn.innerHTML = '<i class="fas fa-times"></i>';
      setTimeout(() => (addBtn.innerHTML = prev), 1200);
    } finally {
      addBtn.disabled = false;
    }
    return;
  }

  const favBtn = e.target.closest('.fav-btn');
  if (favBtn) {
    toggleFavorite(id);
    favBtn.classList.toggle('active');

    if (view.get() === 'favorites') {
      loadFavorites(gridContainer);
    }
    return;
  }

  try {
    const fullRecipe = await fetchDetailsById(id);

    renderModal(fullRecipe, () => {
      const currentIsFav = isFavorite(id);
      const cardFavBtn = card.querySelector('.fav-btn');
      if (!cardFavBtn) return;

      cardFavBtn.classList.toggle('active', currentIsFav);
    });
  } catch {
  }
}
