import UserList from "./components/listAccount"
import KeepAlive from 'react-activation'


export default () => <KeepAlive>
    <UserList userType="account" scene="user" />
</KeepAlive>