import i18n from "@/i18n";
import store from "@/store";
import { Outlet } from "@ice/runtime"
import { useEffect } from "react";
import { AliveScope } from "react-activation"

export default () => {
  const [basisState] = store.useModel('basis');

  useEffect(() => {
    i18n.changeLanguage(basisState.locale);
  }, [basisState.locale]);

  return <AliveScope>
    <Outlet />
  </AliveScope>
}
