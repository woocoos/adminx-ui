import { UserUserType } from '@/generated/adminx/graphql';
import { UserList } from '@/pages/account/components/listAccount';
import { KeepAlive } from '@knockout-js/layout';
import { definePageConfig } from 'ice';


export default () => (<KeepAlive clearAlive>
  <UserList userType={UserUserType.Account} scene="user" />
</KeepAlive>);

export const pageConfig = definePageConfig(() => ({
  auth: ['/system/account'],
}));
