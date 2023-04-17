import CryptoJS from "crypto-js"
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
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
 * 首字母大写
 * @param str 
 * @returns 
 */
export const firstUpper = (str: string) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1)
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


/**
     * 格式化日期
     * @param {Date|Number|String} date 
     * @param {String|null} format  YYYY-MM-DD HH:mm:ss
     * @param {String|null} tz  时区
     * @param {Boolean} isTzSet  true将当前时间设置成这个时区，false 将当前时间根据时区转换
     * 例子 isTzSet=true  dayjs.tz("2022-07-07 16:30:00", "America/New_York").format("YYYY-MM-DDTHH:mm:ssZ") = "2022-07-07T16:30:00-04:00"
     * 例子 isTzSet=false dayjs("2022-07-07T20:30:00Z").tz("America/New_York").format("YYYY-MM-DD HH:mm:ss") = "2022-07-07 16:30:00"
     * @returns 
     */
export const getDate = (date: number | Date | string | dayjs.Dayjs, format: string = "YYYY-MM-DD", tz: string, isTzSet: boolean = false) => {
    if (date) {
        if (tz) {
            if (isTzSet) {
                return dayjs.tz(date, tz).format(format);
            } else {
                return dayjs(date).tz(tz).format(format);
            }
        }
        return dayjs(date).format(format);
    } else {
        return null;
    }
}