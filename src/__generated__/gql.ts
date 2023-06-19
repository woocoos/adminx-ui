/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query appActionList($gid: GID!,$first: Int,$orderBy:AppActionOrder,$where:AppActionWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:actions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n          }\n        }\n      }\n    }\n  }\n}": types.AppActionListDocument,
    "query AppActionInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppAction{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n    }\n  }\n}": types.AppActionInfoDocument,
    "mutation createAppAction($appId:ID!,$input: [CreateAppActionInput!]){\n  action:createAppActions(appID:$appId,input:$input){id}\n}": types.CreateAppActionDocument,
    "mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){\n  action:updateAppAction(actionID:$appActionId,input:$input){id}\n}": types.UpdateAppActionDocument,
    "mutation delAppAction($appActionId:ID!){\n  action:deleteAppAction(actionID: $appActionId)\n}": types.DelAppActionDocument,
    "query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  list:apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logo,comments,status,createdAt\n      }\n    }\n  }\n}": types.AppListDocument,
    "query appInfo($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n      refreshTokenValidity,logo,comments,status,createdAt\n    }\n  }\n}": types.AppInfoDocument,
    "mutation updateApp($appId:ID!,$input: UpdateAppInput!){\n  action:updateApp(appID:$appId,input:$input){id}\n}": types.UpdateAppDocument,
    "mutation createApp($input: CreateAppInput!){\n  action:createApp(input:$input){ id }\n}": types.CreateAppDocument,
    "mutation delApp($appId:ID!){\n  action:deleteApp(appID: $appId)\n}": types.DelAppDocument,
    "query appMenuList($gid:GID!,$first: Int,$where: AppMenuWhereInput,$orderBy: AppMenuOrder){\n  node(id:$gid){\n    ... on App{\n      id\n      menus(first:$first,where:$where,orderBy:$orderBy){\n        totalCount,\n        edges{\n          cursor,node{\n            id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route\n            action{ id,name }\n          }\n        }\n      }\n    }\n  }\n}": types.AppMenuListDocument,
    "mutation updateAppMenu($menuId:ID!,$input: UpdateAppMenuInput!){\n  action:updateAppMenu(menuID:$menuId,input:$input){id}\n}": types.UpdateAppMenuDocument,
    "mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){\n  action:createAppMenus(appID:$appId,input:$input){id}\n}": types.CreateAppMenuDocument,
    "mutation delAppMenu($menuId:ID!){\n  action:deleteAppMenu(menuID: $menuId)\n}": types.DelAppMenuDocument,
    "mutation moveAppMenu($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  action:moveAppMenu(sourceID:$sourceId,targetID:$targetId,action:$action)\n}": types.MoveAppMenuDocument,
    "query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n            domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.AppOrgListDocument,
    "query appRoleAssignedToOrgList($appRoleId:ID!,$where: OrgWhereInput){\n  list:appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}": types.AppRoleAssignedToOrgListDocument,
    "query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){\n  list:appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}": types.AppPolicyAssignedToOrgListDocument,
    "query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){\n  list:appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)\n  }\n}": types.AppPolicyAssignedToOrgListAndIsGrantDocument,
    "query appPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n      }\n    }\n  }\n}": types.AppPolicieListDocument,
    "query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n        isGrantAppRole(appRoleID: $appRoleId)\n      }\n    }\n  }\n}": types.AppPolicieListAndIsGrantDocument,
    "query appPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n    }\n  }\n}": types.AppPolicyInfoDocument,
    "mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!){\n  action:createAppPolicy(appID:$appId,input:$input){id}\n}": types.CreateAppPolicyDocument,
    "mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){\n  action:updateAppPolicy(policyID:$appPolicyId,input:$input){id}\n}": types.UpdateAppPolicyDocument,
    "mutation delAppPolicy($appPolicyId:ID!){\n  action:deleteAppPolicy(policyID: $appPolicyId)\n}": types.DelAppPolicyDocument,
    "query appResList($gid: GID!,$first: Int,$orderBy:AppResOrder,$where:AppResWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:resources(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n          }\n        }\n      }\n    }\n  }\n}": types.AppResListDocument,
    "query appResInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRes{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n    }\n  }\n}": types.AppResInfoDocument,
    "mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){\n  action:updateAppRes(appResID:$appResId,input:$input){id}\n}": types.UpdateAppResDocument,
    "query appRoleList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:roles{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      }\n    }\n  }\n}": types.AppRoleListDocument,
    "query appRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      app{ id,name,code }\n    }\n  }\n}": types.AppRoleInfoDocument,
    "query appRoleInfoPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on AppRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      app{ id,name,code }\n      policies{\n        id,appID,name,comments,autoGrant,status,\n        rules{ effect,actions,resources,conditions }\n      }\n    }\n  }\n}": types.AppRoleInfoPolicieListDocument,
    "mutation createAppRole($appId:ID!,$input: CreateAppRoleInput!){\n  action:createAppRole(appID:$appId,input:$input){id}\n}": types.CreateAppRoleDocument,
    "mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){\n  action:updateAppRole(roleID:$appRoleId,input:$input){id}\n}": types.UpdateAppRoleDocument,
    "mutation delAppRole($appRoleId:ID!){\n  action:deleteAppRole(roleID: $appRoleId)\n}": types.DelAppRoleDocument,
    "mutation assignAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  action:assignAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}": types.AssignAppRolePolicyDocument,
    "mutation revokeAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  action:revokeAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}": types.RevokeAppRolePolicyDocument,
    "query globalID($type:String!,$id:ID!){\n  globalID(type:$type,id:$id)\n}": types.GlobalIdDocument,
    "query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      list:apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,redirectURI,appKey,appSecret,scopes,\n            tokenValidity,refreshTokenValidity,logo,comments,status,createdAt\n          }\n        }\n      }\n    }\n  }\n}": types.OrgAppListDocument,
    "mutation assignOrgApp($orgId:ID!,$appId:ID!){\n  action:assignOrganizationApp(orgID: $orgId,appID: $appId)\n}": types.AssignOrgAppDocument,
    "mutation revokeOrgApp($orgId:ID!,$appId:ID!){\n  action:revokeOrganizationApp(orgID: $orgId,appID: $appId)\n}": types.RevokeOrgAppDocument,
    "query orgAppActionList($appCode:String!){\n  list:orgAppActions(appCode: $appCode){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}": types.OrgAppActionListDocument,
    "query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  list:organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n        domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n        owner { id,displayName }\n      }\n    }\n  }\n}": types.OrgListDocument,
    "query orgInfo($gid:GID!){\n  node(id: $gid){\n    ... on Org{\n      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n      domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n      owner { id,displayName }\n    }\n  }\n}": types.OrgInfoDocument,
    "mutation createRootOrg($input: CreateOrgInput!){\n  action:createRoot(input:$input){id}\n}": types.CreateRootOrgDocument,
    "mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){\n  action:updateOrganization(orgID:$orgId,input:$input){id}\n}": types.UpdateOrgDocument,
    "mutation createOrg($input: CreateOrgInput!){\n  action:createOrganization(input:$input){id}\n}": types.CreateOrgDocument,
    "mutation enableDirectory($input: EnableDirectoryInput!){\n  action:enableDirectory(input:$input){id}\n}": types.EnableDirectoryDocument,
    "mutation delOrg($orgId:ID!){\n  action:deleteOrganization(orgID: $orgId)\n}": types.DelOrgDocument,
    "mutation moveOrg($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  action:moveOrganization(sourceID:$sourceId,targetId:$targetId,action:$action)\n}": types.MoveOrgDocument,
    "query orgPolicyList($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPolicyListDocument,
    "query orgPolicyListNum($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){ totalCount }\n    }\n  }\n}": types.OrgPolicyListNumDocument,
    "query orgPolicyListAndIsGrantUser($gid: GID!,$userId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantUser(userID: $userId)\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPolicyListAndIsGrantUserDocument,
    "query orgPolicyListAndIsGrantRole($gid: GID!,$roleId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantRole(roleID: $roleId)\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPolicyListAndIsGrantRoleDocument,
    "query orgPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments,\n      rules{ effect,actions,resources,conditions }\n    }\n  }\n}": types.OrgPolicyInfoDocument,
    "mutation createOrgPolicy($input: CreateOrgPolicyInput!){\n  action:createOrganizationPolicy(input:$input){id}\n}": types.CreateOrgPolicyDocument,
    "mutation updateOrgPolicy($orgPolicyId:ID!,$input: UpdateOrgPolicyInput!){\n  action:updateOrganizationPolicy(orgPolicyID:$orgPolicyId,input:$input){id}\n}": types.UpdateOrgPolicyDocument,
    "mutation deleteOrgPolicy($orgPolicyId:ID!){\n  action:deleteOrganizationPolicy(orgPolicyID:$orgPolicyId)\n}": types.DeleteOrgPolicyDocument,
    "mutation assignOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  action:assignOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}": types.AssignOrgAppPolicyDocument,
    "mutation revokeOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  action:revokeOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}": types.RevokeOrgAppPolicyDocument,
    "query orgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}": types.OrgGroupListDocument,
    "query orgGroupListAndIsGrant($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}": types.OrgGroupListAndIsGrantDocument,
    "query userGroupList($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:userGroups(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}": types.UserGroupListDocument,
    "query orgRoleList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}": types.OrgRoleListDocument,
    "query orgRoleListAndIsGrant($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}": types.OrgRoleListAndIsGrantDocument,
    "query orgRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n    }\n  }\n}": types.OrgRoleInfoDocument,
    "mutation createOrgRole($input: CreateOrgRoleInput!){\n  action:createRole(input:$input){id}\n}": types.CreateOrgRoleDocument,
    "mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){\n  action:updateRole(roleID:$orgRoleId,input:$input){id}\n}": types.UpdateOrgRoleDocument,
    "mutation deleteOrgRole($orgRoleId:ID!){\n  action:deleteRole(roleID:$orgRoleId)\n}": types.DeleteOrgRoleDocument,
    "mutation assignOrgRoleUser($input: AssignRoleUserInput!){\n  action:assignRoleUser(input:$input)\n}": types.AssignOrgRoleUserDocument,
    "mutation revokeOrgRoleUser($orgRoleId:ID!,$userId:ID!){\n  action:revokeRoleUser(roleID:$orgRoleId,userID:$userId)\n}": types.RevokeOrgRoleUserDocument,
    "mutation assignOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  action:assignOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}": types.AssignOrgAppRoleDocument,
    "mutation revokeOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  action:revokeOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}": types.RevokeOrgAppRoleDocument,
    "query orgGroupListNum($where:OrgRoleWhereInput){\n  list:orgGroups(where: $where){ totalCount }\n}": types.OrgGroupListNumDocument,
    "query userGroupListNum($userId:ID!,$where:OrgRoleWhereInput){\n  list:userGroups(userID:$userId,where: $where){ totalCount }\n}": types.UserGroupListNumDocument,
    "query orgRoleListNum($where:OrgRoleWhereInput){\n  list:orgRoles(where: $where){ totalCount }\n}": types.OrgRoleListNumDocument,
    "query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      list:users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n          }\n        }\n      }\n    }\n  }\n}": types.OrgUserListDocument,
    "query orgUserListAndIsOrgRole($gid: GID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      list:users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n            isAssignOrgRole(orgRoleID: $orgRoleId)\n            isAllowRevokeRole(orgRoleID: $orgRoleId)\n          }\n        }\n      }\n    }\n  }\n}": types.OrgUserListAndIsOrgRoleDocument,
    "query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.OrgRoleUserListDocument,
    "query orgRoleUserListAndIsOrgRole($roleId: ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}": types.OrgRoleUserListAndIsOrgRoleDocument,
    "query orgUserNum($gid:GID!,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      list:users(where: $where){ totalCount }\n    }\n  }\n}": types.OrgUserNumDocument,
    "mutation allotOrgUser($input:CreateOrgUserInput!){\n  action:allotOrganizationUser(input:$input)\n}": types.AllotOrgUserDocument,
    "mutation removeOrgUser($orgId:ID!,$userId:ID!){\n  action:removeOrganizationUser(orgID: $orgId,userID: $userId)\n}": types.RemoveOrgUserDocument,
    "query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  list:orgPolicyReferences(policyID:$orgPolicyId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}": types.OrgPolicyReferencesDocument,
    "query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPrmissionListDocument,
    "query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on User{\n      list:permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.UserPrmissionListDocument,
    "query userExtendGroupPolicieList($userId: ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  list:userExtendGroupPolicies(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}": types.UserExtendGroupPolicieListDocument,
    "query permissionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Permission{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n      userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n      role{ id,orgID,kind,name,isAppRole }\n      orgPolicy{ id,orgID,appPolicyID,name }\n      user{ id,displayName }\n    }\n  }\n}": types.PermissionInfoDocument,
    "mutation createPermission($input: CreatePermissionInput!){\n  action:grant(input:$input){id}\n}": types.CreatePermissionDocument,
    "mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){\n  action:updatePermission(permissionID:$permissionId,input:$input){id}\n}": types.UpdatePermissionDocument,
    "mutation revoke($permissionId:ID!,$orgId:ID!){\n  action:revoke(permissionID:$permissionId,orgID:$orgId)\n}": types.RevokeDocument,
    "query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.UserListDocument,
    "query userInfo($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments\n    }\n  }\n}": types.UserInfoDocument,
    "query userInfoLoginProfile($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n    }\n  }\n}": types.UserInfoLoginProfileDocument,
    "query userInfoLoginProfileIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}": types.UserInfoLoginProfileIdentitiesDocument,
    "query userInfoIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}": types.UserInfoIdentitiesDocument,
    "mutation createUser($rootOrgID:ID!,$input: CreateUserInput!){\n  action:createOrganizationUser(rootOrgID:$rootOrgID,input:$input){ id }\n}": types.CreateUserDocument,
    "mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){\n  action:createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){ id }\n}": types.CreateAccountDocument,
    "mutation updateUser($userId:ID!,$input: UpdateUserInput!){\n  action:updateUser(userID:$userId,input:$input){ id,displayName }\n}": types.UpdateUserDocument,
    "mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){\n  action:updateLoginProfile(userID:$userId,input:$input){ id }\n}": types.UpdateUserLoginProfileDocument,
    "mutation bindUserIdentity($input: CreateUserIdentityInput!){\n  action:bindUserIdentity(input:$input){ id }\n}": types.BindUserIdentityDocument,
    "mutation deleteUserIdentity($identityId:ID!){\n  action:deleteUserIdentity(id:$identityId)\n}": types.DeleteUserIdentityDocument,
    "mutation deleteUser($userId:ID!){\n  action:deleteUser(userID:$userId)\n}": types.DeleteUserDocument,
    "mutation resetUserPasswordByEmail($userId:ID!){\n  action:resetUserPasswordByEmail(userId: $userId)\n}": types.ResetUserPasswordByEmailDocument,
    "mutation changePassword($oldPwd:String!,$newPwd:String!){\n  action:changePassword(oldPwd:$oldPwd,newPwd:$newPwd)\n}": types.ChangePasswordDocument,
    "mutation enableMfa($userId:ID!){\n  action:enableMFA(userID:$userId){secret,account}\n}": types.EnableMfaDocument,
    "mutation disableMfa($userId:ID!){\n  action:disableMFA(userID:$userId)\n}": types.DisableMfaDocument,
    "mutation sendMfaEmail($userId:ID!){\n  action:sendMFAToUserByEmail(userID:$userId)\n}": types.SendMfaEmailDocument,
    "query  checkPermission($permission:String!){\n  action:checkPermission(permission: $permission)\n}": types.CheckPermissionDocument,
    "query userPermissionList($where: AppActionWhereInput){\n  list:userPermissions(where: $where){\n    id,appID,name,kind,method\n  }\n}": types.UserPermissionListDocument,
    "query userMenuList($appCode:String!){\n  list:userMenus(appCode: $appCode){\n    id,parentID,kind,name,comments,displaySort,icon,route\n  }\n}": types.UserMenuListDocument,
    "query userRootOrgs{\n  list:userRootOrgs{\n    id,parentID,kind,domain,code,name,status,path,displaySort,countryCode,timezone\n  }\n}": types.UserRootOrgsDocument,
    "query orgRecycleUsers($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:orgRecycleUsers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.OrgRecycleUsersDocument,
    "mutation recoverOrgUser($userId:ID!,$setKind:UserLoginProfileSetKind!,$userInput: UpdateUserInput!,$pwdInput: CreateUserPasswordInput){\n  action:recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, pwdInput: $pwdInput ){ id }\n}": types.RecoverOrgUserDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appActionList($gid: GID!,$first: Int,$orderBy:AppActionOrder,$where:AppActionWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:actions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appActionList($gid: GID!,$first: Int,$orderBy:AppActionOrder,$where:AppActionWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:actions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query AppActionInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppAction{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n    }\n  }\n}"): (typeof documents)["query AppActionInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppAction{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppAction($appId:ID!,$input: [CreateAppActionInput!]){\n  action:createAppActions(appID:$appId,input:$input){id}\n}"): (typeof documents)["mutation createAppAction($appId:ID!,$input: [CreateAppActionInput!]){\n  action:createAppActions(appID:$appId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){\n  action:updateAppAction(actionID:$appActionId,input:$input){id}\n}"): (typeof documents)["mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){\n  action:updateAppAction(actionID:$appActionId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppAction($appActionId:ID!){\n  action:deleteAppAction(actionID: $appActionId)\n}"): (typeof documents)["mutation delAppAction($appActionId:ID!){\n  action:deleteAppAction(actionID: $appActionId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  list:apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logo,comments,status,createdAt\n      }\n    }\n  }\n}"): (typeof documents)["query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  list:apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logo,comments,status,createdAt\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appInfo($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n      refreshTokenValidity,logo,comments,status,createdAt\n    }\n  }\n}"): (typeof documents)["query appInfo($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n      refreshTokenValidity,logo,comments,status,createdAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateApp($appId:ID!,$input: UpdateAppInput!){\n  action:updateApp(appID:$appId,input:$input){id}\n}"): (typeof documents)["mutation updateApp($appId:ID!,$input: UpdateAppInput!){\n  action:updateApp(appID:$appId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createApp($input: CreateAppInput!){\n  action:createApp(input:$input){ id }\n}"): (typeof documents)["mutation createApp($input: CreateAppInput!){\n  action:createApp(input:$input){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delApp($appId:ID!){\n  action:deleteApp(appID: $appId)\n}"): (typeof documents)["mutation delApp($appId:ID!){\n  action:deleteApp(appID: $appId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appMenuList($gid:GID!,$first: Int,$where: AppMenuWhereInput,$orderBy: AppMenuOrder){\n  node(id:$gid){\n    ... on App{\n      id\n      menus(first:$first,where:$where,orderBy:$orderBy){\n        totalCount,\n        edges{\n          cursor,node{\n            id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route\n            action{ id,name }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appMenuList($gid:GID!,$first: Int,$where: AppMenuWhereInput,$orderBy: AppMenuOrder){\n  node(id:$gid){\n    ... on App{\n      id\n      menus(first:$first,where:$where,orderBy:$orderBy){\n        totalCount,\n        edges{\n          cursor,node{\n            id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route\n            action{ id,name }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppMenu($menuId:ID!,$input: UpdateAppMenuInput!){\n  action:updateAppMenu(menuID:$menuId,input:$input){id}\n}"): (typeof documents)["mutation updateAppMenu($menuId:ID!,$input: UpdateAppMenuInput!){\n  action:updateAppMenu(menuID:$menuId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){\n  action:createAppMenus(appID:$appId,input:$input){id}\n}"): (typeof documents)["mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){\n  action:createAppMenus(appID:$appId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppMenu($menuId:ID!){\n  action:deleteAppMenu(menuID: $menuId)\n}"): (typeof documents)["mutation delAppMenu($menuId:ID!){\n  action:deleteAppMenu(menuID: $menuId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation moveAppMenu($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  action:moveAppMenu(sourceID:$sourceId,targetID:$targetId,action:$action)\n}"): (typeof documents)["mutation moveAppMenu($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  action:moveAppMenu(sourceID:$sourceId,targetID:$targetId,action:$action)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n            domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n            domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appRoleAssignedToOrgList($appRoleId:ID!,$where: OrgWhereInput){\n  list:appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}"): (typeof documents)["query appRoleAssignedToOrgList($appRoleId:ID!,$where: OrgWhereInput){\n  list:appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){\n  list:appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}"): (typeof documents)["query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){\n  list:appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){\n  list:appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)\n  }\n}"): (typeof documents)["query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){\n  list:appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n      }\n    }\n  }\n}"): (typeof documents)["query appPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n        isGrantAppRole(appRoleID: $appRoleId)\n      }\n    }\n  }\n}"): (typeof documents)["query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n        isGrantAppRole(appRoleID: $appRoleId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n    }\n  }\n}"): (typeof documents)["query appPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!){\n  action:createAppPolicy(appID:$appId,input:$input){id}\n}"): (typeof documents)["mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!){\n  action:createAppPolicy(appID:$appId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){\n  action:updateAppPolicy(policyID:$appPolicyId,input:$input){id}\n}"): (typeof documents)["mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){\n  action:updateAppPolicy(policyID:$appPolicyId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppPolicy($appPolicyId:ID!){\n  action:deleteAppPolicy(policyID: $appPolicyId)\n}"): (typeof documents)["mutation delAppPolicy($appPolicyId:ID!){\n  action:deleteAppPolicy(policyID: $appPolicyId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appResList($gid: GID!,$first: Int,$orderBy:AppResOrder,$where:AppResWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:resources(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appResList($gid: GID!,$first: Int,$orderBy:AppResOrder,$where:AppResWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:resources(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appResInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRes{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n    }\n  }\n}"): (typeof documents)["query appResInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRes{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){\n  action:updateAppRes(appResID:$appResId,input:$input){id}\n}"): (typeof documents)["mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){\n  action:updateAppRes(appResID:$appResId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appRoleList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:roles{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      }\n    }\n  }\n}"): (typeof documents)["query appRoleList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      list:roles{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      app{ id,name,code }\n    }\n  }\n}"): (typeof documents)["query appRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      app{ id,name,code }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appRoleInfoPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on AppRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      app{ id,name,code }\n      policies{\n        id,appID,name,comments,autoGrant,status,\n        rules{ effect,actions,resources,conditions }\n      }\n    }\n  }\n}"): (typeof documents)["query appRoleInfoPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on AppRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      app{ id,name,code }\n      policies{\n        id,appID,name,comments,autoGrant,status,\n        rules{ effect,actions,resources,conditions }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppRole($appId:ID!,$input: CreateAppRoleInput!){\n  action:createAppRole(appID:$appId,input:$input){id}\n}"): (typeof documents)["mutation createAppRole($appId:ID!,$input: CreateAppRoleInput!){\n  action:createAppRole(appID:$appId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){\n  action:updateAppRole(roleID:$appRoleId,input:$input){id}\n}"): (typeof documents)["mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){\n  action:updateAppRole(roleID:$appRoleId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppRole($appRoleId:ID!){\n  action:deleteAppRole(roleID: $appRoleId)\n}"): (typeof documents)["mutation delAppRole($appRoleId:ID!){\n  action:deleteAppRole(roleID: $appRoleId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  action:assignAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}"): (typeof documents)["mutation assignAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  action:assignAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revokeAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  action:revokeAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}"): (typeof documents)["mutation revokeAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  action:revokeAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query globalID($type:String!,$id:ID!){\n  globalID(type:$type,id:$id)\n}"): (typeof documents)["query globalID($type:String!,$id:ID!){\n  globalID(type:$type,id:$id)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      list:apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,redirectURI,appKey,appSecret,scopes,\n            tokenValidity,refreshTokenValidity,logo,comments,status,createdAt\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      list:apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,redirectURI,appKey,appSecret,scopes,\n            tokenValidity,refreshTokenValidity,logo,comments,status,createdAt\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignOrgApp($orgId:ID!,$appId:ID!){\n  action:assignOrganizationApp(orgID: $orgId,appID: $appId)\n}"): (typeof documents)["mutation assignOrgApp($orgId:ID!,$appId:ID!){\n  action:assignOrganizationApp(orgID: $orgId,appID: $appId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revokeOrgApp($orgId:ID!,$appId:ID!){\n  action:revokeOrganizationApp(orgID: $orgId,appID: $appId)\n}"): (typeof documents)["mutation revokeOrgApp($orgId:ID!,$appId:ID!){\n  action:revokeOrganizationApp(orgID: $orgId,appID: $appId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgAppActionList($appCode:String!){\n  list:orgAppActions(appCode: $appCode){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}"): (typeof documents)["query orgAppActionList($appCode:String!){\n  list:orgAppActions(appCode: $appCode){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  list:organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n        domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n        owner { id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  list:organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n        domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n        owner { id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgInfo($gid:GID!){\n  node(id: $gid){\n    ... on Org{\n      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n      domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n      owner { id,displayName }\n    }\n  }\n}"): (typeof documents)["query orgInfo($gid:GID!){\n  node(id: $gid){\n    ... on Org{\n      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n      domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n      owner { id,displayName }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createRootOrg($input: CreateOrgInput!){\n  action:createRoot(input:$input){id}\n}"): (typeof documents)["mutation createRootOrg($input: CreateOrgInput!){\n  action:createRoot(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){\n  action:updateOrganization(orgID:$orgId,input:$input){id}\n}"): (typeof documents)["mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){\n  action:updateOrganization(orgID:$orgId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createOrg($input: CreateOrgInput!){\n  action:createOrganization(input:$input){id}\n}"): (typeof documents)["mutation createOrg($input: CreateOrgInput!){\n  action:createOrganization(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation enableDirectory($input: EnableDirectoryInput!){\n  action:enableDirectory(input:$input){id}\n}"): (typeof documents)["mutation enableDirectory($input: EnableDirectoryInput!){\n  action:enableDirectory(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delOrg($orgId:ID!){\n  action:deleteOrganization(orgID: $orgId)\n}"): (typeof documents)["mutation delOrg($orgId:ID!){\n  action:deleteOrganization(orgID: $orgId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation moveOrg($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  action:moveOrganization(sourceID:$sourceId,targetId:$targetId,action:$action)\n}"): (typeof documents)["mutation moveOrg($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  action:moveOrganization(sourceID:$sourceId,targetId:$targetId,action:$action)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyList($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPolicyList($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyListNum($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){ totalCount }\n    }\n  }\n}"): (typeof documents)["query orgPolicyListNum($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){ totalCount }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyListAndIsGrantUser($gid: GID!,$userId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantUser(userID: $userId)\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPolicyListAndIsGrantUser($gid: GID!,$userId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantUser(userID: $userId)\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyListAndIsGrantRole($gid: GID!,$roleId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantRole(roleID: $roleId)\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPolicyListAndIsGrantRole($gid: GID!,$roleId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantRole(roleID: $roleId)\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments,\n      rules{ effect,actions,resources,conditions }\n    }\n  }\n}"): (typeof documents)["query orgPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments,\n      rules{ effect,actions,resources,conditions }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createOrgPolicy($input: CreateOrgPolicyInput!){\n  action:createOrganizationPolicy(input:$input){id}\n}"): (typeof documents)["mutation createOrgPolicy($input: CreateOrgPolicyInput!){\n  action:createOrganizationPolicy(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateOrgPolicy($orgPolicyId:ID!,$input: UpdateOrgPolicyInput!){\n  action:updateOrganizationPolicy(orgPolicyID:$orgPolicyId,input:$input){id}\n}"): (typeof documents)["mutation updateOrgPolicy($orgPolicyId:ID!,$input: UpdateOrgPolicyInput!){\n  action:updateOrganizationPolicy(orgPolicyID:$orgPolicyId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteOrgPolicy($orgPolicyId:ID!){\n  action:deleteOrganizationPolicy(orgPolicyID:$orgPolicyId)\n}"): (typeof documents)["mutation deleteOrgPolicy($orgPolicyId:ID!){\n  action:deleteOrganizationPolicy(orgPolicyID:$orgPolicyId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  action:assignOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}"): (typeof documents)["mutation assignOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  action:assignOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revokeOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  action:revokeOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}"): (typeof documents)["mutation revokeOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  action:revokeOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"): (typeof documents)["query orgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgGroupListAndIsGrant($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}"): (typeof documents)["query orgGroupListAndIsGrant($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userGroupList($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:userGroups(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"): (typeof documents)["query userGroupList($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:userGroups(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleListAndIsGrant($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleListAndIsGrant($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  list:orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n    }\n  }\n}"): (typeof documents)["query orgRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createOrgRole($input: CreateOrgRoleInput!){\n  action:createRole(input:$input){id}\n}"): (typeof documents)["mutation createOrgRole($input: CreateOrgRoleInput!){\n  action:createRole(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){\n  action:updateRole(roleID:$orgRoleId,input:$input){id}\n}"): (typeof documents)["mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){\n  action:updateRole(roleID:$orgRoleId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteOrgRole($orgRoleId:ID!){\n  action:deleteRole(roleID:$orgRoleId)\n}"): (typeof documents)["mutation deleteOrgRole($orgRoleId:ID!){\n  action:deleteRole(roleID:$orgRoleId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignOrgRoleUser($input: AssignRoleUserInput!){\n  action:assignRoleUser(input:$input)\n}"): (typeof documents)["mutation assignOrgRoleUser($input: AssignRoleUserInput!){\n  action:assignRoleUser(input:$input)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revokeOrgRoleUser($orgRoleId:ID!,$userId:ID!){\n  action:revokeRoleUser(roleID:$orgRoleId,userID:$userId)\n}"): (typeof documents)["mutation revokeOrgRoleUser($orgRoleId:ID!,$userId:ID!){\n  action:revokeRoleUser(roleID:$orgRoleId,userID:$userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  action:assignOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}"): (typeof documents)["mutation assignOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  action:assignOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revokeOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  action:revokeOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}"): (typeof documents)["mutation revokeOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  action:revokeOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgGroupListNum($where:OrgRoleWhereInput){\n  list:orgGroups(where: $where){ totalCount }\n}"): (typeof documents)["query orgGroupListNum($where:OrgRoleWhereInput){\n  list:orgGroups(where: $where){ totalCount }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userGroupListNum($userId:ID!,$where:OrgRoleWhereInput){\n  list:userGroups(userID:$userId,where: $where){ totalCount }\n}"): (typeof documents)["query userGroupListNum($userId:ID!,$where:OrgRoleWhereInput){\n  list:userGroups(userID:$userId,where: $where){ totalCount }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleListNum($where:OrgRoleWhereInput){\n  list:orgRoles(where: $where){ totalCount }\n}"): (typeof documents)["query orgRoleListNum($where:OrgRoleWhereInput){\n  list:orgRoles(where: $where){ totalCount }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      list:users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      list:users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgUserListAndIsOrgRole($gid: GID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      list:users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n            isAssignOrgRole(orgRoleID: $orgRoleId)\n            isAllowRevokeRole(orgRoleID: $orgRoleId)\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgUserListAndIsOrgRole($gid: GID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      list:users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n            isAssignOrgRole(orgRoleID: $orgRoleId)\n            isAllowRevokeRole(orgRoleID: $orgRoleId)\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleUserListAndIsOrgRole($roleId: ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleUserListAndIsOrgRole($roleId: ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgUserNum($gid:GID!,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      list:users(where: $where){ totalCount }\n    }\n  }\n}"): (typeof documents)["query orgUserNum($gid:GID!,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      list:users(where: $where){ totalCount }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation allotOrgUser($input:CreateOrgUserInput!){\n  action:allotOrganizationUser(input:$input)\n}"): (typeof documents)["mutation allotOrgUser($input:CreateOrgUserInput!){\n  action:allotOrganizationUser(input:$input)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation removeOrgUser($orgId:ID!,$userId:ID!){\n  action:removeOrganizationUser(orgID: $orgId,userID: $userId)\n}"): (typeof documents)["mutation removeOrgUser($orgId:ID!,$userId:ID!){\n  action:removeOrganizationUser(orgID: $orgId,userID: $userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  list:orgPolicyReferences(policyID:$orgPolicyId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  list:orgPolicyReferences(policyID:$orgPolicyId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on Org{\n      list:permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on User{\n      list:permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on User{\n      list:permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userExtendGroupPolicieList($userId: ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  list:userExtendGroupPolicies(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query userExtendGroupPolicieList($userId: ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  list:userExtendGroupPolicies(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query permissionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Permission{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n      userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n      role{ id,orgID,kind,name,isAppRole }\n      orgPolicy{ id,orgID,appPolicyID,name }\n      user{ id,displayName }\n    }\n  }\n}"): (typeof documents)["query permissionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Permission{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n      userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n      role{ id,orgID,kind,name,isAppRole }\n      orgPolicy{ id,orgID,appPolicyID,name }\n      user{ id,displayName }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createPermission($input: CreatePermissionInput!){\n  action:grant(input:$input){id}\n}"): (typeof documents)["mutation createPermission($input: CreatePermissionInput!){\n  action:grant(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){\n  action:updatePermission(permissionID:$permissionId,input:$input){id}\n}"): (typeof documents)["mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){\n  action:updatePermission(permissionID:$permissionId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revoke($permissionId:ID!,$orgId:ID!){\n  action:revoke(permissionID:$permissionId,orgID:$orgId)\n}"): (typeof documents)["mutation revoke($permissionId:ID!,$orgId:ID!){\n  action:revoke(permissionID:$permissionId,orgID:$orgId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"): (typeof documents)["query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfo($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments\n    }\n  }\n}"): (typeof documents)["query userInfo($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfoLoginProfile($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n    }\n  }\n}"): (typeof documents)["query userInfoLoginProfile($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfoLoginProfileIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"): (typeof documents)["query userInfoLoginProfileIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfoIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"): (typeof documents)["query userInfoIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createUser($rootOrgID:ID!,$input: CreateUserInput!){\n  action:createOrganizationUser(rootOrgID:$rootOrgID,input:$input){ id }\n}"): (typeof documents)["mutation createUser($rootOrgID:ID!,$input: CreateUserInput!){\n  action:createOrganizationUser(rootOrgID:$rootOrgID,input:$input){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){\n  action:createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){ id }\n}"): (typeof documents)["mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){\n  action:createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateUser($userId:ID!,$input: UpdateUserInput!){\n  action:updateUser(userID:$userId,input:$input){ id,displayName }\n}"): (typeof documents)["mutation updateUser($userId:ID!,$input: UpdateUserInput!){\n  action:updateUser(userID:$userId,input:$input){ id,displayName }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){\n  action:updateLoginProfile(userID:$userId,input:$input){ id }\n}"): (typeof documents)["mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){\n  action:updateLoginProfile(userID:$userId,input:$input){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation bindUserIdentity($input: CreateUserIdentityInput!){\n  action:bindUserIdentity(input:$input){ id }\n}"): (typeof documents)["mutation bindUserIdentity($input: CreateUserIdentityInput!){\n  action:bindUserIdentity(input:$input){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteUserIdentity($identityId:ID!){\n  action:deleteUserIdentity(id:$identityId)\n}"): (typeof documents)["mutation deleteUserIdentity($identityId:ID!){\n  action:deleteUserIdentity(id:$identityId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteUser($userId:ID!){\n  action:deleteUser(userID:$userId)\n}"): (typeof documents)["mutation deleteUser($userId:ID!){\n  action:deleteUser(userID:$userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation resetUserPasswordByEmail($userId:ID!){\n  action:resetUserPasswordByEmail(userId: $userId)\n}"): (typeof documents)["mutation resetUserPasswordByEmail($userId:ID!){\n  action:resetUserPasswordByEmail(userId: $userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation changePassword($oldPwd:String!,$newPwd:String!){\n  action:changePassword(oldPwd:$oldPwd,newPwd:$newPwd)\n}"): (typeof documents)["mutation changePassword($oldPwd:String!,$newPwd:String!){\n  action:changePassword(oldPwd:$oldPwd,newPwd:$newPwd)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation enableMfa($userId:ID!){\n  action:enableMFA(userID:$userId){secret,account}\n}"): (typeof documents)["mutation enableMfa($userId:ID!){\n  action:enableMFA(userID:$userId){secret,account}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation disableMfa($userId:ID!){\n  action:disableMFA(userID:$userId)\n}"): (typeof documents)["mutation disableMfa($userId:ID!){\n  action:disableMFA(userID:$userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation sendMfaEmail($userId:ID!){\n  action:sendMFAToUserByEmail(userID:$userId)\n}"): (typeof documents)["mutation sendMfaEmail($userId:ID!){\n  action:sendMFAToUserByEmail(userID:$userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query  checkPermission($permission:String!){\n  action:checkPermission(permission: $permission)\n}"): (typeof documents)["query  checkPermission($permission:String!){\n  action:checkPermission(permission: $permission)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userPermissionList($where: AppActionWhereInput){\n  list:userPermissions(where: $where){\n    id,appID,name,kind,method\n  }\n}"): (typeof documents)["query userPermissionList($where: AppActionWhereInput){\n  list:userPermissions(where: $where){\n    id,appID,name,kind,method\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userMenuList($appCode:String!){\n  list:userMenus(appCode: $appCode){\n    id,parentID,kind,name,comments,displaySort,icon,route\n  }\n}"): (typeof documents)["query userMenuList($appCode:String!){\n  list:userMenus(appCode: $appCode){\n    id,parentID,kind,name,comments,displaySort,icon,route\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userRootOrgs{\n  list:userRootOrgs{\n    id,parentID,kind,domain,code,name,status,path,displaySort,countryCode,timezone\n  }\n}"): (typeof documents)["query userRootOrgs{\n  list:userRootOrgs{\n    id,parentID,kind,domain,code,name,status,path,displaySort,countryCode,timezone\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRecycleUsers($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:orgRecycleUsers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"): (typeof documents)["query orgRecycleUsers($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  list:orgRecycleUsers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation recoverOrgUser($userId:ID!,$setKind:UserLoginProfileSetKind!,$userInput: UpdateUserInput!,$pwdInput: CreateUserPasswordInput){\n  action:recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, pwdInput: $pwdInput ){ id }\n}"): (typeof documents)["mutation recoverOrgUser($userId:ID!,$setKind:UserLoginProfileSetKind!,$userInput: UpdateUserInput!,$pwdInput: CreateUserPasswordInput){\n  action:recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, pwdInput: $pwdInput ){ id }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;