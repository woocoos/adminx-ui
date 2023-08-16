import { gql } from '@/generated/adminx';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'
import { CreateAppRoleInput, UpdateAppRoleInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';

const queryAppRoleList = gql(/* GraphQL */`query appRoleList($gid:GID!){
  node(id:$gid){
    ... on App{
      id,
      roles{
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
  createAppRole(appID:$appId,input:$input){id}
}`);

const mutationUpdateAppRole = gql(/* GraphQL */`mutation updateAppRole($appRoleId:ID!, $input: UpdateAppRoleInput!){
  updateAppRole(roleID:$appRoleId,input:$input){id}
}`);

const mutationDelAppRole = gql(/* GraphQL */`mutation delAppRole($appRoleId:ID!){
  deleteAppRole(roleID: $appRoleId)
}`);

const mutationAssignAppRolePolicy = gql(/* GraphQL */`mutation assignAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){
  assignAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)
}`);

const mutationRevokeAppRolePolicy = gql(/* GraphQL */`mutation revokeAppRolePolicy($appId:ID!,$appRoleId:ID!,$policyIds:[ID!]){
  revokeAppRolePolicy(appID: $appId,roleID: $appRoleId,policyIDs:$policyIds)
}`);


/**
 * 获取应用角色
 * @param appId
 * @returns
 */
export async function getAppRoleList(appId: string) {
  const
    result = await query(
      queryAppRoleList, {
      gid: gid('app', appId),
    });

  if (result.data?.node?.__typename === 'App') {
    return result.data.node.roles;
  }
  return null;
}


/**
 * 获取应用角色
 * @param appRoleId
 * @returns
 */
export async function getAppRoleInfo(appRoleId: string) {
  const
    result = await query(
      queryAppRoleInfo, {
      gid: gid('app_role', appRoleId),
    });

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
  const
    result = await query(
      queryAppRoleInfoPolicieList, {
      gid: gid('app_role', appRoleId),
    });

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
  const
    result = await mutation(
      mutationCreateAppRole, {
      appId,
      input,
    });

  if (result.data?.createAppRole?.id) {
    return result.data.createAppRole;
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
  const
    result = await mutation(
      mutationUpdateAppRole, {
      appRoleId,
      input,
    });

  if (result.data?.updateAppRole?.id) {
    return result.data.updateAppRole;
  }
  return null;
}

/**
 * 删除
 * @param appRoleId
 * @returns
 */
export async function delAppRole(appRoleId: string) {
  const
    result = await mutation(
      mutationDelAppRole, {
      appRoleId,
    });

  if (result.data?.deleteAppRole) {
    return result.data.deleteAppRole;
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
  const
    result = await mutation(
      mutationAssignAppRolePolicy, {
      appRoleId,
      appId,
      policyIds: appPolicyIDs,
    });

  if (result.data?.assignAppRolePolicy) {
    return result.data.assignAppRolePolicy;
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
  const
    result = await mutation(
      mutationRevokeAppRolePolicy, {
      appRoleId,
      appId,
      policyIds: appPolicyIDs,
    });

  if (result.data?.revokeAppRolePolicy) {
    return result.data.revokeAppRolePolicy;
  }
  return null;
}
