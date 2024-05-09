import AsyncStorage from "@react-native-async-storage/async-storage";

class LocalStorageService {
  async storeString(key, value) {
    await AsyncStorage.setItem(key, value);
  }

  async storeObject(key, value) {
    jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  }

  async getString(key) {
    value = await AsyncStorage.getItem(key);
    return value;
  }

  async getObject(key) {
    jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  }

  async removeItem(key) {
    await AsyncStorage.removeItem(key);
  }
}

export default LocalStorageService
