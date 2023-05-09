import { App } from "@/services/app"
import { getAppResList } from "@/services/app/resource"
import { Checkbox, Col, Popconfirm, Row, Space } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import style from "./layout.module.css"
import Create from "./create"

export type AppResItem = {
    title: string
    typeName: string
    arn: string
    arnParams: string[],
    allArn: string
}


export default (props: {
    appInfo: App
    orgId?: string
    values?: string[]
    onChange: (values: string[]) => void
}) => {

    const { t } = useTranslation(),
        [dataSource, setDataSource] = useState<AppResItem[]>([]),
        [modal, setModal] = useState<{
            open: boolean
            title: string
            data: string
            scene: 'create' | 'editor'
        }>({
            open: false,
            title: '',
            data: '',
            scene: 'create'
        })

    const
        getRequest = async () => {
            const result = await getAppResList(props.appInfo.id, {}, {}, {})
            if (result) {
                setDataSource(
                    result.edges.map(item => {
                        const arn = `${props.appInfo.code}${item.node.arnPattern}`,
                            arnParams = arn.split(':').filter(sItem => sItem.indexOf('/') > -1).map(sItem => sItem.split('/')[0])

                        return {
                            title: item.node.name,
                            typeName: item.node.typeName,
                            arn,
                            arnParams,
                            allArn: props.orgId ? arn.replace(':tenant_id:', `:${props.orgId}:`) : arn,

                        }
                    })
                )
            }
        },
        valueArns = (item: AppResItem) => {
            return props.values?.filter(vsItem =>
                (vsItem.indexOf(`:${item.typeName}:`) > -1) &&
                (vsItem.split(':').filter(sItem => sItem.indexOf('/') > -1).map(sItem => sItem.split('/')[0]).join(',') === item.arnParams.join(','))
            ) || []
        }


    useEffect(() => {
        getRequest()
    }, [props.appInfo])

    return <div className={style.appPolicyRes}>
        {
            dataSource.map(item =>
                <div className="appPolicyRes-box" key={item.title}>
                    <div className="appPolicyRes-title">{item.title}</div>
                    <div className="appPolicyRes-content">
                        <Row>
                            <Col flex="auto">
                                {`${t('Resource ARN format')} ${item.arn}`}
                            </Col>
                            <Col>
                                <Space>
                                    {!!props.values?.find(vsItem => vsItem == item.allArn) ? '' : <a
                                        onClick={() => {
                                            setModal({ open: true, title: t('add {{field}}', { field: t('resources') }), data: item.allArn, scene: "create" })
                                        }}
                                    >
                                        {t('add {{field}}', { field: t('resources') })}
                                    </a>}
                                    <Checkbox
                                        checked={!!props.values?.find(vsItem => vsItem == item.allArn)}
                                        onChange={(e) => {
                                            let values: string[] = []
                                            if (e.target.checked) {
                                                values = props.values?.filter(vsItem => !(
                                                    (vsItem.indexOf(`:${item.typeName}:`) > -1) &&
                                                    (vsItem.split(':').filter(sItem => sItem.indexOf('/') > -1).map(sItem => sItem.split('/')[0]).join(',') === item.arnParams.join(','))
                                                )) || []
                                                values.push(item.allArn)
                                            } else {
                                                values = props.values?.filter(vsItem => vsItem != item.allArn) || []
                                            }
                                            props.onChange(values)
                                        }}
                                    >
                                        {t('match all')}
                                    </Checkbox>
                                </Space>
                            </Col>
                        </Row>
                        {
                            valueArns(item).map(vItem => <Row key={vItem} gutter={20}>
                                <Col >
                                    . {vItem}
                                </Col>
                                <Col flex="auto">
                                    {!props.values?.find(vsItem => vsItem == item.allArn) ? <Space>
                                        <a onClick={() => {
                                            setModal({ open: true, title: `${t('amend')} ${vItem}`, data: vItem, scene: "editor" })
                                        }}
                                        >
                                            {t('edit')}
                                        </a>
                                        <Popconfirm
                                            title={t('delete')}
                                            description={t('confirm delete')}
                                            okText={t('confirm')}
                                            cancelText={t('cancel')}
                                            onConfirm={() => {
                                                props.onChange(props.values?.filter(vsItem => vsItem != vItem) || [])
                                            }}
                                        >
                                            <a>
                                                {t('delete')}
                                            </a>
                                        </Popconfirm>
                                    </Space> : ''}

                                </Col>
                            </Row>)
                        }

                    </div>
                </div>
            )
        }
        <Create
            open={modal.open}
            title={modal.title}
            arn={modal.data}
            scene={modal.scene}
            orgId={props.orgId}
            onClose={(newArn) => {
                if (newArn) {
                    if (modal.scene === 'create') {
                        props.onChange([...props.values || [], newArn])
                    } else if (modal.scene === 'editor') {
                        const values = props.values || []
                        props.onChange(values.map(vsItem => {
                            if (vsItem === modal.data) {
                                return newArn
                            }
                            return vsItem
                        }))
                    }
                }
                setModal({ open: false, title: modal.title, data: '', scene: modal.scene })
            }}
        />
    </div>


}