import KeepAlive from '@/components/KeepAlive';
import { PageAppList } from '@/pages/app/list';

export default () => {
  return (<KeepAlive clearAlive>
    <PageAppList />
  </KeepAlive>);
};
