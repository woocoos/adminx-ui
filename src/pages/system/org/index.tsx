import { OrgList } from '@/pages/org/list';
import { KeepAlive } from '@knockout-js/layout';

export default () => {
  return (<KeepAlive clearAlive>
    <OrgList isFromSystem />
  </KeepAlive>);
};
