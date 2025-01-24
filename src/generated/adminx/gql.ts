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
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "query appActionList($gid: GID!,$first: Int,$orderBy:AppActionOrder,$where:AppActionWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      actions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n          }\n        }\n      }\n    }\n  }\n}": types.AppActionListDocument,
    "query AppActionInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppAction{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n    }\n  }\n}": types.AppActionInfoDocument,
    "mutation createAppAction($appId:ID!,$input: [CreateAppActionInput!]){\n  createAppActions(appID:$appId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}": types.CreateAppActionDocument,
    "mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){\n  updateAppAction(actionID:$appActionId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}": types.UpdateAppActionDocument,
    "mutation delAppAction($appActionId:ID!){\n  deleteAppAction(actionID: $appActionId)\n}": types.DelAppActionDocument,
    "query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logo,comments,status,createdAt\n      }\n    }\n  }\n}": types.AppListDocument,
    "query appInfo($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n      refreshTokenValidity,logo,comments,status,createdAt\n    }\n  }\n}": types.AppInfoDocument,
    "mutation updateApp($appId:ID!,$input: UpdateAppInput!){\n  updateApp(appID:$appId,input:$input){\n    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n    refreshTokenValidity,logo,comments,status,createdAt\n  }\n}": types.UpdateAppDocument,
    "mutation createApp($input: CreateAppInput!){\n  createApp(input:$input){\n    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n    refreshTokenValidity,logo,comments,status,createdAt\n  }\n}": types.CreateAppDocument,
    "mutation delApp($appId:ID!){\n  deleteApp(appID: $appId)\n}": types.DelAppDocument,
    "query appAccess($appCode: String!){\n  appAccess( appCode: $appCode )\n}": types.AppAccessDocument,
    "query appMenuList($gid:GID!,$first: Int,$where: AppMenuWhereInput,$orderBy: AppMenuOrder){\n  node(id:$gid){\n    ... on App{\n      id\n      menus(first:$first,where:$where,orderBy:$orderBy){\n        totalCount,\n        edges{\n          cursor,node{\n            id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route,status\n            action{ id,name }\n          }\n        }\n      }\n    }\n  }\n}": types.AppMenuListDocument,
    "mutation updateAppMenu($menuId:ID!,$input: UpdateAppMenuInput!){\n  updateAppMenu(menuID:$menuId,input:$input){\n    id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route,status\n    action{ id,name }\n  }\n}": types.UpdateAppMenuDocument,
    "mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){\n  createAppMenus(appID:$appId,input:$input){\n    id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route,status\n    action{ id,name }\n  }\n}": types.CreateAppMenuDocument,
    "mutation delAppMenu($menuId:ID!){\n  deleteAppMenu(menuID: $menuId)\n}": types.DelAppMenuDocument,
    "mutation moveAppMenu($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveAppMenu(sourceID:$sourceId,targetID:$targetId,action:$action)\n}": types.MoveAppMenuDocument,
    "query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n            domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.AppOrgListDocument,
    "query appRoleAssignedToOrgList($appRoleId:ID!,$where: OrgWhereInput){\n  appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n  }\n}": types.AppRoleAssignedToOrgListDocument,
    "query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n  }\n}": types.AppPolicyAssignedToOrgListDocument,
    "query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)\n  }\n}": types.AppPolicyAssignedToOrgListAndIsGrantDocument,
    "query appPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind\n      }\n    }\n  }\n}": types.AppPolicieListDocument,
    "query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind\n        isGrantAppRole(appRoleID: $appRoleId)\n      }\n    }\n  }\n}": types.AppPolicieListAndIsGrantDocument,
    "query appPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n    }\n  }\n}": types.AppPolicyInfoDocument,
    "query appPolicyView($appCode:String!){\n  appPolicyView(appCode:$appCode){\n    ... on AppPolicyView{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,\n      policyID\n    }\n  }\n}": types.AppPolicyViewDocument,
    "mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!,$appPolicyViewID:ID){\n  createAppPolicy(appID:$appId,input:$input,appPolicyViewID:$appPolicyViewID){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n  }\n}": types.CreateAppPolicyDocument,
    "mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){\n  updateAppPolicy(policyID:$appPolicyId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n  }\n}": types.UpdateAppPolicyDocument,
    "mutation delAppPolicy($appPolicyId:ID!){\n  deleteAppPolicy(policyID: $appPolicyId)\n}": types.DelAppPolicyDocument,
    "mutation createAppPolicyView($input: CreateAppPolicyViewInput!){\n  createAppPolicyView(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,policyID\n  }\n}": types.CreateAppPolicyViewDocument,
    "mutation updateAppPolicyView($appPolicyViewID:ID!, $input: UpdateAppPolicyViewInput!){\n  updateAppPolicyView(appPolicyViewID:$appPolicyViewID,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind\n  }\n}": types.UpdateAppPolicyViewDocument,
    "mutation delAppPolicyView($appPolicyViewID:ID!){\n  deleteAppPolicyView(appPolicyViewID: $appPolicyViewID)\n}": types.DelAppPolicyViewDocument,
    "mutation moveAppPolicyView($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveAppPolicyView(sourceID:$sourceId,targetID:$targetId,action:$action)\n}": types.MoveAppPolicyViewDocument,
    "query appResList($gid: GID!,$first: Int,$orderBy:AppResOrder,$where:AppResWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      resources(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n          }\n        }\n      }\n    }\n  }\n}": types.AppResListDocument,
    "query appResInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRes{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n    }\n  }\n}": types.AppResInfoDocument,
    "mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){\n  updateAppRes(appResID:$appResId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n  }\n}": types.UpdateAppResDocument,
    "query appRoleList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      roles{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      }\n    }\n  }\n}": types.AppRoleListDocument,
    "query appRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      app{ id,name,code }\n    }\n  }\n}": types.AppRoleInfoDocument,
    "query appRoleInfoPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on AppRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n      app{ id,name,code }\n      policies{\n        id,appID,name,comments,autoGrant,status,\n        rules{ effect,actions,resources,conditions }\n      }\n    }\n  }\n}": types.AppRoleInfoPolicieListDocument,
    "mutation createAppRole($appId:ID!,$input: CreateAppRoleInput!){\n  createAppRole(appID:$appId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n  }\n}": types.CreateAppRoleDocument,
    "mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){\n  updateAppRole(roleID:$appRoleId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n  }\n}": types.UpdateAppRoleDocument,
    "mutation delAppRole($appRoleId:ID!){\n  deleteAppRole(roleID: $appRoleId)\n}": types.DelAppRoleDocument,
    "mutation assignAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  assignAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}": types.AssignAppRolePolicyDocument,
    "mutation revokeAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){\n  revokeAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)\n}": types.RevokeAppRolePolicyDocument,
    "mutation syncAppRoleToOrg($orgId:ID!,$appRoleId:ID!){\n  syncAppRoleToOrg(orgID: $orgId,appRoleID: $appRoleId,)\n}": types.SyncAppRoleToOrgDocument,
    "mutation assignAppRolePolicyView($appID: ID!, $roleID: ID!,$rmAppPolicyIDs: [ID!],$addAppPolicyIDs: [ID!]){\n  assignAppRolePolicyView(appID: $appID, roleID: $roleID,rmAppPolicyIDs: $rmAppPolicyIDs,addAppPolicyIDs: $addAppPolicyIDs)\n}": types.AssignAppRolePolicyViewDocument,
    "query appPolicyViewRoleAssigned($appRoleID:ID!){\n  appPolicyViewRoleAssigned(appRoleID:$appRoleID){\n    id,name,kind,policyID\n  }\n}": types.AppPolicyViewRoleAssignedDocument,
    "query countryList($first: Int,$orderBy:CountryOrder,$where:CountryWhereInput){\n  countries(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,nameEn,code,status,displaySort,createdAt\n      }\n    }\n  }\n}": types.CountryListDocument,
    "query countryInfo($gid:GID!){\n  node(id:$gid){\n    ... on Country{\n      id,name,nameEn,code,status,displaySort,createdAt\n    }\n  }\n}": types.CountryInfoDocument,
    "mutation updateCountry($countryId:ID!,$input: UpdateCountryInput!){\n  updateCountry(countryID:$countryId,input:$input){\n    id,name,nameEn,code,status,displaySort,createdAt\n  }\n}": types.UpdateCountryDocument,
    "mutation createCountry($input: CreateCountryInput!){\n  createCountry(input:$input){\n    id,name,nameEn,code,status,displaySort,createdAt\n  }\n}": types.CreateCountryDocument,
    "mutation delCountry($countryId:ID!){\n  deleteCountry(countryID: $countryId)\n}": types.DelCountryDocument,
    "mutation moveCountry($action:ListAction!,$sourceId:ID!,$targetId:ID!){\n  moveCountry(action: $action,sourceID:$sourceId,targetId:$targetId)\n}": types.MoveCountryDocument,
    "query regionList($first: Int,$orderBy:RegionOrder,$where:RegionWhereInput){\n  regions(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n      }\n    }\n  }\n}": types.RegionListDocument,
    "query regionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Region{\n      id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n    }\n  }\n}": types.RegionInfoDocument,
    "mutation updateRegion($regionId:ID!,$input: UpdateRegionInput!){\n  updateRegion(regionID:$regionId,input:$input){\n    id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n  }\n}": types.UpdateRegionDocument,
    "mutation createRegion($input: CreateRegionInput!){\n  createRegion(input:$input){\n    id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n  }\n}": types.CreateRegionDocument,
    "mutation delRegion($regionId:ID!){\n  deleteRegion(regionID: $regionId)\n}": types.DelRegionDocument,
    "mutation moveRegion($action:TreeAction!,$sourceId:ID!,$targetId:ID!){\n  moveRegion(action: $action,sourceID:$sourceId,targetId:$targetId)\n}": types.MoveRegionDocument,
    "query currencyList($first: Int,$orderBy:CurrencyOrder,$where:CurrencyWhereInput){\n  currencies(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,sign,status,createdAt\n      }\n    }\n  }\n}": types.CurrencyListDocument,
    "query currencyInfo($gid:GID!){\n  node(id:$gid){\n    ... on Currency{\n      id,name,code,sign,status,createdAt\n    }\n  }\n}": types.CurrencyInfoDocument,
    "mutation updateCurrency($id:ID!,$input: UpdateCurrencyInput!){\n  updateCurrency(currencyID:$id,input:$input){\n    id,name,code,sign,status,createdAt\n  }\n}": types.UpdateCurrencyDocument,
    "mutation createCurrency($input: CreateCurrencyInput!){\n  createCurrency(input:$input){\n    id,name,code,sign,status,createdAt\n  }\n}": types.CreateCurrencyDocument,
    "mutation delCurrency($id:ID!){\n  deleteCurrency(currencyID: $id)\n}": types.DelCurrencyDocument,
    "query appDictList($first: Int,$orderBy:AppDictOrder,$where:AppDictWhereInput){\n  appDicts(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n        app{id,name}\n      }\n    }\n  }\n}": types.AppDictListDocument,
    "query appDictInfo($gid:GID!){\n  node(id:$gid){\n   ... on AppDict{\n       id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n       app{id,name}\n     }\n   }\n }": types.AppDictInfoDocument,
    "query appDictItemList($gid:GID!){\n  node(id:$gid){\n   ... on AppDict{\n       id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n       items{\n        id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n        org{ id,name }\n       }\n     }\n   }\n }": types.AppDictItemListDocument,
    "query appDictItemInfo($gid:GID!){\n  node(id:$gid){\n   ... on AppDictItem{\n      id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n      org{ id,name }\n     }\n   }\n }": types.AppDictItemInfoDocument,
    "mutation updateAppDict($dictId:ID!,$input: UpdateAppDictInput!){\n  updateAppDict(dictID:$dictId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n    app{id,name}\n  }\n}": types.UpdateAppDictDocument,
    "mutation createAppDict($appId:ID!,$input: CreateAppDictInput!){\n  createAppDict(appID:$appId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n    app{id,name}\n   }\n}": types.CreateAppDictDocument,
    "mutation deleteAppDict($dictId:ID!){\n  deleteAppDict(dictID: $dictId)\n}": types.DeleteAppDictDocument,
    "mutation updateAppDictItem($itemId:ID!,$input:  UpdateAppDictItemInput!){\n  updateAppDictItem(itemID:$itemId,input:$input){\n    id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n    org{ id,name }\n  }\n}": types.UpdateAppDictItemDocument,
    "mutation createAppDictItem($dictId:ID!,$input: CreateAppDictItemInput!){\n  createAppDictItem(dictID:$dictId,input:$input){\n    id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n    org{ id,name }\n  }\n}": types.CreateAppDictItemDocument,
    "mutation deleteAppDictItem($itemId:ID!){\n  deleteAppDictItem(itemID: $itemId)\n}": types.DeleteAppDictItemDocument,
    "mutation moveAppDictItem($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveAppDictItem(sourceID: $sourceId,targetID:$targetId,action:$action)\n}": types.MoveAppDictItemDocument,
    "query fileIdentityList($first: Int,$orderBy:FileIdentityOrder,$where:FileIdentityWhereInput){\n  fileIdentities(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,comments\n        accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n        org{ id,name }\n      }\n    }\n  }\n}": types.FileIdentityListDocument,
    "query fileIdentityInfo($gid:GID!){\n node(id:$gid){\n  ... on FileIdentity{\n      id,createdBy,createdAt,updatedBy,updatedAt,comments,\n      accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n      org{ id,name }\n    }\n  }\n}": types.FileIdentityInfoDocument,
    "query fileIdentityAccessKeySecret($id:ID!){\n fileIdentityAccessKeySecret(id:$id)\n}": types.FileIdentityAccessKeySecretDocument,
    "mutation createFileIdentity($input: CreateFileIdentityInput!){\n  createFileIdentity(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,comments\n    accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n    org{ id,name }\n  }\n}": types.CreateFileIdentityDocument,
    "mutation updateFileIdentity($id:ID!,$input: UpdateFileIdentityInput!){\n  updateFileIdentity(id:$id,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,comments\n    accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n    org{ id,name }\n  }\n}": types.UpdateFileIdentityDocument,
    "mutation deleteFileIdentity($id:ID!){\n  deleteFileIdentity(id: $id)\n}": types.DeleteFileIdentityDocument,
    "mutation setDefaultFileIdentity($id:ID!,$orgId: ID!){\n  setDefaultFileIdentity(identityID:$id,orgID:$orgId)\n}": types.SetDefaultFileIdentityDocument,
    "query fileSourceList($first: Int,$orderBy:FileSourceOrder,$where:FileSourceWhereInput){\n  fileSources(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n        bucket,bucketURL,stsEndpoint,endpointImmutable\n      }\n    }\n  }\n}": types.FileSourceListDocument,
    "query fileSourceInfo($gid:GID!){\n node(id:$gid){\n  ... on FileSource{\n      id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n      bucket,bucketURL,stsEndpoint,endpointImmutable\n    }\n  }\n}": types.FileSourceInfoDocument,
    "mutation createFileSource($input: CreateFileSourceInput!){\n  createFileSource(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n    bucket,bucketURL,stsEndpoint,endpointImmutable\n  }\n}": types.CreateFileSourceDocument,
    "mutation updateFileSource($fsId:ID!,$input: UpdateFileSourceInput!){\n  updateFileSource(fsID:$fsId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n    bucket,bucketURL,stsEndpoint,endpointImmutable\n  }\n}": types.UpdateFileSourceDocument,
    "mutation deleteFileSource($fsId:ID!){\n  deleteFileSource(fsID: $fsId)\n}": types.DeleteFileSourceDocument,
    "query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,redirectURI,appKey,appSecret,scopes,\n            tokenValidity,refreshTokenValidity,logo,comments,status,createdAt\n          }\n        }\n      }\n    }\n  }\n}": types.OrgAppListDocument,
    "mutation assignOrgApp($orgId:ID!,$appId:ID!){\n  assignOrganizationApp(orgID: $orgId,appID: $appId)\n}": types.AssignOrgAppDocument,
    "mutation revokeOrgApp($orgId:ID!,$appId:ID!){\n  revokeOrganizationApp(orgID: $orgId,appID: $appId)\n}": types.RevokeOrgAppDocument,
    "query orgAppActionList($appCode:String!,$orgId:ID!){\n  orgAppActions(appCode: $appCode,orgID: $orgId){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}": types.OrgAppActionListDocument,
    "query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n        domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n        owner { id,displayName }\n      }\n    }\n  }\n}": types.OrgListDocument,
    "query orgInfo($gid:GID!){\n  node(id: $gid){\n    ... on Org{\n      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,customDomain,\n      domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n      owner { id,displayName }\n      logo{ favicon, logo, thumbLogo}\n    }\n  }\n}": types.OrgInfoDocument,
    "mutation createRootOrg($input: CreateOrgInput!){\n  createRoot(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}": types.CreateRootOrgDocument,
    "mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){\n  updateOrganization(orgID:$orgId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}": types.UpdateOrgDocument,
    "mutation createOrg($input: CreateOrgInput!){\n  createOrganization(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}": types.CreateOrgDocument,
    "mutation enableDirectory($input: EnableDirectoryInput!){\n  enableDirectory(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}": types.EnableDirectoryDocument,
    "mutation delOrg($orgId:ID!){\n  deleteOrganization(orgID: $orgId)\n}": types.DelOrgDocument,
    "mutation moveOrg($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveOrganization(sourceID:$sourceId,targetId:$targetId,action:$action)\n}": types.MoveOrgDocument,
    "query userPasswordPolicy($gid: GID!){\n  node(id:$gid){\n    ... on Org{\n      id\n      userPasswordPolicy{\n        id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes\n      }\n    }\n  }\n}": types.UserPasswordPolicyDocument,
    "mutation updateUserPasswordPolicy($orgId:ID!,$input: UpdateUserPasswordPolicyInput!){\n  updateUserPasswordPolicy(orgID:$orgId,input:$input){\n    id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes,tenantID\n  }\n}": types.UpdateUserPasswordPolicyDocument,
    "mutation createUserPasswordPolicy($orgId:ID!,$input: CreateUserPasswordPolicyInput!){\n  createUserPasswordPolicy(orgID:$orgId,input:$input){\n    id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes,tenantID\n  }\n}": types.CreateUserPasswordPolicyDocument,
    "query orgPolicyList($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPolicyListDocument,
    "query orgPolicyListNum($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){ totalCount }\n    }\n  }\n}": types.OrgPolicyListNumDocument,
    "query orgPolicyListAndIsGrantUser($gid: GID!,$userId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantUser(userID: $userId)\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPolicyListAndIsGrantUserDocument,
    "query orgPolicyListAndIsGrantRole($gid: GID!,$roleId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){\n  node(id:$gid){\n    ... on Org{\n      policies(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n            isGrantRole(roleID: $roleId)\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPolicyListAndIsGrantRoleDocument,
    "query orgPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments,\n      rules{ effect,actions,resources,conditions }\n    }\n  }\n}": types.OrgPolicyInfoDocument,
    "mutation createOrgPolicy($input: CreateOrgPolicyInput!){\n  createOrganizationPolicy(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n  }\n}": types.CreateOrgPolicyDocument,
    "mutation updateOrgPolicy($orgPolicyId:ID!,$input: UpdateOrgPolicyInput!){\n  updateOrganizationPolicy(orgPolicyID:$orgPolicyId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n  }\n}": types.UpdateOrgPolicyDocument,
    "mutation deleteOrgPolicy($orgPolicyId:ID!){\n  deleteOrganizationPolicy(orgPolicyID:$orgPolicyId)\n}": types.DeleteOrgPolicyDocument,
    "mutation assignOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  assignOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}": types.AssignOrgAppPolicyDocument,
    "mutation revokeOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){\n  revokeOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)\n}": types.RevokeOrgAppPolicyDocument,
    "query orgPolicyView($appCode: String!,$orgID: ID){\n  orgPolicyView(appCode: $appCode,orgID: $orgID){\n    appPolicyView{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,\n      policyID\n    }\n    orgPolicy{id}\n  }\n}": types.OrgPolicyViewDocument,
    "query orgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}": types.OrgGroupListDocument,
    "query orgGroupListAndIsGrant($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}": types.OrgGroupListAndIsGrantDocument,
    "query userGroupList($userId: ID!,$orgID: ID,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userGroups(userID:$userId,orgID:$orgID,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}": types.UserGroupListDocument,
    "query userRoleList($userId: ID!,$orgId:ID,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userRoles(userID:$userId,orgID:$orgId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}": types.UserRoleListDocument,
    "query orgRoleList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}": types.OrgRoleListDocument,
    "query orgRoleListAndIsGrant($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}": types.OrgRoleListAndIsGrantDocument,
    "query orgRoleInfo($gid:GID!){\n  node(id:$gid){\n    ... on OrgRole{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n    }\n  }\n}": types.OrgRoleInfoDocument,
    "mutation createOrgRole($input: CreateOrgRoleInput!){\n  createRole(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n  }\n}": types.CreateOrgRoleDocument,
    "mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){\n  updateRole(roleID:$orgRoleId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n  }\n}": types.UpdateOrgRoleDocument,
    "mutation deleteOrgRole($orgRoleId:ID!){\n  deleteRole(roleID:$orgRoleId)\n}": types.DeleteOrgRoleDocument,
    "mutation assignOrgRoleUser($input: AssignRoleUserInput!){\n  assignRoleUser(input:$input)\n}": types.AssignOrgRoleUserDocument,
    "mutation revokeOrgRoleUser($orgRoleId:ID!,$userId:ID!){\n  revokeRoleUser(roleID:$orgRoleId,userID:$userId)\n}": types.RevokeOrgRoleUserDocument,
    "mutation assignOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  assignOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}": types.AssignOrgAppRoleDocument,
    "mutation revokeOrgAppRole($orgId:ID!,$appRoleId:ID!){\n  revokeOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)\n}": types.RevokeOrgAppRoleDocument,
    "query orgGroupListNum($first:Int,$where:OrgRoleWhereInput){\n  orgGroups(first:$first,where: $where){ totalCount }\n}": types.OrgGroupListNumDocument,
    "query userGroupListNum($userId:ID!,$first:Int,$where:OrgRoleWhereInput){\n  userGroups(userID:$userId,first:$first,where: $where){ totalCount }\n}": types.UserGroupListNumDocument,
    "query orgRoleListNum($first:Int,$where:OrgRoleWhereInput){\n  orgRoles(first:$first,where: $where){ totalCount }\n}": types.OrgRoleListNumDocument,
    "query orgPolicyViewRoleAssigned($appCode: String!,$orgRoleID:ID!,$orgID: ID){\n  orgPolicyViewRoleAssigned(appCode:$appCode,orgID:$orgID,orgRoleID:$orgRoleID)\n}": types.OrgPolicyViewRoleAssignedDocument,
    "mutation assignOrgRolePolicyView($orgID: ID!, $roleID: ID!,$rmOrgPolicyIDs: [ID!],$addOrgPolicyIDs: [ID!]){\n  assignOrgRolePolicyView(orgID: $orgID, roleID: $roleID,rmOrgPolicyIDs: $rmOrgPolicyIDs,addOrgPolicyIDs: $addOrgPolicyIDs)\n}": types.AssignOrgRolePolicyViewDocument,
    "query orgUserList($gid: GID!,$orgId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            contact{email,mobile},userType,creationType,registerIP,status,comments\n            orgUserType(orgID: $orgId)\n          }\n        }\n      }\n    }\n  }\n}": types.OrgUserListDocument,
    "query orgUserListAndIsOrgRole($gid: GID!,$orgId:ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,orgUserType(orgID: $orgId)\n            contact{email,mobile},userType,creationType,registerIP,status,comments\n            isAssignOrgRole(orgRoleID: $orgRoleId)\n            isAllowRevokeRole(orgRoleID: $orgRoleId)\n          }\n        }\n      }\n    }\n  }\n}": types.OrgUserListAndIsOrgRoleDocument,
    "query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.OrgRoleUserListDocument,
    "query orgRoleUserListAndIsOrgRole($roleId: ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}": types.OrgRoleUserListAndIsOrgRoleDocument,
    "query orgUserNum($gid:GID!,$first: Int,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,where: $where){ totalCount }\n    }\n  }\n}": types.OrgUserNumDocument,
    "mutation allotOrgUser($input:CreateOrgUserInput!){\n  allotOrganizationUser(input:$input)\n}": types.AllotOrgUserDocument,
    "mutation removeOrgUser($orgId:ID!,$userId:ID!){\n  removeOrganizationUser(orgID: $orgId,userID: $userId)\n}": types.RemoveOrgUserDocument,
    "query memberList($orgId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  userMembers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,\n        orgUserType(orgID: $orgId)\n      }\n    }\n  }\n}": types.MemberListDocument,
    "mutation changeOrgUserType($orgId:ID!,$userId:ID!,$userType:OrgUserUserType!){\n  changeOrgUserType(userID:$userId,userType:$userType,orgID: $orgId)\n}": types.ChangeOrgUserTypeDocument,
    "query orgPolicyViewUserAssigned($appCode: String!,$userID:ID!,$orgID:ID){\n  orgPolicyViewUserAssigned(appCode:$appCode,orgID:$orgID,userID: $userID)\n}": types.OrgPolicyViewUserAssignedDocument,
    "mutation assignOrgUserPolicyView($orgID: ID!, $userID: ID!,$rmOrgPolicyIDs: [ID!],$addOrgPolicyIDs: [ID!]){\n  assignOrgUserPolicyView(orgID: $orgID, userID: $userID,rmOrgPolicyIDs: $rmOrgPolicyIDs,addOrgPolicyIDs: $addOrgPolicyIDs)\n}": types.AssignOrgUserPolicyViewDocument,
    "query userOrgRoles($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userOrgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}": types.UserOrgRolesDocument,
    "query parentOrgUsers($orgId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  parentOrgUsers(orgID:$orgId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,\n      }\n    }\n  }\n}": types.ParentOrgUsersDocument,
    "query parentOrgUsersRoleId($orgId:ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  parentOrgUsers(orgID:$orgId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}": types.ParentOrgUsersRoleIdDocument,
    "query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  orgPolicyReferences(policyID:$orgPolicyId, first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}": types.OrgPolicyReferencesDocument,
    "query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on Org{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.OrgPrmissionListDocument,
    "query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on User{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name,comments }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}": types.UserPrmissionListDocument,
    "query userExtendGroupPolicieList($userId: ID!,$orgID:ID,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  userExtendGroupPolicies(userID:$userId,orgID:$orgID,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name,comments}\n        user{ id,displayName }\n      }\n    }\n  }\n}": types.UserExtendGroupPolicieListDocument,
    "query userExtendRolePolicieList($userId: ID!,$orgID:ID,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  userExtendRolePolicies(userID:$userId,orgID:$orgID,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name,comments}\n        user{ id,displayName }\n      }\n    }\n  }\n}": types.UserExtendRolePolicieListDocument,
    "query permissionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Permission{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n      userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n      role{ id,orgID,kind,name,isAppRole }\n      orgPolicy{ id,orgID,appPolicyID,name }\n      user{ id,displayName }\n    }\n  }\n}": types.PermissionInfoDocument,
    "mutation createPermission($input: CreatePermissionInput!){\n  grant(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n    userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n    role{ id,orgID,kind,name,isAppRole }\n    orgPolicy{ id,orgID,appPolicyID,name }\n    user{ id,displayName }\n  }\n}": types.CreatePermissionDocument,
    "mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){\n  updatePermission(permissionID:$permissionId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n    userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n    role{ id,orgID,kind,name,isAppRole }\n    orgPolicy{ id,orgID,appPolicyID,name }\n    user{ id,displayName }\n  }\n}": types.UpdatePermissionDocument,
    "mutation revoke($permissionId:ID!,$orgId:ID!){\n  revoke(permissionID:$permissionId,orgID:$orgId)\n}": types.RevokeDocument,
    "query quotaItems($first: Int,$where:QuotaItemWhereInput,$orderBy:QuotaItemOrder){\n    quotaItems(first:$first,where: $where,orderBy: $orderBy){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n            cursor,node{\n                id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n            }\n        }\n    }\n}": types.QuotaItemsDocument,
    "query quotaItemInfo($gid:GID!){\n    node(id:$gid){\n        ... on QuotaItem{\n            id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n        }\n    }\n}": types.QuotaItemInfoDocument,
    "mutation createQuotaItem($input: CreateQuotaItemInput!){\n    createQuotaItem(input:$input){\n        id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n    }\n}": types.CreateQuotaItemDocument,
    "mutation updateQuotaItem($itemId:ID!,$input: UpdateQuotaItemInput!){\n    updateQuotaItem(id:$itemId,input:$input){\n        id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n    }\n}": types.UpdateQuotaItemDocument,
    "mutation deleteQuotaItem($itemId:ID!){\n    deleteQuotaItem(id: $itemId)\n}": types.DeleteQuotaItemDocument,
    "query quotaList($first: Int,$orderBy:QuotaOrder,$where:QuotaWhereInput){\n  quotas(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdAt,limit,used,startAt,endAt,userID,tenantID\n        quotaOrg {\n          id\n          name\n        }\n        quotaUser {\n          id\n          displayName\n        }\n        quotaItem {\n          id\n          name\n        }\n      }\n    }\n  }\n}": types.QuotaListDocument,
    "query quotaInfo($gid:GID!){\n    node(id:$gid){\n        ... on Quota{\n            id,createdAt,limit,used,startAt,endAt,userID,tenantID\n          quotaOrg {\n            id\n            name\n          }\n          quotaUser {\n            id\n            displayName\n          }\n          quotaItem {\n            id\n            name\n          }\n        }\n    }\n}": types.QuotaInfoDocument,
    "mutation createQuota($input: CreateQuotaInput!){\n    createQuota(input:$input){\n        id,createdAt,limit,used,startAt,endAt,userID,tenantID\n    }\n}": types.CreateQuotaDocument,
    "mutation updateQuota($quotaId:ID!,$input: UpdateQuotaInput!){\n    updateQuota(id:$quotaId,input:$input){\n        id,createdAt,limit,used,startAt,endAt,userID,tenantID\n    }\n}": types.UpdateQuotaDocument,
    "mutation deleteQuota($quotaId:ID!){\n    deleteQuota(id: $quotaId)\n}": types.DeleteQuotaDocument,
    "query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n      }\n    }\n  }\n}": types.UserListDocument,
    "query userInfo($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n    }\n  }\n}": types.UserInfoDocument,
    "query userInfoLoginProfile($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n    }\n  }\n}": types.UserInfoLoginProfileDocument,
    "query userInfoLoginProfileIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}": types.UserInfoLoginProfileIdentitiesDocument,
    "query userInfoIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}": types.UserInfoIdentitiesDocument,
    "query userAccessKeyList($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,\n      oauthClients{\n        id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n      }\n    }\n  }\n}": types.UserAccessKeyListDocument,
    "mutation createUser($rootOrgID:ID!,$input: CreateUserInput!,$orgUserType:OrgUserUserType){\n  createOrganizationUser(rootOrgID:$rootOrgID,input:$input,orgUserType:$orgUserType){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,orgUserType(orgID:$rootOrgID),\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n   }\n}": types.CreateUserDocument,
    "mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){\n  createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n  }\n}": types.CreateAccountDocument,
    "mutation updateUser($userId:ID!,$input: UpdateUserInput!,$contact: UpdateUserAddrInput!){\n  updateUser(userID:$userId,input:$input,contact:$contact){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n   }\n}": types.UpdateUserDocument,
    "mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){\n  updateLoginProfile(userID:$userId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n    canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n   }\n}": types.UpdateUserLoginProfileDocument,
    "mutation bindUserIdentity($input: CreateUserIdentityInput!){\n  bindUserIdentity(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n   }\n}": types.BindUserIdentityDocument,
    "mutation deleteUserIdentity($identityId:ID!){\n  deleteUserIdentity(id:$identityId)\n}": types.DeleteUserIdentityDocument,
    "mutation deleteUser($userId:ID!){\n  deleteUser(userID:$userId)\n}": types.DeleteUserDocument,
    "mutation resetUserPasswordByEmail($userId:ID!){\n  resetUserPasswordByEmail(userId: $userId)\n}": types.ResetUserPasswordByEmailDocument,
    "mutation changePassword($oldPwd:String!,$newPwd:String!){\n  changePassword(oldPwd:$oldPwd,newPwd:$newPwd)\n}": types.ChangePasswordDocument,
    "mutation enableMfa($userId:ID!){\n  enableMFA(userID:$userId){secret,account}\n}": types.EnableMfaDocument,
    "mutation disableMfa($userId:ID!){\n  disableMFA(userID:$userId)\n}": types.DisableMfaDocument,
    "mutation sendMfaEmail($userId:ID!){\n  sendMFAToUserByEmail(userID:$userId)\n}": types.SendMfaEmailDocument,
    "query  checkPermission($permission:String!){\n  checkPermission(permission: $permission)\n}": types.CheckPermissionDocument,
    "query orgRecycleUsers($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRecycleUsers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n        contact{email,mobile},userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}": types.OrgRecycleUsersDocument,
    "mutation recoverOrgUser($userId:ID!,$setKind:UserLoginProfileSetKind!,$userInput: UpdateUserInput!,$contact: UpdateUserAddrInput!,$pwdInput: CreateUserPasswordInput){\n  recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, contact :$contact, pwdInput: $pwdInput ){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n  }\n}": types.RecoverOrgUserDocument,
    "mutation createOauthClient($input: CreateOauthClientInput!){\n  createOauthClient( input: $input ){\n    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n  }\n}": types.CreateOauthClientDocument,
    "mutation enableOauthClient($id: ID!){\n  enableOauthClient( id: $id ){\n    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n  }\n}": types.EnableOauthClientDocument,
    "mutation disableOauthClient($id: ID!){\n  disableOauthClient( id: $id ){\n    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n  }\n}": types.DisableOauthClientDocument,
    "mutation delOauthClient($id: ID!){\n  deleteOauthClient( id: $id )\n}": types.DelOauthClientDocument,
    "query userDevices($first: Int,$orderBy:UserDeviceOrder,$where:UserDeviceWhereInput,$gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,\n      devices(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,status,comments,deviceUID,deviceName,systemName,systemVersion,appVersion,deviceModel,\n          }\n        }\n      }\n    }\n  }\n}": types.UserDevicesDocument,
    "mutation deleteUserDevice($userID: ID!,$deviceID: ID!){\n  deleteUserDevice( userID: $userID,deviceID: $deviceID)\n}": types.DeleteUserDeviceDocument,
    "query userApp{\n  userApps{\n    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n    refreshTokenValidity,logo,comments,status,createdAt\n  }\n}": types.UserAppDocument,
    "query userMfaInfo($userId: ID!,$orgId:ID!){\n  userMfaInfo(userID: $userId,orgID: $orgId){\n    accountName, mfaEnabled, qrCodeUri, secret\n  }\n}": types.UserMfaInfoDocument,
    "query orgPolicyViewUserRoleAssigned($appCode:String!, $userId: ID!,$orgId:ID!){\n  orgPolicyViewUserRoleAssigned(appCode:$appCode userID: $userId,orgID: $orgId)\n}": types.OrgPolicyViewUserRoleAssignedDocument,
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
export function gql(source: "mutation createAppAction($appId:ID!,$input: [CreateAppActionInput!]){\n  createAppActions(appID:$appId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}"): (typeof documents)["mutation createAppAction($appId:ID!,$input: [CreateAppActionInput!]){\n  createAppActions(appID:$appId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){\n  updateAppAction(actionID:$appActionId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}"): (typeof documents)["mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){\n  updateAppAction(actionID:$appActionId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppAction($appActionId:ID!){\n  deleteAppAction(actionID: $appActionId)\n}"): (typeof documents)["mutation delAppAction($appActionId:ID!){\n  deleteAppAction(actionID: $appActionId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logo,comments,status,createdAt\n      }\n    }\n  }\n}"): (typeof documents)["query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  apps(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n        refreshTokenValidity,logo,comments,status,createdAt\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appInfo($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n      refreshTokenValidity,logo,comments,status,createdAt\n    }\n  }\n}"): (typeof documents)["query appInfo($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n      refreshTokenValidity,logo,comments,status,createdAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateApp($appId:ID!,$input: UpdateAppInput!){\n  updateApp(appID:$appId,input:$input){\n    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n    refreshTokenValidity,logo,comments,status,createdAt\n  }\n}"): (typeof documents)["mutation updateApp($appId:ID!,$input: UpdateAppInput!){\n  updateApp(appID:$appId,input:$input){\n    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n    refreshTokenValidity,logo,comments,status,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createApp($input: CreateAppInput!){\n  createApp(input:$input){\n    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n    refreshTokenValidity,logo,comments,status,createdAt\n  }\n}"): (typeof documents)["mutation createApp($input: CreateAppInput!){\n  createApp(input:$input){\n    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n    refreshTokenValidity,logo,comments,status,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delApp($appId:ID!){\n  deleteApp(appID: $appId)\n}"): (typeof documents)["mutation delApp($appId:ID!){\n  deleteApp(appID: $appId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appAccess($appCode: String!){\n  appAccess( appCode: $appCode )\n}"): (typeof documents)["query appAccess($appCode: String!){\n  appAccess( appCode: $appCode )\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appMenuList($gid:GID!,$first: Int,$where: AppMenuWhereInput,$orderBy: AppMenuOrder){\n  node(id:$gid){\n    ... on App{\n      id\n      menus(first:$first,where:$where,orderBy:$orderBy){\n        totalCount,\n        edges{\n          cursor,node{\n            id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route,status\n            action{ id,name }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appMenuList($gid:GID!,$first: Int,$where: AppMenuWhereInput,$orderBy: AppMenuOrder){\n  node(id:$gid){\n    ... on App{\n      id\n      menus(first:$first,where:$where,orderBy:$orderBy){\n        totalCount,\n        edges{\n          cursor,node{\n            id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route,status\n            action{ id,name }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppMenu($menuId:ID!,$input: UpdateAppMenuInput!){\n  updateAppMenu(menuID:$menuId,input:$input){\n    id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route,status\n    action{ id,name }\n  }\n}"): (typeof documents)["mutation updateAppMenu($menuId:ID!,$input: UpdateAppMenuInput!){\n  updateAppMenu(menuID:$menuId,input:$input){\n    id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route,status\n    action{ id,name }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){\n  createAppMenus(appID:$appId,input:$input){\n    id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route,status\n    action{ id,name }\n  }\n}"): (typeof documents)["mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){\n  createAppMenus(appID:$appId,input:$input){\n    id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route,status\n    action{ id,name }\n  }\n}"];
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
export function gql(source: "query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n            domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  node(id:$gid){\n    ... on App{\n      id,\n      orgs(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n            domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n            owner { id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appRoleAssignedToOrgList($appRoleId:ID!,$where: OrgWhereInput){\n  appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n  }\n}"): (typeof documents)["query appRoleAssignedToOrgList($appRoleId:ID!,$where: OrgWhereInput){\n  appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n  }\n}"): (typeof documents)["query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)\n  }\n}"): (typeof documents)["query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){\n  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind\n      }\n    }\n  }\n}"): (typeof documents)["query appPolicieList($gid:GID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind\n        isGrantAppRole(appRoleID: $appRoleId)\n      }\n    }\n  }\n}"): (typeof documents)["query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){\n  node(id:$gid){\n    ... on App{\n      id,\n      policies{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind\n        isGrantAppRole(appRoleID: $appRoleId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n    }\n  }\n}"): (typeof documents)["query appPolicyInfo($gid:GID!){\n  node(id:$gid){\n    ... on AppPolicy{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyView($appCode:String!){\n  appPolicyView(appCode:$appCode){\n    ... on AppPolicyView{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,\n      policyID\n    }\n  }\n}"): (typeof documents)["query appPolicyView($appCode:String!){\n  appPolicyView(appCode:$appCode){\n    ... on AppPolicyView{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,\n      policyID\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!,$appPolicyViewID:ID){\n  createAppPolicy(appID:$appId,input:$input,appPolicyViewID:$appPolicyViewID){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n  }\n}"): (typeof documents)["mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!,$appPolicyViewID:ID){\n  createAppPolicy(appID:$appId,input:$input,appPolicyViewID:$appPolicyViewID){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){\n  updateAppPolicy(policyID:$appPolicyId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n  }\n}"): (typeof documents)["mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){\n  updateAppPolicy(policyID:$appPolicyId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,\n      rules{ effect,actions,resources,conditions }\n      app{ id,name }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppPolicy($appPolicyId:ID!){\n  deleteAppPolicy(policyID: $appPolicyId)\n}"): (typeof documents)["mutation delAppPolicy($appPolicyId:ID!){\n  deleteAppPolicy(policyID: $appPolicyId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppPolicyView($input: CreateAppPolicyViewInput!){\n  createAppPolicyView(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,policyID\n  }\n}"): (typeof documents)["mutation createAppPolicyView($input: CreateAppPolicyViewInput!){\n  createAppPolicyView(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,policyID\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppPolicyView($appPolicyViewID:ID!, $input: UpdateAppPolicyViewInput!){\n  updateAppPolicyView(appPolicyViewID:$appPolicyViewID,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind\n  }\n}"): (typeof documents)["mutation updateAppPolicyView($appPolicyViewID:ID!, $input: UpdateAppPolicyViewInput!){\n  updateAppPolicyView(appPolicyViewID:$appPolicyViewID,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delAppPolicyView($appPolicyViewID:ID!){\n  deleteAppPolicyView(appPolicyViewID: $appPolicyViewID)\n}"): (typeof documents)["mutation delAppPolicyView($appPolicyViewID:ID!){\n  deleteAppPolicyView(appPolicyViewID: $appPolicyViewID)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation moveAppPolicyView($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveAppPolicyView(sourceID:$sourceId,targetID:$targetId,action:$action)\n}"): (typeof documents)["mutation moveAppPolicyView($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveAppPolicyView(sourceID:$sourceId,targetID:$targetId,action:$action)\n}"];
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
export function gql(source: "mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){\n  updateAppRes(appResID:$appResId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n  }\n}"): (typeof documents)["mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){\n  updateAppRes(appResID:$appResId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern\n  }\n}"];
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
export function gql(source: "mutation createAppRole($appId:ID!,$input: CreateAppRoleInput!){\n  createAppRole(appID:$appId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n  }\n}"): (typeof documents)["mutation createAppRole($appId:ID!,$input: CreateAppRoleInput!){\n  createAppRole(appID:$appId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){\n  updateAppRole(roleID:$appRoleId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n  }\n}"): (typeof documents)["mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){\n  updateAppRole(roleID:$appRoleId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable\n  }\n}"];
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
export function gql(source: "mutation syncAppRoleToOrg($orgId:ID!,$appRoleId:ID!){\n  syncAppRoleToOrg(orgID: $orgId,appRoleID: $appRoleId,)\n}"): (typeof documents)["mutation syncAppRoleToOrg($orgId:ID!,$appRoleId:ID!){\n  syncAppRoleToOrg(orgID: $orgId,appRoleID: $appRoleId,)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignAppRolePolicyView($appID: ID!, $roleID: ID!,$rmAppPolicyIDs: [ID!],$addAppPolicyIDs: [ID!]){\n  assignAppRolePolicyView(appID: $appID, roleID: $roleID,rmAppPolicyIDs: $rmAppPolicyIDs,addAppPolicyIDs: $addAppPolicyIDs)\n}"): (typeof documents)["mutation assignAppRolePolicyView($appID: ID!, $roleID: ID!,$rmAppPolicyIDs: [ID!],$addAppPolicyIDs: [ID!]){\n  assignAppRolePolicyView(appID: $appID, roleID: $roleID,rmAppPolicyIDs: $rmAppPolicyIDs,addAppPolicyIDs: $addAppPolicyIDs)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appPolicyViewRoleAssigned($appRoleID:ID!){\n  appPolicyViewRoleAssigned(appRoleID:$appRoleID){\n    id,name,kind,policyID\n  }\n}"): (typeof documents)["query appPolicyViewRoleAssigned($appRoleID:ID!){\n  appPolicyViewRoleAssigned(appRoleID:$appRoleID){\n    id,name,kind,policyID\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query countryList($first: Int,$orderBy:CountryOrder,$where:CountryWhereInput){\n  countries(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,nameEn,code,status,displaySort,createdAt\n      }\n    }\n  }\n}"): (typeof documents)["query countryList($first: Int,$orderBy:CountryOrder,$where:CountryWhereInput){\n  countries(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,nameEn,code,status,displaySort,createdAt\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query countryInfo($gid:GID!){\n  node(id:$gid){\n    ... on Country{\n      id,name,nameEn,code,status,displaySort,createdAt\n    }\n  }\n}"): (typeof documents)["query countryInfo($gid:GID!){\n  node(id:$gid){\n    ... on Country{\n      id,name,nameEn,code,status,displaySort,createdAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateCountry($countryId:ID!,$input: UpdateCountryInput!){\n  updateCountry(countryID:$countryId,input:$input){\n    id,name,nameEn,code,status,displaySort,createdAt\n  }\n}"): (typeof documents)["mutation updateCountry($countryId:ID!,$input: UpdateCountryInput!){\n  updateCountry(countryID:$countryId,input:$input){\n    id,name,nameEn,code,status,displaySort,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createCountry($input: CreateCountryInput!){\n  createCountry(input:$input){\n    id,name,nameEn,code,status,displaySort,createdAt\n  }\n}"): (typeof documents)["mutation createCountry($input: CreateCountryInput!){\n  createCountry(input:$input){\n    id,name,nameEn,code,status,displaySort,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delCountry($countryId:ID!){\n  deleteCountry(countryID: $countryId)\n}"): (typeof documents)["mutation delCountry($countryId:ID!){\n  deleteCountry(countryID: $countryId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation moveCountry($action:ListAction!,$sourceId:ID!,$targetId:ID!){\n  moveCountry(action: $action,sourceID:$sourceId,targetId:$targetId)\n}"): (typeof documents)["mutation moveCountry($action:ListAction!,$sourceId:ID!,$targetId:ID!){\n  moveCountry(action: $action,sourceID:$sourceId,targetId:$targetId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query regionList($first: Int,$orderBy:RegionOrder,$where:RegionWhereInput){\n  regions(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n      }\n    }\n  }\n}"): (typeof documents)["query regionList($first: Int,$orderBy:RegionOrder,$where:RegionWhereInput){\n  regions(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query regionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Region{\n      id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n    }\n  }\n}"): (typeof documents)["query regionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Region{\n      id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateRegion($regionId:ID!,$input: UpdateRegionInput!){\n  updateRegion(regionID:$regionId,input:$input){\n    id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n  }\n}"): (typeof documents)["mutation updateRegion($regionId:ID!,$input: UpdateRegionInput!){\n  updateRegion(regionID:$regionId,input:$input){\n    id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createRegion($input: CreateRegionInput!){\n  createRegion(input:$input){\n    id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n  }\n}"): (typeof documents)["mutation createRegion($input: CreateRegionInput!){\n  createRegion(input:$input){\n    id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delRegion($regionId:ID!){\n  deleteRegion(regionID: $regionId)\n}"): (typeof documents)["mutation delRegion($regionId:ID!){\n  deleteRegion(regionID: $regionId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation moveRegion($action:TreeAction!,$sourceId:ID!,$targetId:ID!){\n  moveRegion(action: $action,sourceID:$sourceId,targetId:$targetId)\n}"): (typeof documents)["mutation moveRegion($action:TreeAction!,$sourceId:ID!,$targetId:ID!){\n  moveRegion(action: $action,sourceID:$sourceId,targetId:$targetId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query currencyList($first: Int,$orderBy:CurrencyOrder,$where:CurrencyWhereInput){\n  currencies(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,sign,status,createdAt\n      }\n    }\n  }\n}"): (typeof documents)["query currencyList($first: Int,$orderBy:CurrencyOrder,$where:CurrencyWhereInput){\n  currencies(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,name,code,sign,status,createdAt\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query currencyInfo($gid:GID!){\n  node(id:$gid){\n    ... on Currency{\n      id,name,code,sign,status,createdAt\n    }\n  }\n}"): (typeof documents)["query currencyInfo($gid:GID!){\n  node(id:$gid){\n    ... on Currency{\n      id,name,code,sign,status,createdAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateCurrency($id:ID!,$input: UpdateCurrencyInput!){\n  updateCurrency(currencyID:$id,input:$input){\n    id,name,code,sign,status,createdAt\n  }\n}"): (typeof documents)["mutation updateCurrency($id:ID!,$input: UpdateCurrencyInput!){\n  updateCurrency(currencyID:$id,input:$input){\n    id,name,code,sign,status,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createCurrency($input: CreateCurrencyInput!){\n  createCurrency(input:$input){\n    id,name,code,sign,status,createdAt\n  }\n}"): (typeof documents)["mutation createCurrency($input: CreateCurrencyInput!){\n  createCurrency(input:$input){\n    id,name,code,sign,status,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delCurrency($id:ID!){\n  deleteCurrency(currencyID: $id)\n}"): (typeof documents)["mutation delCurrency($id:ID!){\n  deleteCurrency(currencyID: $id)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appDictList($first: Int,$orderBy:AppDictOrder,$where:AppDictWhereInput){\n  appDicts(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n        app{id,name}\n      }\n    }\n  }\n}"): (typeof documents)["query appDictList($first: Int,$orderBy:AppDictOrder,$where:AppDictWhereInput){\n  appDicts(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n        app{id,name}\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appDictInfo($gid:GID!){\n  node(id:$gid){\n   ... on AppDict{\n       id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n       app{id,name}\n     }\n   }\n }"): (typeof documents)["query appDictInfo($gid:GID!){\n  node(id:$gid){\n   ... on AppDict{\n       id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n       app{id,name}\n     }\n   }\n }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appDictItemList($gid:GID!){\n  node(id:$gid){\n   ... on AppDict{\n       id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n       items{\n        id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n        org{ id,name }\n       }\n     }\n   }\n }"): (typeof documents)["query appDictItemList($gid:GID!){\n  node(id:$gid){\n   ... on AppDict{\n       id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n       items{\n        id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n        org{ id,name }\n       }\n     }\n   }\n }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query appDictItemInfo($gid:GID!){\n  node(id:$gid){\n   ... on AppDictItem{\n      id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n      org{ id,name }\n     }\n   }\n }"): (typeof documents)["query appDictItemInfo($gid:GID!){\n  node(id:$gid){\n   ... on AppDictItem{\n      id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n      org{ id,name }\n     }\n   }\n }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppDict($dictId:ID!,$input: UpdateAppDictInput!){\n  updateAppDict(dictID:$dictId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n    app{id,name}\n  }\n}"): (typeof documents)["mutation updateAppDict($dictId:ID!,$input: UpdateAppDictInput!){\n  updateAppDict(dictID:$dictId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n    app{id,name}\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppDict($appId:ID!,$input: CreateAppDictInput!){\n  createAppDict(appID:$appId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n    app{id,name}\n   }\n}"): (typeof documents)["mutation createAppDict($appId:ID!,$input: CreateAppDictInput!){\n  createAppDict(appID:$appId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,\n    app{id,name}\n   }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteAppDict($dictId:ID!){\n  deleteAppDict(dictID: $dictId)\n}"): (typeof documents)["mutation deleteAppDict($dictId:ID!){\n  deleteAppDict(dictID: $dictId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateAppDictItem($itemId:ID!,$input:  UpdateAppDictItemInput!){\n  updateAppDictItem(itemID:$itemId,input:$input){\n    id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n    org{ id,name }\n  }\n}"): (typeof documents)["mutation updateAppDictItem($itemId:ID!,$input:  UpdateAppDictItemInput!){\n  updateAppDictItem(itemID:$itemId,input:$input){\n    id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n    org{ id,name }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAppDictItem($dictId:ID!,$input: CreateAppDictItemInput!){\n  createAppDictItem(dictID:$dictId,input:$input){\n    id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n    org{ id,name }\n  }\n}"): (typeof documents)["mutation createAppDictItem($dictId:ID!,$input: CreateAppDictItemInput!){\n  createAppDictItem(dictID:$dictId,input:$input){\n    id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,\n    org{ id,name }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteAppDictItem($itemId:ID!){\n  deleteAppDictItem(itemID: $itemId)\n}"): (typeof documents)["mutation deleteAppDictItem($itemId:ID!){\n  deleteAppDictItem(itemID: $itemId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation moveAppDictItem($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveAppDictItem(sourceID: $sourceId,targetID:$targetId,action:$action)\n}"): (typeof documents)["mutation moveAppDictItem($sourceId:ID!,$targetId:ID!,$action:TreeAction!){\n  moveAppDictItem(sourceID: $sourceId,targetID:$targetId,action:$action)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query fileIdentityList($first: Int,$orderBy:FileIdentityOrder,$where:FileIdentityWhereInput){\n  fileIdentities(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,comments\n        accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n        org{ id,name }\n      }\n    }\n  }\n}"): (typeof documents)["query fileIdentityList($first: Int,$orderBy:FileIdentityOrder,$where:FileIdentityWhereInput){\n  fileIdentities(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,comments\n        accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n        org{ id,name }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query fileIdentityInfo($gid:GID!){\n node(id:$gid){\n  ... on FileIdentity{\n      id,createdBy,createdAt,updatedBy,updatedAt,comments,\n      accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n      org{ id,name }\n    }\n  }\n}"): (typeof documents)["query fileIdentityInfo($gid:GID!){\n node(id:$gid){\n  ... on FileIdentity{\n      id,createdBy,createdAt,updatedBy,updatedAt,comments,\n      accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n      org{ id,name }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query fileIdentityAccessKeySecret($id:ID!){\n fileIdentityAccessKeySecret(id:$id)\n}"): (typeof documents)["query fileIdentityAccessKeySecret($id:ID!){\n fileIdentityAccessKeySecret(id:$id)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createFileIdentity($input: CreateFileIdentityInput!){\n  createFileIdentity(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,comments\n    accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n    org{ id,name }\n  }\n}"): (typeof documents)["mutation createFileIdentity($input: CreateFileIdentityInput!){\n  createFileIdentity(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,comments\n    accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n    org{ id,name }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateFileIdentity($id:ID!,$input: UpdateFileIdentityInput!){\n  updateFileIdentity(id:$id,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,comments\n    accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n    org{ id,name }\n  }\n}"): (typeof documents)["mutation updateFileIdentity($id:ID!,$input: UpdateFileIdentityInput!){\n  updateFileIdentity(id:$id,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,comments\n    accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,\n    org{ id,name }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteFileIdentity($id:ID!){\n  deleteFileIdentity(id: $id)\n}"): (typeof documents)["mutation deleteFileIdentity($id:ID!){\n  deleteFileIdentity(id: $id)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation setDefaultFileIdentity($id:ID!,$orgId: ID!){\n  setDefaultFileIdentity(identityID:$id,orgID:$orgId)\n}"): (typeof documents)["mutation setDefaultFileIdentity($id:ID!,$orgId: ID!){\n  setDefaultFileIdentity(identityID:$id,orgID:$orgId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query fileSourceList($first: Int,$orderBy:FileSourceOrder,$where:FileSourceWhereInput){\n  fileSources(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n        bucket,bucketURL,stsEndpoint,endpointImmutable\n      }\n    }\n  }\n}"): (typeof documents)["query fileSourceList($first: Int,$orderBy:FileSourceOrder,$where:FileSourceWhereInput){\n  fileSources(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n        bucket,bucketURL,stsEndpoint,endpointImmutable\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query fileSourceInfo($gid:GID!){\n node(id:$gid){\n  ... on FileSource{\n      id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n      bucket,bucketURL,stsEndpoint,endpointImmutable\n    }\n  }\n}"): (typeof documents)["query fileSourceInfo($gid:GID!){\n node(id:$gid){\n  ... on FileSource{\n      id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n      bucket,bucketURL,stsEndpoint,endpointImmutable\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createFileSource($input: CreateFileSourceInput!){\n  createFileSource(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n    bucket,bucketURL,stsEndpoint,endpointImmutable\n  }\n}"): (typeof documents)["mutation createFileSource($input: CreateFileSourceInput!){\n  createFileSource(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n    bucket,bucketURL,stsEndpoint,endpointImmutable\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateFileSource($fsId:ID!,$input: UpdateFileSourceInput!){\n  updateFileSource(fsID:$fsId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n    bucket,bucketURL,stsEndpoint,endpointImmutable\n  }\n}"): (typeof documents)["mutation updateFileSource($fsId:ID!,$input: UpdateFileSourceInput!){\n  updateFileSource(fsID:$fsId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,\n    bucket,bucketURL,stsEndpoint,endpointImmutable\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteFileSource($fsId:ID!){\n  deleteFileSource(fsID: $fsId)\n}"): (typeof documents)["mutation deleteFileSource($fsId:ID!){\n  deleteFileSource(fsID: $fsId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,redirectURI,appKey,appSecret,scopes,\n            tokenValidity,refreshTokenValidity,logo,comments,status,createdAt\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id\n      apps(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,name,code,kind,redirectURI,appKey,appSecret,scopes,\n            tokenValidity,refreshTokenValidity,logo,comments,status,createdAt\n          }\n        }\n      }\n    }\n  }\n}"];
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
export function gql(source: "query orgAppActionList($appCode:String!,$orgId:ID!){\n  orgAppActions(appCode: $appCode,orgID: $orgId){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}"): (typeof documents)["query orgAppActionList($appCode:String!,$orgId:ID!){\n  orgAppActions(appCode: $appCode,orgID: $orgId){\n    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n        domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n        owner { id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){\n  organizations(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n        domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n        owner { id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgInfo($gid:GID!){\n  node(id: $gid){\n    ... on Org{\n      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,customDomain,\n      domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n      owner { id,displayName }\n      logo{ favicon, logo, thumbLogo}\n    }\n  }\n}"): (typeof documents)["query orgInfo($gid:GID!){\n  node(id: $gid){\n    ... on Org{\n      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,customDomain,\n      domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n      owner { id,displayName }\n      logo{ favicon, logo, thumbLogo}\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createRootOrg($input: CreateOrgInput!){\n  createRoot(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}"): (typeof documents)["mutation createRootOrg($input: CreateOrgInput!){\n  createRoot(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){\n  updateOrganization(orgID:$orgId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}"): (typeof documents)["mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){\n  updateOrganization(orgID:$orgId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createOrg($input: CreateOrgInput!){\n  createOrganization(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}"): (typeof documents)["mutation createOrg($input: CreateOrgInput!){\n  createOrganization(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation enableDirectory($input: EnableDirectoryInput!){\n  enableDirectory(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}"): (typeof documents)["mutation enableDirectory($input: EnableDirectoryInput!){\n  enableDirectory(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,\n    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency\n    owner { id,displayName }\n    logo{ favicon, logo, thumbLogo}\n  }\n}"];
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
export function gql(source: "query userPasswordPolicy($gid: GID!){\n  node(id:$gid){\n    ... on Org{\n      id\n      userPasswordPolicy{\n        id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes\n      }\n    }\n  }\n}"): (typeof documents)["query userPasswordPolicy($gid: GID!){\n  node(id:$gid){\n    ... on Org{\n      id\n      userPasswordPolicy{\n        id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateUserPasswordPolicy($orgId:ID!,$input: UpdateUserPasswordPolicyInput!){\n  updateUserPasswordPolicy(orgID:$orgId,input:$input){\n    id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes,tenantID\n  }\n}"): (typeof documents)["mutation updateUserPasswordPolicy($orgId:ID!,$input: UpdateUserPasswordPolicyInput!){\n  updateUserPasswordPolicy(orgID:$orgId,input:$input){\n    id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes,tenantID\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createUserPasswordPolicy($orgId:ID!,$input: CreateUserPasswordPolicyInput!){\n  createUserPasswordPolicy(orgID:$orgId,input:$input){\n    id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes,tenantID\n  }\n}"): (typeof documents)["mutation createUserPasswordPolicy($orgId:ID!,$input: CreateUserPasswordPolicyInput!){\n  createUserPasswordPolicy(orgID:$orgId,input:$input){\n    id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes,tenantID\n  }\n}"];
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
export function gql(source: "mutation createOrgPolicy($input: CreateOrgPolicyInput!){\n  createOrganizationPolicy(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n  }\n}"): (typeof documents)["mutation createOrgPolicy($input: CreateOrgPolicyInput!){\n  createOrganizationPolicy(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateOrgPolicy($orgPolicyId:ID!,$input: UpdateOrgPolicyInput!){\n  updateOrganizationPolicy(orgPolicyID:$orgPolicyId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n  }\n}"): (typeof documents)["mutation updateOrgPolicy($orgPolicyId:ID!,$input: UpdateOrgPolicyInput!){\n  updateOrganizationPolicy(orgPolicyID:$orgPolicyId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments\n  }\n}"];
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
export function gql(source: "query orgPolicyView($appCode: String!,$orgID: ID){\n  orgPolicyView(appCode: $appCode,orgID: $orgID){\n    appPolicyView{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,\n      policyID\n    }\n    orgPolicy{id}\n  }\n}"): (typeof documents)["query orgPolicyView($appCode: String!,$orgID: ID){\n  orgPolicyView(appCode: $appCode,orgID: $orgID){\n    appPolicyView{\n      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,\n      policyID\n    }\n    orgPolicy{id}\n  }\n}"];
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
export function gql(source: "query userGroupList($userId: ID!,$orgID: ID,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userGroups(userID:$userId,orgID:$orgID,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"): (typeof documents)["query userGroupList($userId: ID!,$orgID: ID,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userGroups(userID:$userId,orgID:$orgID,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userRoleList($userId: ID!,$orgId:ID,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userRoles(userID:$userId,orgID:$orgId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"): (typeof documents)["query userRoleList($userId: ID!,$orgId:ID,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userRoles(userID:$userId,orgID:$orgId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n      }\n    }\n  }\n}"];
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
export function gql(source: "mutation createOrgRole($input: CreateOrgRoleInput!){\n  createRole(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n  }\n}"): (typeof documents)["mutation createOrgRole($input: CreateOrgRoleInput!){\n  createRole(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){\n  updateRole(roleID:$orgRoleId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n  }\n}"): (typeof documents)["mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){\n  updateRole(roleID:$orgRoleId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n  }\n}"];
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
export function gql(source: "query orgPolicyViewRoleAssigned($appCode: String!,$orgRoleID:ID!,$orgID: ID){\n  orgPolicyViewRoleAssigned(appCode:$appCode,orgID:$orgID,orgRoleID:$orgRoleID)\n}"): (typeof documents)["query orgPolicyViewRoleAssigned($appCode: String!,$orgRoleID:ID!,$orgID: ID){\n  orgPolicyViewRoleAssigned(appCode:$appCode,orgID:$orgID,orgRoleID:$orgRoleID)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignOrgRolePolicyView($orgID: ID!, $roleID: ID!,$rmOrgPolicyIDs: [ID!],$addOrgPolicyIDs: [ID!]){\n  assignOrgRolePolicyView(orgID: $orgID, roleID: $roleID,rmOrgPolicyIDs: $rmOrgPolicyIDs,addOrgPolicyIDs: $addOrgPolicyIDs)\n}"): (typeof documents)["mutation assignOrgRolePolicyView($orgID: ID!, $roleID: ID!,$rmOrgPolicyIDs: [ID!],$addOrgPolicyIDs: [ID!]){\n  assignOrgRolePolicyView(orgID: $orgID, roleID: $roleID,rmOrgPolicyIDs: $rmOrgPolicyIDs,addOrgPolicyIDs: $addOrgPolicyIDs)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgUserList($gid: GID!,$orgId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            contact{email,mobile},userType,creationType,registerIP,status,comments\n            orgUserType(orgID: $orgId)\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgUserList($gid: GID!,$orgId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n            contact{email,mobile},userType,creationType,registerIP,status,comments\n            orgUserType(orgID: $orgId)\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgUserListAndIsOrgRole($gid: GID!,$orgId:ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,orgUserType(orgID: $orgId)\n            contact{email,mobile},userType,creationType,registerIP,status,comments\n            isAssignOrgRole(orgRoleID: $orgRoleId)\n            isAllowRevokeRole(orgRoleID: $orgRoleId)\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgUserListAndIsOrgRole($gid: GID!,$orgId:ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  node(id:$gid){\n    ... on Org{\n      id,\n      users(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,orgUserType(orgID: $orgId)\n            contact{email,mobile},userType,creationType,registerIP,status,comments\n            isAssignOrgRole(orgRoleID: $orgRoleId)\n            isAllowRevokeRole(orgRoleID: $orgRoleId)\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgRoleUserListAndIsOrgRole($roleId: ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}"): (typeof documents)["query orgRoleUserListAndIsOrgRole($roleId: ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}"];
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
export function gql(source: "query memberList($orgId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  userMembers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,\n        orgUserType(orgID: $orgId)\n      }\n    }\n  }\n}"): (typeof documents)["query memberList($orgId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  userMembers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,\n        orgUserType(orgID: $orgId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation changeOrgUserType($orgId:ID!,$userId:ID!,$userType:OrgUserUserType!){\n  changeOrgUserType(userID:$userId,userType:$userType,orgID: $orgId)\n}"): (typeof documents)["mutation changeOrgUserType($orgId:ID!,$userId:ID!,$userType:OrgUserUserType!){\n  changeOrgUserType(userID:$userId,userType:$userType,orgID: $orgId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyViewUserAssigned($appCode: String!,$userID:ID!,$orgID:ID){\n  orgPolicyViewUserAssigned(appCode:$appCode,orgID:$orgID,userID: $userID)\n}"): (typeof documents)["query orgPolicyViewUserAssigned($appCode: String!,$userID:ID!,$orgID:ID){\n  orgPolicyViewUserAssigned(appCode:$appCode,orgID:$orgID,userID: $userID)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation assignOrgUserPolicyView($orgID: ID!, $userID: ID!,$rmOrgPolicyIDs: [ID!],$addOrgPolicyIDs: [ID!]){\n  assignOrgUserPolicyView(orgID: $orgID, userID: $userID,rmOrgPolicyIDs: $rmOrgPolicyIDs,addOrgPolicyIDs: $addOrgPolicyIDs)\n}"): (typeof documents)["mutation assignOrgUserPolicyView($orgID: ID!, $userID: ID!,$rmOrgPolicyIDs: [ID!],$addOrgPolicyIDs: [ID!]){\n  assignOrgUserPolicyView(orgID: $orgID, userID: $userID,rmOrgPolicyIDs: $rmOrgPolicyIDs,addOrgPolicyIDs: $addOrgPolicyIDs)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userOrgRoles($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userOrgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}"): (typeof documents)["query userOrgRoles($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){\n  userOrgRoles(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole\n        isGrantUser(userID: $userId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query parentOrgUsers($orgId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  parentOrgUsers(orgID:$orgId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,\n      }\n    }\n  }\n}"): (typeof documents)["query parentOrgUsers($orgId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  parentOrgUsers(orgID:$orgId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query parentOrgUsersRoleId($orgId:ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  parentOrgUsers(orgID:$orgId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}"): (typeof documents)["query parentOrgUsersRoleId($orgId:ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  parentOrgUsers(orgID:$orgId,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,\n        isAssignOrgRole(orgRoleID: $orgRoleId)\n        isAllowRevokeRole(orgRoleID: $orgRoleId)\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  orgPolicyReferences(policyID:$orgPolicyId, first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  orgPolicyReferences(policyID:$orgPolicyId, first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name }\n        user{ id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on Org{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on Org{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on User{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name,comments }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  node(id:$gid){\n    ... on User{\n      permissions(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n            role{ id,orgID,kind,name,isAppRole }\n            orgPolicy{ id,orgID,appPolicyID,name,comments }\n            user{ id,displayName }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userExtendGroupPolicieList($userId: ID!,$orgID:ID,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  userExtendGroupPolicies(userID:$userId,orgID:$orgID,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name,comments}\n        user{ id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query userExtendGroupPolicieList($userId: ID!,$orgID:ID,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  userExtendGroupPolicies(userID:$userId,orgID:$orgID,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name,comments}\n        user{ id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userExtendRolePolicieList($userId: ID!,$orgID:ID,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  userExtendRolePolicies(userID:$userId,orgID:$orgID,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name,comments}\n        user{ id,displayName }\n      }\n    }\n  }\n}"): (typeof documents)["query userExtendRolePolicieList($userId: ID!,$orgID:ID,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){\n  userExtendRolePolicies(userID:$userId,orgID:$orgID,first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n        role{ id,orgID,kind,name,isAppRole }\n        orgPolicy{ id,orgID,appPolicyID,name,comments}\n        user{ id,displayName }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query permissionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Permission{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n      userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n      role{ id,orgID,kind,name,isAppRole }\n      orgPolicy{ id,orgID,appPolicyID,name }\n      user{ id,displayName }\n    }\n  }\n}"): (typeof documents)["query permissionInfo($gid:GID!){\n  node(id:$gid){\n    ... on Permission{\n      id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n      userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n      role{ id,orgID,kind,name,isAppRole }\n      orgPolicy{ id,orgID,appPolicyID,name }\n      user{ id,displayName }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createPermission($input: CreatePermissionInput!){\n  grant(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n    userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n    role{ id,orgID,kind,name,isAppRole }\n    orgPolicy{ id,orgID,appPolicyID,name }\n    user{ id,displayName }\n  }\n}"): (typeof documents)["mutation createPermission($input: CreatePermissionInput!){\n  grant(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n    userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n    role{ id,orgID,kind,name,isAppRole }\n    orgPolicy{ id,orgID,appPolicyID,name }\n    user{ id,displayName }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){\n  updatePermission(permissionID:$permissionId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n    userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n    role{ id,orgID,kind,name,isAppRole }\n    orgPolicy{ id,orgID,appPolicyID,name }\n    user{ id,displayName }\n  }\n}"): (typeof documents)["mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){\n  updatePermission(permissionID:$permissionId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,\n    userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,\n    role{ id,orgID,kind,name,isAppRole }\n    orgPolicy{ id,orgID,appPolicyID,name }\n    user{ id,displayName }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation revoke($permissionId:ID!,$orgId:ID!){\n  revoke(permissionID:$permissionId,orgID:$orgId)\n}"): (typeof documents)["mutation revoke($permissionId:ID!,$orgId:ID!){\n  revoke(permissionID:$permissionId,orgID:$orgId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query quotaItems($first: Int,$where:QuotaItemWhereInput,$orderBy:QuotaItemOrder){\n    quotaItems(first:$first,where: $where,orderBy: $orderBy){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n            cursor,node{\n                id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n            }\n        }\n    }\n}"): (typeof documents)["query quotaItems($first: Int,$where:QuotaItemWhereInput,$orderBy:QuotaItemOrder){\n    quotaItems(first:$first,where: $where,orderBy: $orderBy){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n            cursor,node{\n                id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n            }\n        }\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query quotaItemInfo($gid:GID!){\n    node(id:$gid){\n        ... on QuotaItem{\n            id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n        }\n    }\n}"): (typeof documents)["query quotaItemInfo($gid:GID!){\n    node(id:$gid){\n        ... on QuotaItem{\n            id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n        }\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createQuotaItem($input: CreateQuotaItemInput!){\n    createQuotaItem(input:$input){\n        id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n    }\n}"): (typeof documents)["mutation createQuotaItem($input: CreateQuotaItemInput!){\n    createQuotaItem(input:$input){\n        id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateQuotaItem($itemId:ID!,$input: UpdateQuotaItemInput!){\n    updateQuotaItem(id:$itemId,input:$input){\n        id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n    }\n}"): (typeof documents)["mutation updateQuotaItem($itemId:ID!,$input: UpdateQuotaItemInput!){\n    updateQuotaItem(id:$itemId,input:$input){\n        id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteQuotaItem($itemId:ID!){\n    deleteQuotaItem(id: $itemId)\n}"): (typeof documents)["mutation deleteQuotaItem($itemId:ID!){\n    deleteQuotaItem(id: $itemId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query quotaList($first: Int,$orderBy:QuotaOrder,$where:QuotaWhereInput){\n  quotas(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdAt,limit,used,startAt,endAt,userID,tenantID\n        quotaOrg {\n          id\n          name\n        }\n        quotaUser {\n          id\n          displayName\n        }\n        quotaItem {\n          id\n          name\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query quotaList($first: Int,$orderBy:QuotaOrder,$where:QuotaWhereInput){\n  quotas(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdAt,limit,used,startAt,endAt,userID,tenantID\n        quotaOrg {\n          id\n          name\n        }\n        quotaUser {\n          id\n          displayName\n        }\n        quotaItem {\n          id\n          name\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query quotaInfo($gid:GID!){\n    node(id:$gid){\n        ... on Quota{\n            id,createdAt,limit,used,startAt,endAt,userID,tenantID\n          quotaOrg {\n            id\n            name\n          }\n          quotaUser {\n            id\n            displayName\n          }\n          quotaItem {\n            id\n            name\n          }\n        }\n    }\n}"): (typeof documents)["query quotaInfo($gid:GID!){\n    node(id:$gid){\n        ... on Quota{\n            id,createdAt,limit,used,startAt,endAt,userID,tenantID\n          quotaOrg {\n            id\n            name\n          }\n          quotaUser {\n            id\n            displayName\n          }\n          quotaItem {\n            id\n            name\n          }\n        }\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createQuota($input: CreateQuotaInput!){\n    createQuota(input:$input){\n        id,createdAt,limit,used,startAt,endAt,userID,tenantID\n    }\n}"): (typeof documents)["mutation createQuota($input: CreateQuotaInput!){\n    createQuota(input:$input){\n        id,createdAt,limit,used,startAt,endAt,userID,tenantID\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateQuota($quotaId:ID!,$input: UpdateQuotaInput!){\n    updateQuota(id:$quotaId,input:$input){\n        id,createdAt,limit,used,startAt,endAt,userID,tenantID\n    }\n}"): (typeof documents)["mutation updateQuota($quotaId:ID!,$input: UpdateQuotaInput!){\n    updateQuota(id:$quotaId,input:$input){\n        id,createdAt,limit,used,startAt,endAt,userID,tenantID\n    }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteQuota($quotaId:ID!){\n    deleteQuota(id: $quotaId)\n}"): (typeof documents)["mutation deleteQuota($quotaId:ID!){\n    deleteQuota(id: $quotaId)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n      }\n    }\n  }\n}"): (typeof documents)["query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  users(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,\n        contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfo($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n    }\n  }\n}"): (typeof documents)["query userInfo($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfoLoginProfile($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n    }\n  }\n}"): (typeof documents)["query userInfoLoginProfile($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfoLoginProfileIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"): (typeof documents)["query userInfoLoginProfileIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n      loginProfile{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n      }\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userInfoIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"): (typeof documents)["query userInfoIdentities($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n      contact{email,mobile},userType,creationType,registerIP,status,comments,\n      identities{\n        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userAccessKeyList($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,\n      oauthClients{\n        id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n      }\n    }\n  }\n}"): (typeof documents)["query userAccessKeyList($gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,\n      oauthClients{\n        id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createUser($rootOrgID:ID!,$input: CreateUserInput!,$orgUserType:OrgUserUserType){\n  createOrganizationUser(rootOrgID:$rootOrgID,input:$input,orgUserType:$orgUserType){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,orgUserType(orgID:$rootOrgID),\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n   }\n}"): (typeof documents)["mutation createUser($rootOrgID:ID!,$input: CreateUserInput!,$orgUserType:OrgUserUserType){\n  createOrganizationUser(rootOrgID:$rootOrgID,input:$input,orgUserType:$orgUserType){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,orgUserType(orgID:$rootOrgID),\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n   }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){\n  createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n  }\n}"): (typeof documents)["mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){\n  createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateUser($userId:ID!,$input: UpdateUserInput!,$contact: UpdateUserAddrInput!){\n  updateUser(userID:$userId,input:$input,contact:$contact){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n   }\n}"): (typeof documents)["mutation updateUser($userId:ID!,$input: UpdateUserInput!,$contact: UpdateUserAddrInput!){\n  updateUser(userID:$userId,input:$input,contact:$contact){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n   }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){\n  updateLoginProfile(userID:$userId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n    canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n   }\n}"): (typeof documents)["mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){\n  updateLoginProfile(userID:$userId,input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,\n    canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus\n   }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation bindUserIdentity($input: CreateUserIdentityInput!){\n  bindUserIdentity(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n   }\n}"): (typeof documents)["mutation bindUserIdentity($input: CreateUserIdentityInput!){\n  bindUserIdentity(input:$input){\n    id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status\n   }\n}"];
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
export function gql(source: "query orgRecycleUsers($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRecycleUsers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n        contact{email,mobile},userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"): (typeof documents)["query orgRecycleUsers($first: Int,$orderBy:UserOrder,$where:UserWhereInput){\n  orgRecycleUsers(first:$first,orderBy: $orderBy,where: $where){\n    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n    edges{\n      cursor,node{\n        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n        contact{email,mobile},userType,creationType,registerIP,status,comments\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation recoverOrgUser($userId:ID!,$setKind:UserLoginProfileSetKind!,$userInput: UpdateUserInput!,$contact: UpdateUserAddrInput!,$pwdInput: CreateUserPasswordInput){\n  recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, contact :$contact, pwdInput: $pwdInput ){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n  }\n}"): (typeof documents)["mutation recoverOrgUser($userId:ID!,$setKind:UserLoginProfileSetKind!,$userInput: UpdateUserInput!,$contact: UpdateUserAddrInput!,$pwdInput: CreateUserPasswordInput){\n  recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, contact :$contact, pwdInput: $pwdInput ){\n    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,gender,\n    contact{email,mobile},userType,creationType,registerIP,status,comments,avatar\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation createOauthClient($input: CreateOauthClientInput!){\n  createOauthClient( input: $input ){\n    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n  }\n}"): (typeof documents)["mutation createOauthClient($input: CreateOauthClientInput!){\n  createOauthClient( input: $input ){\n    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation enableOauthClient($id: ID!){\n  enableOauthClient( id: $id ){\n    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n  }\n}"): (typeof documents)["mutation enableOauthClient($id: ID!){\n  enableOauthClient( id: $id ){\n    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation disableOauthClient($id: ID!){\n  disableOauthClient( id: $id ){\n    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n  }\n}"): (typeof documents)["mutation disableOauthClient($id: ID!){\n  disableOauthClient( id: $id ){\n    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation delOauthClient($id: ID!){\n  deleteOauthClient( id: $id )\n}"): (typeof documents)["mutation delOauthClient($id: ID!){\n  deleteOauthClient( id: $id )\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userDevices($first: Int,$orderBy:UserDeviceOrder,$where:UserDeviceWhereInput,$gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,\n      devices(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,status,comments,deviceUID,deviceName,systemName,systemVersion,appVersion,deviceModel,\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query userDevices($first: Int,$orderBy:UserDeviceOrder,$where:UserDeviceWhereInput,$gid:GID!){\n  node(id:$gid){\n    ... on User {\n      id,\n      devices(first:$first,orderBy: $orderBy,where: $where){\n        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }\n        edges{\n          cursor,node{\n            id,createdBy,createdAt,updatedBy,updatedAt,status,comments,deviceUID,deviceName,systemName,systemVersion,appVersion,deviceModel,\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation deleteUserDevice($userID: ID!,$deviceID: ID!){\n  deleteUserDevice( userID: $userID,deviceID: $deviceID)\n}"): (typeof documents)["mutation deleteUserDevice($userID: ID!,$deviceID: ID!){\n  deleteUserDevice( userID: $userID,deviceID: $deviceID)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userApp{\n  userApps{\n    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n    refreshTokenValidity,logo,comments,status,createdAt\n  }\n}"): (typeof documents)["query userApp{\n  userApps{\n    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,\n    refreshTokenValidity,logo,comments,status,createdAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query userMfaInfo($userId: ID!,$orgId:ID!){\n  userMfaInfo(userID: $userId,orgID: $orgId){\n    accountName, mfaEnabled, qrCodeUri, secret\n  }\n}"): (typeof documents)["query userMfaInfo($userId: ID!,$orgId:ID!){\n  userMfaInfo(userID: $userId,orgID: $orgId){\n    accountName, mfaEnabled, qrCodeUri, secret\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query orgPolicyViewUserRoleAssigned($appCode:String!, $userId: ID!,$orgId:ID!){\n  orgPolicyViewUserRoleAssigned(appCode:$appCode userID: $userId,orgID: $orgId)\n}"): (typeof documents)["query orgPolicyViewUserRoleAssigned($appCode:String!, $userId: ID!,$orgId:ID!){\n  orgPolicyViewUserRoleAssigned(appCode:$appCode userID: $userId,orgID: $orgId)\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;