import type { Request, Response } from '@ice/app';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema, createMockStore, mockServer, relayStylePaginationMock } from '@graphql-tools/mock';
import bodyParser from 'body-parser'
import { readFileSync } from "fs";
import { join } from "path";
import * as casual from "casual";
import { initStoreData } from "./graphql/store";

const typeDefs = readFileSync(join(__dirname, "allinone.graphql"), 'utf-8');
const schema = makeExecutableSchema({
  typeDefs: typeDefs,
});
const mocks = {
  ID: () => casual.integer(1, 1000000000),
  Time: () => casual.date('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
  Cursor: () => casual._string(),
  GID: () => casual._string(),
  App: () => ({
    logo: null
  }),
  Query: {},
  Mutation: {},
}

export const store = createMockStore({ schema, mocks })

initStoreData(store)

const schemaWithMocks = addMocksToSchema({
  schema,
  store,
  resolvers: {
    Query: {
      globalID: (_, { type, id }) => {
        return btoa(`${type}:${id}`)
      },
      apps: relayStylePaginationMock(store),
      users: relayStylePaginationMock(store),
      organizations: relayStylePaginationMock(store),
      orgRoles: relayStylePaginationMock(store),
      node: (_, { id }) => {
        const decoded = Buffer.from(id, 'base64').toString()
        const [type, did] = decoded?.split(':', 2)
        const nType = type.split('_').map(t => t.slice(0, 1).toUpperCase() + t.slice(1)).join('')
        // console.log(store['store'])
        // console.log("--------")
        // console.log("--------")
        // console.log("--------")
        return store.get(nType, did)
      }
    },
  }
})


const preserveResolvers = true
const server = mockServer(schemaWithMocks, mocks, preserveResolvers)
/**
 * 文档
 * https://the-guild.dev/graphql/tools/docs/api/modules/mock_src
 */
export default {
  'POST /api/graphql/query': (request: Request, response: Response) => {
    bodyParser.json()(request, response, async () => {
      const { query, variables } = request.body;
      const result = await server.query(query as string, variables as any)
      response.send(result);
    })
  },
}
