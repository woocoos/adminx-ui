import { UserIdentity } from '@/generated/adminx/graphql';
import Auth, { checkAuth } from '@/components/auth';
import { EnumUserIdentityKind, EnumUserStatus, bindUserIdentity, delUserIdentity, getUserInfoIdentities } from '@/services/adminx/user';
import { ActionType, EditableProTable, ProColumns } from '@ant-design/pro-components';
import { Drawer, Popconfirm, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { delDataSource, saveDataSource } from '@/util';


export default (props: {
  open?: boolean;
  title?: string;
  id?: string | null;
  onClose?: (isSuccess?: boolean, newInfo?: UserIdentity[]) => void;
}) => {
  const proTableRef = useRef<ActionType>(),
    { t } = useTranslation(),
    [loading, setLoading] = useState(false),
    // 是否操作过
    [isAction, setIsAction] = useState(false),
    [dataSource, setDataSource] = useState<UserIdentity[]>([]),
    columns: ProColumns<UserIdentity>[] = [
      {
        title: t('type'),
        dataIndex: 'kind',
        formItemProps: {
          rules: [{ required: true, message: `${t('required_fields')}` }],
        },
        valueType: 'select',
        valueEnum: EnumUserIdentityKind,
      },
      {
        title: 'code',
        dataIndex: 'code',
        formItemProps: (form, row) => {
          const rowData = form.getFieldValue(row.entity.id),
            rules: any[] = [
              { required: true, message: `${t('required_fields')}` },
            ];
          if (rowData?.kind === 'email') {
            rules.push({
              type: 'email',
              message: `${t('format_error')}`,
            });
          }
          return {
            rules,
          };
        },
      },
      {
        title: 'codeExtend',
        dataIndex: 'codeExtend',
      },
      {
        title: t('state'),
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: EnumUserStatus,
      },
      {
        title: t('operation'),
        valueType: 'option',
        width: 200,
        render: (_text, record) => [
          <Auth key={record.id} authKey="deleteUserIdentity">
            <Popconfirm
              key="editable"
              title={t('delete')}
              description={`${t('confirm_delete')}?`}
              onConfirm={async () => {
                setIsAction(true);
                const reulst = await delUserIdentity(record.id);
                if (reulst === true) {
                  setLoading(true);
                  setDataSource(delDataSource(dataSource, record.id));
                  message.success(t('submit_success'));
                }
              }}
            >
              <a> {t('delete')} </a>
            </Popconfirm>
          </Auth>,

        ],
      },
    ];

  useEffect(() => {
    setLoading(false);
  }, [dataSource])

  return (
    <Drawer
      width={800}
      destroyOnClose
      placement="right"
      title={props.title}
      open={props?.open}
      onClose={() => {
        props.onClose?.(isAction, dataSource);
      }}
    >
      <EditableProTable
        actionRef={proTableRef}
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        request={async () => {
          setLoading(true);
          const table = { data: [] as UserIdentity[], success: true, total: 0 };
          if (props.id) {
            const userInfo = await getUserInfoIdentities(props.id);
            if (userInfo?.identities) {
              table.data = userInfo.identities;
              table.total = userInfo?.identities.length;
            }
          }
          setDataSource(table.data)
          setLoading(false);
          return table;
        }}
        recordCreatorProps={checkAuth('deleteUserIdentity') ? {
          record: { id: 'new', status: 'active' } as any,
          creatorButtonText: t('add'),
        } : false}
        editable={{
          type: 'single',
          saveText: t('save'),
          deleteText: t('delete'),
          cancelText: t('cancel'),
          onSave: async (_key: string, record: UserIdentity) => {
            if (props.id) {
              const result = await bindUserIdentity({
                kind: record.kind,
                code: record.code,
                status: record.status,
                codeExtend: record.codeExtend,
                userID: props.id,
              });
              if (result?.id) {
                setLoading(true);
                message.success(t('submit_success'));
                setDataSource(saveDataSource(dataSource, record))
              }
              setIsAction(true);
            }
          },

        }}
      />
    </Drawer>
  );
};
