const STORAGE_KEY = 'fridge_fav_recipes';

export const getFavorites = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const isFavorite = (id) => {
    const favs = getFavorites();
    return favs.includes(id); 
};

export const toggleFavorite = (id) => {
    let favs = getFavorites();
    if (favs.includes(id)) {
        favs = favs.filter(favId => favId !== id); 
    } else {
        favs.push(id); 
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    return favs;
};