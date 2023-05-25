import store from "@/store"
import { useLocation, useSearchParams } from "@ice/runtime"
import { ReactNode } from "react"
import KeepAlive from "react-activation"

export default (props: {
    children: ReactNode
}) => {
    const [basisState] = store.useModel("basis"),
        [searchParams] = useSearchParams(),
        location = useLocation(),
        id = searchParams.get("id") || basisState.tenantId
        
    // 先关闭掉 等测试通过后开启
    return <KeepAlive when={false} cacheKey={btoa(location.pathname)} id={id}>
        {props.children}
    </KeepAlive>
}