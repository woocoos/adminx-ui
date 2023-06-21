import { Org } from '@/__generated__/graphql';
import { PageAppList } from '@/pages/app/list';
import { getOrgInfo } from '@/services/org';
import { PageContainer, useToken } from '@ant-design/pro-components';
import { Link, useSearchParams } from '@ice/runtime';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default (props: {
  isFromSystem?: boolean;
}) => {
  const { t } = useTranslation(),
    { token } = useToken(),
    [searchParams] = useSearchParams(),
    [info, setInfo] = useState<Org>();

  const getInfo = async () => {
    const orgId = searchParams.get('id');
    if (orgId) {
      const result = await getOrgInfo(orgId);
      if (result) {
        setInfo(result as Org);
      }
    }
  };

  useEffect(() => {
    getInfo();
  }, [searchParams]);

  return (<PageContainer
    header={{
      title: t('auth_app'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: props.isFromSystem ? [
          { title: t('system_conf') },
          { title: <Link to={'/system/org'}>{t('org_manage')}</Link> },
          { title: t('auth_app') },
        ] : [
          { title: t('org_cooperation') },
          { title: t('auth_app') },
        ],
      },
    }}
  >
    <PageAppList x-if={info?.id} scene="orgApp" title={`${t('organization')}：${info?.name}`} orgId={info?.id} />
  </PageContainer>);
};
