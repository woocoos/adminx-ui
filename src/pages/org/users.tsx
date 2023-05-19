import {
    PageContainer,
    ProCard,
    useToken,
} from "@ant-design/pro-components";
import { Tree, Empty, Input, Button, Row, Col } from "antd";
import { useEffect, useState, useRef, ReactNode } from "react";
import UserList, { UserListRef } from "@/pages/account/components/listAccount";
import { formatTreeData, getTreeDropData, loopTreeData } from "@/util";
import { Org, getOrgPathList, moveOrg } from "@/services/org";
import store from "@/store";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "@ice/runtime";
import Auth from "@/components/Auth";
import { TreeDataState, TreeMoveAction } from "@/services/graphql";

export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [basisState] = store.useModel("basis"),
        [searchParams, setSearchParams] = useSearchParams(),
        [treeDraggable, setTreeDraggable] = useState(false),
        userListActionRef = useRef<UserListRef>(null),
        [loading, setLoading] = useState(false),
        [allOrgList, setAllOrgList] = useState<Org[]>([]),
        [treeData, setTreeData] = useState<TreeDataState<Org>[]>([]),
        [selectedData, setSelectedData] = useState<Org>()

    const
        getRequest = async () => {
            setLoading(true)
            const orgList = await getOrgPathList(searchParams.get("id") || basisState.tenantId, "org"),
                topData = orgList[0]
            if (topData?.id) {
                setSelectedData(topData)
            } else {
                setSelectedData(undefined)
            }

            setAllOrgList(orgList)
            setTreeData(
                formatTreeData(
                    orgList.map(item => ({
                        key: item.id,
                        title: item.name,
                        parentId: item.parentID,
                        node: item
                    })),
                    undefined,
                    undefined,
                    topData?.parentID || 0
                )
            )

            setLoading(false)
        },
        onSearch = (keyword: string) => {
            const orgInfo = allOrgList.find(item => item.name.indexOf(keyword) > -1)
            if (orgInfo) {
                setSelectedData(orgInfo)
            }
        },
        onTreeSelect = (_selectedKeys, { node }) => {
            setSelectedData(node.node)
        },
        onTreeDrop = async (dragInfo) => {
            const { sourceId, targetId, action, newTreeData } = getTreeDropData(treeData, dragInfo)

            // 传给后端数据效果
            await moveOrg(sourceId, targetId, action);
            await getRequest();
            // 前端拖拽效果
            // setTreeData(newTreeData)
        },
        proCardtitle = () => {
            if (selectedData) {
                return `${selectedData.name}-${t("{{field}} list", { field: t('user') })}`
            }
            return `${t("{{field}} list", { field: t('user') })}`
        }

    useEffect(() => {
        getRequest()
    }, [, searchParams])


    return (
        <PageContainer
            header={{
                title: t('organizational user management'),
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('organization and cooperation'), },
                        { title: t('organizational user management'), },
                    ],
                },
                extra:
                    <Auth authKey={"moveOrganization"}>
                        <Button onClick={() => {
                            setTreeDraggable(!treeDraggable)
                        }}
                        >
                            {treeDraggable ? t('close') : t('open')}{t('move')}
                        </Button>
                    </Auth>
            }}
        >
            <Row gutter={16} wrap={false}>
                <Col flex="280px" >
                    <div style={{ background: token.colorBgContainer, height: "100%" }}>
                        <ProCard title={
                            <Input.Search placeholder={`${t("search {{field}}", { field: t('keyword') })}`} onSearch={onSearch} />
                        } colSpan="280px" loading={loading}>
                            <Tree x-if={treeData.length != 0}
                                draggable={treeDraggable}
                                treeData={treeData}
                                onSelect={onTreeSelect}
                                onDrop={onTreeDrop}
                                selectedKeys={selectedData ? [selectedData.id] : []} defaultExpandAll
                            />
                            <div x-else>
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            </div>
                        </ProCard>
                    </div>
                </Col>
                <Col flex="auto">
                    <UserList
                        x-if={selectedData}
                        ref={userListActionRef}
                        title={proCardtitle()}
                        scene="orgUser"
                        orgInfo={selectedData}
                        orgId={selectedData?.id} />
                </Col>
            </Row>
        </PageContainer>
    )
}