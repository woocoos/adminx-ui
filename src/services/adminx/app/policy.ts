import { gql } from '@/__generated__/adminx';
import { gid } from '@/util';
import { koClient } from '../';
import { CreateAppPolicyInput, UpdateAppPolicyInput } from '@/__generated__/adminx/graphql';

export const EnumAppPolicyStatus = {
  active: { text: '活跃', status: 'success' },
  inactive: { text: '失活', status: 'default' },
  processing: { text: '处理中', status: 'warning' },
};

export const EnumPolicyRuleEffect = {
  allow: { text: '允许', status: 'success' },
  deny: { text: '拒绝', status: 'default' },
};

const queryAppPolicieList = gql(/* GraphQL */`query appPolicieList($gid:GID!){
  node(id:$gid){
    ... on App{
      id,
      policies{
        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status
      }
    }
  }
}`);

const queryAppPolicieListAndIsGrant = gql(/* GraphQL */`query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){
  node(id:$gid){
    ... on App{
      id,
      policies{
        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status
        isGrantAppRole(appRoleID: $appRoleId)
      }
    }
  }
}`);

const queryAppPolicyInfo = gql(/* GraphQL */`query appPolicyInfo($gid:GID!){
  node(id:$gid){
    ... on AppPolicy{
      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,
      rules{ effect,actions,resources,conditions }
      app{ id,name }
    }
  }
}`);

const mutationCreateAppPolicy = gql(/* GraphQL */`mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!){
  createAppPolicy(appID:$appId,input:$input){id}
}`);

const mutationUpdateAppPolicy = gql(/* GraphQL */`mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){
  updateAppPolicy(policyID:$appPolicyId,input:$input){id}
}`);

const mutationDelAppPolicy = gql(/* GraphQL */`mutation delAppPolicy($appPolicyId:ID!){
  deleteAppPolicy(policyID: $appPolicyId)
}`);

/**
 * 获取应用权限
 * @param appId
 * @param isGrant
 * @returns
 */
export async function getAppPolicyList(
  appId: string,
  isGrant?: {
    appRoleId?: string;
  }) {
  const koc = koClient(),
    result = isGrant?.appRoleId ? await koc.client.query(
      queryAppPolicieListAndIsGrant, {
      gid: gid('app', appId),
      appRoleId: isGrant.appRoleId,
    }).toPromise() : await koc.client.query(
      queryAppPolicieList, {
      gid: gid('app', appId),
    }).toPromise();

  if (result.data?.node?.__typename === 'App') {
    return result.data.node.policies;
  }
  return null;
}


/**
 * 获取应用权限
 * @param appPolicyId
 * @returns
 */
export async function getAppPolicyInfo(appPolicyId: string) {
  const koc = koClient(),
    result = await koc.client.query(
      queryAppPolicyInfo, {
      gid: gid('app_policy', appPolicyId),
    }).toPromise();

  if (result.data?.node?.__typename === 'AppPolicy') {
    return result.data.node;
  }
  return null;
}


/**
 * 创建
 * @param input
 * @returns
 */
export async function createAppPolicy(appId: string, input: CreateAppPolicyInput) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationCreateAppPolicy, {
      appId,
      input,
    }).toPromise();

  if (result.data?.createAppPolicy?.id) {
    return result.data.createAppPolicy;
  }
  return null;
}


/**
 * 更新
 * @param appPolicyId
 * @param input
 * @returns
 */
export async function updateAppPolicy(appPolicyId: string, input: UpdateAppPolicyInput) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationUpdateAppPolicy, {
      appPolicyId,
      input,
    }).toPromise();

  if (result.data?.updateAppPolicy?.id) {
    return result.data.updateAppPolicy;
  }
  return null;
}

/**
 * 删除
 * @param appPolicyId
 * @returns
 */
export async function delAppPolicy(appPolicyId: string) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationDelAppPolicy, {
      appPolicyId,
    }).toPromise();

  if (result.data?.deleteAppPolicy) {
    return result.data.deleteAppPolicy;
  }
  return null;
}
