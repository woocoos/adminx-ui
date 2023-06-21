import { OrgRoleKind } from '@/__generated__/knockout/graphql';
import KeepAlive from '@/components/KeepAlive';
import { PageOrgRoleList } from '@/pages/org/roles';
import { useSearchParams } from '@ice/runtime';

export default () => {
  const [searchParams] = useSearchParams();

  return (<KeepAlive>
    <PageOrgRoleList kind={OrgRoleKind.Role} orgId={searchParams.get('id') || ''} isFromSystem />
  </KeepAlive>);
};
