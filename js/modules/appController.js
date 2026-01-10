import { fetchByIngredient, fetchByIngredientsAll, fetchByName, fetchRandom } from './api.js';
import { initShadowRecipeGrid } from './shadowGrid.js';
import { createRecipeGridView } from './recipeGrid/recipeGridView.js';
import { handleGridClick } from './recipeGrid/recipeGridHandlers.js';
import { loadFavorites } from '../components/Favorites.js';
import { renderModal } from '../components/Modal.js';
import { renderShoppingList } from '../components/ShoppingListView.js';

function getEl() {
  const gridHost = document.getElementById('recipe-grid');
  const { gridContainer } = initShadowRecipeGrid(gridHost);

  return {
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),

    searchNameInput: document.getElementById('search-name-input'),
    searchNameBtn: document.getElementById('search-name-btn'),

    shoppingListBtn: document.getElementById('shopping-list-btn'),
    modalContainer: document.getElementById('modal-container'), 
    gridContainer: document.getElementById('recipe-grid'),

    randomBtn: document.getElementById('random-btn'),
    favBtn: document.getElementById('show-fav-btn'),
    shoppingListBtn: document.getElementById('shopping-list-btn'),

    gridContainer,
  };
}

export function initApp() {
  const el = getEl();
  const gridView = createRecipeGridView(el.gridContainer);

  if (el.shoppingListBtn) {
      el.shoppingListBtn.addEventListener('click', () => {
          el.modalContainer.innerHTML = '';
          renderShoppingList(el.modalContainer);
          el.modalContainer.classList.remove('hidden');
      });
  }

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
    const q = query.trim();
    if (!q) return;

    view.set('recipes');
    gridView.setMessage('<p>Searching...</p>');

    try {
        let recipes;

        if (mode === 'ingredient') {
        // multi-ingredient tylko po przecinkach, żeby nie psuć składników typu "soy sauce"
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
    const handler = () => runSearch({ mode, query: input.value });

    button.addEventListener('click', handler);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handler();
    });
  };

  bindSearch({ input: el.searchInput, button: el.searchBtn, mode: 'ingredient' });
  bindSearch({ input: el.searchNameInput, button: el.searchNameBtn, mode: 'name' });

  el.randomBtn.addEventListener('click', async () => {
    try {
      const recipe = await fetchRandom();
      if (recipe) renderModal(recipe);
    } catch {
      console.error('Failed to fetch random recipe. Balls');
    }
  });

  el.favBtn.addEventListener('click', () => {
    view.set('favorites');
    loadFavorites(el.gridContainer);
  });

  el.gridContainer.addEventListener('click', (e) =>
    handleGridClick(e, { gridContainer: el.gridContainer, view })
  );

  view.set('recipes');
  gridView.setMessage('<p>Search by ingredient (use comma for many, e.g. "bread, egg") or by name.</p>');
}
