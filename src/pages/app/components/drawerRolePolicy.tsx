import { getAppPolicyList } from '@/services/adminx/app/policy';
import { assignAppRolePolicy } from '@/services/adminx/app/role';
import { Col, Input, List, Row, Space, Tag, message } from 'antd';
import { useRef, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { ActionType, DrawerForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { TableParams } from '@/services/graphql';
import { setLeavePromptWhen } from '@/components/LeavePrompt';
import { App, AppPolicy, AppRole } from '@/__generated__/adminx/graphql';

export default (props: {
  open: boolean;
  title?: string;
  appInfo?: App;
  roleInfo?: AppRole;
  onClose: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<AppPolicy>[] = [
      { title: t('policy'), dataIndex: 'name' },
      { title: t('description'), dataIndex: 'comments' },
    ],
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [keyword, setKeyword] = useState<string>(),
    [selectedDatas, setSelectedDatas] = useState<AppPolicy[]>([]),
    [dataSource, setDataSource] = useState<AppPolicy[]>([]);

  setLeavePromptWhen(saveDisabled);

  const
    getRequest = async (params: TableParams) => {
      const table = { data: [] as AppPolicy[], success: true, total: 0 };
      if (keyword) {
        params.nameContains = keyword;
      }
      params.status = 'active';
      if (props.appInfo) {
        const result = await getAppPolicyList(
          props.appInfo.id,
          { appRoleId: props.roleInfo?.id },
        );
        if (result?.length) {
          table.data = result as AppPolicy[];
          table.total = result.length;
        }
      }
      setDataSource(table.data);
      return table;
    },
    onOpenChange = (open: boolean) => {
      if (!open) {
        props.onClose?.();
      }
      setSaveDisabled(true);
    },
    onFinish = async () => {
      if (props.roleInfo?.id) {
        setSaveLoading(true);
        const result = await assignAppRolePolicy(
          props.roleInfo.appID || '',
          props.roleInfo.id,
          selectedDatas.map(item => item.id),
        );
        if (result) {
          message.success(t('submit_success'));
          props.onClose?.(true);
          setSaveDisabled(true);
        }
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
        <div>
          {t('app')}：<Tag>{props.appInfo?.name}</Tag>
        </div>
        <div>{t('role')}：</div>
        <div>
          <Input value={props.roleInfo?.name} />
        </div>
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
                  disabled: record.isGrantAppRole,
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
                  <a>{t('empty')}</a>
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
