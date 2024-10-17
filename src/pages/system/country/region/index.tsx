
import { PageContainer, ProCard, useToken, ProForm, ProFormText, ProFormSelect, ProFormTextArea, ProFormInstance } from '@ant-design/pro-components';
import { Space, Dropdown, Tree, Empty, Input, message, Modal, Button, Row, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { TreeDataState, TreeEditorAction, delTreeData, formatTreeData, getTreeDropData, updateFormat, saveTreeData } from '@/util';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from '@ice/runtime';
import Auth, { checkAuth } from '@/components/auth';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { useAuth } from 'ice';
import { useLeavePrompt } from '@knockout-js/layout';
import { Country, Region, RegionSimpleStatus, UpdateRegionInput } from '@/generated/adminx/graphql';
import { getCountryInfo } from '@/services/adminx/country';
import { createRegionInfo, delRegionInfo, getRegionList, moveRegionInfo, updateRegionInfo } from '@/services/adminx/country/region';

type TreeSelectedData = {
  keys: Array<string>;
  action: TreeEditorAction;
  info?: Region;
};

type ProFormData = {
  countryID: string;
  parentID: string;
  name: string;
  nameEn?: string;
  shortCode?: string;
  status?: RegionSimpleStatus;
  zipCode?: string;
}

export default () => {
  const { token } = useToken(),
    [auth] = useAuth(),
    { t } = useTranslation(),
    formRef = useRef<ProFormInstance>(),
    [searchParams] = useSearchParams(),
    id = searchParams.get('id'),
    [loading, setLoading] = useState(false),
    [treeDraggable, setTreeDraggable] = useState(false),
    [countryInfo, setCountryInfo] = useState<Country>(),
    [dataSource, setDataSource] = useState<Region[]>([]),
    [treeData, setTreeData] = useState<TreeDataState<Region>[]>([]),
    [selectedTree, setSelectedTree] = useState<TreeSelectedData>({
      keys: [],
      info: undefined,
      action: 'editor',
    }),
    [actionTitle, setActionTitle] = useState<string>(''),
    [, setFormFieldsValue] = useState<Region>(),
    [, setLeavePromptWhen] = useLeavePrompt(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
    customerTitleRender = (nodeData: TreeDataState<Region>) => {
      const items: ItemType[] = [];
      if (checkAuth('createRegion', auth)) {
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
      if (checkAuth('deleteRegion', auth)) {
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
        const countryResult = await getCountryInfo(id);
        if (countryResult?.id) {
          setCountryInfo(countryResult as Country);
          const result = await getRegionList({
            where: {
              countryID: countryResult.id,
            },
            pageSize: 9999,
          });
          if (result?.totalCount) {
            const list = result.edges?.map(item => item?.node) as Region[];
            setDataSource(list);
            setTreeData(
              formatTreeData(
                list.map(item => ({
                  key: item.id,
                  title: item.name ?? '',
                  parentId: item.parentID ?? '',
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
      const info = dataSource.find(item => (item.name ?? '').indexOf(keyword) > -1);
      if (info) {
        editorMenuAction(info, 'editor');
      }
    },
    onTreeSelect = (_selectedKeys, selectedEvent) => {
      editorMenuAction(selectedEvent.node.node, 'editor');
    },
    editorMenuAction = (info: Region | undefined, action: TreeEditorAction) => {
      if (info) {
        let title = '';
        setSelectedTree({ keys: [info.id], info: info, action: action });
        switch (action) {
          case 'editor':
            title = `${t('edit')}-${info.name}`;
            setFormFieldsValue(info);
            formRef.current?.setFieldsValue(info);
            break;
          case 'peer':
            title = `${t('created')}-${info.name}-${t('same_level')}`;
            setFormFieldsValue(undefined);
            formRef.current?.resetFields();
            break;
          case 'child':
            title = `${t('created')}-${info.name}-${t('sublayer')}`;
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

      const result = await moveRegionInfo(action, sourceId, targetId);
      if (result) {
        await getMenusRequest();
      }
    },
    onDelMenu = (info: Region) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${info.name}`,
        onOk: async (close) => {
          const result = await delRegionInfo(info.id);
          if (result) {
            editorMenuAction(undefined, 'editor');
            delTreeData(treeData, info.id, { id: 'key' })
            setTreeData([...treeData])
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
      if (countryInfo) {
        if (selectedTree.action === 'editor') {
          if (selectedTree.info?.id) {
            const result = await updateRegionInfo(selectedTree.info.id, updateFormat<UpdateRegionInput>({
              name: values.name,
              nameEn: values.nameEn,
              shortCode: values.shortCode,
              status: values.status,
              zipCode: values.zipCode,
            }, selectedTree.info));
            if (result?.id) {
              message.success(t('submit_success'));
              setSaveDisabled(true);
              saveTreeData(treeData, {
                key: result.id,
                title: result.name,
                parentId: result.parentID ?? '',
                node: result as Region,
              }, { id: 'key' })
              setTreeData([...treeData])
            }
          } else {
            const result = await createRegionInfo({
              countryID: countryInfo.id,
              parentID: selectedTree.info?.parentID || "0",
              name: values.name,
              nameEn: values.nameEn,
              shortCode: values.shortCode,
              status: values.status,
              zipCode: values.zipCode,
            });
            if (result?.id) {
              message.success(t('submit_success'));
              setSaveDisabled(true);
              editorMenuAction(result as Region, 'editor');
              saveTreeData(treeData, {
                key: result.id,
                title: result.name,
                parentId: result.parentID ?? '',
                node: result as Region,
              }, { id: 'key' })
              setTreeData([...treeData])
            }
          }
        } else if (selectedTree.action === 'child') {
          const result = await createRegionInfo({
            countryID: countryInfo.id,
            parentID: selectedTree.info?.id || "0",
            name: values.name,
            nameEn: values.nameEn,
            shortCode: values.shortCode,
            status: values.status,
            zipCode: values.zipCode,
          });
          if (result?.id) {
            message.success(t('submit_success'));
            setSaveDisabled(true);
            editorMenuAction(result as Region, 'editor');
            saveTreeData(treeData, {
              key: result.id,
              title: result.name,
              parentId: result.parentID ?? '',
              node: result as Region,
            }, { id: 'key' })
            setTreeData([...treeData])
          }
        } else if (selectedTree.action === 'peer') {
          const result = await createRegionInfo({
            countryID: countryInfo.id,
            parentID: selectedTree.info?.parentID || "0",
            name: values.name,
            nameEn: values.nameEn,
            shortCode: values.shortCode,
            status: values.status,
            zipCode: values.zipCode,
          });
          if (result?.id) {
            message.success(t('submit_success'));
            setSaveDisabled(true);
            editorMenuAction(result as Region, 'editor');
            saveTreeData(treeData, {
              key: result.id,
              title: result.name,
              parentId: result.parentID ?? '',
              node: result as Region,
            }, { id: 'key' })
            setTreeData([...treeData])
          }
        }
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
        title: `${countryInfo?.name} - ${t('region_manage')}`,
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: <Link to={'/system/country'}>{t('country_region_title')}</Link> },
            { title: t('region_manage') },
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
              <Auth authKey="moveRegion">
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
            submitter={checkAuth('createRegion') || checkAuth('updateRegion') ? {
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
            <ProFormText
              name="nameEn"
              label={t('name_en')}
              placeholder={`${t('please_enter_name')}`}
            />
            <ProFormText
              name="shortCode"
              label={t('code')}
              placeholder={`${t('please_enter_code')}`}
            />
            <ProFormText
              name="zipCode"
              label={t('zip_code')}
              placeholder={`${t('please_enter_zip_code')}`}
            />
            <ProFormSelect
              name="status"
              label={t('status')}
              placeholder={`${t('please_select')}`}
              options={[
                { value: RegionSimpleStatus.Active, label: RegionSimpleStatus.Active },
                { value: RegionSimpleStatus.Disabled, label: RegionSimpleStatus.Disabled },
                { value: RegionSimpleStatus.Inactive, label: RegionSimpleStatus.Inactive },
                { value: RegionSimpleStatus.Processing, label: RegionSimpleStatus.Processing },
              ]}
            />
          </ProForm>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
