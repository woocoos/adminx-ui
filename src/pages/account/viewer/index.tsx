import { PageContainer, ProCard, ProDescriptions, useToken } from '@ant-design/pro-components';
import defaultAvatar from '@/assets/images/default-avatar.png';
import { ReactNode, useEffect, useState } from 'react';
import { Button, Divider, Modal, Space, message } from 'antd';
import UserCreate from '../list/components/create';
import UserCreateIdentity from './components/createIdentity';
import { EnumUserIdentityKind, UpdateUserInfoScene, disableMFA, enableMFA, getUserInfoLoginProfileIdentities, sendMFAEmail } from '@/services/user';
import { useTranslation } from 'react-i18next';
import ListUserPermission from './components/listUserPermission';
import ListUserJoinGroup from './components/listUserJoinGroup';
import { Link, history, useSearchParams } from '@ice/runtime';
import Auth from '@/components/Auth';
import style from './index.module.css';
import { PermissionPrincipalKind, User, UserUserType } from '@/__generated__/graphql';

export default (props: {
  isFromOrg?: boolean;
  isFromSystem?: boolean;
}) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [loading, setLoading] = useState(false),
    [info, setInfo] = useState<User>(),
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      scene: UpdateUserInfoScene;
      userType: UserUserType;
    }>({
      open: false,
      title: '',
      scene: 'base',
      userType: UserUserType.Member,
    });

  const
    onDrawerClose = (isSuccess: boolean) => {
      if (isSuccess) {
        getRequest();
      }
      setModal({ open: false, title: '', scene: modal.scene, userType: modal.userType });
    },
    getRequest = async () => {
      const id = searchParams.get('id');
      if (id) {
        setLoading(true);
        const info = await getUserInfoLoginProfileIdentities(id);
        if (info?.id) {
          setInfo(info as User);
          setLoading(false);
        }
      }
    },
    identityRender = () => {
      const items: ReactNode[] = [];
      if (info?.identities) {
        for (let key in info.identities) {
          const item = info.identities[key];
          items.push(
            <ProDescriptions.Item label={EnumUserIdentityKind[item.kind].text} key={key} >
              <div>{item.code}</div>
              <div>{item.codeExtend}</div>
            </ProDescriptions.Item>,
          );
        }
      }
      return items;
    },
    chagneMfa = (enable: boolean) => {
      const title = enable ? t('enable_MFA') : t('close_MFA'),
        content = enable ? t('confirm_enable_MFA') : t('confirm_close_MFA');
      if (info) {
        Modal.confirm({
          title: title,
          content: content,
          onOk: async (close) => {
            if (enable) {
              const result = await enableMFA(info.id);
              if (result?.secret) {
                message.success(t('submit_success'));
                await getRequest();
                close();
              }
            } else {
              const result = await disableMFA(info.id);
              if (result) {
                message.success(t('submit_success'));
                await getRequest();
                close();
              }
            }
          },
        });
      }
    },
    sendEmail = () => {
      if (info) {
        Modal.confirm({
          title: t('send_to_email'),
          content: `${t('MFA')} ${t('send_to_email')}`,
          onOk: async (close) => {
            const result = await sendMFAEmail(info.id);
            if (result) {
              message.success(t('submit_success'));
              await getRequest();
              close();
            }
          },
        });
      }
    };

  useEffect(() => {
    getRequest();
  }, []);

  return (
    <PageContainer
      className={style.viewer}
      header={{
        title: info?.userType == 'account' ? t('account_detail') : t('member_detail'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: props.isFromSystem && props.isFromOrg ? [
            { title: t('system_conf') },
            { title: <Link to={'/system/org'}>{t('org_manage')}</Link> },
            {
              title: <a onClick={() => {
                history?.go(-1)
              }}>{t('user_manage')}</a>
            },
            { title: info?.userType == 'account' ? t('account_detail') : t('member_detail') },
          ] : props.isFromOrg ? [
            { title: t('org_cooperation') },
            { title: <Link to={'/org/users'}>{t('user_manage')}</Link> },
            { title: info?.userType == 'account' ? t('account_detail') : t('member_detail') },
          ] : [
            { title: t('system_conf') },
            { title: <Link to={'/system/account'}>{info?.userType === 'account' ? t('account_manage') : t('member_manage')}</Link> },
            { title: info?.userType == 'account' ? t('account_detail') : t('member_detail') },
          ],
        },
      }}
    >
      <ProCard loading={loading} >
        <ProDescriptions
          size="small"
          title={t('basic_info')}
          column={2}
          extra={
            info ? <Auth authKey="updateUser">
              <Button onClick={() =>
                setModal({ open: true, title: t('amend_basic_info'), scene: 'base', userType: info?.userType || 'member' })}
              >
                {t('amend')}
              </Button>
            </Auth> : ''
          }
        >
          <ProDescriptions.Item
            label=""
            valueType={{ type: 'image', width: 120 }}
            style={{ width: '140px' }}
          >
            {defaultAvatar}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="" >
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={t('display_name')} >
                {info?.displayName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={t('mobile')} >
                {info?.mobile}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={t('email')}>
                {info?.email}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={t('created_at')} valueType="dateTime" >
                {info?.createdAt}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={t('introduction')} span={2} >
                {info?.comments}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProDescriptions.Item>
        </ProDescriptions>

      </ProCard>
      {info ? <ProCard
        style={{ marginTop: '-14px' }}
        tabs={{
          size: 'small',
          items: [
            {
              label: t('certification_manage'),
              key: 'certification',
              children: <>
                <ProDescriptions
                  size="small"
                  title={t('login_credentials')}
                  column={3}
                  extra={
                    <Auth authKey={['deleteUserIdentity', 'bindUserIdentity']} keyAndOr="or">
                      <Button onClick={() =>
                        setModal({ open: true, title: t('amend_login_credentials'), scene: 'identity', userType: info?.userType || 'member' })}
                      >
                        {t('amend')}
                      </Button>
                    </Auth>
                  }
                >
                  {identityRender()}
                </ProDescriptions>
                <Divider />
                <ProDescriptions
                  size="small"
                  title={t('login_settings')}
                  column={3}
                  extra={
                    <Auth authKey="updateLoginProfile">
                      <Button onClick={() =>
                        setModal({ open: true, title: t('amend_login_settings'), scene: 'loginProfile', userType: info?.userType || 'member' })}
                      >
                        {t('amend')}
                      </Button>
                    </Auth>
                  }
                >
                  <ProDescriptions.Item label={t('last_login_ip')} >
                    {info?.loginProfile?.lastLoginIP || '-'}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label={t('last_landing_time')} valueType="dateTime">
                    {info?.loginProfile?.lastLoginAt}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label={t('allow_pwd_login')} >
                    {info?.loginProfile?.canLogin ? t('yes') : t('no')}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label={t('reset_login_pwd')} >
                    {info?.loginProfile?.passwordReset ? t('yes') : t('no')}
                  </ProDescriptions.Item>
                </ProDescriptions>
                <Divider />
                <ProDescriptions
                  size="small"
                  title={t('MFA')}
                  column={3}
                  extra={
                    <Space>
                      {
                        info?.loginProfile?.mfaEnabled ? <>
                          {/* <Button onClick={() => {
                            shoMfaQrCode()
                          }}>
                            {t('view_qr_code')}
                          </Button> */}
                          <Auth authKey="sendMFAToUserByEmail">
                            <Button onClick={() => {
                              sendEmail();
                            }}
                            >
                              {t('send_to_email')}
                            </Button>
                          </Auth>
                          <Auth authKey="enableMFA">
                            <Button
                              type="primary"
                              danger
                              onClick={() => {
                                chagneMfa(false);
                              }}
                            >
                              {t('disable')}
                            </Button>
                          </Auth>
                        </> : <>
                          <Auth authKey="enableMFA">
                            <Button onClick={() => {
                              chagneMfa(true);
                            }}
                            >
                              {t('enable')}
                            </Button>
                          </Auth>
                        </>
                      }
                    </Space>
                  }
                >
                  <ProDescriptions.Item span={3} >
                    <span style={{ color: token.colorTextDescription }}>
                      {t('user_viewer_MFA_description')}
                    </span>
                  </ProDescriptions.Item>
                  {info?.loginProfile?.mfaEnabled ? <>
                    <ProDescriptions.Item label={t('account_number')} >
                      {info.principalName}
                    </ProDescriptions.Item>
                  </> : <></>}
                </ProDescriptions>
              </>
              ,
            }, {
              label: t('join_group'),
              key: 'group',
              children: <ListUserJoinGroup userInfo={info} />,

            }, {
              label: t('permission_manage'),
              key: 'permission',
              children: <ProCard
                style={{ marginTop: '-14px' }}
                tabs={{
                  size: 'small',
                  items: [
                    {
                      label: t('personal_auth'),
                      key: 'user-permission',
                      children: <ListUserPermission
                        userInfo={info}
                        principalKind={PermissionPrincipalKind.User}
                      />,
                    }, {
                      label: t('extend_user_group_permissions'),
                      key: 'group-permission',
                      children: <ListUserPermission
                        userInfo={info}
                        isExtendGroup
                        principalKind={PermissionPrincipalKind.Role}
                      />,
                    },
                  ],
                }}
              />,
            },
          ],
        }}
      /> : ''}


      <UserCreate
        x-if={['base', 'loginProfile'].includes(modal.scene)}
        open={modal.open}
        title={modal.title}
        id={info?.id}
        scene={modal.scene}
        userType={modal.userType}
        onClose={onDrawerClose}
      />
      <UserCreateIdentity
        x-if={modal.scene === 'identity'}
        open={modal.open}
        title={modal.title}
        id={info?.id}
        onClose={onDrawerClose}
      />
    </PageContainer>
  );
};
