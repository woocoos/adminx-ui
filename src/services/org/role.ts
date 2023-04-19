
export type OrgRole = {
    id: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    orgID: string
    kind: OrgRoleKind
    name: string
    comments: string
}

export type OrgRoleKind = "group" | "role"