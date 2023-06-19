import { IMockStore } from "@graphql-tools/mock"

/**
 * 展示列表的模板
 * @param list
 * @returns
 */
const listTemp = (list: any[]) => {
  return {
    edges: list.map(item => {
      return { node: item }
    }),
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
    totalCount: list.length,
  }
}

/**
 * store内的基础数据
 */
export const initStoreData = (store: IMockStore) => {
  // org
  store.set('Query', 'ROOT', 'organizations', listTemp([
    store.get('Org', 1),
  ]))
  store.set('Org', 1, { id: 1, name: 'woocoo', parentID: 0, kind: 'root', ownerID: 1, owner: store.get('User', 1) })
  store.set('OrgRole', 1, { id: 1, name: 'admin' })

  // user
  store.set('Query', 'ROOT', 'users', listTemp([
    store.get('User', 1),
  ]))
  store.set('User', 1, {
    id: 1, displayName: 'admin', userType: "account", email: "admin@woocoo.com",
    loginProfile: {
      mfaEnabled: false
    }
  })

  // app
  store.set('Query', 'ROOT', 'apps', listTemp([
    store.get('App', 1),
  ]))
  store.set('App', 1, {
    id: 1, name: 'app1', code: 'app1',
    // todo 复杂的内置请求对象好像关联不生效数据出不来
    actions: listTemp([
      store.get('AppAction', 1)
    ]),
    // 正常的列表可以出的来
    policies: [
      store.get("AppPolicy", 1)
    ],
  })

  store.set('AppAction', 1, {
    id: 1, name: 'appAction1', appID: 1, app: store.get('App', 1)
  })

  store.set('AppPolicy', 1, {
    id: 1, name: 'appPolicy1', appID: 1, app: store.get('App', 1)
  })

}

