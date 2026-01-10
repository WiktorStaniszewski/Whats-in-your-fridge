import { clearElement } from '../utils.js';
import { createRecipeCard } from '../../components/RecipeCard.js';

export function createRecipeGridView(gridContainer) {
  const setMessage = (html) => {
    gridContainer.innerHTML = html;
  };

  const renderRecipes = (recipes) => {
    clearElement(gridContainer);

    if (!recipes || recipes.length === 0) {
      document.getElementById("mealCount").innerHTML = ""
      setMessage('<p>No recipes found.</p>');
      return;
    }
    document.getElementById("mealCount").innerHTML = `Found: ${recipes.length}`
    recipes.forEach((recipe) => {
      gridContainer.appendChild(createRecipeCard(recipe));
    });
  };

  const setView = (viewName) => {
    gridContainer.dataset.view = viewName;
  };

  return { renderRecipes, setMessage, setView };
}
