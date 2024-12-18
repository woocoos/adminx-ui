import { App, OrgRole, OrgRoleKind } from "@/generated/adminx/graphql"
import { PageContainer, ProCard, useToken } from "@ant-design/pro-components"
import { Button, Empty, message } from "antd"
import { Link, useAuth, useSearchParams } from "ice"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { assignOrgRolePolicyView, getOrgRoleAssignedPolicyView, getOrgRoleInfo } from "@/services/adminx/org/role"
import { getOrgAppList } from "@/services/adminx/org/app"
import CheckPolicyView from "@/pages/app/roles/funauth/components/checkPolicyView"
import Auth from "@/components/auth"

type CheckedsType = {
  appInfo: App
  checked: string[]
  oldChecked: string[]
}

export default (props: {
  isFromSystem?: boolean;
}) => {
  const { token } = useToken(),
    [auth] = useAuth(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [dataSource, setDataSource] = useState<CheckedsType[]>([]),
    [roleInfo, setRoleInfo] = useState<OrgRole>()

  const reqRoleInfo = async () => {
    const roleId = searchParams.get('id')
    if (roleInfo?.id == roleId) {
      return roleInfo;
    }
    if (roleId) {
      const result = await getOrgRoleInfo(roleId);
      if (result?.id) {
        setRoleInfo(result as OrgRole);
        return result;
      }
    }
    return null
  }, reqCheckedsData = async () => {
    const list: CheckedsType[] = []
    if (roleInfo) {
      const appResult = await getOrgAppList(`${roleInfo.orgID}`, {
        current: 1,
        pageSize: 9999,
      })
      if (appResult?.edges) {
        for await (const edge of appResult?.edges) {
          if (edge?.node) {
            const result = await getOrgRoleAssignedPolicyView(edge.node.code, roleInfo.id)
            list.push({
              appInfo: edge.node as App,
              checked: result.map(item => item.orgPolicy?.id as string),
              oldChecked: result.map(item => item.orgPolicy?.id as string)
            })
          }
        }
      }
    }
    setDataSource(list)
  }, onSave = async () => {
    if (roleInfo) {
      setSaveLoading(true)
      const errors: {
        appInfo: App,
        str: string,
      }[] = []
      for await (const dsImte of dataSource) {
        const add: string[] = dsImte.checked.filter(key => !dsImte.oldChecked.includes(key)),
          del: string[] = dsImte.oldChecked.filter(key => !dsImte.checked.includes(key));
        if (add.length > 0 || del.length > 0) {
          const result = await assignOrgRolePolicyView(`${roleInfo.orgID}`, roleInfo.id, add, del)
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
  }, [roleInfo])

  useEffect(() => {
    reqRoleInfo()
  }, [])

  return <PageContainer
    header={{
      title: t('fun_authority'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: props.isFromSystem ? [
          { title: t('system_conf') },
          { title: <Link to={'/system/org'}>{t('org_manage')}</Link> },
          { title: roleInfo?.kind == OrgRoleKind.Role ? <Link to={`/system/org/roles?id=${roleInfo?.orgID}`}>{t('role')}</Link> : <Link to={`/system/org/groups?id=${roleInfo?.orgID}`}>{t('user_group')}</Link> },
          { title: t('fun_authority') },
        ] : [
          { title: t('org_cooperation') },
          { title: roleInfo?.kind == OrgRoleKind.Role ? <Link to={'/org/roles'}>{t('role')}</Link> : <Link to={'/org/groups'}>{t('user_group')}</Link> },
          { title: t('fun_authority') },
        ],
      },
      extra: <></>,
    }}
  >
    {roleInfo ?
      <ProCard title={`${roleInfo.kind === OrgRoleKind.Group ? t('user_group') : t('role')}:${roleInfo.name}`} headerBordered extra={
        <Auth authKey={"assignOrgRolePolicyView"}>
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
            isOrg
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
