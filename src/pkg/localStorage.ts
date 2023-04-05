import localforage from 'localforage'

localforage.config({
    name: 'adminx',
});

function init() {

}

// 从仓库中获取 key 对应的值并将结果提供给回调函数。如果 key 不存在，getItem() 将返回 null
async function getItem<T>(key: string) {
    return await localforage.getItem<T>(key)
}

// 将数据保存到离线仓库。
async function setItem<T>(key: string, value: T) {
    return await localforage.setItem<T>(key, value)
}

// 从离线仓库中删除 key 对应的值
async function removeItem(key: string) {
    return await localforage.removeItem(key)
}

// 会删除离线仓库中的所有值。谨慎使用此方法
async function clear() {
    return await localforage.clear()
}

// 获取离线仓库中的 key 的数量
async function length() {
    return await localforage.length()
}

// 根据 key 的索引获取其名
async function key(keyIndex: number) {
    return await localforage.key(keyIndex)
}

// 获取数据仓库中所有的 key
async function keys() {
    return await localforage.keys()
}


// 返回正在使用的驱动的名称
function driver() {
    return localforage.driver()
}

// 确定异步驱动程序初始化过程是否已完成
async function ready() {
    return await localforage.ready()
}

// 返回一个布尔值，表示浏览器是否支持 driverName
function supports(driverName: string) {
    return localforage.supports(driverName)
}

export default {
    init, getItem, setItem, removeItem, clear, length, key, keys, driver, ready, supports,
    LOCALSTORAGE: localforage.LOCALSTORAGE,
    WEBSQL: localforage.WEBSQL,
    INDEXEDDB: localforage.INDEXEDDB
}