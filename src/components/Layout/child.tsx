import { Outlet } from "@ice/runtime"
import { AliveScope } from "react-activation"

export default () => {
  return <AliveScope>
    <Outlet />
  </AliveScope>
}
