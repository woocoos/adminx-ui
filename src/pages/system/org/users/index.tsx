import { PageOrgUsers } from '@/pages/org/users';
import { useSearchParams } from '@ice/runtime';
import { KeepAlive } from '@knockout-js/layout';

export default () => {
  const [searchParams] = useSearchParams();

  return (<KeepAlive>
    <PageOrgUsers isFromSystem orgId={searchParams.get('id') || ''} />
  </KeepAlive>);
};
