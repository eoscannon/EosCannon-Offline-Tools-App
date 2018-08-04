import Storage from "react-native-storage";
import { AsyncStorage } from "react-native";
// 设置本地存储方法对象；
const storage = new Storage({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    sync: () => null,

});
// 自定义存储对象
const localSave = {};
localSave.set = (key, data) => {
    storage.save({key, data,});
};
localSave.setPrivateKeyArr = (PrivateKeyArr) => {
    localSave.set("PrivateKeyArr", PrivateKeyArr);
};
export {
    storage,
    localSave,
};
