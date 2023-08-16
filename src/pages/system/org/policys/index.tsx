import { PageOrgPolicys } from '@/pages/org/policys';
import { KeepAlive } from '@knockout-js/layout';

export default () => (<KeepAlive>
  <PageOrgPolicys isFromSystem />
</KeepAlive>);
