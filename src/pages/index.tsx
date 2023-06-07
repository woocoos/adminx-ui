import { User, getUserInfo } from '@/services/user';
import store from '@/store';
import { PageContainer, ProCard, useToken } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import defaultAvatar from '@/assets/images/default-avatar.png';
import defaultApp from '@/assets/images/default-app.png';
import { Avatar, Col, Empty, Row, Space, Statistic } from 'antd';
import { App } from '@/services/app';
import { getOrgUserQty } from '@/services/org/user';
import { getOrgGroupQty, getOrgRoleQty } from '@/services/org/role';
import { getOrgPolicyQty } from '@/services/org/policy';
import { getOrgAppList } from '@/services/org/app';
import { Link } from '@ice/runtime';

export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [basisState] = store.useModel('basis'),
    [info, setInfo] = useState<User>(),
    [loading, setLoading] = useState<boolean>(false),
    [userQty, setUserQty] = useState<number>(0),
    [userGroupQty, setUserGroupQty] = useState<number>(0),
    [roleQty, setRoleQty] = useState<number>(0),
    [policyQty, setPolicyQty] = useState<number>(0),
    [myApps, setMyApps] = useState<App[]>([]);

  const getRequest = async () => {
    setLoading(true);
    if (basisState.user?.id) {
      const result = await getUserInfo(basisState.user.id);
      if (result?.id) {
        setInfo(result);

        setUserQty(await getOrgUserQty(basisState.tenantId, {}));
        setUserGroupQty(await getOrgGroupQty({}));
        setRoleQty(await getOrgRoleQty({ kind: 'role' }));
        setPolicyQty(await getOrgPolicyQty(basisState.tenantId, { appPolicyIDIsNil: true }));

        const orgApps = await getOrgAppList(basisState.tenantId, {}, {}, {});
        if (orgApps) {
          setMyApps(orgApps.edges.map(item => item.node));
        }
      }
    }
    setLoading(false);
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
            <Avatar size={64} src={defaultAvatar} />
          </Col>
          <Col flex="auto">
            <div style={{ fontWeight: 'bold', fontSize: '16px', lineHeight: '38px' }}>{info?.displayName}</div>
            <div>{info?.comments}</div>
          </Col>
        </Row>,
      }}
    >
      <ProCard title={t('Basic data')} direction="row">
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
            title={t('user group')}
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
            title={t('Custom policy')}
            value={policyQty}
            formatter={(value) => (<Link to="/org/policys">
              {value}
            </Link>)}
          />
        </ProCard>
      </ProCard>
      <br />
      <ProCard title={t('My application')}>
        {
          myApps.map(item =>
          (<ProCard
            key={item.id}
            colSpan={6}
            title={
              <Space>
                <Avatar src={defaultApp} />
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

