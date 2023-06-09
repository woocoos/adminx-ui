import KeepAlive from '@/components/KeepAlive';
import UserList from '../components/listAccount';


export default () => (<KeepAlive clearAlive={true}>
  <UserList userType="account" scene="user" />
</KeepAlive>);
