import AsyncStorage from '@react-native-async-storage/async-storage';
export const storageService = {
    getItem : async (key) => {
        let value = await AsyncStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    },
    setItem : async (key, object) => {
        if (typeof object === 'undefined') {
            return false;
        }
        try {
            return AsyncStorage.setItem(key, JSON.stringify(object)).then(()=>{
                return true;
            }).catch(()=>{
                return false;
            })
        }
        catch (err) {
            return false;
        }
    },
    removeItem : async (key)=>{
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch (err) {
            return false;
        }
    }
}