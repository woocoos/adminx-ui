import { PageOrgRoleList } from '../roles';
import store from '@/store';
import { OrgRoleKind } from '@/generated/adminx/graphql';
import { KeepAlive } from '@knockout-js/layout';

export default () => {
  const [userState] = store.useModel('user');

  return (<KeepAlive clearAlive>
    <PageOrgRoleList kind={OrgRoleKind.Group} orgId={userState.tenantId} />
  </KeepAlive>
  );
};
