import { isFavorite } from '../modules/storage.js';

export const createRecipeCard = (recipe) => {
    const isFav = isFavorite(recipe.idMeal);
    
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.dataset.id = recipe.idMeal;

    card.innerHTML = `
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <div class="title">
            <h3>${recipe.strMeal}</h3>
            <button class="fav-btn ${isFav ? 'active' : ''}">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="card-actions">
            <button class="btn primary btn-details">See details</button>
            <button class="btn secondary btn-add-shopping">
                <i class="fas fa-cart-plus"></i>
            </button>
        </div>
    `;

    return card;
};