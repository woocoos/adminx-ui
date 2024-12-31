import Auth from "@/components/auth"
import { App, AppAction, AppActionKind, AppActionMethod, AppPolicy, AppPolicyView, PolicyRule, PolicyRuleInput } from "@/generated/adminx/graphql"
import { getAppList } from "@/services/adminx/app"
import { getAppActionList } from "@/services/adminx/app/action"
import { getAppPolicyInfo, updateAppPolicy } from "@/services/adminx/app/policy"
import { ProCard, ProColumns, ProTable } from "@ant-design/pro-components"
import { Button, message, Modal, Select, Space } from "antd"
import { Link } from "ice"
import { Key, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default (props: {
  info?: AppPolicyView
}) => {
  const
    { t } = useTranslation(),
    columns: ProColumns<AppAction>[] = [
      {
        title: t('app'),
        dataIndex: 'appId',
        width: 120,
        renderFormItem: () => {
          return <Select
            placeholder={t('please_select')}
            options={appList.map(item => ({ label: item.name, value: item.id }))}
            allowClear
          />
        },
        render: (_, record) => record.app?.name,
      },
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
      },
      { title: t('description'), dataIndex: 'comments', width: 160, search: false },
    ],
    [appList, setAppList] = useState<App[]>([]),
    [appActionList, setAppActionList] = useState<AppAction[]>([]),
    [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]),
    [loading, setLoading] = useState(false),
    [dataSource, setDataSource] = useState<AppAction[]>([]),
    [info, setInfo] = useState<AppPolicy>()

  const reqData = async () => {
    if (props.info?.policyID) {
      setLoading(true)
      const result = await getAppPolicyInfo(props.info.policyID)
      const allAction: {
        [appCode: string]: string[]
      } = {},
        allApp: App[] = [],
        allAppAction: AppAction[] = []
      result?.rules?.forEach(rule => {
        rule?.actions?.forEach(item => {
          const appCode = item.split(':')[0], name = item.split(':')[1]
          if (allAction[appCode]) {
            allAction[appCode].push(name)
          } else {
            allAction[appCode] = [name]
          }
        })
      })
      const resultAppList = await getAppList({
        current: 1,
        pageSize: Object.keys(allAction).length,
        where: {
          codeIn: Object.keys(allAction)
        }
      })
      resultAppList?.edges?.forEach(item => {
        if (item?.node) {
          allApp.push(item.node as App)
        }
      })

      for (const appCode in allAction) {
        const app = allApp.find(item => item.code === appCode)
        if (app) {
          if (allAction[appCode].length === 1 && allAction[appCode][0] === '*') {
            allAppAction.push({
              id: `appId:${app.id}`,
              name: '全部',
              app: app,
              createdAt: undefined,
              createdBy: 0,
              kind: AppActionKind.Function,
              method: AppActionMethod.Write
            })
          } else {
            const reslutAppAction = await getAppActionList(app.id, {
              current: 1,
              pageSize: allAction[appCode].length,
              where: {
                nameIn: allAction[appCode]
              }
            })
            reslutAppAction?.edges?.forEach(item => {
              if (item?.node) {
                allAppAction.push({ ...item.node, app, })
              }
            })
          }
        }
      }

      setInfo(result as AppPolicy ?? undefined)
      setAppActionList(allAppAction)
      setAppList(allApp)
      setLoading(false)
    } else {
      setInfo(undefined)
      setAppActionList([])
      setAppList([])
    }
  },
    updateAppPolicyAction = async () => {
      if (selectedRowKeys.length) {
        const delActions = appActionList.filter(item => selectedRowKeys.includes(item.id)).map(item => `${item.app?.code}:${item.name}`);
        Modal.confirm({
          title: t('delete'),
          content: `${t('confirm_delete')}：${delActions.join(',')} ?`,
          onOk: async (close) => {
            if (props.info?.policyID) {
              const appPolicyInfo = await getAppPolicyInfo(props.info.policyID)
              if (appPolicyInfo) {
                const rules: PolicyRuleInput[] = []
                appPolicyInfo.rules?.forEach(item => {
                  if (item) {
                    delete item.__typename
                    item.actions = item.actions?.filter(item => !delActions.includes(item))
                    rules.push(item)
                  }
                })
                const result = await updateAppPolicy(appPolicyInfo.id, {
                  rules,
                })
                if (result?.id) {
                  setDataSource(dataSource.filter(item => !selectedRowKeys.includes(item.id)))
                  setAppActionList(appActionList.filter(item => !selectedRowKeys.includes(item.id)))
                  message.success(t('submit_success'))
                }
              }
            }
            close()
          },
        });
      } else {
        message.warning(t('please_select_delete_data'))
      }
    }

  useEffect(() => {
    setDataSource(appActionList)
  }, [appActionList])

  useEffect(() => {
    reqData()
  }, [props.info])

  return (props.info ? <>
    <ProCard title={t('associated_authority')} headerBordered extra={<>
      <Space>
        {
          info?.id ? <Auth authKey={['createAppPolicy', "updateAppPolicy"]} keyAndOr="or">
            <Link to={`/app/policys/editor?id=${info.id}`} target="_blank">
              <Button
                type="primary"
              >{t('amend_policys_viewer_policy')}</Button>
            </Link>
          </Auth> : <></>
        }
        {/* <Auth authKey="updateAppPolicy">
          <Button
            type="primary"
            danger
            onClick={() => {
              updateAppPolicyAction()
            }}
          >{t('delete')}</Button>
        </Auth> */}
      </Space>
    </>}>
      <ProTable
        rowKey={'id'}
        search={{
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys)
          },
        }}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={false}
        options={false}
        onSubmit={(params: {
          appId?: string
          name?: string
        }) => {
          setSelectedRowKeys([])
          setDataSource(
            appActionList.filter(item => {
              let isTrue = true;
              if (params.appId) {
                isTrue = item.app?.id === params.appId
              }
              if (isTrue && params.name) {
                isTrue = item.name.includes(params.name) || (item.comments ?? '').includes(params.name)
              }
              return isTrue;
            })
          )
        }}
      />
    </ProCard>
  </> : <>
  </>)
}
