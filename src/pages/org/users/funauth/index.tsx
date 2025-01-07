import { App, User } from "@/generated/adminx/graphql"
import { PageContainer, ProCard, useToken } from "@ant-design/pro-components"
import { Button, Empty, message } from "antd"
import { Link, useAuth, useSearchParams } from "ice"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import CheckPolicyView from "@/pages/app/roles/funauth/components/checkPolicyView"
import Auth from "@/components/auth"
import { getUserAppList, getUserInfo } from "@/services/adminx/user"
import store from "@/store"
import { assignOrgUserPolicyView, getOrgUserAssignedPolicyView } from "@/services/adminx/org/user"

type CheckedsType = {
  appInfo: App
  checked: string[]
  oldChecked: string[]
}

export default (props: {
  isFromMember?: boolean;
}) => {
  const { token } = useToken(),
    [auth] = useAuth(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [userState] = store.useModel('user'),
    [orgId] = useState(searchParams.get('org_id') ? searchParams.get('org_id') ?? '' : userState.tenantId),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [dataSource, setDataSource] = useState<CheckedsType[]>([]),
    [userInfo, setUserInfo] = useState<User>()

  const reqUserInfo = async () => {
    const userId = searchParams.get('id')
    if (userId) {
      const result = await getUserInfo(userId);
      if (result?.id) {
        setUserInfo(result as User);
      }
    }
    return null
  }, reqCheckedsData = async () => {
    const list: CheckedsType[] = []

    if (userInfo) {
      const appResult = await getUserAppList()
      if (appResult) {
        for await (const app of appResult) {
          if (app) {
            const result = await getOrgUserAssignedPolicyView(app.code, userInfo.id, orgId)
            list.push({
              appInfo: app as App,
              checked: [...result],
              oldChecked: [...result],
            })
          }
        }
      }
    }
    setDataSource(list)
  }, onSave = async () => {
    if (userInfo) {
      setSaveLoading(true)
      const errors: {
        appInfo: App,
        str: string,
      }[] = []
      for await (const dsImte of dataSource) {
        const add: string[] = dsImte.checked.filter(key => !dsImte.oldChecked.includes(key)),
          del: string[] = dsImte.oldChecked.filter(key => !dsImte.checked.includes(key));
        if (add.length > 0 || del.length > 0) {
          const result = await assignOrgUserPolicyView(userState.tenantId, userInfo.id, add, del)
          if (!result) {
            errors.push({
              appInfo: dsImte.appInfo,
              str: `${t('app')}:${dsImte.appInfo.name},${t('save_failure')}`
            })
          }
        }
      }
      if (errors.length) {
        message.error(errors.map(item => item.str).join(';'))
      } else {
        message.success(t('submit_success'))
        setSaveDisabled(true);
      }
      setDataSource(dataSource.map(dsItem => {
        if (!errors.find(errorItem => errorItem.appInfo.id == dsItem.appInfo.id)) {
          dsItem.oldChecked = dsItem.checked
        }
        return dsItem;
      }))
      setSaveLoading(false)
    }
  }

  useEffect(() => {
    reqCheckedsData()
  }, [userInfo])

  useEffect(() => {
    reqUserInfo()
  }, [])

  return <PageContainer
    header={{
      title: t('fun_authority'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: props.isFromMember ? [
          { title: t('org_cooperation') },
          { title: <Link to={`/org/members`} >{t('member_manage')}</Link> },
          { title: t('fun_authority') },
        ] : [
          { title: t('org_cooperation') },
          { title: <Link to={`/org/users`} >{t('user_manage')}</Link> },
          { title: t('fun_authority') },
        ],
      },
      extra: <></>,
    }}
  >
    {userInfo ?
      <ProCard title={`${t('user')}:${userInfo.displayName}`} headerBordered extra={
        <Auth authKey={"assignOrgUserPolicyView"}>
          <Button
            type="primary"
            disabled={saveDisabled}
            loading={saveLoading}
            onClick={onSave}
          >{t('save')}</Button>
        </Auth>
      }>
        {dataSource.length ? dataSource.map(item => (
          <CheckPolicyView
            key={item.appInfo.id}
            orgId={orgId}
            appInfo={item.appInfo}
            value={item.checked}
            onChange={(value) => {
              setSaveDisabled(false)
              setDataSource(dataSource.map(dsItem => {
                if (dsItem.appInfo.id == item.appInfo.id) {
                  item.checked = value
                }
                return dsItem;
              }))
            }}
          />
        )) : <Empty />}
      </ProCard> : <></>
    }
  </PageContainer>
}
