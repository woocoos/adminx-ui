import KeepAlive from '@/components/KeepAlive';
import UserList from '../components/listAccount';


export default () => (<KeepAlive>
  <UserList userType="account" scene="user" />
</KeepAlive>);
