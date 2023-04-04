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