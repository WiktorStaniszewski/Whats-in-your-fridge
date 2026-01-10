const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

export const fetchByIngredient = async (ingredient) => {
    try {
        if (!ingredient || ingredient.length < 3) return null;

        const response = await fetch(`${BASE_URL}filter.php?i=${encodeURIComponent(ingredient)}`);
        const data = await response.json();

        if (data.meals) return data.meals;

        const listQuery = await fetch(`${BASE_URL}list.php?i=list`);
        const listData = await listQuery.json();

        if (!listData.meals) return null;

        const matchedIngredients = listData.meals
            .filter(item => item.strIngredient.toLowerCase().startsWith(ingredient.toLowerCase()))
            .map(item => item.strIngredient);

        if (matchedIngredients.length === 0) return null;

        const fetchPromises = matchedIngredients.map(ing => 
            fetch(`${BASE_URL}filter.php?i=${encodeURIComponent(ing)}`)
                .then(res => res.json())
                .then(json => json.meals || [])
        );

        const resultsArray = await Promise.all(fetchPromises);
        const combinedResults = resultsArray.flat();        
        const uniqueResults = Array.from(new Map(combinedResults.map(m => [m.idMeal, m])).values());
        return uniqueResults;

    } catch (error) {
        console.error("API Error (fetchByIngredient):", error);
        return null;
    }
};

export const fetchByName = async (name) => {

    try {
        if (!name) return null;
        const response = await fetch(`${BASE_URL}search.php?s=${encodeURIComponent(name)}`);
        if (!response.ok) throw new Error('Network response was not ok');
           const data = await response.json();
        return data.meals || []; 
    } catch (error) {
        console.error("API Error (fetchByName):", error);
        return null;
    }

};

export const fetchDetailsById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

export const fetchRandom = async () => {
    try {
        const response = await fetch(`${BASE_URL}random.php`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

export const fetchByIngredientsAll = async (ingredients) => {
    try {
        const list = [...new Set(
            (ingredients || [])
                .map(s => (s ?? '').trim())
                .filter(Boolean)
        )];

        if (list.length === 0) return null;

        // dla każdego składnika użyj fetchByIngredient 
        const results = await Promise.all(list.map(async (ing) => {
            const r = await fetchByIngredient(ing);
            return Array.isArray(r) ? r : [];
        }));

        // jeśli którykolwiek składnik nie ma wyników, AND jest pusty
        if (results.some(arr => arr.length === 0)) return [];

        // przecięcie po idMeal
        let intersection = new Map(results[0].map(m => [m.idMeal, m]));

        for (let i = 1; i < results.length; i++) {
            const setIds = new Set(results[i].map(m => m.idMeal));
            for (const id of intersection.keys()) {
                if (!setIds.has(id)) intersection.delete(id);
            }
        }

        return Array.from(intersection.values());
    } catch (error) {
        console.error("API Error (fetchByIngredientsAll):", error);
        return null;
    }
};
