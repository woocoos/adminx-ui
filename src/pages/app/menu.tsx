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
import { useSearchParams } from "ice";
import { useEffect, useState, useRef, ReactNode } from "react";
import { App, AppMenu, createAppMenu, delAppMenu, getAppMenus, moveAppMenu } from "@/services/app";
import { formatTreeData, loopTreeData } from "@/util";
import { updateAppMenu } from "@/services/app";
import { TreeMoveAction } from "@/services/graphql";

type TreeEditorAction = 'editor' | 'peer' | 'child'
type TreeDataState = {
    key: string
    title: string | ReactNode
    children?: TreeDataState[]
    parentId: string
    node?: AppMenu
}
type TreeSelectedData = {
    keys: Array<string>
    action: TreeEditorAction
    info?: AppMenu
}

export default () => {
    const { token } = useToken(),
        formRef = useRef<ProFormInstance>(),
        [searchParams, setSearchParams] = useSearchParams(),
        id = searchParams.get('id'),
        [loading, setLoading] = useState(false),
        [treeDraggable, setTreeDraggable] = useState(false),
        [appInfo, setAppInfo] = useState<App>(),
        [menus, setMenus] = useState<AppMenu[]>([]),
        [treeData, setTreeData] = useState<TreeDataState[]>([]),
        [selectedTree, setSelectedTree] = useState<TreeSelectedData>({
            keys: [],
            info: undefined,
            action: 'editor'
        }),
        [actionTitle, setActionTitle] = useState<string>('新建-顶级菜单'),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true)

    const
        customerTitleRender = (nodeData: TreeDataState) => {
            return (
                <Space>
                    <span>{nodeData.title}</span>
                    <Dropdown menu={{
                        items: [
                            {
                                key: 'create', label: "新建", children: [
                                    {
                                        key: 'peer', label: <a onClick={(e) => {
                                            e.stopPropagation();
                                            editorMenuAction(nodeData.node, 'peer')
                                        }}>同层</a>
                                    },
                                    {
                                        key: 'child', label: <a onClick={(e) => {
                                            e.stopPropagation();
                                            editorMenuAction(nodeData.node, 'child')
                                        }}>子层</a>
                                    }
                                ]
                            },
                            {
                                key: 'deo', label: <a onClick={(e) => {
                                    if (nodeData.node) {
                                        onDelMenu(nodeData.node)
                                    }
                                }}>删除</a>
                            },
                        ]
                    }} >
                        <SettingOutlined className="tree-setting" />
                    </Dropdown>
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
                        title = `编辑-${menuInfo.name}`
                        formRef.current?.setFieldsValue(menuInfo)
                        break;
                    case 'peer':
                        title = `新建-${menuInfo.name}-同层`
                        formRef.current?.resetFields()
                        break;
                    case 'child':
                        title = `新建-${menuInfo.name}-子层`
                        formRef.current?.resetFields()
                        break;
                    default:
                        break;
                }
                setActionTitle(title)
            } else {
                setSelectedTree({ keys: [], info: undefined, action: action })
                setActionTitle(`新建-顶级菜单`)
                formRef.current?.resetFields()
            }
        },
        onTreeDrop = async (dragInfo) => {
            // 深拷贝
            const dragTreeData = JSON.parse(JSON.stringify(treeData));
            let dragObj: TreeDataState,
                action: TreeMoveAction = "child",
                sourceId: string = "",
                targetId: string = "";
            loopTreeData<TreeDataState>(dragTreeData, dragInfo.dragNode.key, (item, i, pArr) => {
                pArr.splice(i, 1);
                sourceId = item.key
                dragObj = item
            })
            if (!dragInfo.dropToGap) {
                // 直接插入第一个子节点
                loopTreeData<TreeDataState>(dragTreeData, dragInfo.node.key, (item) => {
                    item.children = item.children || []
                    if (item.children.length) {
                        targetId = item.children[0].key
                        action = "up"
                    } else {
                        targetId = item.key
                        action = 'child'
                    }
                    item.children.unshift(dragObj)
                })
            } else {
                loopTreeData(dragTreeData, dragInfo.node.key, (_item, i, arr) => {
                    if (dragInfo.dropPosition === -1) {
                        targetId = arr[0].key
                        action = "up"
                        arr.splice(0, 0, dragObj)
                    } else {
                        targetId = arr[i].key
                        action = "down"
                        arr.splice(dragInfo.dropPosition, 0, dragObj)
                    }
                });
            }

            // 传给后端数据效果
            // console.log(sourceId, targetId, action)
            await moveAppMenu(sourceId, targetId, action);
            await getMenusRequest();
            // 前端拖拽效果
            // setTreeData(dragTreeData)
        },
        onDelMenu = (menuInfo: AppMenu) => {
            Modal.confirm({
                title: "删除",
                content: `是否删除菜单：${menuInfo.name}`,
                onOk: async (close) => {
                    const result = await delAppMenu(menuInfo.id)
                    if (result) {
                        editorMenuAction(undefined, 'editor')
                        await getMenusRequest();
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

                if (selectedTree.info?.id && selectedTree.action === 'editor') {
                    const ur = await updateAppMenu(selectedTree.info.id, values)
                    if (ur?.id) {
                        message.success("提交成功");
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
                        message.success("提交成功");
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
                title: `${appInfo?.name} - 菜单管理`,
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { path: "", title: "系统配置", },
                        { path: "", title: "应用管理", },
                        { path: "", title: "菜单管理", },
                    ],
                },
                extra: <Button onClick={() => {
                    setTreeDraggable(!treeDraggable)
                }}>{treeDraggable ? '关闭' : '启动'}菜单移动</Button>
            }}
        >
            <ProCard split="vertical">
                <ProCard title={
                    <Input.Search placeholder="关键字搜索" onSearch={onSearch} />
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
                        submitter={{
                            submitButtonProps: {
                                loading: saveLoading,
                                disabled: saveDisabled,
                            }
                        }}
                        onFinish={onFinish}
                        onReset={getRequest}
                        request={getRequest}
                        onValuesChange={onValuesChange}
                    >
                        <ProFormText
                            name="name"
                            label="名称"
                            placeholder="请输入名称"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入名称",
                                },
                            ]}
                        />
                        <ProFormSelect name="kind" label="类型"
                            placeholder="请选择类型"
                            options={[
                                { value: "dir", label: "目录" },
                                { value: "menu", label: "菜单项" },
                            ]} rules={[
                                { required: true, message: "请选择类型", },
                            ]} />
                        <ProFormText
                            name="actionID"
                            label="关联权限"
                            placeholder="请输入关联权限"
                        />
                        <ProFormTextArea
                            name="comments"
                            label="备注（选填）"
                            placeholder="请输入备注"
                        />
                    </ProForm>
                </ProCard>
            </ProCard>
        </PageContainer>
    )
}