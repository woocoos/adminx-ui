import { getUserInfo } from '@/services/adminx/user';
import store from '@/store';
import { PageContainer, ProCard, useToken } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import defaultAvatar from '@/assets/images/default-avatar.png';
import defaultApp from '@/assets/images/default-app.png';
import { Avatar, Col, Empty, Row, Space, Statistic } from 'antd';
import { getOrgUserQty } from '@/services/adminx/org/user';
import { getOrgGroupQty, getOrgRoleQty } from '@/services/adminx/org/role';
import { getOrgPolicyQty } from '@/services/adminx/org/policy';
import { getOrgAppList } from '@/services/adminx/org/app';
import { Link } from '@ice/runtime';
import { App, OrgRoleKind, User } from '@/__generated__/adminx/graphql';
import { formatArrayFilesRaw, getFilesRaw } from '@/services/files';

export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [userState] = store.useModel('user'),
    [info, setInfo] = useState<User>(),
    [avatar, setAvatar] = useState<string>(),
    [loading, setLoading] = useState<boolean>(false),
    [userQty, setUserQty] = useState<number>(0),
    [userGroupQty, setUserGroupQty] = useState<number>(0),
    [roleQty, setRoleQty] = useState<number>(0),
    [policyQty, setPolicyQty] = useState<number>(0),
    [myApps, setMyApps] = useState<App[]>([]);

  const
    getRequest = async () => {
      setLoading(true);
      if (userState.user?.id) {
        const result = await getUserInfo(userState.user.id);
        if (result?.id) {
          setInfo(result as User);
          if (result.avatarFileID) {
            await getAvatar(result.avatarFileID)
          }
          setUserQty(await getOrgUserQty(userState.tenantId));
          setUserGroupQty(await getOrgGroupQty());
          setRoleQty(await getOrgRoleQty({ kind: OrgRoleKind.Role }));
          setPolicyQty(await getOrgPolicyQty(userState.tenantId, { appPolicyIDIsNil: true }));

          const orgAppsRes = await getOrgAppList(userState.tenantId, {
            pageSize: 999,
          });
          if (orgAppsRes) {
            const orgApps = orgAppsRes.edges?.map(item => item?.node) as App[]
            setMyApps(
              await formatArrayFilesRaw(orgApps, 'logo')
            );
          }
        }
      }
      setLoading(false);
    },
    getAvatar = async (fileId: string) => {
      const result = await getFilesRaw(fileId, 'url');
      if (typeof result === 'string') {
        setAvatar(result);
      }
    };

  useEffect(() => {
    getRequest();
  }, []);

  return (
    <PageContainer
      loading={loading}
      header={{
        title: t('worktable'),
        style: { background: token.colorBgContainer },
        children: <Row gutter={20}>
          <Col>
            <Avatar size={64} src={avatar || defaultAvatar} />
          </Col>
          <Col flex="auto">
            <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '38px' }}>{info?.displayName}</div>
            <div>{info?.comments}</div>
          </Col>
        </Row>,
      }}
    >
      <ProCard title={t('basic_data')} direction="row">
        <ProCard>
          <Statistic
            title={t('user')}
            value={userQty}
            formatter={(value) => (<Link to="/org/users">
              {value}
            </Link>)}
          />
        </ProCard>
        <ProCard>
          <Statistic
            title={t('user_group')}
            value={userGroupQty}
            formatter={(value) => (<Link to="/org/groups">
              {value}
            </Link>)}
          />
        </ProCard>
        <ProCard>
          <Statistic
            title={t('role')}
            value={roleQty}
            formatter={(value) => (<Link to="/org/roles">
              {value}
            </Link>)}
          />
        </ProCard>
        <ProCard>
          <Statistic
            title={t('custom_policy')}
            value={policyQty}
            formatter={(value) => (<Link to="/org/policys">
              {value}
            </Link>)}
          />
        </ProCard>
      </ProCard>
      <br />
      <ProCard title={t('my_app')}>
        {
          myApps.map(item =>
          (<ProCard
            key={item.id}
            colSpan={6}
            title={
              <Space>
                <Avatar src={item.logo || defaultApp} />
                <span style={{ display: 'inline-block', lineHeight: '30px' }} >{item.name}</span>
              </Space>
            }
          >
            {item.comments}
          </ProCard>),
          )
        }
        <Empty x-if={myApps.length === 0} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </ProCard>
    </PageContainer>
  );
};

