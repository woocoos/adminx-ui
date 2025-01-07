import { KeepAlive } from "@knockout-js/layout"
import { PageOrgPolicys } from "../../policys"

export default () => {

  return <KeepAlive clearAlive>
    <PageOrgPolicys isFromOrg />
  </KeepAlive>
}
