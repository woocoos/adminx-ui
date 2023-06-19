import store from '@/store';
import OrgList from '../list';
import { useSearchParams } from '@ice/runtime';
import { OrgKind } from '@/__generated__/graphql';

export default () => {
  const [basisState] = store.useModel('basis'),
    [searchParams] = useSearchParams();

  return (
    <OrgList kind={OrgKind.Org} tenantId={searchParams.get('id') || basisState.tenantId} />
  );
};
