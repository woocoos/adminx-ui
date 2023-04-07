import { List, TableParams, graphqlApi, PagingParams, getGraphqlFilter, TableSort } from "../graphql";

interface App {
    id: string
    name: string
    code: string
    kind: "web" | "native" | "server"
    redirectURI: string
    appKey: string
    appSecret: string
    scopes: string
    tokenValidity: number
    refreshTokenValidity: number
    logo: string
    comments: string
    status: "active" | "inactive" | "processing"
    createdAt: Date
    createdBy: string
    updatedAt: Date
    updatedBy: string
}

/**
 * 获取用户信息
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getAppList(params?: TableParams, filter?: any, sort?: TableSort, paging?: PagingParams) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort)

    const result = await graphqlApi(
        `query apps($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:AppOrder,$where:AppWhereInput){
            list:apps(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                edges{
                    cursor,node{
                        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,refreshTokenValidity,logo,comments,
                        status,createdAt
                    }
                }
            }
        }`,
        {
            after: paging?.after,
            first: paging?.first,
            before: paging?.before,
            last: paging?.last,
            where,
            orderBy,
        }
    )

    if (result?.data?.list) {
        return result?.data?.list as List<App>
    } else {
        return null
    }
}
