import { gql } from '@/generated/adminx';
import { CreateOrgInput, EnableDirectoryInput, OrderDirection, Org, OrgKind, OrgOrder, OrgOrderField, OrgWhereInput, TreeAction, UpdateOrgInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'

export const EnumOrgStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
},
  EnumOrgKind = {
    root: { text: '组织' },
    org: { text: '部门' },
  };

const queryOrgList = gql(/* GraphQL */`query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
  organizations(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
        domain,code,name,profile,status,path,displaySort,countryCode,timezone,
        owner { id,displayName }
      }
    }
  }
}`);

const queryOrgInfo = gql(/* GraphQL */`query orgInfo($gid:GID!){
  node(id: $gid){
    ... on Org{
      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
      domain,code,name,profile,status,path,displaySort,countryCode,timezone,
      owner { id,displayName }
    }
  }
}`);

const mutationCreateRootOrg = gql(/* GraphQL */`mutation createRootOrg($input: CreateOrgInput!){
  createRoot(input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,
    owner { id,displayName }
  }
}`);

const mutationUpdateOrg = gql(/* GraphQL */`mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){
  updateOrganization(orgID:$orgId,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,
    owner { id,displayName }
  }
}`);

const mutationCreateOrg = gql(/* GraphQL */`mutation createOrg($input: CreateOrgInput!){
  createOrganization(input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,
    owner { id,displayName }
  }
}`);

const mutationEnableDirectory = gql(/* GraphQL */`mutation enableDirectory($input: EnableDirectoryInput!){
  enableDirectory(input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,
    owner { id,displayName }
  }
}`);

const mutationDelOrg = gql(/* GraphQL */`mutation delOrg($orgId:ID!){
  deleteOrganization(orgID: $orgId)
}`);

const mutationMoveOrg = gql(/* GraphQL */`mutation moveOrg($sourceId:ID!,$targetId:ID!,$action:TreeAction!){
  moveOrganization(sourceID:$sourceId,targetId:$targetId,action:$action)
}`);

/**
 * 获取组织信息
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getOrgList(gather: {
  current?: number;
  pageSize?: number;
  where?: OrgWhereInput;
  orderBy?: OrgOrder;
}) {
  const
    result = await paging(queryOrgList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy || {
        direction: OrderDirection.Asc,
        field: OrgOrderField.DisplaySort,
      },
    }, gather.current || 1);
  if (result.data?.organizations) {
    return result.data.organizations;
  }
  return null;
}

/**
 * 通过path获取整个组织树结构
 * @param orgId
 * @returns
 */
export async function getOrgPathList(orgId: string, kind: OrgKind) {
  const topOrg = await getOrgInfo(orgId),
    orgList: Org[] = [];
  if (topOrg?.id) {
    orgList.push(topOrg as Org);
    const result = await getOrgList({
      pageSize: 9999,
      where: {
        pathHasPrefix: `${topOrg.path}/`,
        kind: kind,
      },
    });
    if (result?.totalCount) {
      orgList.push(...(result.edges?.map(item => item?.node) as Org[] || []));
    }
  }
  return orgList;
}


/**
 * 获取组织信息
 * @param orgId
 * @returns
 */
export async function getOrgInfo(orgId: string) {
  const
    result = await query(queryOrgInfo, {
      gid: gid('org', orgId),
    });
  if (result.data?.node?.__typename === 'Org') {
    return result.data.node;
  }
  return null;
}

/**
 * 更新组织信息
 * @param orgId
 * @param input
 * @returns
 */
export async function updateOrgInfo(orgId: string, input: UpdateOrgInput) {
  const
    result = await mutation(mutationUpdateOrg, {
      orgId,
      input,
    });
  if (result.data?.updateOrganization?.id) {
    return result.data.updateOrganization;
  }
  return null;
}

/**
 * 创建组织信息
 * @param input
 * @param kind
 * @returns
 */
export async function createOrgInfo(input: CreateOrgInput, kind: OrgKind) {
  const
    result = await mutation(
      kind === OrgKind.Root ? mutationCreateRootOrg : mutationCreateOrg, {
      input,
    });
  if (result.data?.createRoot?.id) {
    return result.data.createRoot;
  }
  return null;
}

/**
 * 创建根组织信息
 * @param input
 * @returns
 */
export async function createRootOrgInfo(input: EnableDirectoryInput) {
  const
    result = await mutation(mutationEnableDirectory, {
      input,
    });
  if (result.data?.enableDirectory?.id) {
    return result.data.enableDirectory;
  }
  return null;
}

/**
 * 删除组织信息
 * @param orgId
 * @returns
 */
export async function delOrgInfo(orgId: string) {
  const
    result = await mutation(mutationDelOrg, {
      orgId,
    });
  if (result.data?.deleteOrganization) {
    return result.data.deleteOrganization;
  }
  return null;
}


/**
 * 组织位置移动
 * @param input
 * @returns
 */
export async function moveOrg(sourceId: string, targetId: string, action: TreeAction) {
  const
    result = await mutation(mutationMoveOrg, {
      sourceId,
      targetId,
      action,
    });
  if (result.data?.moveOrganization) {
    return result.data.moveOrganization;
  }
  return null;
}
