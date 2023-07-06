import KeepAlive from '@/components/KeepAlive';
import { OrgList } from '@/pages/org/list';

export default () => {
  return (<KeepAlive clearAlive>
    <OrgList isFromSystem />
  </KeepAlive>);
};
