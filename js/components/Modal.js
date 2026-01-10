import { getIngredientsList, formatInstructions } from '../modules/utils.js';
import { isFavorite, toggleFavorite } from '../modules/storage.js';
import { addToShoppingList } from '../modules/shoppingList.js';

export const renderModal = (meal, onClose) => {
    const modalContainer = document.getElementById('modal-container');
    const ingredients = getIngredientsList(meal);
    const isFav = isFavorite(meal.idMeal);
    const instructionsHtml = formatInstructions(meal.strInstructions);

    const html = `
        <div class="modal-content">
            <div class="head">
                <button class="fav-btn ${isFav ? 'active' : ''}">
                    <i class="fas fa-heart"></i>
                </button>
                <h2>${meal.strMeal}</h2>
                <span class="close-modal">
                    <i class="fas fa-times"></i>
                </span>
            </div>
            
            <img src="${meal.strMealThumb}" style="width:100%; border-radius:10px; margin-bottom:15px;">
            
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
                <a href="${meal.strYoutube}" target="_blank" class="btn secondary">Watch on YouTube</a>
            </div>
            
        </div>
    `;

    modalContainer.innerHTML = html;
    modalContainer.classList.remove('hidden');

    const closeBtn = modalContainer.querySelector('.close-modal');
    const favBtn = modalContainer.querySelector('.fav-btn');
    const cartBtn = modalContainer.querySelector('.btn-add-shopping');

    favBtn.addEventListener('click', () => {
        toggleFavorite(meal.idMeal);
        favBtn.classList.toggle('active');
    });

    cartBtn.addEventListener('click', () => {
        cartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        addToShoppingList(ingredients, meal.strMeal);
        cartBtn.innerHTML = '<i class="fas fa-check"></i>';

        setTimeout(() => {
            cartBtn.innerHTML = '<i class="fas fa-cart-plus"></i>';
        }, 2000);
    });
    
    closeBtn.addEventListener('click', () => {
        modalContainer.classList.add('hidden');
        if (onClose) onClose();
    });

    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            modalContainer.classList.add('hidden');
            if (onClose) onClose();
        }
    });
};