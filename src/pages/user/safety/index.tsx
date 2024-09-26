import { getUserInfoLoginProfile } from '@/services/adminx/user';
import store from '@/store';
import { PageContainer, ProCard, ProDescriptions, useToken } from '@ant-design/pro-components';
import { Link } from '@ice/runtime';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UnbindMFA from './components/unbindMFA';
import styles from './index.module.css';
import { User } from '@/generated/adminx/graphql';
import { definePageConfig } from 'ice';

export default () => {
  const { t } = useTranslation(),
    { token } = useToken(),
    [loading, setLoading] = useState(false),
    [info, setInfo] = useState<User>(),
    [userState] = store.useModel('user'),
    [modal, setModal] = useState<{
      open: boolean;
    }>({
      open: false,
    });

  const
    getRequest = async () => {
      if (userState.user?.id) {
        setLoading(true);
        const result = await getUserInfoLoginProfile(userState.user.id);
        if (result?.id) {
          setInfo(result as User);
        }
      }
      setLoading(false);
    };

  useEffect(() => {
    getRequest();
  }, []);


  return (<PageContainer
    header={{
      title: t('security_setting'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: [
          { title: t('info_center') },
          { title: t('security_setting') },
        ],
      },
    }}
  >
    <ProCard className={styles.safrety} loading={loading} >
      <ProDescriptions
        size="small"
        title={t('account_pwd')}
        column={2}
        extra={
          info ? <Link to="/user/password">
            {t('amend')}
          </Link> : ''
        }
      >
        <ProDescriptions.Item label={t('email')}>
          {info?.contact?.email}
        </ProDescriptions.Item>
      </ProDescriptions>
      <Divider />
      <ProDescriptions
        size="small"
        title={t('virtual_MFA')}
        column={1}
        extra={
          info?.loginProfile?.mfaEnabled ? <a onClick={() => {
            setModal({ open: true });
          }}
          >
            {t('unbind')}
          </a> : <Link to="/user/bindmfa">
            {t('binding')}
          </Link>
        }
      >
        <ProDescriptions.Item>
          {
            info?.loginProfile?.mfaEnabled
              ? t('mfa_enabled_true_text')
              : t('mfa_enabled_false_text')
          }
        </ProDescriptions.Item>
      </ProDescriptions>
    </ProCard>
    {
      info ? <UnbindMFA
        open={modal.open}
        userInfo={info}
        onClose={(isSuccess) => {
          if (isSuccess) {
            getRequest();
          }
          setModal({ open: false });
        }}
      /> : ''
    }

  </PageContainer>);
};

export const pageConfig = definePageConfig(() => ({
  auth: ['/user/safety'],
}));
