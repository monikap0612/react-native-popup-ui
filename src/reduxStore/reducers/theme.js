import { Appearance } from 'react-native';
import {
    TOGGLE_LIGHT_THEME,
    TOGGLE_DARK_THEME
} from 'reduxStore/actions/ActionTypes';

const INITIAL_STATE = {
    isDarkTheme: Appearance.getColorScheme() == 'dark',
};

const themeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TOGGLE_LIGHT_THEME:
            return {
                ...state,
                isDarkTheme: false
            };
        case TOGGLE_DARK_THEME:
            return {
                ...state,
                isDarkTheme: true
            };
        default:
            return state;
    }
}

export default themeReducer