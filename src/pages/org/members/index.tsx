import { PageContainer, useToken } from '@ant-design/pro-components';
import { UserList } from '@/pages/account/components/listAccount';
import store from '@/store';
import { useTranslation } from 'react-i18next';
import { KeepAlive } from '@knockout-js/layout';
import { definePageConfig } from 'ice';
import { Org, UserUserType } from '@/generated/adminx/graphql';
import { useEffect, useState } from 'react';
import { getOrgInfo } from '@/services/adminx/org';

export const PageOrgUsers = (props: {
  orgId: string;
}) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [orgInfo, setOrgInfo] = useState<Org>();

  const reqOrgInfo = async () => {
    const result = await getOrgInfo(props.orgId);
    setOrgInfo((result as Org) ?? undefined);
  }

  useEffect(() => {
    reqOrgInfo()
  }, [props.orgId])

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
        orgInfo={orgInfo}
        orgId={props.orgId}
      />
    </PageContainer>

  );
};


export default () => {
  const [userState] = store.useModel('user')

  return (<KeepAlive clearAlive>
    <PageOrgUsers
      orgId={userState.tenantId}
    />
  </KeepAlive>
  );
};



export const pageConfig = definePageConfig(() => ({
  auth: ['/org/members'],
}));
