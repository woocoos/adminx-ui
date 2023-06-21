import KeepAlive from '@/components/KeepAlive';
import { UserUserType } from '@/__generated__/graphql';
import { UserList } from '@/pages/account/components/listAccount';


export default () => (<KeepAlive clearAlive>
  <UserList userType={UserUserType.Account} scene="user" />
</KeepAlive>);
