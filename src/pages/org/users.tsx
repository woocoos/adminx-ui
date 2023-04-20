import {
    PageContainer,
    ProCard,
    useToken,
} from "@ant-design/pro-components";
import { Tree, Empty, Input, Button } from "antd";
import { useEffect, useState, useRef, ReactNode } from "react";
import OrgUserList, { UserListRef } from "@/pages/account/list";
import ModalUser from "@/pages/account/components/modalAccount";
import { formatTreeData, getDate } from "@/util";
import { Org, getOrgList } from "@/services/org";
import { User, allotOrgUser } from "@/services/user";
import UserCreate from "@/pages/account/components/create";

type TreeDataState = {
    key: string
    title: string | ReactNode
    children?: TreeDataState[]
    parentId: string
    node?: Org
}


export default () => {
    const { token } = useToken(),
        userListActionRef = useRef<UserListRef>(null),
        [loading, setLoading] = useState(false),
        [allOrgList, setAllOrgList] = useState<Org[]>([]),
        [treeData, setTreeData] = useState<TreeDataState[]>([]),
        [selectedTreeKeys, setSelectedTreeKeys] = useState<string[]>([]),
        [modal, setModal] = useState<{
            open: boolean
            title: string
            scene: "create" | "add"
        }>({
            open: false,
            title: '',
            scene: "add"
        })

    const
        getMenusRequest = async () => {
            setLoading(true)
            const orgList = await getOrgList({}, {}, {})
            if (orgList?.edges.length) {
                const ol = orgList.edges.map(item => item.node)
                setSelectedTreeKeys([ol?.[0]?.id])
                setAllOrgList(ol)
                setTreeData(
                    formatTreeData(
                        orgList.edges.map(item => ({
                            key: item.node.id,
                            title: item.node.name,
                            parentId: item.node.parentID,
                            node: item.node
                        }))
                    )
                )

            }
            setLoading(false)
        },
        onSearch = (keyword: string) => {
            const orgInfo = allOrgList.find(item => item.name.indexOf(keyword) > -1)
            if (orgInfo) {
                setSelectedTreeKeys([orgInfo.id])
            }
        },
        onTreeSelect = (_selectedKeys, { node }) => {
            setSelectedTreeKeys([node.key])
        },
        proCardtitle = () => {
            const orgInfo = allOrgList.find(item => item.id == selectedTreeKeys[0])
            if (orgInfo) {
                return `${orgInfo.name}-用户列表`
            }
            return "用户列表"
        },
        onUserModalClose = async (selectData?: User[]) => {
            setModal({ open: false, title: "", scene: modal.scene })
            const suInfo = selectData?.[0], orgInfo = allOrgList.find(item => item.id == selectedTreeKeys[0])
            if (suInfo && orgInfo) {
                const result = await allotOrgUser({
                    joinedAt: getDate(Date.now(), 'YYYY-MM-DDTHH:mm:ssZ') as string,
                    displayName: suInfo.displayName,
                    orgID: orgInfo.id,
                    userID: suInfo.id,
                })

                if (result) {
                    userListActionRef.current?.reload()
                }
            }
        },
        onDrawerClose = (isSuccess: boolean) => {
            if (isSuccess) {
                userListActionRef.current?.reload();
            }
            setModal({ open: false, title: "", scene: modal.scene })
        }

    useEffect(() => {
        getMenusRequest()
    }, [])

    return (
        <PageContainer
            header={{
                title: `组织用户管理`,
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: "组织协作", },
                        { title: "组织用户管理", },
                    ],
                },
                extra: selectedTreeKeys[0] ? [
                    <Button key="createUser" onClick={() => {
                        setModal({
                            open: true, title: "创建用户", scene: 'create'
                        })
                    }}>创建用户</Button>,
                    <Button key="addUser" onClick={() => {
                        setModal({
                            open: true, title: "添加用户", scene: 'add'
                        })
                    }}>添加用户</Button>
                ] : []
            }}
        >
            <ProCard split="vertical">
                <ProCard title={
                    <Input.Search placeholder="关键字搜索" onSearch={onSearch} />
                } colSpan="280px" loading={loading}>
                    <Tree x-if={treeData.length != 0}
                        treeData={treeData}
                        onSelect={onTreeSelect}
                        selectedKeys={selectedTreeKeys} defaultExpandAll
                    />
                    <div x-else>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                </ProCard>
                <ProCard >
                    <OrgUserList
                        ref={userListActionRef}
                        title={proCardtitle()}
                        scene="orgUser"
                        orgId={selectedTreeKeys[0]} />
                </ProCard>
                <ModalUser x-if={modal.scene === "add"} open={modal.open} title={modal.title} onClose={onUserModalClose} />
                <UserCreate
                    x-if={modal.scene === "create"}
                    open={modal.open}
                    title={modal.title}
                    orgId={selectedTreeKeys[0]}
                    userType="member"
                    scene="create"
                    onClose={onDrawerClose} />
            </ProCard>
        </PageContainer>
    )
}