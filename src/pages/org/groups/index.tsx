import { PageOrgRoleList } from '../roles';
import store from '@/store';
import KeepAlive from '@/components/KeepAlive';
import { OrgRoleKind } from '@/__generated__/adminx/graphql';

export default () => {
  const [basisState] = store.useModel('basis');

  return (<KeepAlive clearAlive>
    <PageOrgRoleList kind={OrgRoleKind.Group} orgId={basisState.tenantId} />
  </KeepAlive>
  );
};
