import AppList from '@/pages/app/list'
import { Org, getOrgInfo } from '@/services/org'
import { PageContainer, useToken } from '@ant-design/pro-components'
import { useSearchParams } from 'ice'
import { useEffect, useState } from 'react'

export default () => {
    const
        { token } = useToken(),
        [searchParams, setSearchParams] = useSearchParams(),
        [info, setInfo] = useState<Org>()

    const getInfo = async () => {
        const orgId = searchParams.get('id');
        if (orgId) {
            const result = await getOrgInfo(orgId);
            if (result) {
                setInfo(result)
            }
        }
    }

    useEffect(() => {
        getInfo()
    }, [])

    return <PageContainer
        header={{
            title: "授权应用",
            style: { background: token.colorBgContainer },
            breadcrumb: {
                items: [
                    { title: "系统配置", },
                    { title: "组织管理", },
                    { title: "授权应用", },
                ],
            },
        }}
    >
        <AppList x-if={info?.id} scene="orgApp" title={`组织：${info?.name}`} orgId={info?.id} />
    </PageContainer>
}