import type {Request, Response} from '@ice/app';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {addMocksToSchema, createMockStore, mockServer, relayStylePaginationMock} from '@graphql-tools/mock';
import bodyParser from 'body-parser'
import {readFileSync} from "fs";
import {join} from "path";
import * as casual from "casual";

const typeDefs = readFileSync(join(__dirname, "allinone.graphql"), 'utf-8');
const schema = makeExecutableSchema({
  typeDefs: typeDefs,
});

const store = createMockStore({schema})
store.set('Query', 'ROOT', 'organizations', {
  edges: [{
    node: {
      id: 1,
    },
    cursor: '1',
  }],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
  totalCount: 1,
})
store.set('Org', 1, {id: 1, name: 'woocoo'})
store.set('OrgRole', 1, {id: 1, name: 'admin'})

const mocks = {
  ID: () => casual.integer(1, 1000000000),
  Time: () => casual.date('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
  User: () => ({
    id: 1,
    userType: "account",
    email: "",
    displayName: () => "admin",
    loginProfile: {
      id: 1,
      passwordReset: true
    }
  }),
  Org: () => ({
    id: 1,
    name: 'woocoo'
  }),
  Query: {},
  Mutation: {},
}

const schemaWithMocks = addMocksToSchema({
  schema,
  mocks,
  resolvers: store => {
    return {
      Query: {
        userPermissions: () => {
          return [{
            id: 1,
            appID: 1,
            name: 'admin',
            kind: 'graphql'
          }]
        },
        organizations: relayStylePaginationMock(store),
        orgRoles: relayStylePaginationMock(store),
        node: (_, {id}) => {
          const decoded = Buffer.from(id, 'base64').toString()
          const [type, did] = decoded?.split(':', 2)
          switch (type) {
            case 'org':
              return store.get('Org', did)
            case 'org_role':
              return store.get('OrgRole', did)
          }
          return {}
        }
      }
    }
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
      const {query, variables} = request.body;
      const result = await server.query(query as string, variables as any)
      response.send(result);
    })
  },
}
