import { gid } from "@/util"
import { App, AppNodeField } from "."
import { TreeMoveAction, graphqlApi, setClearInputField } from "../graphql"
import { AppAction } from "./action"

export type AppMenuKind = "dir" | "menu"
export interface AppMenu {
    id: string
    createdBy: number
    createdAt: Date
    updatedBy: number
    updatedAt: Date
    appID: string
    parentID: string
    kind: AppMenuKind
    name: string
    icon: string
    route: string
    actionID: string | null
    comments: string
    displaySort: number
    app?: App
    action?: AppAction
}

export const AppMenuField = `#graphql
    id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route
    action{ id,name }
`

/**
 * 获取应用菜单
 * @param appId 
 * @returns 
 */
export async function getAppMenus(appId: string) {
    const appGid = gid('app', appId)
    const result = await graphqlApi(
        `#graphql
        query menus($orderBy: AppMenuOrder){
          node(id:"${appGid}"){
            ... on App{        
                ${AppNodeField}    
                menus(orderBy:$orderBy){
                    edges{                                        
                        cursor,node{                    
                            ${AppMenuField}
                        }
                    }
                }
            }
          }
        }`, {
        orderBy: {
            direction: 'ASC',
            field: "displaySort"
        }
    })

    if (result?.data?.node) {
        return result.data.node as App
    } else {
        return null
    }
}


/**
 * 更新应用菜单
 * @param appId
 * @param input 
 * @returns 
 */
export async function updateAppMenu(menuId: string, input: App | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation updateAppMenu($input: UpdateAppMenuInput!){
          action:updateAppMenu(menuID:"${menuId}",input:$input){
            ${AppMenuField}
          }
        }`, { input: setClearInputField(input) })

    if (result?.data?.action) {
        return result?.data?.action as App
    } else {
        return null
    }
}

/**
 * 创建应用菜单
 * @param input 
 * @returns 
 */
export async function createAppMenu(appId: string, input: AppMenu | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation createAppMenus($input: [CreateAppMenuInput!]){
          action:createAppMenus(appID:"${appId}",input:$input){
            ${AppMenuField}
          }
        }`, { input: [input] })

    if (result?.data?.action?.[0]?.id) {
        return result.data.action[0] as AppMenu
    } else {
        return null
    }
}

/**
 * 删除应用菜单
 * @param appId 
 * @returns 
 */
export async function delAppMenu(menuId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation deleteAppMenu{
          action:deleteAppMenu(menuID: "${menuId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}


/**
 * 菜单位置移动
 * @param input 
 * @returns 
 */
export async function moveAppMenu(sourceId: string, targetId: string, action: TreeMoveAction) {
    const result = await graphqlApi(
        `#graphql
        mutation moveAppMenu{
          action:moveAppMenu(sourceID:"${sourceId}",targetID:"${targetId}",action:${action})
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}