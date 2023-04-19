import { App } from "."

export type AppRole = {
    id: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    appID: string
    name: string
    comments: string
    autoGrant: boolean
    editable: boolean
    app?: App
}