import { App, AppRole } from "@/generated/adminx/graphql"
import { assignAppRolePolicyView, getAppRoleAssignedPolicyView, getAppRoleInfo } from "@/services/adminx/app/role"
import { PageContainer, ProCard, useToken } from "@ant-design/pro-components"
import { Button, message } from "antd"
import { Link, useAuth, useSearchParams } from "ice"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import CheckPolicyView from "./components/checkPolicyView"

export default () => {
  const { token } = useToken(),
    [auth] = useAuth(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [checked, setChecked] = useState<string[]>([]),
    [oldChecked, setOldChecked] = useState<string[]>([]),
    [roleInfo, setRoleInfo] = useState<AppRole>()

  const reqRoleInfo = async () => {
    const roleId = searchParams.get('role_id')
    if (roleInfo?.id == roleId) {
      return roleInfo;
    }
    if (roleId) {
      const result = await getAppRoleInfo(roleId);
      if (result?.id) {
        const assignedPolicyView = await getAppRoleAssignedPolicyView(`${result.app?.code}`, result.id)
        setChecked(assignedPolicyView.map(item => item.id))
        setOldChecked(assignedPolicyView.map(item => item.id))
        setRoleInfo(result as AppRole);
        return result;
      }
    }
    return null
  },
    onSave = async () => {
      if (roleInfo) {
        setSaveLoading(true)
        const add: string[] = checked.filter(key => !oldChecked.includes(key)),
          del: string[] = oldChecked.filter(key => !checked.includes(key));
        const result = await assignAppRolePolicyView(`${roleInfo.appID}`, roleInfo.id, add, del)
        if (result) {
          message.success(t('submit_success'))
          setOldChecked([...checked])
          setSaveDisabled(true);
        }
        setSaveLoading(false)
      }
    }

  useEffect(() => {
    reqRoleInfo()
  }, [])

  return <PageContainer
    header={{
      title: t('fun_authority'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: [
          { title: t('system_conf') },
          { title: <Link to={'/system/app'}>{t('app_manage')}</Link> },
          { title: <Link to={`/app/roles?id=${roleInfo?.appID}`}>{t('app_role')}</Link> },
          { title: t('fun_authority') },
        ],
      },
      extra: <></>,
    }}
  >
    {roleInfo ?
      <ProCard title={`角色:${roleInfo.name}`} headerBordered extra={
        <Button
          type="primary"
          disabled={saveDisabled}
          loading={saveLoading}
          onClick={onSave}
        >{t('save')}</Button>
      }>
        <CheckPolicyView
          appInfo={roleInfo.app as App}
          value={checked}
          onChange={(value) => {
            setSaveDisabled(false)
            setChecked(value)
          }}
        />
      </ProCard> : <></>
    }
  </PageContainer>
}
