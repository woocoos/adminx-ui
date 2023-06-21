import { gql } from '@/__generated__/knockout';
import { gid } from '@/util';
import { koClient } from '../';
import { CreateAppRoleInput, UpdateAppRoleInput } from '@/__generated__/knockout/graphql';

const queryAppRoleList = gql(/* GraphQL */`query appRoleList($gid:GID!){
  node(id:$gid){
    ... on App{
      id,
      list:roles{
        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable
      }
    }
  }
}`);

const queryAppRoleInfo = gql(/* GraphQL */`query appRoleInfo($gid:GID!){
  node(id:$gid){
    ... on AppRole{
      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable
      app{ id,name,code }
    }
  }
}`);

const queryAppRoleInfoPolicieList = gql(/* GraphQL */`query appRoleInfoPolicieList($gid:GID!){
  node(id:$gid){
    ... on AppRole{
      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,editable
      app{ id,name,code }
      policies{
        id,appID,name,comments,autoGrant,status,
        rules{ effect,actions,resources,conditions }
      }
    }
  }
}`);

const mutationCreateAppRole = gql(/* GraphQL */`mutation createAppRole($appId:ID!,$input: CreateAppRoleInput!){
  action:createAppRole(appID:$appId,input:$input){id}
}`);

const mutationUpdateAppRole = gql(/* GraphQL */`mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){
  action:updateAppRole(roleID:$appRoleId,input:$input){id}
}`);

const mutationDelAppRole = gql(/* GraphQL */`mutation delAppRole($appRoleId:ID!){
  action:deleteAppRole(roleID: $appRoleId)
}`);

const mutationAssignAppRolePolicy = gql(/* GraphQL */`mutation assignAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){
  action:assignAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)
}`);

const mutationRevokeAppRolePolicy = gql(/* GraphQL */`mutation revokeAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){
  action:revokeAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)
}`);


/**
 * 获取应用角色
 * @param appId
 * @returns
 */
export async function getAppRoleList(appId: string) {
  const koc = koClient(),
    result = await koc.client.query(
      queryAppRoleList, {
      gid: gid('app', appId),
    }).toPromise();

  if (result.data?.node?.__typename === 'App') {
    return result.data.node.list;
  }
  return null;
}


/**
 * 获取应用角色
 * @param appRoleId
 * @returns
 */
export async function getAppRoleInfo(appRoleId: string) {
  const koc = koClient(),
    result = await koc.client.query(
      queryAppRoleInfo, {
      gid: gid('app_role', appRoleId),
    }).toPromise();

  if (result.data?.node?.__typename === 'AppRole') {
    return result.data.node;
  }
  return null;
}

/**
 * 获取应用角色
 * @param appRoleId
 * @returns
 */
export async function getAppRoleInfoPolicieList(appRoleId: string) {
  const koc = koClient(),
    result = await koc.client.query(
      queryAppRoleInfoPolicieList, {
      gid: gid('app_role', appRoleId),
    }).toPromise();

  if (result.data?.node?.__typename === 'AppRole') {
    return result.data.node;
  }
  return null;
}


/**
 * 创建
 * @param input
 * @returns
 */
export async function createAppRole(appId: string, input: CreateAppRoleInput) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationCreateAppRole, {
      appId,
      input,
    }).toPromise();

  if (result.data?.action?.id) {
    return result.data.action;
  }
  return null;
}

/**
 * 更新
 * @param appRoleId
 * @param input
 * @returns
 */
export async function updateAppRole(appRoleId: string, input: UpdateAppRoleInput) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationUpdateAppRole, {
      appRoleId,
      input,
    }).toPromise();

  if (result.data?.action?.id) {
    return result.data.action;
  }
  return null;
}

/**
 * 删除
 * @param appRoleId
 * @returns
 */
export async function delAppRole(appRoleId: string) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationDelAppRole, {
      appRoleId,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}


/**
 * 角色添加策略
 * @param appId
 * @param appRoleId
 * @param appPolicyIDs
 * @returns
 */
export async function assignAppRolePolicy(appId: string, appRoleId: string, appPolicyIDs?: string | string[]) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationAssignAppRolePolicy, {
      appRoleId,
      appId,
      policyIds: appPolicyIDs,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}

/**
 * 角色移除策略
 * @param appId
 * @param appRoleId
 * @param appPolicyIDs
 * @returns
 */
export async function revokeAppRolePolicy(appId: string, appRoleId: string, appPolicyIDs: string[]) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationRevokeAppRolePolicy, {
      appRoleId,
      appId,
      policyIds: appPolicyIDs,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}
