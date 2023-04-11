import CryptoJS from "crypto-js"

/**
 * 设置gid
 * @param type 
 * @param id 
 * @returns 
 */
export const gid = (type: string, id: string | number) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(`${type}:${id}`))
}

/**
 * 解析gid
 * @param gid 
 * @returns 
 */
export const parseGid = (gid: string) => {
    return CryptoJS.enc.Base64.parse(gid).toString(CryptoJS.enc.Utf8)
}

/**
 * tree数据结构的形成
 * @param allList 
 * @param parentList 
 * @param defineKey 
 * @returns 
 */
export const formatTreeData = <T>(allList: Array<T>, parentList?: Array<T>, defineKey = { key: "key", parentId: "parentId", children: "children" }) => {
    if (!parentList) {
        parentList = allList.filter(item => item[defineKey.parentId] == '0')
    }
    parentList.forEach((pItem) => {
        let children = allList.filter(
            (allItem) => allItem[defineKey.parentId] == pItem[defineKey.key]
        );
        if (children && children.length) {
            pItem[defineKey.children] = formatTreeData(allList, children, defineKey);
        }
    });
    return parentList;
}

/**
 * 循环处理tree结构数据
 * @param data 
 * @param key 
 * @param callback 
 * @returns 
 */
export const loopTreeData = <T extends { key: string, children?: Array<T> }>(data: Array<T>, key: string, callback: (rData: T, i: number, parentData: Array<T>) => void): void => {
    for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item.key === key) {
            return callback(item, i, data);
        }
        if (item.children) {
            loopTreeData(item.children, key, callback);
        }
    }
};