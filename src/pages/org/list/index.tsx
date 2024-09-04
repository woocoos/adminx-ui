import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Dropdown, Modal } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { Link, useAuth } from 'ice';
import { EnumOrgKind, delOrgInfo, getOrgList, getOrgPathList } from '@/services/adminx/org';
import OrgCreate from './components/create';
import { TreeEditorAction, delTreeData, formatTreeData, loopTreeData, updateTreeData } from '@/util';
import { getAppOrgList } from '@/services/adminx/app/org';
import { useTranslation } from 'react-i18next';
import Auth, { checkAuth } from '@/components/auth';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { Org, OrgKind, OrgWhereInput } from '@/generated/adminx/graphql';

type OrgTree = Org & { children?: Org[] }

export const OrgList = (props: {
  title?: string;
  tenantId?: string;
  appId?: string;
  kind?: OrgKind;
  isFromSystem?: boolean;
}) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [auth] = useAuth(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    kind = props.kind || OrgKind.Root,
    columns: ProColumns<Org>[] = [
      // 有需要排序配置  sorter: true
      { title: t('name'), dataIndex: 'name', width: 120 },
      { title: t('code'), dataIndex: 'code', width: 120 },
      { title: t('type'), dataIndex: 'kind', width: 120, valueEnum: EnumOrgKind },
      { title: t('domain'), dataIndex: 'domain', width: 120, search: false },
      { title: t('country_region'), dataIndex: 'countryCode', width: 120, search: false },
      {
        title: t('manage_account'),
        dataIndex: 'owner',
        width: 120,
        search: false,
        render: (text, record) => {
          return <div>{record?.owner?.displayName || '-'}</div>;
        },
      },
      { title: t('description'), dataIndex: 'profile', width: 120, search: false },
    ],
    [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]),
    [dataSource, setDataSource] = useState<OrgTree[]>([]),
    [parentDataSource, setParentDataSource] = useState<OrgTree[]>([]),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      id: string;
      scene: TreeEditorAction;
    }>({
      open: false,
      title: '',
      id: '',
      scene: 'editor',
    });

  columns.push(
    {
      title: t('operation'),
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      search: false,
      width: 150,
      render: (text, record) => {
        const createAction = [
          {
            key: 'child',
            label: <a onClick={() => {
              editorAction(record, 'child');
            }}
            >
              {t('sublayer')}
            </a>,
          },
        ];
        if (record.parentID != '0') {
          createAction.unshift({
            key: 'peer',
            label: <a onClick={() => {
              editorAction(record, 'peer');
            }}
            >
              {t('same_level')}
            </a>,
          });
        }
        const items: ItemType[] = [];
        if (kind == 'root') {
          items.push(
            { key: 'policy', label: <Link to={`/system/org/policys?id=${record.id}`}>{t('policy')}</Link> },
            { key: 'app', label: <Link to={`/system/org/apps?id=${record.id}`}>{t('auth_app')}</Link> },
            { key: 'org', label: <Link to={`/system/org/departments?id=${record.id}`} >{t('department_manage')}</Link> },
            { key: 'orgUser', label: <Link to={`/system/org/users?id=${record.id}`}>{t('user_manage')}</Link> },
          );
        } else {
          if (checkAuth('createOrganization', auth)) {
            items.push(
              { key: 'create', label: t('created'), children: createAction },
            );
          }
          if (record.kind === kind && checkAuth('deleteOrganization', auth)) {
            items.push(
              { key: 'delete', label: <a onClick={() => onDelOrg(record)}>{t('delete')}</a> },
            );
          }
        }

        return (<Space>
          {record.kind === kind ? <>
            <Auth authKey="updateOrganization">
              <a key="editor" onClick={() => editorAction(record, 'editor')}>
                {t('edit')}
              </a>
            </Auth>
          </> : <></>}
          {
            kind == 'root' ? <>
              <Link key="userGroup" to={`/system/org/groups?id=${record.id}`}>
                {t('user_group')}
              </Link>
              {items.length ? <Dropdown
                trigger={['click']}
                menu={{
                  items,
                }}
              >
                <a><EllipsisOutlined /></a>
              </Dropdown> : ''}
            </>
              : <>
                {items.length ? <Dropdown
                  trigger={['click']}
                  menu={{
                    items,
                  }}
                >
                  <a><EllipsisOutlined /></a>
                </Dropdown> : ''}
              </>
          }
        </Space>);
      },
    },
  );


  const
    onDelOrg = (record: Org) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${record.name}?`,
        onOk: async (close) => {
          const result = await delOrgInfo(record.id);
          if (result === true) {
            delTreeData(dataSource as any, record.id)
            setDataSource([...dataSource])
            close();
          }
        },
      });
    },
    editorAction = (info: Org, action: TreeEditorAction) => {
      let title = '';
      switch (action) {
        case 'child':
          title = `${t('created')}-${info.name}-${t('sublayer')}`;
          break;
        case 'peer':
          title = `${t('created')}-${info.name}-${t('same_level')}`;
          break;
        case 'editor':
          title = `${t('edit')}-${info.name}`;
          break;
        default:
          break;
      }
      setModal({ open: true, title: title, id: info.id, scene: action });
    };

  return (
    <>
      <PageContainer
        header={{
          title: kind == 'org' ? t('department_manage') : t('org_manage'),
          style: { background: token.colorBgContainer },
          breadcrumb: {
            items: props.isFromSystem ? kind == 'org' ?
              [
                { title: t('system_conf') },
                { title: <Link to={'/system/org'}>{t('org_manage')}</Link> },
                { title: t('department_manage') },
              ] : [
                { title: t('system_conf') },
                { title: t('org_manage') },
              ] : [
              { title: t('org_cooperation') },
              { title: kind == 'org' ? t('department_manage') : t('org_manage') },
            ],
          },
        }}
      >
        <ProTable
          actionRef={proTableRef}
          rowKey={'id'}
          search={false}
          toolbar={{
            title: kind === 'org' ? t('department_manage') : t('org_manage'),
            actions: kind == 'org' ? [] : [
              <Auth authKey={kind === 'root' ? 'createRoot' : 'createOrganization'}>
                <Button
                  type="primary"
                  onClick={() => {
                    setModal({ open: true, title: t('create_org'), id: '', scene: 'editor' });
                  }}
                >
                  {t('create_org')}
                </Button>
              </Auth>,
            ],
          }}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpandedRowsChange: (expandedKeys: string[]) => {
              setExpandedRowKeys(expandedKeys);
            },
          }}
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={dataSource}
          request={async (params) => {
            const table = { data: [] as OrgTree[], success: true, total: 0 },
              where: OrgWhereInput = {};
            setExpandedRowKeys([]);
            if (props.appId) {
              where.nameContains = params.name;
              where.codeContains = params.code;
              where.kind = params.kind;
              const data = await getAppOrgList(props.appId, {
                current: params.current,
                pageSize: params.pageSize,
                where,
              });
              if (data?.totalCount) {
                table.data = data.edges?.map(item => item?.node) as OrgTree[];
                table.total = data.totalCount;
              }
            } else {
              let list: OrgTree[] = [];
              if (kind === 'org') {
                if (props.tenantId) {
                  const restul = await getOrgPathList(props.tenantId, kind);
                  list = restul.map(item => item) as OrgTree[] || [];
                  table.total = list.length;
                }
              } else {
                where.kind = kind;
                const result = await getOrgList({
                  pageSize: 999,
                  where,
                });
                if (result?.totalCount) {
                  list = result.edges?.map(item => item?.node) as OrgTree[] || [];
                  table.total = result.totalCount;
                }
              }
              setParentDataSource([...list]);
              if (list.length) {
                table.data = formatTreeData(list, undefined, { key: 'id', parentId: 'parentID' });
                setExpandedRowKeys(list.map(item => item.id));
              }
            }
            setDataSource(table.data);
            return table;
          }}
          pagination={false}
        />
        <OrgCreate
          open={modal.open}
          title={modal.title}
          id={modal.id}
          scene={modal.scene}
          parentDataSource={parentDataSource}
          kind={kind}
          onClose={(isSuccess, newInfo) => {
            if (isSuccess && newInfo) {
              const idx = dataSource.findIndex(item => item.id == newInfo.id)
              if (idx === -1) {
                dataSource.unshift(newInfo as OrgTree)
              } else {
                dataSource[idx] = newInfo as OrgTree
              }
              setDataSource([...dataSource])
            }
            setModal({ open: false, title: '', id: '', scene: 'editor' });
          }}
        />
      </PageContainer>
    </>
  );
};
