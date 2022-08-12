import {
    TOGGLE_LIGHT_THEME,
    TOGGLE_DARK_THEME
} from './ActionTypes';


export const toggleLightTheme = () => {
    return {
        type: TOGGLE_LIGHT_THEME,
    };
};

export const toggleDarkTheme = () => {
    return {
        type: TOGGLE_DARK_THEME,
    };
};