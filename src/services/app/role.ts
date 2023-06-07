import { gid } from '@/util';
import { App, AppNodeField } from '.';
import { TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, setClearInputField } from '../graphql';
import { AppPolicy, AppPolicyField } from './policy';

export type AppRole = {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  appID: string;
  name: string;
  comments: string;
  autoGrant: boolean;
  editable: boolean;
  app?: App;
  policies?: AppPolicy[];
};


const AppRoleField = `
  id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,
  autoGrant,editable
`;


/**
 * 获取应用角色
 * @param appId
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getAppRoleList(appId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
  const { } = getGraphqlFilter(params, filter, sort),
    result = await graphqlApi(
      `query appRoles{
        node(id:"${gid('app', appId)}"){
          ... on App{
            id,
            list:roles{
              ${AppRoleField}
            }
          }
        }
      }`,
    );

  if (result?.data?.node?.list) {
    return result.data.node.list as AppRole[];
  } else {
    return null;
  }
}


/**
 * 获取应用角色
 * @param appRoleId
 * @returns
 */
export async function getAppRoleInfo(appRoleId: string, scene?: Array<'policies' | 'app'>) {
  const result = await graphqlApi(
    `query node{
      node(id:"${gid('app_role', appRoleId)}"){
        ... on AppRole{
          ${AppRoleField}
          ${scene?.includes('app') ? `app{
            ${AppNodeField}
          }` : ''}
          ${scene?.includes('policies') ? `policies{
            ${AppPolicyField}
          }` : ''}
        }
      }
    }`);

  if (result?.data?.node) {
    return result.data.node as AppRole;
  } else {
    return null;
  }
}


/**
 * 创建
 * @param input
 * @returns
 */
export async function createAppRole(appId: string, input: AppRole | Record<string, any>) {
  input.appID = appId;
  const result = await graphqlApi(
    `mutation createAppRole($input: CreateAppRoleInput!){
      action:createAppRole(appID:"${appId}",input:$input){
        ${AppRoleField}
      }
    }`, { input: input });

  if (result?.data?.action?.id) {
    return result.data.action as AppRole;
  } else {
    return null;
  }
}

/**
 * 更新
 * @param appRoleId
 * @param input
 * @returns
 */
export async function updateAppRole(appRoleId: string, input: AppRole | Record<string, any>) {
  const result = await graphqlApi(
    `mutation updateAppRole($input: UpdateAppRoleInput!){
      action:updateAppRole(roleID:"${appRoleId}",input:$input){
        ${AppRoleField}
      }
    }`, { input: setClearInputField(input) });

  if (result?.data?.action?.id) {
    return result.data.action as AppRole;
  } else {
    return null;
  }
}

/**
 * 删除
 * @param appRoleId
 * @returns
 */
export async function delAppRole(appRoleId: string) {
  const result = await graphqlApi(
    `mutation deleteAppRole{
      action:deleteAppRole(roleID: "${appRoleId}")
    }`);

  if (result?.data?.action) {
    return result?.data?.action as boolean;
  } else {
    return null;
  }
}


/**
 * 角色添加策略
 * @param appId
 * @param appRoleId
 * @param appPolicyIDs
 * @returns
 */
export async function assignAppRolePolicy(appId: string, appRoleId: string, appPolicyIDs: string[]) {
  const result = await graphqlApi(
    `mutation assignAppRolePolicy($policyIds:[ID!]){
      action:assignAppRolePolicy(appID: "${appId}",roleID: "${appRoleId}",policyIDs:$policyIds)
    }`,
    {
      policyIds: appPolicyIDs,
    },
  );

  if (result?.data?.action) {
    return result?.data?.action as boolean;
  } else {
    return null;
  }
}

/**
 * 角色移除策略
 * @param appId
 * @param appRoleId
 * @param appPolicyIDs
 * @returns
 */
export async function revokeAppRolePolicy(appId: string, appRoleId: string, appPolicyIDs: string[]) {
  const result = await graphqlApi(
    `mutation revokeAppRolePolicy($policyIds:[ID!]){
      action:revokeAppRolePolicy(appID: "${appId}",roleID: "${appRoleId}",policyIDs:$policyIds)
    }`, {
    policyIds: appPolicyIDs,
  },
  );

  if (result?.data?.action) {
    return result?.data?.action as boolean;
  } else {
    return null;
  }
}


