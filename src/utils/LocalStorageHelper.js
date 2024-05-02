import AsyncStorage from "@react-native-async-storage/async-storage";

const storeString = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

const storeObject = async (key, value) => {
  const jsonValue = JSON.stringify(value);
  await AsyncStorage.setItem(key, jsonValue);
};

const getString = async (key) => {
  const value = await AsyncStorage.getItem(key);
  return value;
};

const getObject = async (key) => {
  const jsonValue = await AsyncStorage.getItem(key);
  return jsonValue != null ? JSON.parse(jsonValue) : null;
};

const removeItem = async (key) => {
  await AsyncStorage.removeItem(key)
}

export { storeString, storeObject, getString, getObject,removeItem };
