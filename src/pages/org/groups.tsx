import { useSearchParams } from 'ice'
import RoleList from './roles'
import store from '@/store'

export default () => {
    const [searchParams, setSearchParams] = useSearchParams(),
        [basisState] = store.useModel("basis")

    return (
        <RoleList kind='group' orgId={searchParams.get('id') || basisState.tenantId} />
    )
}