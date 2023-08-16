import { PageAppList } from '@/pages/app/list';
import { KeepAlive } from '@knockout-js/layout';

export default () => {
  return (<KeepAlive clearAlive>
    <PageAppList />
  </KeepAlive>);
};
