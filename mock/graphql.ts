import type { Request, Response } from '@ice/app';
import { mockServer, relayStylePaginationMock } from '@graphql-tools/mock';
import bodyParser from 'body-parser'
import { readFileSync } from "fs";
import { join } from "path";

const schema = readFileSync(join(__dirname, "allinone.graphql"), 'utf-8');

const mocks: any = {
    // 由于Node没有任何参数可以进行判断指向哪个__typename 无法进行模拟
    // Node: {
    //     __typename: "Org"
    // },
    User: () => ({
        id: 1,
        userType: "account",
        email: "",
        displayName: () => "admin",
        loginProfile: {
            passwordReset: true
        }
    }),
    Org: () => ({
        id: 1,
        name: 'woocoo'
    })
}

const preserveResolvers = false

/**
 * 文档
 * https://the-guild.dev/graphql/tools/docs/api/modules/mock_src
 */
export default {
    'POST /api/graphql/query': (request: Request, response: Response) => {
        bodyParser.json()(request, response, async () => {
            const { query, variables } = request.body;
            const ms = mockServer(schema, mocks, preserveResolvers)
            const result = await ms.query(query as string, variables as any)
            response.send(result);
        })

    },

}