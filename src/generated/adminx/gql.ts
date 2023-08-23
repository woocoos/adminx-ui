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
    "query appActionList($gid: GID!,$first: Int,$orderBy:AppActionOrder,$where:AppActionWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      actions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n          }\n        }\n      }\n    }\n  }\n}": types.AppActionListDocument,
    "query AppActionInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppAction{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n    }\n  }\n}": types.AppActionInfoDocument,
    "mutation createAppAction($appId:ID!,$input: [CreateAppActionInput!]){\n  createAppActions(appID:$appId,input:$input){id}\n}": types.CreateAppActionDocument,
    "mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){\n  updateAppAction(actionID:$appActionId,input:$input){id}\n}": types.UpdateAppActionDocument,
    "mutation delAppAction($appActionId:ID!){\n  deleteAppAction(actionID: $appActionId)\n}": types.DelAppActionDocument,
    "query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logoFileID,comments,status,createdAt\n      }\n    }\n  }\n}": types.AppListDocument,
    "query appInfo($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n      refreshTokenValidity,logoFileID,comments,status,createdAt\n    }\n  }\n}": types.AppInfoDocument,
    "mutation updateApp($appId:ID!,$input: UpdateAppInput!){\n  updateApp(appID:$appId,input:$input){id}\n}": types.UpdateAppDocument,
    "mutation createApp($input: CreateAppInput!){\n  createApp(input:$input){ id }\n}": types.CreateAppDocument,
    "mutation delApp($appId:ID!){\n  deleteApp(appID: $appId)\n}": types.DelAppDocument,
    "query appMenuList($gid:GID!,$first: Int,$where: AppMenuWhereInput,$orderBy: AppMenuOrder){\n  node(id:$gid){\n    ... on App{\n      id\n      menus(first:$first,where:$where,orderBy:$orderBy){\n        totalCount,\n        edges{\n          cursor,node{\n            id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route\n            action{ id,name }\n          }\n        }\n      }\n    }\n  }\n}": types.AppMenuListDocument,
    "mutation updateAppMenu($menuId:ID!,$input: UpdateAppMenuInput!){\n  updateAppMenu(menuID:$menuId,input:$input){id}\n}": types.UpdateAppMenuDocument,
    "mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){\n  createAppMenus(appID:$appId,input:$input){id}\n}": types.CreateAppMenuDocument,
    "mutation delAppMenu($menuId:ID!){\n  deleteAppMenu(menuID: $menuId)\n}": types.DelAppMenuDocument,
    "mutation moveAppMenu($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveAppMenu(sourceID:$sourceId,targetID:$targetId,action:$action)\n}": types.MoveAppMenuDocument,
    "query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n            domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.AppOrgListDocument,
    "query appRoleAssignedToOrgList($appRoleId:ID!,$where: OrgWhereInput){\n  appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}": types.AppRoleAssignedToOrgListDocument,
    "query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}": types.AppPolicyAssignedToOrgListDocument,
    "query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)\n  }\n}": types.AppPolicyAssignedToOrgListAndIsGrantDocument,
    "query appPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n      }\n    }\n  }\n}": types.AppPolicieListDocument,
    "query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n        isGrantAppRole(appRoleID: $appRoleId)\n      }\n    }\n  }\n}": types.AppPolicieListAndIsGrantDocument,
    "query appPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n    }\n  }\n}": types.AppPolicyInfoDocument,
    "mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!){\n  createAppPolicy(appID:$appId,input:$input){id}\n}": types.CreateAppPolicyDocument,
    "mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){\n  updateAppPolicy(policyID:$appPolicyId,input:$input){id}\n}": types.UpdateAppPolicyDocument,
    "mutation delAppPolicy($appPolicyId:ID!){\n  deleteAppPolicy(policyID: $appPolicyId)\n}": types.DelAppPolicyDocument,
    "query appResList($gid: GID!,$first: Int,$orderBy:AppResOrder,$where:AppResWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      resources(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n          }\n        }\n      }\n    }\n  }\n}": types.AppResListDocument,
    "query appResInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRes{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n    }\n  }\n}": types.AppResInfoDocument,
    "mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){\n  updateAppRes(appResID:$appResId,input:$input){id}\n}": types.UpdateAppResDocument,
    "query appRoleList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      roles{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      }\n    }\n  }\n}": types.AppRoleListDocument,
    "query appRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      app{ id,name,code }\n    }\n  }\n}": types.AppRoleInfoDocument,
    "query appRoleInfoPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on AppRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      app{ id,name,code }\n      policies{\n        id,appID,name,comments,autoGrant,status,\n        rules{ effect,actions,resources,conditions }\n      }\n    }\n  }\n}": types.AppRoleInfoPolicieListDocument,
    "mutation createAppRole($appId:ID!,$input: CreateAppRoleInput!){\n  createAppRole(appID:$appId,input:$input){id}\n}": types.CreateAppRoleDocument,
    "mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){\n  updateAppRole(roleID:$appRoleId,input:$input){id}\n}": types.UpdateAppRoleDocument,
    "mutation delAppRole($appRoleId:ID!){\n  deleteAppRole(roleID: $appRoleId)\n}": types.DelAppRoleDocument,
    "mutation assignAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  assignAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}": types.AssignAppRolePolicyDocument,
    "mutation revokeAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  revokeAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}": types.RevokeAppRolePolicyDocument,
    "query fileSourceList($first: Int,$orderBy:FileSourceOrder,$where:FileSourceWhereInput){\n  fileSources(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n        bucket\n      }\n    }\n  }\n}": types.FileSourceListDocument,
    "query fileSourceInfo($gid:GID!){\n node(id:$gid){\n  ... on FileSource{\n      id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n      bucket\n    }\n  }\n}": types.FileSourceInfoDocument,
    "mutation createFileSource($input: CreateFileSourceInput!){\n  createFileSource(input:$input){id}\n}": types.CreateFileSourceDocument,
    "mutation updateFileSource($fsId:ID!,$input: UpdateFileSourceInput!){\n  updateFileSource(fsID:$fsId,input:$input){id}\n}": types.UpdateFileSourceDocument,
    "mutation deleteFileSource($fsId:ID!){\n  deleteFileSource(fsID: $fsId)\n}": types.DeleteFileSourceDocument,
    "query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,redirectURI,appKey,appSecret,scopes,\n            tokenValidity,refreshTokenValidity,logoFileID,comments,status,createdAt\n          }\n        }\n      }\n    }\n  }\n}": types.OrgAppListDocument,
    "mutation assignOrgApp($orgId:ID!,$appId:ID!){\n  assignOrganizationApp(orgID: $orgId,appID: $appId)\n}": types.AssignOrgAppDocument,
    "mutation revokeOrgApp($orgId:ID!,$appId:ID!){\n  revokeOrganizationApp(orgID: $orgId,appID: $appId)\n}": types.RevokeOrgAppDocument,
    "query orgAppActionList($appCode:String!){\n  orgAppActions(appCode: $appCode){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}": types.OrgAppActionListDocument,
    "query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n        domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n        owner { id,displayName }\n      }\n    }\n  }\n}": types.OrgListDocument,
    "query orgInfo($gid:GID!){\n  node(id: $gid){\n    ... on Org{\n      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n      domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n      owner { id,displayName }\n    }\n  }\n}": types.OrgInfoDocument,
    "mutation createRootOrg($input: CreateOrgInput!){\n  createRoot(input:$input){id}\n}": types.CreateRootOrgDocument,
    "mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){\n  updateOrganization(orgID:$orgId,input:$input){id}\n}": types.UpdateOrgDocument,
    "mutation createOrg($input: CreateOrgInput!){\n  createOrganization(input:$input){id}\n}": types.CreateOrgDocument,
    "mutation enableDirectory($input: EnableDirectoryInput!){\n  enableDirectory(input:$input){id}\n}": types.EnableDirectoryDocument,
    "mutation delOrg($orgId:ID!){\n  deleteOrganization(orgID: $orgId)\n}": types.DelOrgDocument,
    "mutation moveOrg($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveOrganization(sourceID:$sourceId,targetId:$targetId,action:$action)\n}": types.MoveOrgDocument,
    "query orgPolicyList($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPolicyListDocument,
    "query orgPolicyListNum($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){ totalCount }\n    }\n  }\n}": types.OrgPolicyListNumDocument,
    "query orgPolicyListAndIsGrantUser($gid: GID!,$userId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantUser(userID: $userId)\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPolicyListAndIsGrantUserDocument,
    "query orgPolicyListAndIsGrantRole($gid: GID!,$roleId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantRole(roleID: $roleId)\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPolicyListAndIsGrantRoleDocument,
    "query orgPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments,\n      rules{ effect,actions,resources,conditions }\n    }\n  }\n}": types.OrgPolicyInfoDocument,
    "mutation createOrgPolicy($input: CreateOrgPolicyInput!){\n  createOrganizationPolicy(input:$input){id}\n}": types.CreateOrgPolicyDocument,
    "mutation updateOrgPolicy($orgPolicyId:ID!,$input: UpdateOrgPolicyInput!){\n  updateOrganizationPolicy(orgPolicyID:$orgPolicyId,input:$input){id}\n}": types.UpdateOrgPolicyDocument,
    "mutation deleteOrgPolicy($orgPolicyId:ID!){\n  deleteOrganizationPolicy(orgPolicyID:$orgPolicyId)\n}": types.DeleteOrgPolicyDocument,
    "mutation assignOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  assignOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}": types.AssignOrgAppPolicyDocument,
    "mutation revokeOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  revokeOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}": types.RevokeOrgAppPolicyDocument,
    "query orgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}": types.OrgGroupListDocument,
    "query orgGroupListAndIsGrant($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}": types.OrgGroupListAndIsGrantDocument,
    "query userGroupList($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userGroups(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}": types.UserGroupListDocument,
    "query orgRoleList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}": types.OrgRoleListDocument,
    "query orgRoleListAndIsGrant($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}": types.OrgRoleListAndIsGrantDocument,
    "query orgRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n    }\n  }\n}": types.OrgRoleInfoDocument,
    "mutation createOrgRole($input: CreateOrgRoleInput!){\n  createRole(input:$input){id}\n}": types.CreateOrgRoleDocument,
    "mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){\n  updateRole(roleID:$orgRoleId,input:$input){id}\n}": types.UpdateOrgRoleDocument,
    "mutation deleteOrgRole($orgRoleId:ID!){\n  deleteRole(roleID:$orgRoleId)\n}": types.DeleteOrgRoleDocument,
    "mutation assignOrgRoleUser($input: AssignRoleUserInput!){\n  assignRoleUser(input:$input)\n}": types.AssignOrgRoleUserDocument,
    "mutation revokeOrgRoleUser($orgRoleId:ID!,$userId:ID!){\n  revokeRoleUser(roleID:$orgRoleId,userID:$userId)\n}": types.RevokeOrgRoleUserDocument,
    "mutation assignOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  assignOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}": types.AssignOrgAppRoleDocument,
    "mutation revokeOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  revokeOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}": types.RevokeOrgAppRoleDocument,
    "query orgGroupListNum($first:Int,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,where: $where){ totalCount }\n}": types.OrgGroupListNumDocument,
    "query userGroupListNum($userId:ID!,$first:Int,$where:OrgRoleWhereInput){\n  userGroups(userID:$userId,first:$first,where: $where){ totalCount }\n}": types.UserGroupListNumDocument,
    "query orgRoleListNum($first:Int,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,where: $where){ totalCount }\n}": types.OrgRoleListNumDocument,
    "query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n          }\n        }\n      }\n    }\n  }\n}": types.OrgUserListDocument,
    "query orgUserListAndIsOrgRole($gid: GID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n            isAssignOrgRole(orgRoleID: $orgRoleId)\n            isAllowRevokeRole(orgRoleID: $orgRoleId)\n          }\n        }\n      }\n    }\n  }\n}": types.OrgUserListAndIsOrgRoleDocument,
    "query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.OrgRoleUserListDocument,
    "query orgRoleUserListAndIsOrgRole($roleId: ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}": types.OrgRoleUserListAndIsOrgRoleDocument,
    "query orgUserNum($gid:GID!,$first: Int,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,where: $where){ totalCount }\n    }\n  }\n}": types.OrgUserNumDocument,
    "mutation allotOrgUser($input:CreateOrgUserInput!){\n  allotOrganizationUser(input:$input)\n}": types.AllotOrgUserDocument,
    "mutation removeOrgUser($orgId:ID!,$userId:ID!){\n  removeOrganizationUser(orgID: $orgId,userID: $userId)\n}": types.RemoveOrgUserDocument,
    "query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  orgPolicyReferences(policyID:$orgPolicyId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}": types.OrgPolicyReferencesDocument,
    "query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on Org{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPrmissionListDocument,
    "query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on User{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.UserPrmissionListDocument,
    "query userExtendGroupPolicieList($userId: ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  userExtendGroupPolicies(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}": types.UserExtendGroupPolicieListDocument,
    "query permissionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Permission{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n      userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n      role{ id,orgID,kind,name,isAppRole }\n      orgPolicy{ id,orgID,appPolicyID,name }\n      user{ id,displayName }\n    }\n  }\n}": types.PermissionInfoDocument,
    "mutation createPermission($input: CreatePermissionInput!){\n  grant(input:$input){id}\n}": types.CreatePermissionDocument,
    "mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){\n  updatePermission(permissionID:$permissionId,input:$input){id}\n}": types.UpdatePermissionDocument,
    "mutation revoke($permissionId:ID!,$orgId:ID!){\n  revoke(permissionID:$permissionId,orgID:$orgId)\n}": types.RevokeDocument,
    "query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.UserListDocument,
    "query userInfo($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID\n    }\n  }\n}": types.UserInfoDocument,
    "query userInfoLoginProfile($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n    }\n  }\n}": types.UserInfoLoginProfileDocument,
    "query userInfoLoginProfileIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}": types.UserInfoLoginProfileIdentitiesDocument,
    "query userInfoIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}": types.UserInfoIdentitiesDocument,
    "query userAccessKeyList($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,\n      oauthClients{\n        id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n      }\n    }\n  }\n}": types.UserAccessKeyListDocument,
    "mutation createUser($rootOrgID:ID!,$input: CreateUserInput!){\n  createOrganizationUser(rootOrgID:$rootOrgID,input:$input){ id }\n}": types.CreateUserDocument,
    "mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){\n  createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){ id }\n}": types.CreateAccountDocument,
    "mutation updateUser($userId:ID!,$input: UpdateUserInput!){\n  updateUser(userID:$userId,input:$input){ id,displayName }\n}": types.UpdateUserDocument,
    "mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){\n  updateLoginProfile(userID:$userId,input:$input){ id }\n}": types.UpdateUserLoginProfileDocument,
    "mutation bindUserIdentity($input: CreateUserIdentityInput!){\n  bindUserIdentity(input:$input){ id }\n}": types.BindUserIdentityDocument,
    "mutation deleteUserIdentity($identityId:ID!){\n  deleteUserIdentity(id:$identityId)\n}": types.DeleteUserIdentityDocument,
    "mutation deleteUser($userId:ID!){\n  deleteUser(userID:$userId)\n}": types.DeleteUserDocument,
    "mutation resetUserPasswordByEmail($userId:ID!){\n  resetUserPasswordByEmail(userId: $userId)\n}": types.ResetUserPasswordByEmailDocument,
    "mutation changePassword($oldPwd:String!,$newPwd:String!){\n  changePassword(oldPwd:$oldPwd,newPwd:$newPwd)\n}": types.ChangePasswordDocument,
    "mutation enableMfa($userId:ID!){\n  enableMFA(userID:$userId){secret,account}\n}": types.EnableMfaDocument,
    "mutation disableMfa($userId:ID!){\n  disableMFA(userID:$userId)\n}": types.DisableMfaDocument,
    "mutation sendMfaEmail($userId:ID!){\n  sendMFAToUserByEmail(userID:$userId)\n}": types.SendMfaEmailDocument,
    "query  checkPermission($permission:String!){\n  checkPermission(permission: $permission)\n}": types.CheckPermissionDocument,
    "query orgRecycleUsers($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRecycleUsers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.OrgRecycleUsersDocument,
    "mutation recoverOrgUser($userId:ID!,$setKind:UserLoginProfileSetKind!,$userInput: UpdateUserInput!,$pwdInput: CreateUserPasswordInput){\n  recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, pwdInput: $pwdInput ){ id }\n}": types.RecoverOrgUserDocument,
    "mutation createOauthClient($input: CreateOauthClientInput!){\n  createOauthClient( input: $input ){ id }\n}": types.CreateOauthClientDocument,
    "mutation enableOauthClient($id: ID!){\n  enableOauthClient( id: $id ){ id }\n}": types.EnableOauthClientDocument,
    "mutation disableOauthClient($id: ID!){\n  disableOauthClient( id: $id ){ id }\n}": types.DisableOauthClientDocument,
    "mutation delOauthClient($id: ID!){\n  deleteOauthClient( id: $id )\n}": types.DelOauthClientDocument,
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
export function gql(source: "query appActionList($gid: GID!,$first: Int,$orderBy:AppActionOrder,$where:AppActionWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      actions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appActionList($gid: GID!,$first: Int,$orderBy:AppActionOrder,$where:AppActionWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      actions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query AppActionInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppAction{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n    }\n  }\n}"): (typeof documents)["query AppActionInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppAction{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppAction($appId:ID!,$input: [CreateAppActionInput!]){\n  createAppActions(appID:$appId,input:$input){id}\n}"): (typeof documents)["mutation createAppAction($appId:ID!,$input: [CreateAppActionInput!]){\n  createAppActions(appID:$appId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){\n  updateAppAction(actionID:$appActionId,input:$input){id}\n}"): (typeof documents)["mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){\n  updateAppAction(actionID:$appActionId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppAction($appActionId:ID!){\n  deleteAppAction(actionID: $appActionId)\n}"): (typeof documents)["mutation delAppAction($appActionId:ID!){\n  deleteAppAction(actionID: $appActionId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logoFileID,comments,status,createdAt\n      }\n    }\n  }\n}"): (typeof documents)["query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logoFileID,comments,status,createdAt\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appInfo($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n      refreshTokenValidity,logoFileID,comments,status,createdAt\n    }\n  }\n}"): (typeof documents)["query appInfo($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n      refreshTokenValidity,logoFileID,comments,status,createdAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateApp($appId:ID!,$input: UpdateAppInput!){\n  updateApp(appID:$appId,input:$input){id}\n}"): (typeof documents)["mutation updateApp($appId:ID!,$input: UpdateAppInput!){\n  updateApp(appID:$appId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createApp($input: CreateAppInput!){\n  createApp(input:$input){ id }\n}"): (typeof documents)["mutation createApp($input: CreateAppInput!){\n  createApp(input:$input){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delApp($appId:ID!){\n  deleteApp(appID: $appId)\n}"): (typeof documents)["mutation delApp($appId:ID!){\n  deleteApp(appID: $appId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appMenuList($gid:GID!,$first: Int,$where: AppMenuWhereInput,$orderBy: AppMenuOrder){\n  node(id:$gid){\n    ... on App{\n      id\n      menus(first:$first,where:$where,orderBy:$orderBy){\n        totalCount,\n        edges{\n          cursor,node{\n            id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route\n            action{ id,name }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appMenuList($gid:GID!,$first: Int,$where: AppMenuWhereInput,$orderBy: AppMenuOrder){\n  node(id:$gid){\n    ... on App{\n      id\n      menus(first:$first,where:$where,orderBy:$orderBy){\n        totalCount,\n        edges{\n          cursor,node{\n            id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route\n            action{ id,name }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppMenu($menuId:ID!,$input: UpdateAppMenuInput!){\n  updateAppMenu(menuID:$menuId,input:$input){id}\n}"): (typeof documents)["mutation updateAppMenu($menuId:ID!,$input: UpdateAppMenuInput!){\n  updateAppMenu(menuID:$menuId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){\n  createAppMenus(appID:$appId,input:$input){id}\n}"): (typeof documents)["mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){\n  createAppMenus(appID:$appId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppMenu($menuId:ID!){\n  deleteAppMenu(menuID: $menuId)\n}"): (typeof documents)["mutation delAppMenu($menuId:ID!){\n  deleteAppMenu(menuID: $menuId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation moveAppMenu($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveAppMenu(sourceID:$sourceId,targetID:$targetId,action:$action)\n}"): (typeof documents)["mutation moveAppMenu($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveAppMenu(sourceID:$sourceId,targetID:$targetId,action:$action)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n            domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n            domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appRoleAssignedToOrgList($appRoleId:ID!,$where: OrgWhereInput){\n  appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}"): (typeof documents)["query appRoleAssignedToOrgList($appRoleId:ID!,$where: OrgWhereInput){\n  appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}"): (typeof documents)["query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)\n  }\n}"): (typeof documents)["query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n    owner { id,displayName }\n    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n      }\n    }\n  }\n}"): (typeof documents)["query appPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n        isGrantAppRole(appRoleID: $appRoleId)\n      }\n    }\n  }\n}"): (typeof documents)["query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status\n        isGrantAppRole(appRoleID: $appRoleId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n    }\n  }\n}"): (typeof documents)["query appPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!){\n  createAppPolicy(appID:$appId,input:$input){id}\n}"): (typeof documents)["mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!){\n  createAppPolicy(appID:$appId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){\n  updateAppPolicy(policyID:$appPolicyId,input:$input){id}\n}"): (typeof documents)["mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){\n  updateAppPolicy(policyID:$appPolicyId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppPolicy($appPolicyId:ID!){\n  deleteAppPolicy(policyID: $appPolicyId)\n}"): (typeof documents)["mutation delAppPolicy($appPolicyId:ID!){\n  deleteAppPolicy(policyID: $appPolicyId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appResList($gid: GID!,$first: Int,$orderBy:AppResOrder,$where:AppResWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      resources(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appResList($gid: GID!,$first: Int,$orderBy:AppResOrder,$where:AppResWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      resources(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appResInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRes{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n    }\n  }\n}"): (typeof documents)["query appResInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRes{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){\n  updateAppRes(appResID:$appResId,input:$input){id}\n}"): (typeof documents)["mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){\n  updateAppRes(appResID:$appResId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appRoleList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      roles{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      }\n    }\n  }\n}"): (typeof documents)["query appRoleList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      roles{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      }\n    }\n  }\n}"];
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
export function gql(source: "mutation createAppRole($appId:ID!,$input: CreateAppRoleInput!){\n  createAppRole(appID:$appId,input:$input){id}\n}"): (typeof documents)["mutation createAppRole($appId:ID!,$input: CreateAppRoleInput!){\n  createAppRole(appID:$appId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){\n  updateAppRole(roleID:$appRoleId,input:$input){id}\n}"): (typeof documents)["mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){\n  updateAppRole(roleID:$appRoleId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppRole($appRoleId:ID!){\n  deleteAppRole(roleID: $appRoleId)\n}"): (typeof documents)["mutation delAppRole($appRoleId:ID!){\n  deleteAppRole(roleID: $appRoleId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  assignAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}"): (typeof documents)["mutation assignAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  assignAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revokeAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  revokeAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}"): (typeof documents)["mutation revokeAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  revokeAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query fileSourceList($first: Int,$orderBy:FileSourceOrder,$where:FileSourceWhereInput){\n  fileSources(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n        bucket\n      }\n    }\n  }\n}"): (typeof documents)["query fileSourceList($first: Int,$orderBy:FileSourceOrder,$where:FileSourceWhereInput){\n  fileSources(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n        bucket\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query fileSourceInfo($gid:GID!){\n node(id:$gid){\n  ... on FileSource{\n      id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n      bucket\n    }\n  }\n}"): (typeof documents)["query fileSourceInfo($gid:GID!){\n node(id:$gid){\n  ... on FileSource{\n      id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n      bucket\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createFileSource($input: CreateFileSourceInput!){\n  createFileSource(input:$input){id}\n}"): (typeof documents)["mutation createFileSource($input: CreateFileSourceInput!){\n  createFileSource(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateFileSource($fsId:ID!,$input: UpdateFileSourceInput!){\n  updateFileSource(fsID:$fsId,input:$input){id}\n}"): (typeof documents)["mutation updateFileSource($fsId:ID!,$input: UpdateFileSourceInput!){\n  updateFileSource(fsID:$fsId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteFileSource($fsId:ID!){\n  deleteFileSource(fsID: $fsId)\n}"): (typeof documents)["mutation deleteFileSource($fsId:ID!){\n  deleteFileSource(fsID: $fsId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,redirectURI,appKey,appSecret,scopes,\n            tokenValidity,refreshTokenValidity,logoFileID,comments,status,createdAt\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,redirectURI,appKey,appSecret,scopes,\n            tokenValidity,refreshTokenValidity,logoFileID,comments,status,createdAt\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignOrgApp($orgId:ID!,$appId:ID!){\n  assignOrganizationApp(orgID: $orgId,appID: $appId)\n}"): (typeof documents)["mutation assignOrgApp($orgId:ID!,$appId:ID!){\n  assignOrganizationApp(orgID: $orgId,appID: $appId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revokeOrgApp($orgId:ID!,$appId:ID!){\n  revokeOrganizationApp(orgID: $orgId,appID: $appId)\n}"): (typeof documents)["mutation revokeOrgApp($orgId:ID!,$appId:ID!){\n  revokeOrganizationApp(orgID: $orgId,appID: $appId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgAppActionList($appCode:String!){\n  orgAppActions(appCode: $appCode){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}"): (typeof documents)["query orgAppActionList($appCode:String!){\n  orgAppActions(appCode: $appCode){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n        domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n        owner { id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n        domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n        owner { id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgInfo($gid:GID!){\n  node(id: $gid){\n    ... on Org{\n      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n      domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n      owner { id,displayName }\n    }\n  }\n}"): (typeof documents)["query orgInfo($gid:GID!){\n  node(id: $gid){\n    ... on Org{\n      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n      domain,code,name,profile,status,path,displaySort,countryCode,timezone,\n      owner { id,displayName }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createRootOrg($input: CreateOrgInput!){\n  createRoot(input:$input){id}\n}"): (typeof documents)["mutation createRootOrg($input: CreateOrgInput!){\n  createRoot(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){\n  updateOrganization(orgID:$orgId,input:$input){id}\n}"): (typeof documents)["mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){\n  updateOrganization(orgID:$orgId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createOrg($input: CreateOrgInput!){\n  createOrganization(input:$input){id}\n}"): (typeof documents)["mutation createOrg($input: CreateOrgInput!){\n  createOrganization(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation enableDirectory($input: EnableDirectoryInput!){\n  enableDirectory(input:$input){id}\n}"): (typeof documents)["mutation enableDirectory($input: EnableDirectoryInput!){\n  enableDirectory(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delOrg($orgId:ID!){\n  deleteOrganization(orgID: $orgId)\n}"): (typeof documents)["mutation delOrg($orgId:ID!){\n  deleteOrganization(orgID: $orgId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation moveOrg($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveOrganization(sourceID:$sourceId,targetId:$targetId,action:$action)\n}"): (typeof documents)["mutation moveOrg($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveOrganization(sourceID:$sourceId,targetId:$targetId,action:$action)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyList($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPolicyList($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyListNum($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){ totalCount }\n    }\n  }\n}"): (typeof documents)["query orgPolicyListNum($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){ totalCount }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyListAndIsGrantUser($gid: GID!,$userId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantUser(userID: $userId)\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPolicyListAndIsGrantUser($gid: GID!,$userId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantUser(userID: $userId)\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyListAndIsGrantRole($gid: GID!,$roleId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantRole(roleID: $roleId)\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPolicyListAndIsGrantRole($gid: GID!,$roleId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantRole(roleID: $roleId)\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments,\n      rules{ effect,actions,resources,conditions }\n    }\n  }\n}"): (typeof documents)["query orgPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments,\n      rules{ effect,actions,resources,conditions }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createOrgPolicy($input: CreateOrgPolicyInput!){\n  createOrganizationPolicy(input:$input){id}\n}"): (typeof documents)["mutation createOrgPolicy($input: CreateOrgPolicyInput!){\n  createOrganizationPolicy(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateOrgPolicy($orgPolicyId:ID!,$input: UpdateOrgPolicyInput!){\n  updateOrganizationPolicy(orgPolicyID:$orgPolicyId,input:$input){id}\n}"): (typeof documents)["mutation updateOrgPolicy($orgPolicyId:ID!,$input: UpdateOrgPolicyInput!){\n  updateOrganizationPolicy(orgPolicyID:$orgPolicyId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteOrgPolicy($orgPolicyId:ID!){\n  deleteOrganizationPolicy(orgPolicyID:$orgPolicyId)\n}"): (typeof documents)["mutation deleteOrgPolicy($orgPolicyId:ID!){\n  deleteOrganizationPolicy(orgPolicyID:$orgPolicyId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  assignOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}"): (typeof documents)["mutation assignOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  assignOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revokeOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  revokeOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}"): (typeof documents)["mutation revokeOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  revokeOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"): (typeof documents)["query orgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgGroupListAndIsGrant($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}"): (typeof documents)["query orgGroupListAndIsGrant($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userGroupList($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userGroups(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"): (typeof documents)["query userGroupList($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userGroups(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleListAndIsGrant($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleListAndIsGrant($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n    }\n  }\n}"): (typeof documents)["query orgRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createOrgRole($input: CreateOrgRoleInput!){\n  createRole(input:$input){id}\n}"): (typeof documents)["mutation createOrgRole($input: CreateOrgRoleInput!){\n  createRole(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){\n  updateRole(roleID:$orgRoleId,input:$input){id}\n}"): (typeof documents)["mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){\n  updateRole(roleID:$orgRoleId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteOrgRole($orgRoleId:ID!){\n  deleteRole(roleID:$orgRoleId)\n}"): (typeof documents)["mutation deleteOrgRole($orgRoleId:ID!){\n  deleteRole(roleID:$orgRoleId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignOrgRoleUser($input: AssignRoleUserInput!){\n  assignRoleUser(input:$input)\n}"): (typeof documents)["mutation assignOrgRoleUser($input: AssignRoleUserInput!){\n  assignRoleUser(input:$input)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revokeOrgRoleUser($orgRoleId:ID!,$userId:ID!){\n  revokeRoleUser(roleID:$orgRoleId,userID:$userId)\n}"): (typeof documents)["mutation revokeOrgRoleUser($orgRoleId:ID!,$userId:ID!){\n  revokeRoleUser(roleID:$orgRoleId,userID:$userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  assignOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}"): (typeof documents)["mutation assignOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  assignOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revokeOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  revokeOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}"): (typeof documents)["mutation revokeOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  revokeOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgGroupListNum($first:Int,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,where: $where){ totalCount }\n}"): (typeof documents)["query orgGroupListNum($first:Int,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,where: $where){ totalCount }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userGroupListNum($userId:ID!,$first:Int,$where:OrgRoleWhereInput){\n  userGroups(userID:$userId,first:$first,where: $where){ totalCount }\n}"): (typeof documents)["query userGroupListNum($userId:ID!,$first:Int,$where:OrgRoleWhereInput){\n  userGroups(userID:$userId,first:$first,where: $where){ totalCount }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleListNum($first:Int,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,where: $where){ totalCount }\n}"): (typeof documents)["query orgRoleListNum($first:Int,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,where: $where){ totalCount }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgUserListAndIsOrgRole($gid: GID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n            isAssignOrgRole(orgRoleID: $orgRoleId)\n            isAllowRevokeRole(orgRoleID: $orgRoleId)\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgUserListAndIsOrgRole($gid: GID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            email,mobile,userType,creationType,registerIP,status,comments\n            isAssignOrgRole(orgRoleID: $orgRoleId)\n            isAllowRevokeRole(orgRoleID: $orgRoleId)\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleUserListAndIsOrgRole($roleId: ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleUserListAndIsOrgRole($roleId: ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgUserNum($gid:GID!,$first: Int,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,where: $where){ totalCount }\n    }\n  }\n}"): (typeof documents)["query orgUserNum($gid:GID!,$first: Int,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,where: $where){ totalCount }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation allotOrgUser($input:CreateOrgUserInput!){\n  allotOrganizationUser(input:$input)\n}"): (typeof documents)["mutation allotOrgUser($input:CreateOrgUserInput!){\n  allotOrganizationUser(input:$input)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation removeOrgUser($orgId:ID!,$userId:ID!){\n  removeOrganizationUser(orgID: $orgId,userID: $userId)\n}"): (typeof documents)["mutation removeOrgUser($orgId:ID!,$userId:ID!){\n  removeOrganizationUser(orgID: $orgId,userID: $userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  orgPolicyReferences(policyID:$orgPolicyId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  orgPolicyReferences(policyID:$orgPolicyId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on Org{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on Org{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on User{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on User{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userExtendGroupPolicieList($userId: ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  userExtendGroupPolicies(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query userExtendGroupPolicieList($userId: ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  userExtendGroupPolicies(userID:$userId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query permissionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Permission{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n      userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n      role{ id,orgID,kind,name,isAppRole }\n      orgPolicy{ id,orgID,appPolicyID,name }\n      user{ id,displayName }\n    }\n  }\n}"): (typeof documents)["query permissionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Permission{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n      userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n      role{ id,orgID,kind,name,isAppRole }\n      orgPolicy{ id,orgID,appPolicyID,name }\n      user{ id,displayName }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createPermission($input: CreatePermissionInput!){\n  grant(input:$input){id}\n}"): (typeof documents)["mutation createPermission($input: CreatePermissionInput!){\n  grant(input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){\n  updatePermission(permissionID:$permissionId,input:$input){id}\n}"): (typeof documents)["mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){\n  updatePermission(permissionID:$permissionId,input:$input){id}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revoke($permissionId:ID!,$orgId:ID!){\n  revoke(permissionID:$permissionId,orgID:$orgId)\n}"): (typeof documents)["mutation revoke($permissionId:ID!,$orgId:ID!){\n  revoke(permissionID:$permissionId,orgID:$orgId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"): (typeof documents)["query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfo($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID\n    }\n  }\n}"): (typeof documents)["query userInfo($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfoLoginProfile($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n    }\n  }\n}"): (typeof documents)["query userInfoLoginProfile($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfoLoginProfileIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"): (typeof documents)["query userInfoLoginProfileIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfoIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"): (typeof documents)["query userInfoIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n      email,mobile,userType,creationType,registerIP,status,comments,\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userAccessKeyList($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,\n      oauthClients{\n        id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n      }\n    }\n  }\n}"): (typeof documents)["query userAccessKeyList($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,\n      oauthClients{\n        id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createUser($rootOrgID:ID!,$input: CreateUserInput!){\n  createOrganizationUser(rootOrgID:$rootOrgID,input:$input){ id }\n}"): (typeof documents)["mutation createUser($rootOrgID:ID!,$input: CreateUserInput!){\n  createOrganizationUser(rootOrgID:$rootOrgID,input:$input){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){\n  createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){ id }\n}"): (typeof documents)["mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){\n  createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateUser($userId:ID!,$input: UpdateUserInput!){\n  updateUser(userID:$userId,input:$input){ id,displayName }\n}"): (typeof documents)["mutation updateUser($userId:ID!,$input: UpdateUserInput!){\n  updateUser(userID:$userId,input:$input){ id,displayName }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){\n  updateLoginProfile(userID:$userId,input:$input){ id }\n}"): (typeof documents)["mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){\n  updateLoginProfile(userID:$userId,input:$input){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation bindUserIdentity($input: CreateUserIdentityInput!){\n  bindUserIdentity(input:$input){ id }\n}"): (typeof documents)["mutation bindUserIdentity($input: CreateUserIdentityInput!){\n  bindUserIdentity(input:$input){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteUserIdentity($identityId:ID!){\n  deleteUserIdentity(id:$identityId)\n}"): (typeof documents)["mutation deleteUserIdentity($identityId:ID!){\n  deleteUserIdentity(id:$identityId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteUser($userId:ID!){\n  deleteUser(userID:$userId)\n}"): (typeof documents)["mutation deleteUser($userId:ID!){\n  deleteUser(userID:$userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation resetUserPasswordByEmail($userId:ID!){\n  resetUserPasswordByEmail(userId: $userId)\n}"): (typeof documents)["mutation resetUserPasswordByEmail($userId:ID!){\n  resetUserPasswordByEmail(userId: $userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation changePassword($oldPwd:String!,$newPwd:String!){\n  changePassword(oldPwd:$oldPwd,newPwd:$newPwd)\n}"): (typeof documents)["mutation changePassword($oldPwd:String!,$newPwd:String!){\n  changePassword(oldPwd:$oldPwd,newPwd:$newPwd)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation enableMfa($userId:ID!){\n  enableMFA(userID:$userId){secret,account}\n}"): (typeof documents)["mutation enableMfa($userId:ID!){\n  enableMFA(userID:$userId){secret,account}\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation disableMfa($userId:ID!){\n  disableMFA(userID:$userId)\n}"): (typeof documents)["mutation disableMfa($userId:ID!){\n  disableMFA(userID:$userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation sendMfaEmail($userId:ID!){\n  sendMFAToUserByEmail(userID:$userId)\n}"): (typeof documents)["mutation sendMfaEmail($userId:ID!){\n  sendMFAToUserByEmail(userID:$userId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query  checkPermission($permission:String!){\n  checkPermission(permission: $permission)\n}"): (typeof documents)["query  checkPermission($permission:String!){\n  checkPermission(permission: $permission)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRecycleUsers($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRecycleUsers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"): (typeof documents)["query orgRecycleUsers($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRecycleUsers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        email,mobile,userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation recoverOrgUser($userId:ID!,$setKind:UserLoginProfileSetKind!,$userInput: UpdateUserInput!,$pwdInput: CreateUserPasswordInput){\n  recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, pwdInput: $pwdInput ){ id }\n}"): (typeof documents)["mutation recoverOrgUser($userId:ID!,$setKind:UserLoginProfileSetKind!,$userInput: UpdateUserInput!,$pwdInput: CreateUserPasswordInput){\n  recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, pwdInput: $pwdInput ){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createOauthClient($input: CreateOauthClientInput!){\n  createOauthClient( input: $input ){ id }\n}"): (typeof documents)["mutation createOauthClient($input: CreateOauthClientInput!){\n  createOauthClient( input: $input ){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation enableOauthClient($id: ID!){\n  enableOauthClient( id: $id ){ id }\n}"): (typeof documents)["mutation enableOauthClient($id: ID!){\n  enableOauthClient( id: $id ){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation disableOauthClient($id: ID!){\n  disableOauthClient( id: $id ){ id }\n}"): (typeof documents)["mutation disableOauthClient($id: ID!){\n  disableOauthClient( id: $id ){ id }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delOauthClient($id: ID!){\n  deleteOauthClient( id: $id )\n}"): (typeof documents)["mutation delOauthClient($id: ID!){\n  deleteOauthClient( id: $id )\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;