import { PageOrgRoleList } from '../roles';
import store from '@/store';
import { OrgRoleKind } from '@/generated/adminx/graphql';
import { KeepAlive } from '@knockout-js/layout';
import { definePageConfig } from 'ice';

export default () => {
  const [userState] = store.useModel('user');

  return (<KeepAlive clearAlive>
    <PageOrgRoleList kind={OrgRoleKind.Group} orgId={userState.tenantId} />
  </KeepAlive>
  );
};


export const pageConfig = definePageConfig(() => ({
  auth: ['/org/groups'],
}));
