import { getShoppingList, toggleItemCheck, clearChecked, clearIngredientList } from '../modules/shoppingList.js';

export const renderShoppingList = (container) => {
    const list = getShoppingList();
    
    container.innerHTML = `
        <div class="modal-content">
            <div class="head">
                <button class="btn-placeholder" style="visibility:hidden"><i class="fas fa-heart"></i></button>
                <h2><i class="fas fa-shopping-basket"></i> Shopping List</h2>
                <span class="close-modal"><i class="fas fa-times"></i></span>
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
        </div>
    `;


    container.querySelector('.close-modal').addEventListener('click', () => {
        container.classList.add('hidden');
    });

    const itemsList = container.querySelector('.shopping-items');
    if (itemsList) {

        itemsList.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;

            const checkbox = li.querySelector('input[type="checkbox"]');
            const id = parseFloat(li.dataset.id);


            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }

            toggleItemCheck(id);
            
            li.classList.toggle('checked');
        });
    }

    const clearBtn = container.querySelector('#clear-shopping');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            clearChecked();
            renderShoppingList(container);
        });
    }

    const clearWholeList = container.querySelector("#clear-all-shopping");
    if (clearWholeList){
        clearWholeList.addEventListener('click', () =>{
            clearIngredientList();
            renderShoppingList(container);
        })
    }
};