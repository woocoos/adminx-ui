import { KeepAlive } from "@knockout-js/layout"
import { OrgRoleKind } from "@/generated/adminx/graphql"
import { PageOrgRoleList } from "../../roles"
import { useSearchParams } from "ice"
import { Empty } from "antd"

export default () => {
  const [searchParams] = useSearchParams(),
    orgId = searchParams.get('id')

  return (orgId ? <KeepAlive clearAlive>
    <PageOrgRoleList kind={OrgRoleKind.Role} orgId={orgId} isFromOrg />
  </KeepAlive> : <Empty description={`参数错误`} />)
}
