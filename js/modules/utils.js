export const clearElement = (element) => {
    element.innerHTML = '';
};

export const getIngredientsList = (meal) => {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`] || '';
            ingredients.push(`${ingredient} - ${measure}`);
        } else {
            break;
        }
    }
    return ingredients;
};

export const formatInstructions = (instructionText) => {
    if (!instructionText) return '';
    let formatted = instructionText.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');

    formatted = formatted.replace(/(step \s?\d+)/gi, '<br><strong>$1</strong>');
    formatted = formatted.replace(/(\d+\.\s)/g, '<br><strong>$1</strong>');

    formatted = formatted.replace(/^(<br>\s*)+/i, '');

    return formatted;
};