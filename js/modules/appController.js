import { fetchByIngredient, fetchByIngredientsAll, fetchByName, fetchRandom } from './api.js';
import { initShadowRecipeGrid } from './shadowGrid.js';
import { createRecipeGridView } from './recipeGrid/recipeGridView.js';
import { handleGridClick } from './recipeGrid/recipeGridHandlers.js';
import { loadFavorites } from '../components/Favorites.js';
import { renderModal } from '../components/Modal.js';
import { renderShoppingListShadow } from '../components/ShoppingListView.js';

const byId = (id) => document.getElementById(id);

function getEl() {
  const gridHost = byId('recipe-grid');
  if (!gridHost) throw new Error('initApp: #recipe-grid not found');

  const { gridContainer } = initShadowRecipeGrid(gridHost);

  const modalContainer = byId('modal-container');
  if (!modalContainer) throw new Error('initApp: #modal-container not found');

  return {
    searchInput: byId('search-input'),
    searchNameInput: byId('search-name-input'),

    searchBtn: byId('search-btn'),
    searchNameBtn: byId('search-name-btn'),

    randomBtn: byId('random-btn'),
    favBtn: byId('show-fav-btn'),
    shoppingListBtn: byId('shopping-list-btn'),

    modalContainer,
    gridContainer,
  };
}

export function initApp() {
  const el = getEl();
  const gridView = createRecipeGridView(el.gridContainer);

  const view = (() => {
    let current = 'recipes';
    return {
      get: () => current,
      set: (v) => {
        current = v;
        gridView.setView(v);
      },
    };
  })();

  const runSearch = async ({ mode, query }) => {
    const q = (query ?? '').trim();
    if (!q) return;

    view.set('recipes');
    gridView.setMessage('<p>Searching...</p>');

    try {
      let recipes;

      if (mode === 'ingredient') {
        const parts = q.split(',').map(s => s.trim()).filter(Boolean);
        recipes = parts.length > 1
          ? await fetchByIngredientsAll(parts)
          : await fetchByIngredient(q);
      } else {
        recipes = await fetchByName(q);
      }

      gridView.renderRecipes(recipes);
    } catch {
      gridView.setMessage('<p>Search failed. Try again.</p>');
    }
  };

  const bindSearch = ({ input, button, mode }) => {
    if (!input || !button) return;

    const handler = () => runSearch({ mode, query: input.value });

    button.addEventListener('click', handler);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handler();
    });
  };

  bindSearch({ input: el.searchInput, button: el.searchBtn, mode: 'ingredient' });
  bindSearch({ input: el.searchNameInput, button: el.searchNameBtn, mode: 'name' });

  el.shoppingListBtn?.addEventListener('click', () => {
    renderShoppingListShadow(el.modalContainer);
  });

  el.randomBtn?.addEventListener('click', async () => {
    try {
      const recipe = await fetchRandom();
      if (recipe) renderModal(recipe);
    } catch (err) {
      console.error('Failed to fetch random recipe.', err);
    }
  });

  el.favBtn?.addEventListener('click', () => {
    view.set('favorites');
    loadFavorites(el.gridContainer);
  });

  el.gridContainer.addEventListener('click', (e) =>
    handleGridClick(e, { gridContainer: el.gridContainer, view })
  );

  view.set('recipes');
  gridView.setMessage('<p>Search by ingredient (use comma for many, e.g. "bread, egg") or by name.</p>');
}
