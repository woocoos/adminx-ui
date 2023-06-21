import { Alert, Col, Input, List, Row, Space, message } from 'antd';
import { useRef, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { ActionType, DrawerForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { TableParams } from '@/services/graphql';
import { assignOrgRoleUser } from '@/services/org/role';
import { allotOrgUser, getOrgUserList } from '@/services/org/user';
import { getDate } from '@/util';
import { setLeavePromptWhen } from '@/components/LeavePrompt';
import { Org, OrgRole, User, UserUserType, UserWhereInput } from '@/__generated__/knockout/graphql';

export default (props: {
  open: boolean;
  title?: string;
  orgId: string;
  orgRole?: OrgRole;
  orgInfo?: Org;
  userType?: UserUserType;
  onClose: (isSuccess?: boolean) => void;
}) => {
  const
    { t } = useTranslation(),
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<User>[] = [
      { title: t('display_name'), dataIndex: 'displayName' },
      { title: t('principal_name'), dataIndex: 'principalName' },
    ],
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [keyword, setKeyword] = useState<string>(),
    [selectedDatas, setSelectedDatas] = useState<User[]>([]),
    [dataSource, setdataSource] = useState<User[]>([]);

  setLeavePromptWhen(saveDisabled);

  const
    getRequest = async (params: TableParams) => {
      const table = { data: [] as User[], success: true, total: 0 },
        where: UserWhereInput = {};
      if (keyword) {
        where.displayNameContains = keyword;
      }
      where.userType = props.userType;
      const result = await getOrgUserList(props.orgId, {
        current: params.current,
        pageSize: params.pageSize,
        where,
      }, {
        orgRoleId: props.orgRole?.id,
      });
      if (result?.totalCount) {
        table.data = result.edges?.map(item => item?.node) as User[] || [];
        table.total = result.totalCount;
      }
      setdataSource(table.data);
      return table;
    },
    onOpenChange = (open: boolean) => {
      if (!open) {
        props.onClose();
      }
      setSaveDisabled(true);
    },
    onFinish = async () => {
      let isTree = false;
      setSaveLoading(true);
      for (let idx in selectedDatas) {
        const item = selectedDatas[idx];
        if (props.orgRole) {
          const result = await assignOrgRoleUser({
            orgRoleID: props.orgRole.id,
            userID: item.id,
          });
          if (result) {
            isTree = true;
          }
        } else if (props.orgInfo) {
          const result = await allotOrgUser({
            joinedAt: getDate(Date.now(), 'YYYY-MM-DDTHH:mm:ssZ') as string,
            displayName: item.displayName,
            orgID: props.orgInfo.id,
            userID: item.id,
          });
          if (result) {
            isTree = true;
          }
        }
      }
      if (isTree) {
        message.success(t('submit_success'));
        props.onClose(true);
        setSaveDisabled(true);
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
          props.orgRole ? <>
            <Alert showIcon message={t('drawer_org_role_alert_msg')} />
            <div>{props.orgRole.kind === 'role' ? t('role') : t('user_group')}</div>
            <div>
              <Input value={props.orgRole.name} />
            </div>
          </> : ''
        }
        {
          props.orgInfo ? <>
            <div>{props.orgInfo.kind === 'root' ? t('organization') : t('department')}</div>
            <div>
              <Input value={props.orgInfo.name} />
            </div>
          </> : ''
        }
        <div>

          {t('user')}
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
              request={getRequest}
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
                  disabled: record.isAssignOrgRole,
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
                  <List.Item.Meta title={item.displayName} description={item.principalName} />
                </List.Item>)}
              />
            </div>
          </Col>
        </Row>
      </Space>
    </DrawerForm>
  );
};
