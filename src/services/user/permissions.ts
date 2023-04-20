import { gid } from "@/util"
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi } from "../graphql"
import { Permission, PermissionNodeField } from "../permission"


/**
 * 获取应用权限
 * @param userId
 * @param params 
 * @param filter 
 * @param sort 
 * @returns 
 */
export async function getUserPermissions(userId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query apps($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
                node(id:"${gid('user', userId)}"){
                    ... on User{  
                        id,
                        list:permissions(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                            totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                            edges{                                        
                                cursor,node{                    
                                    ${PermissionNodeField}
                                }
                            }
                        }
                    }
                }
                
            }`,
            {
                first: params.pageSize,
                where,
                orderBy,
            },
            params.current
        )

    if (result?.data?.node?.list) {
        return result.data.node.list as List<Permission>
    } else {
        return null
    }
}