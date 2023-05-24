import { useSearchParams } from '@ice/runtime'
import { OrgRoleList } from './roles'
import store from '@/store'
import KeepAlive from 'react-activation'

export default () => {
    const [searchParams, setSearchParams] = useSearchParams(),
        [basisState] = store.useModel("basis"),
        orgId = searchParams.get('id') || basisState.tenantId

    return (<KeepAlive id={orgId}>
        <OrgRoleList kind='group' orgId={orgId} />
    </KeepAlive>
    )
}