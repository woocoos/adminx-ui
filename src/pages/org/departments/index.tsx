import store from '@/store';
import { OrgList } from '../list';
import { useSearchParams } from '@ice/runtime';
import { OrgKind } from '@/generated/adminx/graphql';

export default (props: {
  isFromSystem?: boolean;
}) => {
  const [userState] = store.useModel('user'),
    [searchParams] = useSearchParams();

  return (
    <OrgList kind={OrgKind.Org} tenantId={searchParams.get('id') || userState.tenantId} isFromSystem={props.isFromSystem} />
  );
};
