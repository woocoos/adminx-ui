import KeepAlive from '@/components/KeepAlive';
import { UserList } from '../components/listAccount';
import { UserUserType } from '@/__generated__/knockout/graphql';


export default () => (<KeepAlive clearAlive>
  <UserList userType={UserUserType.Account} scene="user" />
</KeepAlive>);