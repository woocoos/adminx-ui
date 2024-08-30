import { OrgRoleKind } from '@/generated/adminx/graphql';
import { PageOrgRoleList } from '@/pages/org/roles';
import { useSearchParams } from '@ice/runtime';
import { KeepAlive } from '@knockout-js/layout';

export default () => {
  const [searchParams] = useSearchParams();

  return (<KeepAlive>
    <PageOrgRoleList kind={OrgRoleKind.Group} orgId={searchParams.get('id') || ''} isFromSystem />
  </KeepAlive>
  );
};
