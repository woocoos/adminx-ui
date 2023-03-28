import localforage from 'localforage'

function init() {
    localforage.config({
        name: 'adminx',
        driver: localforage.LOCALSTORAGE
    });
}

// 从仓库中获取 key 对应的值并将结果提供给回调函数。如果 key 不存在，getItem() 将返回 null
function getItem<T>(key: string, callback?: (err: any, value: T | null) => void): Promise<T | null> {
    return localforage.getItem(key, callback)
}

/**
 * 将数据保存到离线仓库。
 * @param key 
 * @param value 可存储对象类型：Array|ArrayBuffer|Blob|Float32Array|Float64Array|Int8Array|Int16Array|Int32Array|Number|Object|Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|String
 * @param callback 
 * @returns 
 */
function setItem<T>(key: string, value: T, callback?: (err: any, value: T) => void): Promise<T> {
    return localforage.setItem(key, value, callback)
}

// 从离线仓库中删除 key 对应的值
function removeItem(key: string, callback?: (err: any) => void): Promise<void> {
    return localforage.removeItem(key, callback)
}

// 会删除离线仓库中的所有值。谨慎使用此方法
function clear(callback?: (err: any) => void): Promise<void> {
    return localforage.clear(callback)
}

// 获取离线仓库中的 key 的数量
function length(callback?: (err: any, numberOfKeys: number) => void): Promise<number> {
    return localforage.length(callback)
}

// 根据 key 的索引获取其名
function key(keyIndex: number, callback?: (err: any, key: string) => void): Promise<string> {
    return localforage.key(keyIndex, callback)
}

// 获取数据仓库中所有的 key
function keys(callback?: (err: any, keys: string[]) => void): Promise<string[]> {
    return localforage.keys(callback)
}

// 迭代数据仓库中的所有 value/key 键值对
function iterate<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U,
    callback?: (err: any, result: U) => void): Promise<U> {
    return localforage.iterate(iteratee, callback)
}

// 返回正在使用的驱动的名称
function driver(): string {
    return localforage.driver()
}

// 确定异步驱动程序初始化过程是否已完成
function ready(callback?: (error: any) => void): Promise<void> {
    return localforage.ready(callback)
}

// 返回一个布尔值，表示浏览器是否支持 driverName
function supports(driverName: string): boolean {
    return localforage.supports(driverName)
}

export default {
    init, getItem, setItem, removeItem, clear, length, key, keys, iterate, driver, ready, supports,
    LOCALSTORAGE: localforage.LOCALSTORAGE,
    WEBSQL: localforage.WEBSQL,
    INDEXEDDB: localforage.INDEXEDDB
}