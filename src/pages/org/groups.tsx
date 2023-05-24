import { useSearchParams } from '@ice/runtime'
import RoleList from './roles'
import store from '@/store'
import KeepAlive from 'react-activation'

export default () => {
    const [searchParams, setSearchParams] = useSearchParams(),
        [basisState] = store.useModel("basis"),
        orgId = searchParams.get('id')

    return (<KeepAlive id={orgId || undefined}>
        <RoleList kind='group' orgId={orgId || basisState.tenantId} />
    </KeepAlive>
    )
}