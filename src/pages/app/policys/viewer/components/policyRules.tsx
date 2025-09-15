import { ProCard } from '@ant-design/pro-components';
import { Divider, Radio, Tabs, Row, Col, Button, Popconfirm } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import { PlusCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import ActionsTransfer from '@/components/actionsTransfer';
import { useTranslation } from 'react-i18next';
import AppPolicyRes from '@/components/appPolicyRes';
import { App, AppAction, AppPolicyKind, PolicyEffect, PolicyRule } from '@/generated/adminx/graphql';
import Editor from '@/components/editor';
import InputApp from '@/pages/app/components/inputApp';
import app from '@/app';
import { getAppList } from '@/services/adminx/app';
import { getAppActionList } from '@/services/adminx/app/action';

const RuleItem = (props: {
  rule: PolicyRule;
  appActions: AppAction[];
  kind: AppPolicyKind;
  appInfo: App;
  readonly?: boolean;
  onChange?: (rule: PolicyRule) => void;
  onCopy?: () => void;
  onDel?: () => void;
}) => {
  const { t } = useTranslation(),
    [appInfo, setAppInfo] = useState<App>(),
    [appActions, setAppActions] = useState<AppAction[]>([]),
    [stretch1, setStretch1] = useState<boolean>(false),
    [stretch2, setStretch2] = useState<boolean>(false),
    [stretch3, setStretch3] = useState<boolean>(false);

  const
    getTitle = () => {
      const titles: string[] = [];
      titles.push(props.kind === AppPolicyKind.View ? `${appInfo?.name ?? ''}` : props.appInfo.name);
      if (props.rule?.actions?.[0] === '*') {
        titles.push(t('all_operation'));
      } else {
        titles.push(t('{{num}}_operations', { num: props.rule.actions?.length || 0 }));
      }
      return titles.join('/');
    };

  const rowColStyle: CSSProperties = { width: '70px', paddingRight: '20px', textAlign: 'right' },
    // 适用于kind=view模式下
    reqAppInfo = async () => {
      const appCode = props.rule.actions?.[0]?.split(':')?.[0];
      if (appCode) {
        if (appCode === props.appInfo.code) {
          setAppInfo(props.appInfo);
        } else {
          const result = await getAppList({
            current: 1,
            pageSize: 1,
            where: {
              code: appCode,
            },
          });
          if (result?.totalCount) {
            setAppInfo(result.edges?.[0]?.node as App);
          }
        }
      }
    },
    reqAppActions = async () => {
      if (appInfo) {
        const result = await getAppActionList(appInfo.id, {
          pageSize: 9999,
        });
        if (result?.totalCount) {
          setAppActions(result.edges?.map(item => item?.node) as AppAction[]);
        }
      } else {
        setAppActions([]);
      }
    };

  useEffect(() => {
    if (props.kind === AppPolicyKind.View) {
      reqAppInfo()
    }
  }, [props.kind])

  useEffect(() => {
    if (props.kind === AppPolicyKind.View) {
      reqAppActions()
    }
  }, [appInfo])

  return (
    <ProCard
      type="inner"
      size="small"
      bordered
      title={getTitle()}
      extra={props.readonly ? '' : <>
        <Popconfirm
          title={t('copy')}
          description={`${t('confirm_copy')}?`}
          onConfirm={() => {
            props.onCopy?.();
          }}
        >
          <a>{t('copy')}</a>
        </Popconfirm>
        <Divider type="vertical" />
        <Popconfirm
          title={t('delete')}
          description={`${t('confirm_delete')}?`}
          onConfirm={() => {
            props.onDel?.();
          }}
        >
          <a>{t('delete')}</a>
        </Popconfirm>
      </>}
    >
      <Row >
        <Col style={rowColStyle}>{t('effect')}</Col>
        <Col flex="auto">
          <Radio.Group
            disabled={props.readonly}
            value={props.rule.effect}
            options={[
              { label: t('allow'), value: 'allow' },
              { label: t('deny'), value: 'deny' },
            ]}
            onChange={(event) => {
              const nRule = { ...props.rule };
              nRule.effect = event.target.value;
              props.onChange?.(nRule);
            }}
          />
        </Col>
      </Row>
      <Divider style={{ margin: '10px 0' }} />
      <Row >
        <Col style={rowColStyle}>{t('app')}</Col>
        <Col flex="200px">
          {
            props.kind == AppPolicyKind.View ? <InputApp
              value={appInfo}
              disabled={props.readonly}
              onChange={(data) => {
                const nRule = { ...props.rule };
                nRule.actions = [];
                nRule.resources = [];
                nRule.conditions = [];
                props.onChange?.(nRule);
                setAppInfo(data);
              }}
            /> : props.appInfo.name
          }
        </Col>
      </Row>
      <Divider style={{ margin: '10px 0' }} />
      <Row >
        <Col style={rowColStyle}>
          <CaretUpOutlined
            x-if={stretch1}
            onClick={() => {
              setStretch1(false);
            }}
          />
          <CaretDownOutlined
            x-else
            onClick={() => {
              setStretch1(true);
            }}
          />
          {t('operation')}
        </Col>
        <Col flex="auto">
          <div>
            <a>{
              props.rule.actions?.[0]?.includes(':*') ?
                t('all_operation') :
                t('{{num}}_operations', { num: props.rule.actions?.length || 0 })
            }</a>
          </div>
          <div x-if={stretch1}>
            <div>
              <Radio.Group
                disabled={props.readonly}
                value={props.rule.actions?.[0]?.includes(':*')}
                options={[
                  { label: `${t('all_operation')}(*)`, value: true },
                  { label: t('specify'), value: false },
                ]}
                onChange={(event) => {
                  const nRule = { ...props.rule };
                  if (event.target.value) {
                    nRule.actions = [`${props.kind == AppPolicyKind.View ? appInfo?.code : props.appInfo.code}:*`];
                  } else {
                    nRule.actions = [];
                  }
                  props.onChange?.(nRule);
                }}
              />
            </div>
            {
              props.rule.actions?.[0] == `${props.kind === AppPolicyKind.View ? appInfo?.code : props.appInfo?.code}:*` ? <></> : <>
                <br />
                <ActionsTransfer
                  readonly={props.readonly}
                  appCode={props.kind === AppPolicyKind.View ? appInfo?.code : props.appInfo?.code}
                  targetKeys={props.rule.actions || []}
                  dataSource={props.kind === AppPolicyKind.View ? appActions : props.appActions}
                  onChange={(values) => {
                    const nRule = { ...props.rule };
                    nRule.actions = values;
                    props.onChange?.(nRule);
                  }}
                />
              </>
            }
          </div>
        </Col>
      </Row>
      <Divider style={{ margin: '10px 0' }} />
      <Row >
        <Col style={rowColStyle}>
          <CaretUpOutlined
            x-if={stretch2}
            onClick={() => {
              setStretch2(false);
            }}
          />
          <CaretDownOutlined
            x-else
            onClick={() => {
              setStretch2(true);
            }}
          />
          {t('resources')}
        </Col>
        <Col flex="auto">
          <div>
            <a>{props.rule.resources ? t('{{num}}_resources', { num: props.rule.resources.length }) : t('all_resources')}</a>
          </div>
          <div x-if={stretch2}>
            <div>
              <Radio.Group
                disabled={props.readonly}
                value={!props.rule.resources}
                options={[
                  { label: t('all_resources'), value: true },
                  { label: t('specify'), value: false },
                ]}
                onChange={(event) => {
                  const nRule = { ...props.rule };
                  if (event.target.value) {
                    nRule.resources = null;
                  } else {
                    nRule.resources = [];
                  }
                  props.onChange?.(nRule);
                }}
              />
            </div>
            {
              props.rule.resources && (props.kind === AppPolicyKind.View ? appInfo : props.appInfo) ? <>
                <br />
                <AppPolicyRes
                  readonly={props.readonly}
                  appInfo={props.kind === AppPolicyKind.View ? appInfo as App : props.appInfo}
                  isShowAppCode
                  values={props.rule.resources}
                  onChange={(values) => {
                    const nRule = { ...props.rule };
                    nRule.resources = values;
                    props.onChange?.(nRule);
                  }}
                />
              </> : ''
            }
          </div>
        </Col>
      </Row>
      <Divider style={{ margin: '10px 0' }} />
      <Row >
        <Col style={rowColStyle}>
          <CaretUpOutlined
            x-if={stretch3}
            onClick={() => {
              setStretch3(false);
            }}
          />
          <CaretDownOutlined
            x-else
            onClick={() => {
              setStretch3(true);
            }}
          />
          {t('condition')}
        </Col>
        <Col flex="auto">
          <div>
            <a>{t('{{num}}_conditions', { num: props.rule.conditions?.length || 0 })}</a>
          </div>
        </Col>
      </Row>
    </ProCard >);
};

export default (props: {
  appInfo: App;
  kind: AppPolicyKind;
  rules: PolicyRule[];
  appActions: AppAction[];
  readonly?: boolean;
  onChange?: (rules: PolicyRule[]) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Tabs
      defaultActiveKey="ui"
      items={[
        {
          label: t('visual_editing'),
          key: 'ui',
          children: <>
            {
              props.rules?.map((item, index) =>
              (<div key={`ruleItemdiv${index}`} >
                <RuleItem
                  key={`ruleItem${index}`}
                  readonly={props.readonly}
                  rule={item}
                  appInfo={props.appInfo}
                  kind={props.kind}
                  appActions={props.appActions}
                  onChange={(rule) => {
                    props.rules[index] = rule;
                    props.onChange?.(props.rules);
                  }}
                  onCopy={() => {
                    props.rules.push({ ...item });
                    props.onChange?.(props.rules);
                  }}
                  onDel={() => {
                    props.rules?.splice(index, 1);
                    props.onChange?.(props.rules);
                  }}
                />
                <br />
              </div>),
              )
            }
            {props.readonly ? '' : <Button
              key="add"
              block
              icon={<PlusCircleOutlined />}
              size="small"
              onClick={() => {
                props.rules.push({
                  effect: PolicyEffect.Allow,
                  actions: [],
                  resources: null,
                  conditions: null,
                });
                props.onChange?.(props.rules);
              }}
            >
              {t('add_statement')}
            </Button>}

          </>,
        },
        {
          label: t('script_editing'),
          key: 'json',
          children: <>
            <Editor
              options={{
                readOnly: props.readonly,
              }}
              className="adminx-editor"
              height="400px"
              defaultLanguage="json"
              value={JSON.stringify(props.rules, null, 4)}
              onChange={(value) => {
                try {
                  if (value) {
                    props.onChange?.(JSON.parse(value));
                  }
                } catch (error) {

                }
              }}
            />
          </>,
        },
      ]}
    />

  );
};
