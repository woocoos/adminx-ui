import { Col, Input, List, Row, Space, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { ActionType, DrawerForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { getOrgPolicyList } from '@/services/adminx/org/policy';
import { createPermission } from '@/services/adminx/permission';
import { useTranslation } from 'react-i18next';
import { OrgPolicy, OrgPolicyWhereInput, OrgRole, PermissionPrincipalKind, User } from '@/generated/adminx/graphql';
import { useLeavePrompt } from '@knockout-js/layout';

export default (props: {
  open: boolean;
  title?: string;
  orgId: string;
  userInfo?: User;
  orgRoleInfo?: OrgRole;
  onClose: (isSuccess?: boolean) => void;
}) => {
  const
    { t } = useTranslation(),
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<OrgPolicy>[] = [
      { title: t('policy'), dataIndex: 'name' },
      { title: t('description'), dataIndex: 'comments' },
    ],
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [keyword, setKeyword] = useState<string>(),
    [selectedDatas, setSelectedDatas] = useState<OrgPolicy[]>([]),
    [checkLeave, setLeavePromptWhen] = useLeavePrompt(),
    [dataSource, setdataSource] = useState<OrgPolicy[]>([]);

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
    onOpenChange = (open: boolean) => {
      if (!open) {
        if (checkLeave()) {
          props.onClose?.();
          setSaveDisabled(true);
        }
      } else {
        setSaveDisabled(true);
      }
    },
    onFinish = async () => {
      setSaveLoading(true);
      let isTree = false;
      for (let idx in selectedDatas) {
        const item = selectedDatas[idx];
        if (props.orgRoleInfo) {
          const result = await createPermission({
            principalKind: PermissionPrincipalKind.Role,
            orgID: props.orgId,
            orgPolicyID: item.id,
            roleID: props.orgRoleInfo.id,
          });
          if (result?.id) {
            isTree = true;
          }
        } else if (props.userInfo) {
          const result = await createPermission({
            principalKind: PermissionPrincipalKind.User,
            orgID: props.orgId,
            orgPolicyID: item.id,
            userID: props.userInfo.id,
          });
          if (result?.id) {
            isTree = true;
          }
        }
      }
      if (isTree) {
        message.success(t('submit_success'));
        setSaveDisabled(true);
        props.onClose(true);
      }
      setSaveLoading(false);
      return false;
    };


  return (
    <DrawerForm
      title={props.title}
      open={props.open}
      submitter={{
        searchConfig: {
          submitText: t('submit'),
          resetText: t('cancel'),
        },
        submitButtonProps: {
          loading: saveLoading,
          disabled: saveDisabled,
        },
      }}
      drawerProps={{
        width: 800,
        destroyOnClose: true,
      }}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
    >
      <Space direction="vertical">
        {
          props.orgRoleInfo ? <>
            <div>{props.orgRoleInfo.kind === 'role' ? t('role') : t('user_group')}</div>
            <div>
              <Input value={props.orgRoleInfo.name} />
            </div>
          </> : ''
        }
        {
          props.userInfo ? <>
            <div>{t('user')}</div>
            <div>
              <Input value={props.userInfo.displayName} />
            </div>
          </> : ''
        }
        <div>
          {t('policy')}
        </div>
        <Row gutter={20}>
          <Col span="16">
            <div>
              <Input.Search
                value={keyword}
                placeholder={`${t('search_keyword')}`}
                onChange={(event) => {
                  setKeyword(event.target.value);
                }}
                onSearch={() => {
                  proTableRef.current?.reload(true);
                }}
              />
            </div>
            <br />
            <ProTable
              className="innerTable"
              columns={columns}
              actionRef={proTableRef}
              request={async (params) => {
                const table = { data: [] as OrgPolicy[], success: true, total: 0 },
                  where: OrgPolicyWhereInput = {};
                if (keyword) {
                  where.nameContains = keyword;
                }
                const result = await getOrgPolicyList(props.orgId, {
                  current: params.current,
                  pageSize: params.pageSize,
                  where,
                }, {
                  roleId: props.orgRoleInfo?.id,
                  userId: props.userInfo?.id,
                });
                if (result?.totalCount) {
                  table.data = result.edges?.map(item => item?.node) as OrgPolicy[];
                  table.total = result.totalCount;
                }
                setdataSource(table.data);
                return table;
              }}
              search={false}
              toolbar={{
                settings: [],
              }}
              scroll={{ y: 500 }}
              rowKey="id"
              size="small"
              pagination={false}
              rowSelection={{
                selectedRowKeys: selectedDatas.map(item => item.id),
                onChange: (selectedRowKeys: string[]) => {
                  const allIds = dataSource.map(item => item.id),
                    oldDatas = selectedDatas.filter(sItem => !allIds.includes(sItem.id)),
                    newDatas = selectedRowKeys.length ? dataSource.filter(item => selectedRowKeys.includes(item.id))
                      : [];
                  setSelectedDatas([...oldDatas, ...newDatas]);
                  setSaveDisabled(false);
                },
                getCheckboxProps: (record) => ({
                  disabled: record.isGrantRole || record.isGrantUser,
                }),
                type: 'checkbox',
              }}
            />
          </Col>
          <Col span="8">
            <div style={{ paddingBottom: '30px' }}>
              <Row>
                <Col flex="auto">
                  {t('selected')}（{selectedDatas.length}）
                </Col>
                <Col >
                  <a onClick={() => {
                    setSelectedDatas([]);
                    setSaveDisabled(true);
                  }}
                  >{t('empty')}</a>
                </Col>
              </Row>
            </div>
            <div>
              <List
                style={{ overflow: 'auto', height: '500px' }}
                bordered
                size="small"
                dataSource={selectedDatas}
                renderItem={(item) => (<List.Item extra={
                  <a onClick={() => {
                    const index = selectedDatas.findIndex(pItem => pItem.id == item.id);
                    if (index > -1) {
                      selectedDatas.splice(index, 1);
                      setSelectedDatas([...selectedDatas]);
                    }
                    setSaveDisabled(false);
                  }}
                  >
                    <CloseOutlined />
                  </a>
                }
                >
                  <List.Item.Meta title={item.name} description={item.comments} />
                </List.Item>)}
              />
            </div>
          </Col>
        </Row>
      </Space>
    </DrawerForm>
  );
};
