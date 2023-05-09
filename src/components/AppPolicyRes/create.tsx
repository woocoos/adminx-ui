import { ModalForm, ProForm, ProFormInstance, ProFormText, } from '@ant-design/pro-components';
import { Checkbox, Col, Modal, Row } from 'antd';
import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';

export default (props: {
    open: boolean
    title?: string
    arn: string
    orgId?: string
    scene: 'create' | 'editor'
    onClose: (newArn?: string) => void
}) => {

    const { t } = useTranslation(),
        formRef = useRef<ProFormInstance>(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [model, setModel] = useState<{
            [key: string]: string
        }>({}),
        [newArn, setNewArn] = useState<string>('');

    const
        getRequest = async () => {
            setSaveLoading(false)
            setSaveDisabled(true)
            const data = {};
            setNewArn(props.arn)
            props.arn.split(':').filter(sItem => sItem.indexOf('/') > -1).forEach(sItem => {
                data[sItem.split('/')[0]] = sItem.split('/')[1]
            })
            setModel(data)
            return data
        },
        onValuesChange = (_changeValues, values) => {
            setSaveDisabled(false)
            setModel(values)
        },
        onFinish = async () => {
            setSaveLoading(true)
            if (newArn) {
                setSaveDisabled(true)
                props.onClose(newArn)
            }
            setSaveLoading(false)
            return false;
        }

    useEffect(() => {
        if (props.open) {
            getRequest()
        }
    }, [props.open])

    useEffect(() => {
        const arn = props.orgId ? props.arn.replace(':tenant_id:', `:${props.orgId}:`) : props.arn
        setNewArn(
            arn.split(':').map(item => {
                if (item.indexOf('/') > -1) {
                    const key = item.split('/')[0]
                    return `${key}/${model[key]}`
                }
                return item;
            }).join(':')
        )
    }, [model])


    return (
        <Modal
            width={500}
            title={props.title}
            open={props?.open}
            okText={t('submit')}
            okButtonProps={{
                loading: saveLoading,
                disabled: saveDisabled,
            }}
            destroyOnClose
            cancelText={t('cancel')}
            onCancel={() => {
                props.onClose()
            }}
            onOk={() => {
                formRef.current?.submit()
            }}
        >
            <ProForm
                x-if={Object.keys(model).length}
                formRef={formRef}
                layout="horizontal"
                request={getRequest}
                onValuesChange={onValuesChange}
                onFinish={onFinish}
                submitter={false}
            >
                <div style={{ lineHeight: "50px" }}>
                    {t('Resource ARN format')}：{newArn}
                </div>
                {Object.keys(model).map(key =>
                    <Row key={key} gutter={20}>
                        <Col flex="auto">
                            <ProFormText
                                disabled={model[key] === '*'}
                                name={key}
                                label={key}
                                rules={[
                                    { required: true, message: `${t('Please enter {{field}}', { field: key })}`, },
                                ]}
                            />
                        </Col>
                        <Col>
                            <Checkbox
                                checked={model[key] === '*'}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        formRef.current?.setFieldValue(key, '*')
                                        model[key] = '*'
                                        setModel({ ...model })
                                    } else {
                                        formRef.current?.setFieldValue(key, '')
                                        model[key] = ''
                                        setModel({ ...model })
                                    }
                                }}
                            >
                                {t('match all')}
                            </Checkbox>
                        </Col>
                    </Row>
                )}

            </ProForm>
        </Modal>
    );
}