import { formatTreeData, } from "@/util"
import { Checkbox, Col, Input, List, Row, Space, Tree } from "antd"
import { ReactNode, useEffect, useState } from "react"
import { SwapOutlined, CloseOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { AppAction } from "@/services/app/action";
import CardTree from "./cardTree";



export default function (props: {
    targetKeys: string[]
    dataSource: AppAction[]
    appCode: string
    titles?: [string, string]
    onChange?: (targetKeys: string[]) => void
}) {

    const [dataSource, setDataSource] = useState<AppAction[]>([...props.dataSource])

    useEffect(() => {
        setDataSource([...props.dataSource])
    }, [props.dataSource])

    return (
        <>
            <Row>
                <Col flex="1">
                    <ProCard
                        type="inner"
                        size="small"
                        bordered
                        title={props.titles?.[0] || '全部操作'}
                    >
                        <Input.Search
                            placeholder="筛选操作"
                            onSearch={(value) => {
                                if (value) {
                                    setDataSource(props.dataSource.filter(item => item.name.indexOf(value) > -1 || item.comments.indexOf(value) > -1))
                                } else {
                                    setDataSource([...props.dataSource])
                                }
                            }}
                        />
                        <div style={{ overflow: 'auto', height: '300px', marginTop: "10px" }}>
                            <CardTree method="read"
                                checkedKeys={props.targetKeys}
                                dataSource={dataSource}
                                appCode={props.appCode}
                                onChange={(keys: string[]) => {
                                    props.onChange?.(keys)
                                }}
                            />
                            <CardTree method="write"
                                checkedKeys={props.targetKeys}
                                dataSource={dataSource}
                                appCode={props.appCode}
                                onChange={(keys: string[]) => {
                                    props.onChange?.(keys)
                                }}
                            />
                            <CardTree method="list"
                                checkedKeys={props.targetKeys}
                                dataSource={dataSource}
                                appCode={props.appCode}
                                onChange={(keys: string[]) => {
                                    props.onChange?.(keys)
                                }}
                            />
                        </div>
                    </ProCard>
                </Col>
                <Col flex="40px" style={{ display: "flex", justifyContent: 'center' }}>
                    <SwapOutlined style={{ fontSize: "20px", color: "#ccc" }} />
                </Col>
                <Col flex="1">
                    <ProCard
                        type="inner"
                        size="small"
                        bordered
                        title={props.titles?.[1] || '已选操作'}
                    >
                        <div style={{ overflow: 'auto', height: '342px' }}>
                            {
                                props.dataSource.filter(item => props.targetKeys.includes(`${props.appCode}:${item.name}`)).map(item => (
                                    <Row className="actionsTransfer-listRow" key={`select${item.id}`}>
                                        <Col flex="auto">
                                            <div>{item.name}</div>
                                            <div>{item.comments}</div>
                                        </Col>
                                        <Col style={{ display: "flex", justifyContent: 'center' }}>
                                            <CloseOutlined className="delIcon" onClick={() => {
                                                props.onChange?.([...props.targetKeys.filter(key => key != `${props.appCode}:${item.name}`)])
                                            }} />
                                        </Col>
                                    </Row>
                                ))
                            }
                        </div>
                    </ProCard>
                </Col>
            </Row>

        </>

    )
}

