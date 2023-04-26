import { EnumPolicyRuleEffect, PolicyRule, PolicyRuleEffect } from "@/services/app/policy"
import { ProCard } from "@ant-design/pro-components"
import { Divider, Radio, Tabs, Row, Col, Button, Transfer, Tree, List, Popconfirm } from "antd"
import { CSSProperties, ReactNode, useEffect, useState } from "react"
import { PlusCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { AppAction, getAppActionList } from "@/services/app/action";
import ActionsTransfer from "@/components/ActionsTransfer";
import { App, getAppList } from "@/services/app";
import Editor from '@monaco-editor/react';
import InputApp from "@/pages/app/components/inputApp";

const RuleItem = (props: {
    orgId: string
    rule: PolicyRule
    onChange?: (rule: PolicyRule) => void
    onCopy?: () => void
    onDel?: () => void
}) => {
    const [effect, setEffect] = useState<PolicyRuleEffect>(props.rule.effect || 'allow'),
        [appInfo, setAppInfo] = useState<App>(),
        [appActions, setAppActions] = useState<AppAction[]>([]),
        [action, setAction] = useState<"all" | "customer">(props.rule.actions?.[0]?.indexOf(":*") > -1 ? "all" : 'customer'),
        [actions, setActions] = useState<string[]>(props.rule.actions || []),
        [resource, setResource] = useState<"all" | "customer">(props.rule.resources?.[0] === "*" ? "all" : 'customer'),
        [resources, setResources] = useState<string[]>([]),
        [conditions, setConditions] = useState<string[]>([]),
        newRule: PolicyRule = {
            effect: effect,
            actions: [],
            resources: [],
            conditions: []
        },
        [stretch1, setStretch1] = useState<boolean>(false),
        [stretch2, setStretch2] = useState<boolean>(false),
        [stretch3, setStretch3] = useState<boolean>(false)

    const
        updateAppInfo = async (info?: App) => {
            setAppInfo(info)
            if (info?.id) {
                const actionsList = await getAppActionList(info.id, {}, {}, {})
                if (actionsList?.totalCount) {
                    setAppActions(actionsList.edges.map(item => item.node))
                } else {
                    setAppActions([])
                }
            } else {
                setAppActions([])
            }
        },
        getAppInfo = async () => {
            const appCode = props.rule.actions?.[0]?.split(":")?.[0]
            if (appCode && appInfo?.code != appCode) {
                const result = await getAppList({ code: appCode, }, {}, {})
                if (result?.totalCount) {
                    updateAppInfo(result.edges[0].node)
                }
            }
        },
        getTitle = () => {
            const titles: string[] = [];
            if (appInfo) {
                titles.push(appInfo.name)
                if (actions[0]?.indexOf(':*') > -1) {
                    titles.push('全部操作')
                } else {
                    titles.push(`${actions.length}个操作`)

                }
            } else {
                titles.push('选择应用')
            }

            return titles.join('/')
        },
        rowColStyle = () => {
            const style: CSSProperties = { width: "70px", paddingRight: "20px", textAlign: "right" }
            return style
        }

    useEffect(() => {
        getAppInfo()
    }, [props.rule])

    return (
        <ProCard
            type="inner"
            size="small"
            bordered
            title={getTitle()}
            extra={
                <>
                    <Popconfirm
                        title="复制"
                        description="确定使用当前规则?"
                        onConfirm={() => {
                            props.onCopy?.()
                        }}
                    >
                        <a>复制</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="删除"
                        description="确定删除当前规则?"
                        onConfirm={() => {
                            props.onDel?.()
                        }}
                    >
                        <a>删除</a>
                    </Popconfirm>
                </>
            }>
            <Row >
                <Col style={rowColStyle()}>效果</Col>
                <Col flex="auto">
                    <Radio.Group
                        value={effect}
                        options={[
                            { label: "允许", value: "allow" },
                            { label: "拒绝", value: "deny" },
                        ]}
                        onChange={(e) => {
                            setEffect(e.target.value)
                            newRule.effect = e.target.value
                            props.onChange?.(newRule)
                        }}
                    />
                </Col>
            </Row>
            <Divider style={{ margin: "10px 0" }} />
            <Row >
                <Col style={rowColStyle()}>
                    应用
                </Col>
                <Col flex="auto">
                    <div style={{ width: "260px", }}>
                        <InputApp
                            value={appInfo}
                            onChange={updateAppInfo}
                        />
                    </div>
                </Col>
            </Row>
            <Divider style={{ margin: "10px 0" }} />
            <Row >
                <Col style={rowColStyle()}>
                    <CaretUpOutlined x-if={stretch1} onClick={() => { setStretch1(false) }} />
                    <CaretDownOutlined x-else onClick={() => { setStretch1(true) }} />
                    操作
                </Col>
                <Col flex="auto">
                    <div x-if={appInfo}>
                        <div>
                            <a>{action === 'all' ? '全部操作' : `${actions.length}个操作`}</a>
                        </div>
                        <div x-if={stretch1}>
                            <div>
                                <Radio.Group
                                    value={action}
                                    options={[
                                        { label: "全部操作(*)", value: "all" },
                                        { label: "指定", value: "customer" },
                                    ]}
                                    onChange={(e) => {
                                        setAction(e.target.value)
                                        if (e.target.value == 'all') {
                                            newRule.actions = [`${appInfo?.code}:*`]
                                        } else {
                                            newRule.actions = []
                                        }
                                        props.onChange?.(newRule)
                                    }}
                                />
                            </div>
                            {
                                action != "all" ? <>
                                    <br />
                                    <ActionsTransfer
                                        appCode={appInfo?.code || ''}
                                        targetKeys={actions}
                                        dataSource={appActions}
                                        onChange={(values) => {
                                            setActions(values);
                                            newRule.actions = values;
                                            props.onChange?.(newRule);
                                        }}
                                    />
                                </> : ""
                            }
                        </div>
                    </div>
                    <div x-else>
                        选择应用
                    </div>
                </Col>
            </Row>
            <Divider style={{ margin: "10px 0" }} />
            <Row >
                <Col style={rowColStyle()}>
                    <CaretUpOutlined x-if={stretch2} onClick={() => { setStretch2(false) }} />
                    <CaretDownOutlined x-else onClick={() => { setStretch2(true) }} />
                    资源
                </Col>
                <Col flex="auto">
                    <div x-if={appInfo}>
                        <div>
                            <a>{resource === 'all' ? '全部资源' : `${resources.length}个资源`}</a>
                        </div>
                        <div x-if={stretch2}>
                            <Radio.Group
                                value={resource}
                                options={[
                                    { label: "全部资源", value: "all" },
                                    { label: "指定资源", value: "customer" },
                                ]}
                                onChange={(e) => {
                                    setResource(e.target.value)
                                    if (e.target.value == 'all') {
                                        newRule.resources = ['*']
                                    } else {
                                        newRule.resources = []
                                    }
                                    props.onChange?.(newRule)
                                }}
                            />
                        </div>
                    </div>
                    <div x-else>
                        选择应用
                    </div>
                </Col>
            </Row>
            <Divider style={{ margin: "10px 0" }} />
            <Row >
                <Col style={rowColStyle()}>
                    <CaretUpOutlined x-if={stretch3} onClick={() => { setStretch3(false) }} />
                    <CaretDownOutlined x-else onClick={() => { setStretch3(true) }} />
                    条件
                </Col>
                <Col flex="auto">
                    <div x-if={appInfo}>
                        <div>
                            <a>{`${conditions.length}个条件`}</a>
                        </div>
                    </div>
                    <div x-else>
                        选择应用
                    </div>
                </Col>
            </Row>
        </ProCard >)
}

export default (props: {
    orgId: string
    rules: PolicyRule[],
    onChange?: (rules: PolicyRule[]) => void
}) => {
    return (
        <Tabs
            defaultActiveKey="ui"
            items={[
                {
                    label: "可视化编辑", key: "ui", children:
                        <>
                            {
                                props.rules?.map((item, index) =>
                                    <div key={`ruleItemdiv${index}`} >
                                        <RuleItem
                                            key={`ruleItem${index}`}
                                            orgId={props.orgId}
                                            rule={item}
                                            onChange={(rule) => {
                                                props.rules[index] = rule
                                                props.onChange?.(props.rules)
                                            }}
                                            onCopy={() => {
                                                props.rules.push({ ...item })
                                                props.onChange?.(props.rules)
                                            }}
                                            onDel={() => {
                                                props.rules?.splice(index, 1)
                                                props.onChange?.(props.rules)
                                            }}
                                        />
                                        <br />
                                    </div>
                                )
                            }

                            <Button key="add"
                                block
                                icon={<PlusCircleOutlined />}
                                size="small"
                                onClick={() => {
                                    props.rules.push({
                                        effect: 'allow',
                                        actions: [],
                                        resources: [],
                                        conditions: [],
                                    })
                                    props.onChange?.(props.rules)
                                }} >
                                添加语句
                            </Button>
                        </>
                },
                {
                    label: "脚本编辑", key: "json", children:
                        <Editor
                            className="adminx-editor"
                            height="400px"
                            defaultLanguage="json"
                            value={JSON.stringify(props.rules, null, 4)}
                            onChange={(value) => {
                                try {
                                    if (value) {
                                        props.onChange?.(JSON.parse(value))
                                    }
                                } catch (error) {

                                }
                            }}
                        />
                },
            ]}
        />

    )
}