import { EnumPolicyRuleEffect, PolicyRule, PolicyRuleEffect } from "@/services/app/policy"
import { ProCard } from "@ant-design/pro-components"
import { Divider, Radio, Tabs, Row, Col, Button, Transfer, Tree, List, Popconfirm } from "antd"
import { CSSProperties, ReactNode, useEffect, useState } from "react"
import { PlusCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { AppAction } from "@/services/app/action";
import ActionsTransfer from "@/components/ActionsTransfer";
import { App } from "@/services/app";
import Editor from '@monaco-editor/react';
import { useTranslation } from "react-i18next";

const RuleItem = (props: {
    rule: PolicyRule
    appActions: AppAction[],
    appInfo: App,
    onChange?: (rule: PolicyRule) => void
    onCopy?: () => void
    onDel?: () => void
}) => {
    const { t } = useTranslation(),
        [effect, setEffect] = useState<PolicyRuleEffect>(props.rule.effect || 'allow'),
        [action, setAction] = useState<"all" | "customer">(props.rule.actions?.[0] === `*` ? "all" : 'customer'),
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
        getTitle = () => {
            const titles: string[] = [];
            titles.push(props.appInfo.name)
            if (actions[0] === '*') {
                titles.push(t('full operation'))
            } else {
                titles.push(t('{{num}} operations', { num: actions.length }))

            }
            return titles.join('/')
        }


    const rowColStyle: CSSProperties = { width: "70px", paddingRight: "20px", textAlign: "right" }

    return (
        <ProCard
            type="inner"
            size="small"
            bordered
            title={getTitle()}
            extra={
                <>
                    <Popconfirm
                        title={t('copy')}
                        description={`${t('confirm copy')}?`}
                        onConfirm={() => {
                            props.onCopy?.()
                        }}
                    >
                        <a>{t('copy')}</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Popconfirm
                        title={t('delete')}
                        description={`${t('confirm delete')}?`}
                        onConfirm={() => {
                            props.onDel?.()
                        }}
                    >
                        <a>{t('delete')}</a>
                    </Popconfirm>
                </>
            }>
            <Row >
                <Col style={rowColStyle}>{t('effect')}</Col>
                <Col flex="auto">
                    <Radio.Group value={effect} options={[
                        { label: t('allow'), value: "allow" },
                        { label: t('deny'), value: "deny" },
                    ]} onChange={(e) => {
                        setEffect(e.target.value)
                        newRule.effect = e.target.value
                        props.onChange?.(newRule)
                    }} />
                </Col>
            </Row>
            <Divider style={{ margin: "10px 0" }} />
            <Row >
                <Col style={rowColStyle}>{t('app')}</Col>
                <Col flex="auto">
                    {props.appInfo.name}
                </Col>
            </Row>
            <Divider style={{ margin: "10px 0" }} />
            <Row >
                <Col style={rowColStyle}>
                    <CaretUpOutlined x-if={stretch1} onClick={() => {
                        setStretch1(false)
                    }} />
                    <CaretDownOutlined x-else onClick={() => {
                        setStretch1(true)
                    }} />
                    {t('operation')}
                </Col>
                <Col flex="auto">
                    <div>
                        <a>{action === 'all' ? t('full operation') : t('{{num}} operations', { num: actions.length })}</a>
                    </div>
                    <div x-if={stretch1}>
                        <div>
                            <Radio.Group value={action} options={[
                                { label: `${t('full operation')}(*)`, value: "all" },
                                { label: t('specify'), value: "customer" },
                            ]} onChange={(e) => {
                                setAction(e.target.value)
                                if (e.target.value == 'all') {
                                    newRule.actions = ["*"]
                                } else {
                                    newRule.actions = []
                                }
                                props.onChange?.(newRule)
                            }} />
                        </div>
                        {
                            action != "all" ? <>
                                <br />
                                <ActionsTransfer
                                    targetKeys={actions}
                                    dataSource={props.appActions}
                                    onChange={(values) => {
                                        setActions(values);
                                        newRule.actions = values;
                                        props.onChange?.(newRule);
                                    }} appCode={props.appInfo.code} />
                            </> : ""
                        }
                    </div>
                </Col>
            </Row>
            <Divider style={{ margin: "10px 0" }} />
            <Row >
                <Col style={rowColStyle}>
                    <CaretUpOutlined x-if={stretch2} onClick={() => {
                        setStretch2(false)
                    }} />
                    <CaretDownOutlined x-else onClick={() => {
                        setStretch2(true)
                    }} />
                    {t('resources')}
                </Col>
                <Col flex="auto">
                    <div>
                        <a>{resource === 'all' ? t('total resources') : t("{{num}} resources", { num: resources.length })}</a>
                    </div>
                    <div x-if={stretch2}>
                        <Radio.Group value={resource} options={[
                            { label: t('total resources'), value: "all" },
                            { label: t('specify'), value: "customer" },
                        ]} onChange={(e) => {
                            setResource(e.target.value)
                            if (e.target.value == 'all') {
                                newRule.resources = ['*']
                            } else {
                                newRule.resources = []
                            }
                            props.onChange?.(newRule)
                        }} />
                    </div>
                </Col>
            </Row>
            <Divider style={{ margin: "10px 0" }} />
            <Row >
                <Col style={rowColStyle}>
                    <CaretUpOutlined x-if={stretch3} onClick={() => {
                        setStretch3(false)
                    }} />
                    <CaretDownOutlined x-else onClick={() => {
                        setStretch3(true)
                    }} />
                    {t('condition')}
                </Col>
                <Col flex="auto">
                    <div>
                        <a>{t("{{num}} conditions", { num: conditions.length })}</a>
                    </div>
                </Col>
            </Row>
        </ProCard >)
}

export default (props: {
    appInfo: App,
    rules: PolicyRule[],
    appActions: AppAction[],
    onChange?: (rules: PolicyRule[]) => void
}) => {
    const { t } = useTranslation();

    return (
        <Tabs
            defaultActiveKey="ui"
            items={[
                {
                    label: t('visual editing'), key: "ui", children:
                        <>
                            {
                                props.rules?.map((item, index) =>
                                    <div key={`ruleItemdiv${index}`} >
                                        <RuleItem
                                            key={`ruleItem${index}`}
                                            rule={item}
                                            appInfo={props.appInfo}
                                            appActions={props.appActions}
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
                                {t('add statement')}
                            </Button>
                        </>
                },
                {
                    label: t('script editing'), key: "json", children: <>
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
                    </>
                },
            ]}
        />

    )
}