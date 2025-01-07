import { OrgRoleKind } from "@/generated/adminx/graphql"
import { PageOrgRoleList } from "../../roles"
import { useSearchParams } from "ice"
import { Empty } from "antd"

export default () => {
  const [searchParams] = useSearchParams(),
    orgId = searchParams.get('id')

  return (orgId ? <PageOrgRoleList kind={OrgRoleKind.Group} orgId={orgId} isFromOrg /> : <Empty description={`参数错误`} />)
}
