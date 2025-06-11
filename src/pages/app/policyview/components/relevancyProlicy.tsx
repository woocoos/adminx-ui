import Auth from "@/components/auth"
import { App, AppAction, AppActionKind, AppActionMethod, AppPolicy, AppPolicyView, PolicyRule, PolicyRuleInput } from "@/generated/adminx/graphql"
import { getAppList } from "@/services/adminx/app"
import { getAppActionList } from "@/services/adminx/app/action"
import { getAppPolicyInfo, updateAppPolicy } from "@/services/adminx/app/policy"
import { exportJson, readFile } from "@/util"
import { SheetData } from "@/util/excel"
import { ProCard, ProColumns, ProTable } from "@ant-design/pro-components"
import { Button, message, Modal, Select, Space, Upload } from "antd"
import { Link } from "ice"
import { Key, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { json } from "stream/consumers"

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
    [search, setSearch] = useState<{
      appId?: string
      name?: string
    }>({}),
    [loading, setLoading] = useState(false),
    [dataSource, setDataSource] = useState<AppAction[]>([]),
    [importLoading, setImportLoading] = useState(false),
    [exportLoading, setExportLoading] = useState(false),
    [info, setInfo] = useState<AppPolicy>()

  const reqData = async () => {
    setSelectedRowKeys([])
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
  }

  useEffect(() => {
    setDataSource(
      appActionList.filter(item => {
        let isTrue = true;
        if (search.appId) {
          isTrue = item.app?.id === search.appId
        }
        if (isTrue && search.name) {
          isTrue = item.name.includes(search.name) || (item.comments ?? '').includes(search.name)
        }
        return isTrue;
      })
    )
  }, [appActionList])

  useEffect(() => {
    reqData()
  }, [props.info, search])

  return (props.info ? <>
    <ProCard title={t('associated_authority')} headerBordered extra={<>
      <Space>
        {
          info?.id ? <>
            <Auth authKey="importAppPolicyRule">
              <Upload
                accept="application/json"
                showUploadList={false}
                beforeUpload={async (file) => {
                  setImportLoading(true);
                  try {
                    const fileRes = await readFile(file)
                    const result = await updateAppPolicy(info.id, {
                      rules: JSON.parse(fileRes) as PolicyRule[]
                    })
                    if (result?.id) {
                      await reqData()
                      message.success(t('submit_success'))
                    }
                  } catch (error) {
                    console.error(error)
                  }
                  setImportLoading(false);
                  return false;
                }}
              >
                <Button
                  key="import"
                  type="primary"
                  loading={importLoading}
                >
                  {t('import')}
                </Button>
              </Upload>
            </Auth>
            <Auth authKey="exportAppPolicyRule">
              <Button
                key="export"
                type="primary"
                loading={exportLoading}
                onClick={() => {
                  setExportLoading(true)
                  exportJson(JSON.stringify(info.rules), `${props.info?.name}${t('associated_authority')}`)
                  setExportLoading(false)
                }}
              >
                {t('export')}
              </Button>
            </Auth>
            <Auth authKey={['createAppPolicy', "updateAppPolicy"]} keyAndOr="or">
              <Link to={`/app/policys/viewer?id=${info.id}`} target="_blank">
                <Button
                  type="primary"
                >{t('amend_policys_viewer_policy')}</Button>
              </Link>
            </Auth>
          </> : <></>
        }
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
          setSearch(params)
        }}
      />
    </ProCard>
  </> : <>
  </>)
}
