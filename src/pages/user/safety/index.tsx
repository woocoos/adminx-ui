import { User, getUserInfo } from '@/services/user';
import store from '@/store';
import { PageContainer, ProCard, ProDescriptions, useToken } from '@ant-design/pro-components';
import { Link } from '@ice/runtime';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UnbindMFA from './components/unbindMFA';
import styles from './index.module.css';

export default () => {
  const { t } = useTranslation(),
    { token } = useToken(),
    [loading, setLoading] = useState(false),
    [info, setInfo] = useState<User>(),
    [basisState] = store.useModel('basis'),
    [modal, setModal] = useState<{
      open: boolean;
    }>({
      open: false,
    });

  const
    getRequest = async () => {
      if (basisState.user?.id) {
        setLoading(true);
        const result = await getUserInfo(basisState.user.id, ['loginProfile']);
        if (result?.id) {
          setInfo(result);
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
          {info?.email}
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
