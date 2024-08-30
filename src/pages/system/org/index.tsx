import { OrgList } from '@/pages/org/list';
import { KeepAlive } from '@knockout-js/layout';
import { definePageConfig } from 'ice';

export default () => {
  return (<KeepAlive clearAlive>
    <OrgList isFromSystem />
  </KeepAlive>);
};

export const pageConfig = definePageConfig(() => ({
  auth: ['/system/org'],
}));
