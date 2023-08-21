import { gql } from "@/generated/adminx";
import { CreateFileSourceInput, FileSourceOrder, FileSourceWhereInput, UpdateFileSourceInput } from "@/generated/adminx/graphql";
import { gid } from "@knockout-js/api";
import { mutation, paging, query } from "@knockout-js/ice-urql/request";

export const EnumFileSourceKind = {
  local: { text: 'local' },
  alioss: { text: 'alioss' },
};

const fileSourcesQuery = gql(/* GraphQL */`query fileSourceList($first: Int,$orderBy:FileSourceOrder,$where:FileSourceWhereInput){
  fileSources(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,
        bucket
      }
    }
  }
}`);

const fileSourceInfoQuery = gql(/* GraphQL */`query fileSourceInfo($gid:GID!){
 node(id:$gid){
  ... on FileSource{
      id,createdBy,createdAt,updatedBy,updatedAt,kind,comments,endpoint,region,
      bucket
    }
  }
}`);


const mutationCreateFileSource = gql(/* GraphQL */`mutation createFileSource($input: CreateFileSourceInput!){
  createFileSource(input:$input){id}
}`);

const mutationUpdateFileSource = gql(/* GraphQL */`mutation updateFileSource($fsId:ID!,$input: UpdateFileSourceInput!){
  updateFileSource(fsID:$fsId,input:$input){id}
}`);

const mutationDelFileSource = gql(/* GraphQL */`mutation deleteFileSource($fsId:ID!){
  deleteFileSource(fsID: $fsId)
}`);


/**
 * 获取文件来源
 * @param gather
 * @returns
 */
export async function getFileSourceList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: FileSourceWhereInput;
    orderBy?: FileSourceOrder;
  }) {
  const
    result = await paging(
      fileSourcesQuery, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, gather.current || 1);

  if (result.data?.fileSources) {
    return result.data.fileSources;
  }
  return null;
}


/**
 * 获取文件来源
 * @param fsId
 * @returns
 */
export async function getFileSourceInfo(fsId: string) {
  const
    result = await query(
      fileSourceInfoQuery, {
      gid: gid('file_source', fsId),
    });

  if (result.data?.node?.__typename === "FileSource") {
    return result.data.node;
  }
  return null;
}



/**
 * 创建
 * @param input
 * @returns
 */
export async function createFileSource(input: CreateFileSourceInput) {
  const
    result = await mutation(
      mutationCreateFileSource, {
      input,
    });

  if (result.data?.createFileSource) {
    return result.data.createFileSource;
  }
  return null;
}

/**
 * 更新
 * @param fsId
 * @param input
 * @returns
 */
export async function updateFileSource(fsId: string, input: UpdateFileSourceInput) {
  const
    result = await mutation(
      mutationUpdateFileSource, {
      fsId,
      input,
    });

  if (result.data?.updateFileSource?.id) {
    return result.data.updateFileSource;
  }
  return null;
}

/**
 * 删除
 * @param fsId
 * @returns
 */
export async function delFileSource(fsId: string) {
  const
    result = await mutation(
      mutationDelFileSource, {
      fsId,
    });

  if (result.data?.deleteFileSource) {
    return result.data.deleteFileSource;
  }
  return null;
}
