import { PageContainer, ProCard, useToken, ProForm, ProFormText, ProFormSelect, ProFormTextArea, ProFormInstance } from '@ant-design/pro-components';
import { Space, Dropdown, Tree, Empty, Input, message, Modal, Button, Row, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { TreeDataState, TreeEditorAction, formatTreeData, getTreeDropData, updateFormat } from '@/util';
import { createAppMenu, delAppMenu, getAppMenus, moveAppMenu, updateAppMenu } from '@/services/adminx/app/menu';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from '@ice/runtime';
import Auth, { checkAuth } from '@/components/auth';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { useAuth } from 'ice';
import { App, AppMenu, AppMenuKind, UpdateAppMenuInput } from '@/generated/adminx/graphql';
import { getAppInfo } from '@/services/adminx/app';
import { useLeavePrompt } from '@knockout-js/layout';


type TreeSelectedData = {
  keys: Array<string>;
  action: TreeEditorAction;
  info?: AppMenu;
};

type ProFormData = {
  name: string;
  kind: AppMenuKind;
  icon?: string;
  route?: string;
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
    [menus, setMenus] = useState<AppMenu[]>([]),
    [treeData, setTreeData] = useState<TreeDataState<AppMenu>[]>([]),
    [selectedTree, setSelectedTree] = useState<TreeSelectedData>({
      keys: [],
      info: undefined,
      action: 'editor',
    }),
    [actionTitle, setActionTitle] = useState<string>(''),
    [, setFormFieldsValue] = useState<AppMenu>(),
    [, setLeavePromptWhen] = useLeavePrompt(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
    customerTitleRender = (nodeData: TreeDataState<AppMenu>) => {
      const items: ItemType[] = [];
      if (checkAuth('createAppMenus', auth)) {
        items.push({
          key: 'create',
          label: t('created'),
          children: [
            {
              key: 'peer',
              label: <a onClick={(event) => {
                event.stopPropagation();
                editorMenuAction(nodeData.node, 'peer');
              }}
              >
                {t('same_level')}
              </a>,
            },
            {
              key: 'child',
              label: <a onClick={(event) => {
                event.stopPropagation();
                editorMenuAction(nodeData.node, 'child');
              }}
              >
                {t('sublayer')}
              </a>,
            },
          ],
        });
      }
      if (checkAuth('deleteAppMenu', auth)) {
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
    getMenusRequest = async (isInit?: boolean) => {
      if (id) {
        if (isInit) {
          setLoading(true);
        }
        const appResult = await getAppInfo(id);
        if (appResult?.id) {
          setAppInfo(appResult as App);
          const result = await getAppMenus(appResult.id, {
            pageSize: 9999,
          });
          if (result?.totalCount) {
            const menuList = result.edges?.map(item => item?.node) as AppMenu[];
            setMenus(menuList);
            setTreeData(
              formatTreeData(
                menuList.map(item => ({
                  key: item.id,
                  title: item.name,
                  parentId: item.parentID,
                  node: item,
                })),
              ),
            );
          }
        }
        setLoading(false);
      }
    },
    onSearch = (keyword: string) => {
      const menuInfo = menus.find(item => item.name.indexOf(keyword) > -1);
      if (menuInfo) {
        editorMenuAction(menuInfo, 'editor');
      }
    },
    onTreeSelect = (_selectedKeys, selectedEvent) => {
      editorMenuAction(selectedEvent.node.node, 'editor');
    },
    editorMenuAction = (menuInfo: AppMenu | undefined, action: TreeEditorAction) => {
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

      const result = await moveAppMenu(sourceId, targetId, action);
      if (result) {
        await getMenusRequest();
      }
    },
    onDelMenu = (menuInfo: AppMenu) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${menuInfo.name}`,
        onOk: async (close) => {
          const result = await delAppMenu(menuInfo.id);
          if (result) {
            editorMenuAction(undefined, 'editor');
            await getMenusRequest();
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
      let isTrue = false;
      if (appInfo) {
        if (selectedTree.action === 'editor') {
          if (selectedTree.info?.id) {
            const result = await updateAppMenu(selectedTree.info.id, updateFormat<UpdateAppMenuInput>({
              comments: values.comments,
              icon: values.icon,
              kind: values.kind,
              name: values.name,
              route: values.kind === AppMenuKind.Menu ? values.route : null,
            }, selectedTree.info));
            if (result?.id) {
              isTrue = true;
            }
          } else {
            const input = {
              comments: values.comments,
              icon: values.icon,
              kind: values.kind,
              name: values.name,
              parentID: selectedTree.info?.parentID || 0,
              route: values.route,
            },
              result = await createAppMenu(appInfo.id, input);
            if (result?.[0]?.id) {
              isTrue = true;
              editorMenuAction({
                id: result[0].id,
                ...input,
              } as AppMenu, 'editor');
            }
          }
        } else if (selectedTree.action === 'child') {
          const input = {
            comments: values.comments,
            icon: values.icon,
            kind: values.kind,
            name: values.name,
            parentID: Number(selectedTree.info?.id) || 0,
            route: values.route,
          },
            result = await createAppMenu(appInfo.id, input);
          if (result?.[0]?.id) {
            isTrue = true;
            editorMenuAction({
              id: result[0].id,
              ...input,
            } as AppMenu, 'editor');
          }
        } else if (selectedTree.action === 'peer') {
          const input = {
            comments: values.comments,
            icon: values.icon,
            kind: values.kind,
            name: values.name,
            parentID: selectedTree.info?.parentID || 0,
            route: values.route,
          },
            result = await createAppMenu(appInfo.id, input);
          if (result?.[0]?.id) {
            isTrue = true;
            editorMenuAction({
              id: result[0].id,
              ...input,
            } as AppMenu, 'editor');
          }
        }
      }
      if (isTrue) {
        message.success(t('submit_success'));
        await getMenusRequest();
        setSaveDisabled(true);
      }
      setSaveLoading(false);
      return false;
    };

  useEffect(() => {
    getMenusRequest(true);
  }, []);


  return (
    <PageContainer
      header={{
        title: `${appInfo?.name} - ${t('menu_manage')}`,
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: <Link to={'/system/app'}>{t('app_manage')}</Link> },
            { title: t('menu_manage') },
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
            <Col >
              <Auth authKey="moveAppMenu">
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
        </ProCard>
        <ProCard title={actionTitle || `${t('created')}-${t('top_menu')}`} headerBordered>
          <ProForm
            formRef={formRef}
            style={{ maxWidth: 400 }}
            submitter={checkAuth('createAppMenus') || checkAuth('updateAppMenu') ? {
              searchConfig: {
                submitText: t('submit'),
                resetText: t('reset'),
              },
              submitButtonProps: {
                loading: saveLoading,
                disabled: saveDisabled,
              },
            } : false}
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
              options={[
                { value: 'dir', label: t('directory') },
                { value: 'menu', label: t('menu') },
              ]}
              rules={[
                { required: true, message: `${t('please_enter_type')}` },
              ]}
            />
            <ProFormText
              name="icon"
              label={t('icon')}
              placeholder={`${t('please_enter_icon')}`}
            />
            <ProForm.Item noStyle shouldUpdate>
              {(form) => (
                form.getFieldValue('kind') == 'menu' ? <>
                  <ProFormText
                    name="route"
                    label={t('route')}
                    placeholder={`${t('please_enter_route')}`}
                  />
                </> : ''
              )}
            </ProForm.Item>
            <ProFormTextArea
              name="comments"
              label={t('remarks')}
              placeholder={`${t('please_enter_remarks')}`}
            />
          </ProForm>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
