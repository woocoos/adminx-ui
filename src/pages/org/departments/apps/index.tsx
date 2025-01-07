import { KeepAlive } from "@knockout-js/layout"
import OrgApps from "../../apps"

export default () => {

  return <KeepAlive clearAlive>
    <OrgApps isFromOrg />
  </KeepAlive>
}
