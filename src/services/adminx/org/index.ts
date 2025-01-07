import { gql } from '@/generated/adminx';
import { CreateOrgInput, CreateUserPasswordPolicyInput, EnableDirectoryInput, OrderDirection, Org, OrgKind, OrgOrder, OrgOrderField, OrgWhereInput, TreeAction, UpdateOrgInput, UpdateUserPasswordPolicyInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';
import { CreateUserPasswordInput } from '@knockout-js/api/ucenter';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'

export const EnumOrgStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
},
  EnumOrgKind = {
    [OrgKind.Root]: { text: '组织' },
    [OrgKind.Org]: { text: '部门' },
  };

const queryOrgList = gql(/* GraphQL */`query orgList($first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
  organizations(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
        domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency
        owner { id,displayName }
      }
    }
  }
}`);

const queryOrgInfo = gql(/* GraphQL */`query orgInfo($gid:GID!){
  node(id: $gid){
    ... on Org{
      id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,customDomain,
      domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency
      owner { id,displayName }
      logo{ favicon, logo, thumbLogo}
    }
  }
}`);

const mutationCreateRootOrg = gql(/* GraphQL */`mutation createRootOrg($input: CreateOrgInput!){
  createRoot(input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency
    owner { id,displayName }
    logo{ favicon, logo, thumbLogo}
  }
}`);

const mutationUpdateOrg = gql(/* GraphQL */`mutation updateOrg($orgId:ID!,$input: UpdateOrgInput!){
  updateOrganization(orgID:$orgId,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency
    owner { id,displayName }
    logo{ favicon, logo, thumbLogo}
  }
}`);

const mutationCreateOrg = gql(/* GraphQL */`mutation createOrg($input: CreateOrgInput!){
  createOrganization(input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency
    owner { id,displayName }
    logo{ favicon, logo, thumbLogo}
  }
}`);

const mutationEnableDirectory = gql(/* GraphQL */`mutation enableDirectory($input: EnableDirectoryInput!){
  enableDirectory(input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,localCurrency
    owner { id,displayName }
    logo{ favicon, logo, thumbLogo}
  }
}`);

const mutationDelOrg = gql(/* GraphQL */`mutation delOrg($orgId:ID!){
  deleteOrganization(orgID: $orgId)
}`);

const mutationMoveOrg = gql(/* GraphQL */`mutation moveOrg($sourceId:ID!,$targetId:ID!,$action:TreeAction!){
  moveOrganization(sourceID:$sourceId,targetId:$targetId,action:$action)
}`);

const queryUserPasswordPolicy = gql(/* GraphQL */`query userPasswordPolicy($gid: GID!){
  node(id:$gid){
    ... on Org{
      id
      userPasswordPolicy{
        id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes
      }
    }
  }
}`);

const mutationUpdatePwdPolicy = gql(/* GraphQL */`mutation updateUserPasswordPolicy($orgId:ID!,$input: UpdateUserPasswordPolicyInput!){
  updateUserPasswordPolicy(orgID:$orgId,input:$input){
    id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes,tenantID
  }
}`);

const mutationCreatePwdPolicy = gql(/* GraphQL */`mutation createUserPasswordPolicy($orgId:ID!,$input: CreateUserPasswordPolicyInput!){
  createUserPasswordPolicy(orgID:$orgId,input:$input){
    id,retry,includeChar,includeElement,invalidDay,invalidLoginLimit,allowIncludeUserName,length,captchaTimes,tenantID
  }
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
export async function getOrgPathList(orgId: string, kind?: OrgKind) {
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
      gid: gid('Org', orgId),
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

/**
 * 组织下的密码策略
 * @param orgId
 * @returns
 */
export async function getPwdPolicy(orgId: string) {
  const result = await query(queryUserPasswordPolicy, {
    gid: gid('Org', orgId),
  });
  if (result.data?.node?.__typename === 'Org') {
    return result.data.node.userPasswordPolicy;
  }
  return null;
}

/**
 * 更新密码策略
 * @param orgId
 * @param input
 * @returns
 */
export async function updatePwdPolicy(orgId: string, input: UpdateUserPasswordPolicyInput) {
  const
    result = await mutation(mutationUpdatePwdPolicy, {
      orgId,
      input,
    });
  if (result.data?.updateUserPasswordPolicy?.id) {
    return result.data.updateUserPasswordPolicy;
  }
  return null;
}

/**
 * 创建密码策略
 * @param orgId
 * @param input
 * @returns
 */
export async function createPwdPolicy(orgId: string, input: CreateUserPasswordPolicyInput) {
  const
    result = await mutation(mutationCreatePwdPolicy, {
      orgId,
      input,
    });
  if (result.data?.createUserPasswordPolicy?.id) {
    return result.data.createUserPasswordPolicy;
  }
  return null;
}
