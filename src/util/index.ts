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

// zh-CN
export const browserLanguage = () => {
    let locale = ''
    switch (navigator.language) {
        case 'zh':
            locale = 'zh-CN'
            break;
        case 'en':
            locale = 'en-US'
            break;
        default:
            locale = navigator.language
            break;
    }
    return locale
}

/**
 * tree数据结构的形成
 * @param allList 
 * @param parentList 
 * @param defineKey 
 * @returns 
 */
export const formatTreeData = <T>(
    allList: Array<T>,
    parentList?: Array<T>,
    defineKey?: {
        key?: string
        parentId?: string
        children?: string
    },
    parentId?: string | number) => {
    const dataKey = { key: "key", parentId: "parentId", children: "children" }, pid = parentId == undefined ? "0" : parentId

    if (defineKey) {
        for (let key in defineKey) {
            dataKey[key] = defineKey[key]
        }
    }

    if (!parentList) {
        parentList = allList.filter(item => item[dataKey.parentId] == pid)
    }
    parentList.forEach((pItem) => {
        let children = allList.filter(
            (allItem) => allItem[dataKey.parentId] == pItem[dataKey.key]
        );
        if (children && children.length) {
            pItem[dataKey.children] = formatTreeData(allList, children, dataKey);
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
export const getDate = (date: number | Date | string | dayjs.Dayjs, format?: string, tz?: string, isTzSet?: boolean) => {
    if (date) {
        format = format || "YYYY-MM-DD"
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

/**
  * 生成随机字符串
  * @param len  几位
  * @returns {string}
  */
export const randomId = (len: number) => {
    var rdmString = '';
    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
    return rdmString.substr(0, len)
}