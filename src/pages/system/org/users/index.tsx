import KeepAlive from '@/components/KeepAlive';
import { PageOrgUsers } from '@/pages/org/users';
import { useSearchParams } from '@ice/runtime';

export default () => {
  const [searchParams] = useSearchParams();

  return (<KeepAlive>
    <PageOrgUsers isFromSystem orgId={searchParams.get('id') || ''} />
  </KeepAlive>);
};
