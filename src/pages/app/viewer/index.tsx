import { PageContainer, ProCard, ProDescriptions, useToken } from '@ant-design/pro-components';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import defaultApp from '@/assets/images/default-app.png';
import { useSearchParams } from '@ice/runtime';
import { useEffect, useState } from 'react';
import { EnumAppKind, EnumAppStatus, getAppInfo } from '@/services/adminx/app';
import { Button, Divider } from 'antd';
import AppCreate from '../list/components/create';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/auth';
import { App } from '@/generated/adminx/graphql';
import { getFilesRaw } from '@/services/files';

export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    id = searchParams.get('id'),
    [showEys, setShowEys] = useState(false),
    [loading, setLoading] = useState(false),
    [appInfo, setAppInfo] = useState<App>(),
    [logoSrc, setLogoSrc] = useState<string>(),
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      scene?: 'conf';
    }>({
      open: false,
      title: '',
    });

  const
    onDrawerClose = (isSuccess: boolean) => {
      if (isSuccess) {
        getRequest();
      }
      setModal({ open: false, title: '', scene: undefined });
    },
    getRequest = async () => {
      if (id) {
        setLoading(true);
        const result = await getAppInfo(id);
        if (result?.id) {
          if (result.logoFileID) {
            await getLogoSrc(result.logoFileID)
          }
          setAppInfo(result as App);
          setLoading(false);
        }
      }
    },
    getLogoSrc = async (fileId: string | number) => {
      const result = await getFilesRaw(fileId, 'url')
      if (typeof result === 'string') {
        setLogoSrc(result)
      }
    };

  useEffect(() => {
    getRequest();
  }, []);


  return (
    <PageContainer
      header={{
        title: t('app_manage'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: t('app_manage') },
          ],
        },
      }}
    >
      <ProCard loading={loading} >
        <ProDescriptions
          title={t('basic_info')}
          column={2}
          extra={
            <Auth authKey="updateApp">
              <Button onClick={() => setModal({ open: true, title: t('amend_basic_info') })}>
                {t('amend')}
              </Button>
            </Auth>
          }
        >
          <ProDescriptions.Item
            label=""
            valueType={{ type: 'image', width: 120 }}
            style={{ width: '140px' }}
          >
            {logoSrc || defaultApp}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="" >
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={t('name')} >
                {appInfo?.name}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={t('code')} >
                {appInfo?.code}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={t('type')}
                valueEnum={EnumAppKind}
              >
                {appInfo?.kind}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={t('status')}
                valueEnum={EnumAppStatus}
              >
                {appInfo?.status}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="AppKey" >
                {appInfo?.appKey ? <span>{appInfo.appKey}</span> : '-'}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="AppSecret" >
                {
                  appInfo?.appSecret
                    ? showEys
                      ? <>
                        <span>{appInfo?.appSecret}</span>
                        <a onClick={() => setShowEys(false)}><EyeInvisibleOutlined /></a>
                      </>
                      : <>
                        <span>**********</span>
                        <a onClick={() => setShowEys(true)}><EyeOutlined /></a>
                      </>
                    : '-'
                }
              </ProDescriptions.Item>
              <ProDescriptions.Item label={t('description')} >
                {appInfo?.comments}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProDescriptions.Item>

        </ProDescriptions>
        <Divider style={{ margin: '0 0 24px 0' }} />
        <ProDescriptions
          title={t('app_config')}
          column={2}
          extra={
            <Auth authKey="updateApp">
              <Button onClick={() => setModal({ open: true, title: t('amend_app_config'), scene: 'conf' })}>
                {t('amend')}
              </Button>
            </Auth>
          }
        >
          <ProDescriptions.Item label={t('cb_address')} >
            {appInfo?.redirectURI || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('scope_authority')} >
            {appInfo?.scopes || '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={`token ${t('validity')}`} >
            {typeof appInfo?.tokenValidity === 'number' ? appInfo.tokenValidity : '-'}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={`refresh_token ${t('validity')}`} >
            {typeof appInfo?.refreshTokenValidity === 'number' ? appInfo.refreshTokenValidity : '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>

      <AppCreate
        open={modal.open}
        scene={modal.scene}
        title={modal.title}
        id={id}
        onClose={onDrawerClose}
      />
    </PageContainer>
  );
};
