import store from '@/store';
import { OrgList } from '../list';
import { useSearchParams } from '@ice/runtime';
import { OrgKind } from '@/__generated__/adminx/graphql';

export default (props: {
  isFromSystem?: boolean;
}) => {
  const [basisState] = store.useModel('basis'),
    [searchParams] = useSearchParams();

  return (
    <OrgList kind={OrgKind.Org} tenantId={searchParams.get('id') || basisState.tenantId} isFromSystem={props.isFromSystem} />
  );
};
