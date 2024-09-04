import { gql } from '@/generated/adminx';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'
import { AppOrder, AppOrderField, AppWhereInput, OrderDirection } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';

const queryOrgAppList = gql(/* GraphQL */`query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){
  node(id:$gid){
    ... on Org{
      id
      apps(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,name,code,kind,redirectURI,appKey,appSecret,scopes,
            tokenValidity,refreshTokenValidity,logo,comments,status,createdAt
          }
        }
      }
    }
  }
}`);

const mutationAssignOrgApp = gql(/* GraphQL */`mutation assignOrgApp($orgId:ID!,$appId:ID!){
  assignOrganizationApp(orgID: $orgId,appID: $appId)
}`);

const mutationRevOrgApp = gql(/* GraphQL */`mutation revokeOrgApp($orgId:ID!,$appId:ID!){
  revokeOrganizationApp(orgID: $orgId,appID: $appId)
}`);

const queryOrgAppActionList = gql(/* GraphQL */`query orgAppActionList($appCode:String!){
  orgAppActions(appCode: $appCode){
    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments
  }
}`);

/**
 * 组织下的应用
 * @param orgId
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getOrgAppList(
  orgId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: AppWhereInput;
    orderBy?: AppOrder;
  }) {
  const result = await paging(
    queryOrgAppList, {
    gid: gid('org', orgId),
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy ?? {
      direction: OrderDirection.Desc,
      field: AppOrderField.CreatedAt
    },
  }, gather.current || 1);

  if (result.data?.node?.__typename === 'Org') {
    return result.data.node.apps;
  }
  return null;
}


/**
 * 组织分配应用
 * @param orgId
 * @param appId
 * @returns
 */
export async function assignOrgApp(orgId: string, appId: string) {
  const result = await mutation(
    mutationAssignOrgApp, {
    orgId,
    appId,
  });

  if (result.data?.assignOrganizationApp) {
    return result.data.assignOrganizationApp;
  }
  return null;
}

/**
 * 取消组织分配应用
 * @param orgId
 * @param appId
 * @returns
 */
export async function revokeOrgApp(orgId: string, appId: string) {
  const result = await mutation(
    mutationRevOrgApp, {
    orgId,
    appId,
  });

  if (result.data?.revokeOrganizationApp) {
    return result.data.revokeOrganizationApp;
  }
  return null;
}


/**
 * 组织下的应用授权权限
 * @param appCode
 * @returns
 */
export async function getOrgAppActionList(appCode: string) {
  const result = await query(
    queryOrgAppActionList, {
    appCode,
  });

  if (result.data?.orgAppActions) {
    return result.data.orgAppActions;
  }
  return [];
}
