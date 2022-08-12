import AsyncStorage from '@react-native-community/async-storage';

var LocalStorage = {
    getKey: async function (key) {
        try {
            return await AsyncStorage.getItem(key);
        }
        catch (error) {
            console.log('Error retrieving data: ' + error);
        }
    },
    getParseData: async function (key) {
        try {
            const data = await AsyncStorage.getItem(key);
            return JSON.parse(data);
        }
        catch (error) {
            console.log('Error retrieving data: ' + error);
        }
    },
    saveKey: async function (key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        }
        catch (error) {
            console.log('Error saving data: ' + error);
        }
    },
    removeKey: async function (key) {
        try {
            await AsyncStorage.removeItem(key);
        }
        catch (error) {
            console.log('Error removing data: ' + error);
        }
    },
    clearStore: async function (key) {
        try {
            await AsyncStorage.clear();
        }
        catch (error) {
            console.log('Error clearing data: ' + error);
        }
    }
}
export default LocalStorage;