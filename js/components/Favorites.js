import { getFavorites } from '../modules/storage.js';
import { fetchDetailsById } from '../modules/api.js';
import { createRecipeCard } from './RecipeCard.js';
import { clearElement } from '../modules/utils.js';

export const loadFavorites = async (container) => {
    clearElement(container);
    const favIds = getFavorites();

    if (favIds.length === 0) {
        container.innerHTML = '<p>You have no favorite recipes yet.</p>';
        return;
    }

    const promises = favIds.map(id => fetchDetailsById(id));
    const recipes = await Promise.all(promises);
    document.getElementById("mealCount").innerHTML = `Found: ${recipes.length}`
    recipes.forEach(recipe => {
        if(recipe) {
            const card = createRecipeCard(recipe);
            container.appendChild(card);
        }
    });
};