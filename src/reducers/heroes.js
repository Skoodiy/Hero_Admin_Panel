const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle'
}

const heroesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }
        case 'HERO_DELETED':
            return {
                ...state,
                heroes: state.heroes.filter(hero => hero.id !== action.payload)
            }
        case 'HERO_ADDED':
            const newHeroesList = [...state.heroes, action.payload];
            return {
                ...state,
                heroes: newHeroesList
            }
        default: return state
    }
}

export default heroesReducer;