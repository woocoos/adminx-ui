import { PageContainer, ProCard, useToken, ProForm, ProFormText, ProFormSelect, ProFormTextArea, ProFormInstance } from '@ant-design/pro-components';
import { Space, Dropdown, Tree, Empty, Input, message, Modal, Button, Row, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { TreeDataState, TreeEditorAction, delTreeData, formatTreeData, getTreeDropData, updateFormat, saveTreeData } from '@/util';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from '@ice/runtime';
import Auth, { checkAuth } from '@/components/auth';
import { useAuth } from 'ice';
import { App, AppPolicyView, AppPolicyViewKind, CreateAppPolicyViewInput, } from '@/generated/adminx/graphql';
import { getAppInfo } from '@/services/adminx/app';
import { useLeavePrompt } from '@knockout-js/layout';
import { createAppPolicyView, delAppPolicyView, getAppPolicyView, moveAppPolicyView, updateAppPolicyView } from '@/services/adminx/app/policy';
import { ItemType } from 'antd/es/menu/interface';
import RelevancyProlicy from './components/relevancyProlicy';

type TreeSelectedData = {
  keys: Array<string>;
  action: TreeEditorAction;
  info?: AppPolicyView;
};

type ProFormData = {
  name: string;
  kind: AppPolicyViewKind;
  comments?: string;
};

export default () => {
  const { token } = useToken(),
    [auth] = useAuth(),
    { t } = useTranslation(),
    formRef = useRef<ProFormInstance>(),
    [searchParams] = useSearchParams(),
    id = searchParams.get('id'),
    [loading, setLoading] = useState(false),
    [treeDraggable, setTreeDraggable] = useState(false),
    [appInfo, setAppInfo] = useState<App>(),
    [appPolicyViews, setAppPolicyViews] = useState<AppPolicyView[]>([]),
    [treeData, setTreeData] = useState<TreeDataState<AppPolicyView>[]>([]),
    [selectedTree, setSelectedTree] = useState<TreeSelectedData>({
      keys: [],
      info: undefined,
      action: 'editor',
    }),
    [actionTitle, setActionTitle] = useState<string>(''),
    [, setFormFieldsValue] = useState<AppPolicyView>(),
    [, setLeavePromptWhen] = useLeavePrompt(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
    customerTitleRender = (nodeData: TreeDataState<AppPolicyView>) => {
      const items: ItemType[] = [];
      if (checkAuth('createAppPolicyView', auth)) {
        const children = [
          {
            key: 'peer',
            label: <a onClick={(event) => {
              event.stopPropagation();
              editorMenuAction(nodeData.node, 'peer');
            }}
            >
              {t('same_level')}
            </a>,
          }
        ]
        if (nodeData.node?.kind === AppPolicyViewKind.Dir) {
          children.push({
            key: 'child',
            label: <a onClick={(event) => {
              event.stopPropagation();
              editorMenuAction(nodeData.node, 'child');
            }}
            >
              {t('sublayer')}
            </a>,
          })
        }

        items.push({
          key: 'create',
          label: t('created'),
          children,
        });

      }
      if (checkAuth('deleteAppPolicyView', auth)) {
        items.push({
          key: 'deo',
          label: <a onClick={() => {
            if (nodeData.node) {
              onDelMenu(nodeData.node);
            }
          }}
          >
            {t('delete')}
          </a>,
        });
      }
      return (
        <Space>
          <span>{nodeData.title}</span>
          {items.length ? <Dropdown menu={{
            items: items,
          }}
          >
            <SettingOutlined className="tree-setting" />
          </Dropdown> : ''}
        </Space>
      );
    },
    getAppPolicyViewRequest = async (isInit?: boolean) => {
      if (id) {
        if (isInit) {
          setLoading(true);
        }
        const appResult = await getAppInfo(id);
        if (appResult?.id) {
          setAppInfo(appResult as App);
          const result = await getAppPolicyView(appResult.code);
          setAppPolicyViews(result as AppPolicyView[]);
          setTreeData(
            formatTreeData(
              result.map(item => ({
                key: item.id,
                title: item.name,
                parentId: item.parentID,
                node: item as AppPolicyView,
              })),
            ),
          );
        }
        setLoading(false);
      }
    },
    onSearch = (keyword: string) => {
      const menuInfo = appPolicyViews.find(item => item.name.indexOf(keyword) > -1);
      if (menuInfo) {
        editorMenuAction(menuInfo, 'editor');
      }
    },
    onTreeSelect = (_selectedKeys, selectedEvent) => {
      editorMenuAction(selectedEvent.node.node, 'editor');
    },
    editorMenuAction = (menuInfo: AppPolicyView | undefined, action: TreeEditorAction) => {
      if (menuInfo) {
        let title = '';
        setSelectedTree({ keys: [menuInfo.id], info: menuInfo, action: action });
        switch (action) {
          case 'editor':
            title = `${t('edit')}-${menuInfo.name}`;
            setFormFieldsValue(menuInfo);
            formRef.current?.setFieldsValue(menuInfo);
            break;
          case 'peer':
            title = `${t('created')}-${menuInfo.name}-${t('same_level')}`;
            setFormFieldsValue(undefined);
            formRef.current?.resetFields();
            break;
          case 'child':
            title = `${t('created')}-${menuInfo.name}-${t('sublayer')}`;
            setFormFieldsValue(undefined);
            formRef.current?.resetFields();
            break;
          default:
            break;
        }
        setActionTitle(title);
      } else {
        setSelectedTree({ keys: [], info: undefined, action: action });
        setActionTitle(`${t('created')}-${t('top_menu')}`);
        formRef.current?.resetFields();
      }
    },
    onTreeDrop = async (dragInfo) => {
      const { sourceId, targetId, action } = getTreeDropData(treeData, dragInfo);

      const result = await moveAppPolicyView(sourceId, targetId, action);
      if (result) {
        await getAppPolicyViewRequest();
      }
    },
    onDelMenu = (menuInfo: AppPolicyView) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${menuInfo.name}`,
        onOk: async (close) => {
          const result = await delAppPolicyView(menuInfo.id);
          if (result) {
            editorMenuAction(undefined, 'editor');
            delTreeData(treeData, menuInfo.id, { id: 'key' });
            setTreeData([...treeData]);
            message.success(t('submit_success'));
            close();
          }
        },
      });
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    getRequest = async () => {
      setSaveLoading(false);
      setSaveDisabled(true);
      return {};
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      if (appInfo) {
        if (selectedTree.action === 'editor') {
          if (selectedTree.info?.id) {
            const result = await updateAppPolicyView(selectedTree.info.id, updateFormat<CreateAppPolicyViewInput>({
              comments: values.comments,
              kind: values.kind,
              name: values.name,
              parentID: selectedTree.info.parentID
            }, selectedTree.info));
            if (result?.id) {
              message.success(t('submit_success'));
              setSaveDisabled(true);
              saveTreeData(treeData, {
                key: result.id,
                title: result.name,
                parentId: result.parentID,
                node: result as AppPolicyView,
              }, { id: 'key' });
              setTreeData([...treeData]);
            }
          } else {
            const result = await createAppPolicyView({
              appID: appInfo.id,
              comments: values.comments,
              kind: values.kind,
              name: values.name,
              parentID: selectedTree.info?.parentID || "0",
            });
            if (result?.id) {
              message.success(t('submit_success'));
              setSaveDisabled(true);
              editorMenuAction(result as AppPolicyView, 'editor');
              saveTreeData(treeData, {
                key: result.id,
                title: result.name,
                parentId: result.parentID,
                node: result as AppPolicyView,
              }, { id: 'key' });
              setTreeData([...treeData]);
            }
          }
        } else if (selectedTree.action === 'child') {
          const result = await createAppPolicyView({
            appID: appInfo.id,
            comments: values.comments,
            kind: values.kind,
            name: values.name,
            parentID: selectedTree.info?.id || "0",
          });
          if (result?.id) {
            message.success(t('submit_success'));
            setSaveDisabled(true);
            editorMenuAction(result as AppPolicyView, 'editor');
            saveTreeData(treeData, {
              key: result.id,
              title: result.name,
              parentId: result.parentID,
              node: result as AppPolicyView,
            }, { id: 'key' });
            setTreeData([...treeData]);
          }
        } else if (selectedTree.action === 'peer') {
          const result = await createAppPolicyView({
            appID: appInfo.id,
            comments: values.comments,
            kind: values.kind,
            name: values.name,
            parentID: selectedTree.info?.parentID || "0",
          });
          if (result?.id) {
            message.success(t('submit_success'));
            setSaveDisabled(true);
            editorMenuAction(result as AppPolicyView, 'editor');
            saveTreeData(treeData, {
              key: result.id,
              title: result.name,
              parentId: result.parentID,
              node: result as AppPolicyView,
            }, { id: 'key' });
            setTreeData([...treeData]);
          }
        }
      }
      setSaveLoading(false);
      return false;
    };

  useEffect(() => {
    getAppPolicyViewRequest(true);
  }, []);


  return (
    <PageContainer
      header={{
        title: `${appInfo?.name} - ${t('policy_view')}`,
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: <Link to={'/system/app'}>{t('app_manage')}</Link> },
            { title: t('policy_view') },
          ],
        },
      }}
    >
      <ProCard split="vertical">
        <ProCard colSpan="30%" loading={loading}>
          <Row wrap={false}>
            <Col flex="auto">
              <Input.Search placeholder={`${t('search_keyword')}`} onSearch={onSearch} />
            </Col>
            <Col>
              <Auth authKey="moveAppPolicyView">
                <Button
                  type="text"
                  onClick={() => {
                    setTreeDraggable(!treeDraggable);
                  }}
                >{treeDraggable ? t('cancel') : t('drag')}</Button>
              </Auth>
            </Col>
          </Row>
          <br />
          <div style={{ height: 'calc(100vh - 300px)', overflow: 'auto' }}>
            <Tree
              x-if={treeData.length != 0}
              draggable={treeDraggable ? { icon: false, nodeDraggable: () => true } : false}
              treeData={treeData}
              onSelect={onTreeSelect}
              selectedKeys={selectedTree.keys}
              defaultExpandAll
              titleRender={customerTitleRender}
              onDrop={onTreeDrop}
            />
            <div x-else>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          </div>
        </ProCard>
        <ProCard split="horizontal">
          <ProCard
            title={actionTitle || `${t('created')}-${t('top_policy_view')}`}
            headerBordered
            extra={checkAuth('createAppPolicyView') || checkAuth('updateAppPolicyView') ? <>
              <Button
                type='primary'
                loading={saveLoading}
                disabled={saveDisabled}
                onClick={() => {
                  formRef.current?.submit();
                }}
              >{t('save')}</Button>
            </> : <></>}
          >
            <ProForm
              formRef={formRef}
              style={{ maxWidth: 400 }}
              submitter={false}
              onFinish={onFinish}
              onReset={getRequest}
              request={getRequest}
              onValuesChange={onValuesChange}
            >
              <ProFormText
                name="name"
                label={t('name')}
                placeholder={`${t('please_enter_name')}`}
                rules={[
                  { required: true, message: `${t('please_enter_name')}` },
                ]}
              />
              <ProFormSelect
                name="kind"
                label={t('type')}
                placeholder={`${t('please_enter_type')}`}
                disabled={selectedTree.action === 'editor' && selectedTree.info?.kind === AppPolicyViewKind.Policy}
                options={[
                  { value: 'dir', label: t('directory') },
                  { value: 'policy', label: t('policy') },
                ]}
                rules={[
                  { required: true, message: `${t('please_enter_type')}` },
                ]}
              />
              <ProFormTextArea
                name="comments"
                label={t('remarks')}
                placeholder={`${t('please_enter_remarks')}`}
              />
            </ProForm>
          </ProCard>
          {selectedTree.info?.kind === AppPolicyViewKind.Policy ? <>
            <RelevancyProlicy info={selectedTree.info} />
          </> : <></>}
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
