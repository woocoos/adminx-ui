import { gql } from '@/__generated__/knockout';
import { gid } from '@/util';
import { koClient } from '../graphql';
import { AppOrder, AppWhereInput } from '@/__generated__/knockout/graphql';

const queryOrgAppList = gql(/* GraphQL */`query orgAppList($gid: GID!,$first: Int,$orderBy:AppOrder,$where:AppWhereInput){
  node(id:$gid){
    ... on Org{
      id
      list:apps(first:$first,orderBy: $orderBy,where: $where){
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
  action:assignOrganizationApp(orgID: $orgId,appID: $appId)
}`);

const mutationRevOrgApp = gql(/* GraphQL */`mutation revokeOrgApp($orgId:ID!,$appId:ID!){
  action:revokeOrganizationApp(orgID: $orgId,appID: $appId)
}`);

const queryOrgAppActionList = gql(/* GraphQL */`query orgAppActionList($appCode:String!){
  list:orgAppActions(appCode: $appCode){
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
  const koc = koClient(),
    result = await koc.client.query(
      queryOrgAppList, {
      gid: gid('org', orgId),
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`,
    }).toPromise();

  if (result.data?.node?.__typename === 'Org') {
    return result.data.node.list;
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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationAssignOrgApp, {
      orgId,
      appId,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationRevOrgApp, {
      orgId,
      appId,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}


/**
 * 组织下的应用授权权限
 * @param appCode
 * @returns
 */
export async function getOrgAppActionList(appCode: string) {
  const koc = koClient(),
    result = await koc.client.query(
      queryOrgAppActionList, {
      appCode,
    }).toPromise();

  if (result.data?.list) {
    return result.data.list;
  }
  return [];
}
