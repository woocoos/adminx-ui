import { gql } from '@/generated/adminx';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'
import {
  AppPolicyView,
  CreateAppPolicyInput,
  CreateAppPolicyViewInput,
  UpdateAppPolicyInput, UpdateAppPolicyViewInput, TreeAction,
} from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';

export const EnumAppPolicyStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
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
        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind
      }
    }
  }
}`);

const queryAppPolicieListAndIsGrant = gql(/* GraphQL */`query appPolicieListAndIsGrant($gid:GID!,$appRoleId:ID!){
  node(id:$gid){
    ... on App{
      id,
      policies{
        id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind
        isGrantAppRole(appRoleID: $appRoleId)
      }
    }
  }
}`);

const queryAppPolicyInfo = gql(/* GraphQL */`query appPolicyInfo($gid:GID!){
  node(id:$gid){
    ... on AppPolicy{
      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,
      rules{ effect,actions,resources,conditions }
      app{ id,name }
    }
  }
}`);

const queryAppPolicyView = gql(/* GraphQL */`query appPolicyView($appCode:String!){
  appPolicyView(appCode:$appCode){
    ... on AppPolicyView{
      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,
      policyID
    }
  }
}`);

const mutationCreateAppPolicy = gql(/* GraphQL */`mutation createAppPolicy($appId:ID!,$input: CreateAppPolicyInput!,$appPolicyViewID:ID){
  createAppPolicy(appID:$appId,input:$input,appPolicyViewID:$appPolicyViewID){
    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,
      rules{ effect,actions,resources,conditions }
      app{ id,name }
  }
}`);

const mutationUpdateAppPolicy = gql(/* GraphQL */`mutation updateAppPolicy($appPolicyId:ID!,$input: UpdateAppPolicyInput!){
  updateAppPolicy(policyID:$appPolicyId,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,autoGrant,status,kind,
      rules{ effect,actions,resources,conditions }
      app{ id,name }
  }
}`);

const mutationDelAppPolicy = gql(/* GraphQL */`mutation delAppPolicy($appPolicyId:ID!){
  deleteAppPolicy(policyID: $appPolicyId)
}`);

const mutationCreateAppPolicyView = gql(/* GraphQL */`mutation createAppPolicyView($input: CreateAppPolicyViewInput!){
  createAppPolicyView(input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind,policyID
  }
}`);

const mutationUpdateAppPolicyView = gql(/* GraphQL */`mutation updateAppPolicyView($appPolicyViewID:ID!, $input: UpdateAppPolicyViewInput!){
  updateAppPolicyView(appPolicyViewID:$appPolicyViewID,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,parentID,displaySort,kind
  }
}`);

const mutationDelAppPolicyView = gql(/* GraphQL */`mutation delAppPolicyView($appPolicyViewID:ID!){
  deleteAppPolicyView(appPolicyViewID: $appPolicyViewID)
}`);

const mutationMoveAppPolicyView = gql(/* GraphQL */`mutation moveAppPolicyView($sourceId:ID!,$targetId:ID!,$action:TreeAction!){
  moveAppPolicyView(sourceID:$sourceId,targetID:$targetId,action:$action)
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
  const
    result = isGrant?.appRoleId ? await query(
      queryAppPolicieListAndIsGrant, {
      gid: gid('App', appId),
      appRoleId: isGrant.appRoleId,
    }) : await query(
      queryAppPolicieList, {
      gid: gid('App', appId),
    });

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
  const
    result = await query(
      queryAppPolicyInfo, {
      gid: gid('AppPolicy', appPolicyId),
    });

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
export async function createAppPolicy(appId: string, input: CreateAppPolicyInput, appPolicyViewID?: string) {
  const
    result = await mutation(
      mutationCreateAppPolicy, {
      appId,
      input,
      appPolicyViewID,
    });

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
  const
    result = await mutation(
      mutationUpdateAppPolicy, {
      appPolicyId,
      input,
    });

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
  const
    result = await mutation(
      mutationDelAppPolicy, {
      appPolicyId,
    });

  if (result.data?.deleteAppPolicy) {
    return result.data.deleteAppPolicy;
  }
  return null;
}

/**
 * 获取应用权限策略视图
 * @param appCode
 * @returns
 */
export async function getAppPolicyView(appCode: string) {
  const result = await query(
    queryAppPolicyView, {
    appCode: appCode,
  });

  if (result.data?.appPolicyView) {
    return result.data.appPolicyView.sort((a, b) => {
      const apid = a.parentID,
        bpid = b.parentID,
        aSort = a.displaySort ?? 0,
        bSort = b.displaySort ?? 0;
      return apid < bpid ? -1 : apid > bpid ? 1 : aSort > bSort ? 1 : aSort < bSort ? -1 : 0;
    })
  }
  return [];
}

export async function createAppPolicyView(input: CreateAppPolicyViewInput) {
  const
    result = await mutation(mutationCreateAppPolicyView, {
      input,
    });

  if (result.data?.createAppPolicyView?.id) {
    return result.data.createAppPolicyView;
  }
  return null;
}

/**
 * 更新
 * @param appPolicyViewId
 * @param input
 * @returns
 */
export async function updateAppPolicyView(appPolicyViewID: string, input: UpdateAppPolicyViewInput) {
  const
    result = await mutation(
      mutationUpdateAppPolicyView, {
      appPolicyViewID,
      input,
    });

  if (result.data?.updateAppPolicyView?.id) {
    return result.data.updateAppPolicyView;
  }
  return null;
}

/**
 * 删除
 * @param appPolicyViewID
 * @returns
 */
export async function delAppPolicyView(appPolicyViewID: string) {
  const
    result = await mutation(
      mutationDelAppPolicyView, {
      appPolicyViewID,
    });

  if (result.data?.deleteAppPolicyView) {
    return result.data.deleteAppPolicyView;
  }
  return null;
}

/**
 * 菜单位置移动
 * @param input
 * @returns
 */
export async function moveAppPolicyView(sourceId: string, targetId: string, action: TreeAction) {
  const
    result = await mutation(
      mutationMoveAppPolicyView, {
      sourceId,
      targetId,
      action,
    });

  if (result.data?.moveAppPolicyView) {
    return result.data.moveAppPolicyView;
  }
  return null;
}
