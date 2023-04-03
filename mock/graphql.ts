import type { Request, Response } from '@ice/app';
import { mockServer } from '@graphql-tools/mock';
import bodyParser from 'body-parser'
import { readFileSync } from "fs";
import { join } from "path";

const schema = readFileSync(join(__dirname, "allinone.graphql"), 'utf-8');

// const schema = `
// type User {
//     id: ID!
//     name: String
//     avatar:String
//     userType:String
// }
// type Query {
//     viewer:User
//     userList:[User]
// }
// `

const mocks = {
    User: () => ({
        userType: "admin",
        avatar: "https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png",
        name: () => (Math.random() + 1).toString(36).substring(7)
    })
}

const preserveResolvers = false

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