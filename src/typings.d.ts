/// <reference types="@ice/app/types" />

interface Window {
  antd
  resource?: {
    /**
 * logo
 */
    logo?: string
    /**
     * icon
     */
    icon?: string
    /**
     * 登录标题
     */
    loginTitle?: string
    /**
     * 登录副标题
     */
    loginSubTitle?: string
  }
}

declare module '*.png'
declare module '*.css'
