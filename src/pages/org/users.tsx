import {
    PageContainer,
    ProCard,
    useToken,
} from "@ant-design/pro-components";
import { Tree, Empty, Input, Button } from "antd";
import { useEffect, useState, useRef, ReactNode } from "react";
import UserList, { UserListRef } from "@/pages/account/components/listAccount";
import { formatTreeData } from "@/util";
import { Org, getOrgPathList } from "@/services/org";
import store from "@/store";
import { useSearchParams } from "ice";
import { useTranslation } from "react-i18next";

type TreeDataState = {
    key: string
    title: string | ReactNode
    children?: TreeDataState[]
    parentId: string
    node?: Org
}


export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [basisState] = store.useModel("basis"),
        [searchParams, setSearchParams] = useSearchParams(),
        userListActionRef = useRef<UserListRef>(null),
        [loading, setLoading] = useState(false),
        [allOrgList, setAllOrgList] = useState<Org[]>([]),
        [treeData, setTreeData] = useState<TreeDataState[]>([]),
        [selectedTreeKeys, setSelectedTreeKeys] = useState<string[]>([])

    const
        getMenusRequest = async () => {
            setLoading(true)
            const orgList = await getOrgPathList(searchParams.get("id") || basisState.tenantId, "org")
            if (orgList[0]?.id) {
                setSelectedTreeKeys([orgList[0].id])
            } else {
                setSelectedTreeKeys([])
            }

            setAllOrgList(orgList)
            setTreeData(
                formatTreeData(
                    orgList.map(item => ({
                        key: item.id,
                        title: item.name,
                        parentId: item.parentID,
                        node: item
                    }))
                )
            )

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
                return `${orgInfo.name}-${t("{{field}} list", { field: t('user') })}`
            }
            return `${t("{{field}} list", { field: t('user') })}`
        }

    useEffect(() => {
        getMenusRequest()
    }, [])

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
            }}
        >
            <ProCard split="vertical">
                <ProCard title={
                    <Input.Search placeholder={`${t("search {{field}}", { field: t('keyword') })}`} onSearch={onSearch} />
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
                    <UserList
                        x-if={selectedTreeKeys[0]}
                        ref={userListActionRef}
                        title={proCardtitle()}
                        scene="orgUser"
                        orgId={selectedTreeKeys[0]} />
                </ProCard>
            </ProCard>
        </PageContainer>
    )
}