import { useSearchParams } from '@ice/runtime';
import { OrgRoleList } from '../roles';
import store from '@/store';
import KeepAlive from '@/components/KeepAlive';
import { OrgRoleKind } from '@/__generated__/graphql';

export default () => {
  const [searchParams] = useSearchParams(),
    [basisState] = store.useModel('basis'),
    orgId = searchParams.get('id') || basisState.tenantId;

  return (<KeepAlive clearAlive>
    <OrgRoleList kind={OrgRoleKind.Group} orgId={orgId} />
  </KeepAlive>
  );
};
