import { AppList } from '@/pages/app/list';
import { Org, getOrgInfo } from '@/services/org';
import { PageContainer, useToken } from '@ant-design/pro-components';
import { useSearchParams } from '@ice/runtime';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation(),
    { token } = useToken(),
    [searchParams] = useSearchParams(),
    [info, setInfo] = useState<Org>();

  const getInfo = async () => {
    const orgId = searchParams.get('id');
    if (orgId) {
      const result = await getOrgInfo(orgId);
      if (result) {
        setInfo(result);
      }
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (<PageContainer
    header={{
      title: t('Authorized application'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: [
          { title: t('System configuration') },
          { title: t('{{field}} management', { field: t('organization') }) },
          { title: t('Authorized application') },
        ],
      },
    }}
  >
    <AppList x-if={info?.id} scene="orgApp" title={`${t('organization')}：${info?.name}`} orgId={info?.id} />
  </PageContainer>);
};
