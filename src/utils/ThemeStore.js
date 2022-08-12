import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
    name: 'theme',
    initialState: {
        dark: false
    },
    reducers: {
        toggleDark: state => {
            state.dark = true
        },
        toggleLight: state => {
            state.dark = false;
        }
    }
})

export const { toggleDark, toggleLight } = counterSlice.actions

const ThemeStore = configureStore({
    reducer: counterSlice.reducer
})

export default ThemeStore;