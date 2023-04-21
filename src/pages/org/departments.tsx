import store from '@/store'
import OrgList from './list'
import { useSearchParams } from 'ice'

export default () => {
    const [basisState] = store.useModel("basis"),
        [searchParams, setSearchParams] = useSearchParams()

    return (
        <OrgList kind='org' tenantId={searchParams.get('id') || basisState.tenantId} />
    )
}