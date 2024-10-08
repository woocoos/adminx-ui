import { getOrgRoleInfo } from '@/services/adminx/org/role';
import { PageContainer, ProCard, ProDescriptions, useToken } from '@ant-design/pro-components';
import { Button } from 'antd';
import { Link, useSearchParams } from '@ice/runtime';
import { useEffect, useState } from 'react';
import { UserList } from '@/pages/account/components/listAccount';
import CreateOrgRole from '../../roles/components/create';
import ListRolePermission from '../../roles/components/listRolePermission';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/auth';
import { OrgRole } from '@/generated/adminx/graphql';

export default (props: {
  isFromSystem?: boolean;
}) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [loading, setLoading] = useState(false),
    [info, setInfo] = useState<OrgRole>(),
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      scene: 'base';
    }>({
      open: false,
      title: '',
      scene: 'base',
    });


  const getRequest = async () => {
    const id = searchParams.get('id');
    if (id) {
      setLoading(true);
      const info = await getOrgRoleInfo(id);
      if (info?.id) {
        setInfo(info as OrgRole);
      }
      setLoading(false);
    }
  },
    onDrawerClose = (isSuccess: boolean) => {
      if (isSuccess) {
        getRequest();
      }
      setModal({ open: false, title: '', scene: modal.scene });
    };

  useEffect(() => {
    getRequest();
  }, []);

  return (
    <PageContainer
      header={{
        title: info?.kind === 'role' ? t('role_detail') : t('user_group_detail'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: props.isFromSystem ? [
            { title: t('system_conf') },
            { title: <Link to={'/system/org'}>{t('org_manage')}</Link> },
            { title: info?.kind == 'role' ? <Link to={`/system/org/roles?id=${info?.orgID}`}>{t('role')}</Link> : <Link to={`/system/org/groups?id=${info?.orgID}`}>{t('user_group')}</Link> },
            { title: info?.kind === 'role' ? t('role_detail') : t('user_group_detail') },
          ] : [
            { title: t('org_cooperation') },
            { title: info?.kind == 'role' ? <Link to={'/org/roles'}>{t('role')}</Link> : <Link to={'/org/groups'}>{t('user_group')}</Link> },
            { title: info?.kind === 'role' ? t('role_detail') : t('user_group_detail') },
          ],
        },
      }}
    >
      <ProCard loading={loading} >
        <ProDescriptions
          title={t('basic_info')}
          column={info?.kind === 'role' ? 2 : 1}
          extra={
            <Auth authKey="updateRole">
              <Button onClick={() => {
                setModal({ open: true, title: t('amend_basic_info'), scene: 'base' });
              }}
              >
                {t('amend')}
              </Button>
            </Auth>
          }
        >
          <ProDescriptions.Item label={t('name')} >
            {info?.name}
          </ProDescriptions.Item>
          <ProDescriptions.Item x-if={info?.kind === 'role'} label={t('type')} >
            {info?.isAppRole ? t('system_role') : t('custom_role')}
          </ProDescriptions.Item>
          <ProDescriptions.Item label={t('introduction')} >
            {info?.comments}
          </ProDescriptions.Item>
        </ProDescriptions>

      </ProCard>
      {info ? (
        <CreateOrgRole
          open={modal.open}
          id={info.id}
          orgId={info.orgID || ''}
          kind={info.kind}
          onClose={onDrawerClose}
        />) : ''}
      <ProCard
        tabs={{
          items: [
            {
              label: t('member_manage'),
              key: 'member',
              children: info ? <>
                <UserList
                  scene="roleUser"
                  title={`${t('member_list')}`}
                  orgRole={info}
                  orgId={info.orgID || ''}
                />
              </> : '',
            },
            {
              label: t('permission_manage'),
              key: 'policy',
              children: info ? <ListRolePermission orgRoleInfo={info} readonly={info?.isAppRole} /> : '',
            },
          ],
        }}
      />
    </PageContainer>
  );
};
