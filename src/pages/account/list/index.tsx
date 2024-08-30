import { KeepAlive } from '@knockout-js/layout';
import { UserList } from '../components/listAccount';
import { UserUserType } from '@/generated/adminx/graphql';

export default () => (<KeepAlive clearAlive>
  <UserList userType={UserUserType.Account} scene="user" />
</KeepAlive>);
