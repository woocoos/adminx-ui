import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema, createMockStore, mockServer, Ref, relayStylePaginationMock } from '@graphql-tools/mock';
import { readFileSync } from "fs";
import { join } from "path";
import * as casual from "casual";
import { addListTemp, delListTemp, getAllDist, initStoreData, listTemp } from "./store";
import { QuotaItem } from "../../../src/generated/adminx/graphql";
import quota from "../../../src/pages/system/quotaItem/quota";

const preserveResolvers = true
const typeDefs = readFileSync(join(process.cwd(), 'script', 'generated', "adminx.graphql"), 'utf-8');
const schema = makeExecutableSchema({ typeDefs });
const mocks = {
  ID: () => casual.integer(1, 1000000000),
  Time: () => casual.date('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
  Cursor: () => casual._string(),
  GID: () => casual._string(),
  Query: {},
  Mutation: {},
}

const store = createMockStore({ schema, mocks })

initStoreData(store)

const schemaWithMocks = addMocksToSchema({
  schema,
  store,
  preserveResolvers,
  resolvers: {
    AppActionConnection: {
      totalCount: () => Math.floor(Math.random() * 100 + 1),
    },
    App: {
      menus: relayStylePaginationMock(store),
      actions: relayStylePaginationMock(store),
      resources: relayStylePaginationMock(store),
      orgs: relayStylePaginationMock(store),
    },
    Org: {
      users: relayStylePaginationMock(store),
      permissions: relayStylePaginationMock(store),
      policies: relayStylePaginationMock(store),
      apps: relayStylePaginationMock(store),
    },
    User: {
      permissions: relayStylePaginationMock(store),
    },
    FileIdentity: {
      policy: () => JSON.stringify({
        "Statement": [
          {
            "Action": [
              "oss:GetObject",
              "oss:PutObject",
              "oss:DeleteObject",
              "oss:ListParts",
              "oss:AbortMultipartUpload",
              "oss:ListObjects"
            ],
            "Effect": "Allow",
            "Resource": ["acs:oss:*:*:*"]
          }
        ],
        "Version": "1"
      }),
      roleArn: () => 'acs:ram::5755321561100682:role/devossrwrole'
    },
    Query: {
      appAccess: () => true,
      apps: relayStylePaginationMock(store),
      userMembers: relayStylePaginationMock(store),
      countries: relayStylePaginationMock(store),
      regions: relayStylePaginationMock(store),
      currencies: relayStylePaginationMock(store),
      organizations: (_, { where }) => {
        if (where.kind === 'org') {
          return listTemp([
            store.get('Org', 2),
            store.get('Org', 3),
            store.get('Org', 4),
          ])
        } else {
          return listTemp([
            store.get('Org', 1),
            store.get('Org', 5),
          ])
        }
      },
      appPolicyView: () => {
        return [
          store.get('AppPolicyView', 1),
          store.get('AppPolicyView', 2),
          store.get('AppPolicyView', 3),
          store.get('AppPolicyView', 4),
          store.get('AppPolicyView', 5),
          store.get('AppPolicyView', 6),
        ]
      },
      orgPolicyView: () => {
        return [
          store.get('AppPolicyView', 1),
          store.get('AppPolicyView', 2),
          store.get('AppPolicyView', 3),
          store.get('AppPolicyView', 4),
          store.get('AppPolicyView', 5),
          store.get('AppPolicyView', 6),
        ]
      },
      fileSources: relayStylePaginationMock(store),
      fileIdentities: relayStylePaginationMock(store),
      users: relayStylePaginationMock(store),
      orgGroups: relayStylePaginationMock(store),
      orgRoleUsers: relayStylePaginationMock(store),
      orgRoles: relayStylePaginationMock(store),
      appRoleAssignedToOrgs: () => [
        store.get('Org', 1),
      ],
      appPolicyAssignedToOrgs: () => [
        store.get('Org', 1),
      ],
      orgUserPreference: () => store.get('OrgUserPreference', 1),
      orgPolicyReferences: relayStylePaginationMock(store),
      appResources: relayStylePaginationMock(store),
      orgAppResources: relayStylePaginationMock(store),
      userGroups: relayStylePaginationMock(store),
      userExtendGroupPolicies: relayStylePaginationMock(store),
      userMenus: () => [
        store.get("AppMenu", 1),
        store.get("AppMenu", 2),
        store.get("AppMenu", 3),
        store.get("AppMenu", 4),
        store.get("AppMenu", 5),
        store.get("AppMenu", 6),
        store.get("AppMenu", 7),
        store.get("AppMenu", 8),
        store.get("AppMenu", 9),
        store.get("AppMenu", 10),
        store.get("AppMenu", 11),
        store.get("AppMenu", 12),
        store.get("AppMenu", 13),
        store.get("AppMenu", 14),
      ],
      userPermissions: () => [
        store.get('AppAction', 1),
        store.get('AppAction', 2),
        store.get('AppAction', 3),
        store.get('AppAction', 4),
        store.get('AppAction', 5),
        store.get('AppAction', 6),
        store.get('AppAction', 7),
        store.get('AppAction', 8),
        store.get('AppAction', 9),
        store.get('AppAction', 10),
        store.get('AppAction', 11),
        store.get('AppAction', 12),
        store.get('AppAction', 13),
        store.get('AppAction', 14),
        store.get('AppAction', 15),
        store.get('AppAction', 16),
        store.get('AppAction', 17),
      ],
      checkPermission: (_, { permission }) => {
        // permission => appCode:action
        return true;
      },
      orgAppActions: () => [
        store.get('AppAction', 1),
        store.get('AppAction', 2),
        store.get('AppAction', 3),
      ],
      userRootOrgs: () => [
        store.get('Org', 1),
      ],
      userApps: () => [
        store.get('App', 1),
      ],
      orgRecycleUsers: relayStylePaginationMock(store),
      globalID: (_, { type, id }) => btoa(`${type}:${id}`),
      appDictByRefCode: (_, { refCodes }) => {
        return getAllDist(store, refCodes)
      },
      appDictItemByRefCode: (_, { refCode }) => {
        return getAllDist(store, refCode)
      },
      quotaItems: relayStylePaginationMock(store),
      quotas: relayStylePaginationMock(store),
      node: (root, args, context, info) => {
        const decoded = Buffer.from(args.id, 'base64').toString()
        const [type, did] = decoded?.split(':', 2)
        const nType = type.split('_').map(t => t.slice(0, 1).toUpperCase() + t.slice(1)).join('')
        return store.get(nType, did)
      }
    },
    Mutation: {
      updateUser: (_, { userID, input }) => {
        store.set('User', userID, input)
        return store.get('User', userID)
      },
      saveOrgUserPreference: (_, { input }) => {
        if (input.menuFavorite) {
          store.set("OrgUserPreference", 1, 'menuFavorite', input.menuFavorite)
        } else if (input.menuRecent) {
          store.set("OrgUserPreference", 1, 'menuRecent', input.menuRecent)
        }
        return { id: 1 };
      },
      // 测试 mutation 的前端处理
      createFileSource: (_, { input }) => {
        input.id = `${Date.now()}`
        store.set('FileSource', input.id, input)
        return addListTemp(
          store,
          store.get('Query', 'ROOT', 'fileSources') as Ref,
          store.get('FileSource', input.id) as Ref
        );
      },
      updateFileSource: (_, { fsID, input }) => {
        store.set('FileSource', fsID, input)
        return store.get('FileSource', fsID)
      },
      deleteFileSource: (_, { fsID }) => {
        delListTemp(
          store,
          store.get('Query', 'ROOT', 'fileSources') as Ref,
          fsID,
        )
        return true
      },
      createAppMenus: (_, { appID, input }) => {
        const data = input[0]
        data.id = `${Date.now()}`
        data.appID = appID
        store.set('AppMenu', data.id, data)
        return [store.get('AppMenu', data.id)]
      },
      updateAppMenu: (_, { menuID, input }) => {
        store.set('AppMenu', menuID, input)
        return store.get('AppMenu', menuID)
      },
      deleteCountry: (_, { countryID }) => {
        delListTemp(
          store,
          store.get('Query', 'ROOT', 'countries') as Ref,
          countryID,
        )
        return true
      },
      createCountry: (_, { input }) => {
        const data = input
        data.id = `${Date.now()}`
        store.set('Country', data.id, data)
        return addListTemp(
          store,
          store.get('Query', 'ROOT', 'countries') as Ref,
          store.get('Country', input.id) as Ref
        )
      },
      updateCountry: (_, { countryID, input }) => {
        store.set('Country', countryID, input)
        return store.get('Country', countryID)
      },
      deleteRegion: (_, { regionID }) => {
        delListTemp(
          store,
          store.get('Query', 'ROOT', 'regions') as Ref,
          regionID,
        )
        return true
      },
      createRegion: (_, { input }) => {
        const data = input
        data.id = `${Date.now()}`
        store.set('Region', data.id, data)
        return addListTemp(
          store,
          store.get('Query', 'ROOT', 'regions') as Ref,
          store.get('Region', input.id) as Ref
        )
      },
      updateRegion: (_, { regionID, input }) => {
        store.set('Region', regionID, input)
        return store.get('Region', regionID)
      },
      createQuotaItem: (_, { input }) => {
        const data = input;
        data.id = `${Date.now()}`;
        store.set('QuotaItem', data.id, data);
        return addListTemp(
          store,
          store.get('Query', 'ROOT', 'quotaItems') as Ref,
          store.get('QuotaItem', data.id) as Ref,
        );
      },
      updateQuotaItem: (_, { quotaItemID, input }) => {
        store.set('QuotaItem', quotaItemID, input);
        return store.get('QuotaItem', quotaItemID);
      },
      deleteQuotaItem: (_, { quotaItemID }) => {
        delListTemp(
          store,
          store.get('Query', 'ROOT', 'quotaItems') as Ref,
          quotaItemID,
        );
        return true;
      },
      createQuota: (_, { input }) => {
        const data = input;
        data.id = `${Date.now()}`;
        store.set('Quota', data.id, data);
        return addListTemp(
          store,
          store.get('Query', 'ROOT', 'quotas') as Ref,
          store.get('Quota', data.id) as Ref,
        );
      },
      updateQuota: (_, { quotaID, input }) => {
        store.set('Quota', quotaID, input);
        return store.get('Quota', quotaID);
      },
      deleteQuota: (_, { quotaID }) => {
        delListTemp(
          store,
          store.get('Query', 'ROOT', 'quotas') as Ref,
          quotaID,
        );
        return true;
      },
    },
  },
})

export default mockServer(schemaWithMocks, mocks, preserveResolvers)
