import { gql } from "@/generated/adminx";
import { CreateFileIdentityInput, FileIdentityOrder, FileIdentityWhereInput, FileSourceKind, UpdateFileIdentityInput } from "@/generated/adminx/graphql";
import { gid } from "@knockout-js/api";
import { mutation, paging, query } from "@knockout-js/ice-urql/request";

export const EnumFileSourceKind = {
  [FileSourceKind.AwsS3]: { text: 'awsS3' },
  [FileSourceKind.AliOss]: { text: 'alioss' },
  [FileSourceKind.Minio]: { text: 'minio' },
};

const fileIdentityQuery = gql(/* GraphQL */`query fileIdentityList($first: Int,$orderBy:FileIdentityOrder,$where:FileIdentityWhereInput){
  fileIdentities(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,comments
        accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,
        org{ id,name }
      }
    }
  }
}`);

const fileIdentityInfoQuery = gql(/* GraphQL */`query fileIdentityInfo($gid:GID!){
 node(id:$gid){
  ... on FileIdentity{
      id,createdBy,createdAt,updatedBy,updatedAt,comments,
      accessKeyID,durationSeconds,fileSourceID,isDefault,policy,roleArn,tenantID,
      org{ id,name }
    }
  }
}`);

const fileIdentityAccessKeySecretQuery = gql(/* GraphQL */`query fileIdentityAccessKeySecret($id:ID!){
 fileIdentityAccessKeySecret(id:$id)
}`);


const mutationCreateFileIdentity = gql(/* GraphQL */`mutation createFileIdentity($input: CreateFileIdentityInput!){
  createFileIdentity(input:$input){id}
}`);

const mutationUpdateFileIdentity = gql(/* GraphQL */`mutation updateFileIdentity($id:ID!,$input: UpdateFileIdentityInput!){
  updateFileIdentity(id:$id,input:$input){id}
}`);

const mutationDelFileIdentity = gql(/* GraphQL */`mutation deleteFileIdentity($id:ID!){
  deleteFileIdentity(id: $id)
}`);

const mutationSetDefaultFileIdentity = gql(/* GraphQL */`mutation setDefaultFileIdentity($id:ID!,$orgId: ID!){
  setDefaultFileIdentity(identityID:$id,orgID:$orgId)
}`);


/**
 * 获取文件来源凭证
 * @param gather
 * @returns
 */
export async function getFileIdentityList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: FileIdentityWhereInput;
    orderBy?: FileIdentityOrder;
  }) {
  const
    result = await paging(
      fileIdentityQuery, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, gather.current || 1);

  if (result.data?.fileIdentities) {
    return result.data.fileIdentities;
  }
  return null;
}


/**
 * 获取文件来源
 * @param fsId
 * @returns
 */
export async function getFileIdentityInfo(fsId: string) {
  const
    result = await query(
      fileIdentityInfoQuery, {
      gid: gid('file_identity', fsId),
    });

  if (result.data?.node?.__typename === "FileIdentity") {
    return result.data.node;
  }
  return null;
}

/**
 * 获取文件来源
 * @param fsId
 * @returns
 */
export async function getAccessKeySecret(fileIdentityId: string) {
  const
    result = await query(
      fileIdentityAccessKeySecretQuery, {
      id: fileIdentityId,
    });

  return result.data?.fileIdentityAccessKeySecret;
}

/**
 * 创建
 * @param input
 * @returns
 */
export async function createFileIdentity(input: CreateFileIdentityInput) {
  const
    result = await mutation(
      mutationCreateFileIdentity, {
      input,
    });

  if (result.data?.createFileIdentity) {
    return result.data.createFileIdentity;
  }
  return null;
}

/**
 * 更新
 * @param id
 * @param input
 * @returns
 */
export async function updateFileIdentity(id: string, input: UpdateFileIdentityInput) {
  const
    result = await mutation(
      mutationUpdateFileIdentity, {
      id,
      input,
    });

  if (result.data?.updateFileIdentity?.id) {
    return result.data.updateFileIdentity;
  }
  return null;
}

/**
 * 删除
 * @param fsId
 * @returns
 */
export async function delFileIdentity(id: string) {
  const
    result = await mutation(
      mutationDelFileIdentity, {
      id,
    });

  if (result.data?.deleteFileIdentity) {
    return result.data.deleteFileIdentity;
  }
  return null;
}

/**
 * 删除
 * @param fsId
 * @returns
 */
export async function setDefaultFileIdentity(id: string, orgId: string) {
  const
    result = await mutation(
      mutationSetDefaultFileIdentity, {
      id,
      orgId
    });

  if (result.data?.setDefaultFileIdentity) {
    return result.data.setDefaultFileIdentity;
  }
  return null;
}
