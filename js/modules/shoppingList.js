const SHOPPING_KEY = 'fridge_shopping_list';

export const getShoppingList = () => JSON.parse(localStorage.getItem(SHOPPING_KEY)) || [];

export const addToShoppingList = (ingredients, recipeName) => {
    const currentList = getShoppingList();
    
    const newItems = ingredients.map(ing => ({
        id: Date.now() + Math.random(), 
        text: ing,
        recipe: recipeName,
        checked: false
    }));

    const updatedList = [...currentList, ...newItems];
    localStorage.setItem(SHOPPING_KEY, JSON.stringify(updatedList));
    return updatedList;
};

export const toggleItemCheck = (id) => {
    const list = getShoppingList();
    const updated = list.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
    );
    localStorage.setItem(SHOPPING_KEY, JSON.stringify(updated));
};

export const clearChecked = () => {
    const list = getShoppingList().filter(item => !item.checked);
    localStorage.setItem(SHOPPING_KEY, JSON.stringify(list));
    return list;
};

export const clearIngredientList = () => {
    localStorage.removeItem(SHOPPING_KEY)
}