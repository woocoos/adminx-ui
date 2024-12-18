import { CreateQuotaItemInput, OrderDirection, QuotaItemOrder, QuotaItemOrderField, QuotaItemResourceType, QuotaItemWhereInput } from "@/generated/adminx/graphql";
import { mutation, paging, query } from "@knockout-js/ice-urql/request";
import { gql } from "@/generated/adminx";
import { gid } from "@knockout-js/api";

const EnumResourceType = {
  [QuotaItemResourceType.Network]: { text: '网络类型' },
  [QuotaItemResourceType.Number]: { text: '数值类型' },
  [QuotaItemResourceType.Storage]: { text: '存储类型' },
}

const queryQuotaItemList = gql(/* GraphQL */`query quotaItems($first: Int,$where:QuotaItemWhereInput,$orderBy:QuotaItemOrder){
    quotaItems(first:$first,where: $where,orderBy: $orderBy){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
            cursor,node{
                id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType
            }
        }
    }
}`);

const queryQuotaItemInfo = gql(/* GraphQL */`query quotaItemInfo($gid:GID!){
    node(id:$gid){
        ... on QuotaItem{
            id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType
        }
    }
}`);

const mutationCreateQuotaItem = gql(/* GraphQL */`mutation createQuotaItem($input: CreateQuotaItemInput!){
    createQuotaItem(input:$input){
        id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType
    }
}`);

const mutationUpdateQuotaItem = gql(/* GraphQL */`mutation updateQuotaItem($itemId:ID!,$input: UpdateQuotaItemInput!){
    updateQuotaItem(id:$itemId,input:$input){
        id,createdAt,name,code,active,defaultLimit,unit,defaultLimit,resourceType
    }
}`);

const mutationDelQuotaItem = gql(/* GraphQL */`mutation deleteQuotaItem($itemId:ID!){
    deleteQuotaItem(id: $itemId)
}`);

/**
 * 获取配额定义列表
 * @param gather
 * @returns
 */
export async function getQuotaItemList(
  gather: {
    current?: number,
    pageSize?: number,
    where?: QuotaItemWhereInput,
    orderBy?: QuotaItemOrder;
  },
) {
  const result = await paging(
    queryQuotaItemList, {
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy ?? {
      direction: OrderDirection.Desc,
      field: QuotaItemOrderField.CreatedAt
    },
  }, gather.current || 1
  )
  if (result.data?.quotaItems) {
    return result.data.quotaItems;
  }
  return null;
}

export async function getQuotaItemInfo(id: string) {
  const result = await query(
    queryQuotaItemInfo, {
    gid: gid('quota_item', id),
  }
  )
  if (result.data?.node?.__typename === 'QuotaItem') {
    return result.data.node;
  }
  return null;
}

export async function createQuotaItem(input: CreateQuotaItemInput) {
  const result = await mutation(
    mutationCreateQuotaItem, {
    input
  })
  if (result.data?.createQuotaItem?.id) {
    return result.data.createQuotaItem;
  }
  return null;
}

export async function updateQuotaItem(itemId: string, input: any) {
  const result = await mutation(
    mutationUpdateQuotaItem, {
    itemId,
    input
  })
  if (result.data?.updateQuotaItem?.id) {
    return result.data.updateQuotaItem;
  }
  return null;
}

export async function delQuotaItem(itemId: string) {
  const result = await mutation(mutationDelQuotaItem, {
    itemId
  })
  return result.data?.deleteQuotaItem;
}
