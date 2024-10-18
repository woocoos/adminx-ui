import { PageContainer, useToken } from '@ant-design/pro-components';
import { UserList } from '@/pages/account/components/listAccount';
import store from '@/store';
import { useTranslation } from 'react-i18next';
import { KeepAlive } from '@knockout-js/layout';
import { definePageConfig } from 'ice';
import { UserUserType } from '@/generated/adminx/graphql';

export const PageOrgUsers = (props: {
  orgId: string;
}) => {
  const { token } = useToken(),
    { t } = useTranslation();

  return (
    <PageContainer
      header={{
        title: t('member_manage'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('org_cooperation') },
            { title: t('member_manage') },
          ],
        },
      }}
    >
      <UserList
        title={t('member_list') ?? ''}
        scene="orgMember"
        userType={UserUserType.Member}
        orgId={props.orgId}
      />
    </PageContainer>

  );
};


export default () => {
  const [userState] = store.useModel('user');

  return (<KeepAlive clearAlive>
    <PageOrgUsers orgId={userState.tenantId} />
  </KeepAlive>
  );
};



export const pageConfig = definePageConfig(() => ({
  auth: ['/org/members'],
}));
