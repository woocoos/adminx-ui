import {
    PageContainer,
    ProCard,
    useToken,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
    ProFormInstance,
} from "@ant-design/pro-components";
import { Space, Dropdown, Tree, Empty, Input, message, Modal, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef, ReactNode } from "react";
import { formatTreeData, getTreeDropData, loopTreeData } from "@/util";
import { TreeDataState, TreeMoveAction } from "@/services/graphql";
import { TreeEditorAction } from "@/util/type";
import { AppMenu, createAppMenu, delAppMenu, getAppMenus, moveAppMenu, updateAppMenu } from "@/services/app/menu";
import { App } from "@/services/app";
import ModalAction from "@/pages/app/components/modalAction";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "@ice/runtime";
import Auth, { checkAuth } from "@/components/Auth";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useAuth } from "ice";



type TreeSelectedData = {
    keys: Array<string>
    action: TreeEditorAction
    info?: AppMenu
}

export default () => {
    const { token } = useToken(),
        [auth] = useAuth(),
        { t } = useTranslation(),
        formRef = useRef<ProFormInstance>(),
        [searchParams, setSearchParams] = useSearchParams(),
        id = searchParams.get('id'),
        [loading, setLoading] = useState(false),
        [treeDraggable, setTreeDraggable] = useState(false),
        [appInfo, setAppInfo] = useState<App>(),
        [menus, setMenus] = useState<AppMenu[]>([]),
        [treeData, setTreeData] = useState<TreeDataState<AppMenu>[]>([]),
        [selectedTree, setSelectedTree] = useState<TreeSelectedData>({
            keys: [],
            info: undefined,
            action: 'editor'
        }),
        [actionTitle, setActionTitle] = useState<string>(`${t('created')}-${t('top menu')}`),
        [formFieldsValue, setFormFieldsValue] = useState<AppMenu>(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [modal, setModal] = useState<{
            open: boolean
        }>({
            open: false
        })

    const
        customerTitleRender = (nodeData: TreeDataState<AppMenu>) => {
            const items: ItemType[] = []
            if (checkAuth('createAppMenus', auth)) {
                items.push({
                    key: 'create',
                    label: t('created'),
                    children: [
                        {
                            key: 'peer', label: <a onClick={(e) => {
                                e.stopPropagation();
                                editorMenuAction(nodeData.node, 'peer')
                            }}>
                                {t('same level')}
                            </a>
                        },
                        {
                            key: 'child', label: <a onClick={(e) => {
                                e.stopPropagation();
                                editorMenuAction(nodeData.node, 'child')
                            }}>
                                {t('sublayer')}
                            </a>
                        }
                    ]
                })
            }
            if (checkAuth('deleteAppMenu', auth)) {
                items.push({
                    key: 'deo', label: <a onClick={(e) => {
                        if (nodeData.node) {
                            onDelMenu(nodeData.node)
                        }
                    }}>
                        {t('delete')}
                    </a>
                })
            }
            return (
                <Space>
                    <span>{nodeData.title}</span>
                    {items.length ? <Dropdown menu={{
                        items: items
                    }}
                    >
                        <SettingOutlined className="tree-setting" />
                    </Dropdown> : ''}
                </Space>
            )
        },
        getMenusRequest = async (isInit?: boolean) => {
            if (id) {
                if (isInit) {
                    setLoading(true)
                }
                const info = await getAppMenus(id)
                if (info?.id) {
                    setAppInfo(info)
                    if (info.menus) {
                        setMenus(info.menus.edges.map(item => item.node))
                        setTreeData(
                            formatTreeData(
                                info.menus.edges.map(item => ({
                                    key: item.node.id,
                                    title: item.node.name,
                                    parentId: item.node.parentID,
                                    node: item.node
                                }))
                            )
                        )

                    }
                }
                setLoading(false)
            }
        },
        onSearch = (keyword: string) => {
            const menuInfo = menus.find(item => item.name.indexOf(keyword) > -1)
            if (menuInfo) {
                editorMenuAction(menuInfo, 'editor')
            }
        },
        onTreeSelect = (_selectedKeys, selectedEvent) => {
            editorMenuAction(selectedEvent.node.node, 'editor')
        },
        editorMenuAction = (menuInfo: AppMenu | undefined, action: TreeEditorAction) => {
            if (menuInfo) {
                let title = "";
                setSelectedTree({ keys: [menuInfo.id], info: menuInfo, action: action })
                switch (action) {
                    case 'editor':
                        title = `${t('edit')}-${menuInfo.name}`
                        setFormFieldsValue(menuInfo)
                        formRef.current?.setFieldsValue(menuInfo)
                        break;
                    case 'peer':
                        title = `${t('created')}-${menuInfo.name}-${t('same level')}`
                        formRef.current?.resetFields()
                        break;
                    case 'child':
                        title = `${t('created')}-${menuInfo.name}-${t('sublayer')}`
                        formRef.current?.resetFields()
                        break;
                    default:
                        break;
                }
                setActionTitle(title)
            } else {
                setSelectedTree({ keys: [], info: undefined, action: action })
                setActionTitle(`${t('created')}-${t('top menu')}`)
                formRef.current?.resetFields()
            }
        },
        onTreeDrop = async (dragInfo) => {
            const { sourceId, targetId, action, newTreeData } = getTreeDropData(treeData, dragInfo)

            await moveAppMenu(sourceId, targetId, action);
            await getMenusRequest();
        },
        onDelMenu = (menuInfo: AppMenu) => {
            Modal.confirm({
                title: t('delete'),
                content: `${t('confirm delete')}：${menuInfo.name}`,
                onOk: async (close) => {
                    const result = await delAppMenu(menuInfo.id)
                    if (result) {
                        editorMenuAction(undefined, 'editor')
                        await getMenusRequest();
                        message.success(t('submit success'));
                        close();
                    }
                }
            })
        },
        onValuesChange = () => {
            setSaveDisabled(false)
        },
        getRequest = async () => {
            setSaveLoading(false)
            setSaveDisabled(true)
            return {}
        },
        onFinish = async (values: AppMenu) => {
            if (appInfo) {
                setSaveLoading(true)
                if (formFieldsValue?.action) {
                    values.actionID = formFieldsValue.action.id
                }
                if (selectedTree.info?.id && selectedTree.action === 'editor') {
                    const ur = await updateAppMenu(selectedTree.info.id, values)
                    if (ur?.id) {
                        message.success(t('submit success'));
                        await getMenusRequest()
                        setSaveDisabled(true)
                    }
                } else {
                    if (selectedTree.info?.id) {
                        values.parentID = selectedTree.action === 'child' ? selectedTree.info.id : selectedTree.info.parentID
                    } else {
                        values.parentID = "0"
                    }
                    const cr = await createAppMenu(appInfo.id, values)
                    if (cr?.id) {
                        message.success(t('submit success'));
                        await getMenusRequest()
                        setSaveDisabled(true)
                        editorMenuAction(cr, 'editor')
                    }
                }
                setSaveLoading(false)
            }
        }

    useEffect(() => {
        getMenusRequest(true)
    }, [])

    return (
        <PageContainer
            header={{
                title: `${appInfo?.name} - ${t("{{field}} management", { field: t('menu') })}`,
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('System configuration'), },
                        { title: t("{{field}} management", { field: t('app') }), },
                        { title: t("{{field}} management", { field: t('menu') }), },
                    ],
                },
                extra:
                    <Auth authKey={"moveAppMenu"}>
                        <Button onClick={() => {
                            setTreeDraggable(!treeDraggable)
                        }}
                        >
                            {treeDraggable ? t('close') : t('open')}{t('move')}
                        </Button>
                    </Auth>
            }}
        >
            <ProCard split="vertical">
                <ProCard title={
                    <Input.Search placeholder={`${t("search {{field}}", { field: t('keyword') })}`} onSearch={onSearch} />
                } colSpan="30%" loading={loading}>
                    <Tree x-if={treeData.length != 0}
                        draggable={treeDraggable}
                        treeData={treeData}
                        onSelect={onTreeSelect}
                        selectedKeys={selectedTree.keys} defaultExpandAll
                        titleRender={customerTitleRender}
                        onDrop={onTreeDrop}
                    />
                    <div x-else>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                </ProCard>
                <ProCard title={actionTitle} headerBordered>
                    <ProForm
                        formRef={formRef}
                        style={{ maxWidth: 400 }}
                        submitter={checkAuth('createAppMenus') || checkAuth('updateAppMenu') ? {
                            searchConfig: {
                                submitText: t('submit'),
                                resetText: t('reset')
                            },
                            submitButtonProps: {
                                loading: saveLoading,
                                disabled: saveDisabled,
                            }
                        } : false}
                        onFinish={onFinish}
                        onReset={getRequest}
                        request={getRequest}
                        onValuesChange={onValuesChange}
                    >
                        <ProFormText
                            name="name"
                            label={t('name')}
                            placeholder={`${t("Please enter {{field}}", { field: t('name') })}`}
                            rules={[
                                { required: true, message: `${t("Please enter {{field}}", { field: t('name') })}`, },
                            ]}
                        />
                        <ProFormSelect name="kind" label={t('type')}
                            placeholder={`${t("Please enter {{field}}", { field: t('type') })}`}
                            options={[
                                { value: "dir", label: t('directory') },
                                { value: "menu", label: t('menu') },
                            ]} rules={[
                                { required: true, message: `${t("Please enter {{field}}", { field: t('type') })}`, },
                            ]} />
                        <ProFormText
                            label={t('permission')}
                            placeholder={`${t("Please enter {{field}}", { field: t('permission') })}`}
                        >
                            <Input.Search
                                value={formFieldsValue?.action?.name || ""}
                                placeholder={`${t("click search {{field}}", { field: t('permission') })}`}
                                onSearch={() => {
                                    setModal({ open: true })
                                }}
                            />
                        </ProFormText>
                        <ProFormTextArea
                            name="comments"
                            label={t('remarks')}
                            placeholder={`${t("Please enter {{field}}", { field: t('remarks') })}`}
                        />
                    </ProForm>
                    <ModalAction
                        open={modal.open}
                        title={t("search {{field}}", { field: t('permission') })}
                        appId={appInfo?.id || ''}
                        onClose={(selectData) => {
                            const data = selectData?.[0]

                            if (data?.id) {
                                setFormFieldsValue({
                                    ...formFieldsValue,
                                    action: data,
                                    actionID: data.id
                                } as any)
                            }
                            onValuesChange()
                            setModal({ open: false })
                        }} />
                </ProCard>
            </ProCard>
        </PageContainer>
    )
}