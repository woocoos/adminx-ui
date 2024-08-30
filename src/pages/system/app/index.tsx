import { PageAppList } from '@/pages/app/list';
import { KeepAlive } from '@knockout-js/layout';
import { definePageConfig } from 'ice';

export default () => {
  return (<KeepAlive clearAlive>
    <PageAppList />
  </KeepAlive>);
};

export const pageConfig = definePageConfig(() => ({
  auth: ['/system/app'],
}));
