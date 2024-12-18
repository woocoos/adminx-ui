import { gid } from "@knockout-js/api";
import { mutation, paging, query } from "@knockout-js/ice-urql/request";
import { gql } from "@/generated/adminx";
import { OrderDirection, Quota, QuotaOrder, QuotaOrderField, QuotaWhereInput } from "@/generated/adminx/graphql";


const queryQuotaList = gql(/* GraphQL */`query quotaList($first: Int,$orderBy:QuotaOrder,$where:QuotaWhereInput){
    quotas(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
            cursor,node{
                id,createdAt,limit,used,startAt,endAt,userID,tenantID
            }
        }
    }
}`);

const queryQuotaInfo = gql(/* GraphQL */`query quotaInfo($gid:GID!){
    node(id:$gid){
        ... on Quota{
            id,createdAt,limit,used,startAt,endAt,userID,tenantID
        }
    }
}`);

const mutationCreateQuota = gql(/* GraphQL */`mutation createQuota($input: CreateQuotaInput!){
    createQuota(input:$input){
        id,createdAt,limit,used,startAt,endAt,userID,tenantID
    }
}`);


const mutationUpdateQuota = gql(/* GraphQL */`mutation updateQuota($quotaId:ID!,$input: UpdateQuotaInput!){
    updateQuota(id:$quotaId,input:$input){
        id,createdAt,limit,used,startAt,endAt,userID,tenantID
    }
}`);

const mutationDelQuota = gql(/* GraphQL */`mutation deleteQuota($quotaId:ID!){
    deleteQuota(id: $quotaId)
}`);


export async function getQuotaList(gather: {
  current?: number;
  pageSize?: number;
  where?: QuotaWhereInput;
  orderBy?: QuotaOrder;
}) {
  const result = await paging(queryQuotaList, {
    first: gather.pageSize,
    orderBy: gather.orderBy,
    where: gather.where,
  }, gather.current || 1)
  if (result.data?.quotas) {
    return result.data.quotas;
  }
  return null;
}

export async function getQuotaInfo(id: string) {
  const result = await query(queryQuotaInfo, {
    gid: gid('quota', id),
  })
  if (result.data?.node?.__typename === 'Quota') {
    return result.data.node;
  }
  return null;
}

export async function createQuota(input: any) {
  const result = await mutation(mutationCreateQuota, {
    input,
  })
  if (result.data?.createQuota) {
    return result.data.createQuota;
  }
  return null;
}

export async function updateQuota(quotaId: string, input: any) {
  const result = await mutation(mutationUpdateQuota, {
    quotaId,
    input,
  })
  if (result.data?.updateQuota) {
    return result.data.updateQuota;
  }
  return null;
}

export async function delQuota(quotaId: string) {
  const result = await mutation(mutationDelQuota, {
    quotaId,
  })
  if (result.data?.deleteQuota) {
    return result.data.deleteQuota;
  }
  return null;
}


