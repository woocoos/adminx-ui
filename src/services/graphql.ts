import { request } from 'ice';

export async function graphqlApi(query: string, variables?: any, headers?: any) {
    return await request({
        url: '/graphql/query',
        method: 'post',
        data: {
            query,
            variables,
        },
        headers
    })

}