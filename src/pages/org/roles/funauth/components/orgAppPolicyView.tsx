import { App, OrgRole } from "@/generated/adminx/graphql"
import CheckPolicyView from "@/pages/app/roles/funauth/components/checkPolicyView"
import { getOrgRoleAssignedPolicyView } from "@/services/adminx/org/role"
import { useEffect, useState } from "react"

export default (props: {
  roleInfo: OrgRole
  appInfo: App,
  onChange?: (appInfo: App, add: string[], del: string[]) => void
}) => {
  const [checked, setChecked] = useState<string[]>([]),
    [oldChecked, setOldChecked] = useState<string[]>([]);

  const reqOrgRolePolicyView = async () => {
    const result = await getOrgRoleAssignedPolicyView(props.appInfo.code, props.roleInfo.id)
    setChecked(result.map(item => item.id))
    setOldChecked(result.map(item => item.id))
  }

  useEffect(() => {
    reqOrgRolePolicyView();
  }, [props.roleInfo, props.appInfo])

  useEffect(() => {
    const add: string[] = checked.filter(key => !oldChecked.includes(key)),
      del: string[] = oldChecked.filter(key => !checked.includes(key));
    props.onChange?.(props.appInfo, add, del)
  }, [checked])

  return <CheckPolicyView
    isOrg
    appInfo={props.appInfo}
    value={checked}
    onChange={(value) => {
      setChecked(value)
    }}
  />
}
