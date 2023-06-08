import { PolicyRule } from '@/services/app/policy';
import { ProCard } from '@ant-design/pro-components';
import { Divider, Radio, Tabs, Row, Col, Button, Popconfirm } from 'antd';
import { CSSProperties, useState } from 'react';
import { PlusCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { AppAction } from '@/services/app/action';
import ActionsTransfer from '@/components/ActionsTransfer';
import { App } from '@/services/app';
import Editor from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';
import AppPolicyRes from '@/components/AppPolicyRes';

const RuleItem = (props: {
  rule: PolicyRule;
  appActions: AppAction[];
  appInfo: App;
  readonly?: boolean;
  onChange?: (rule: PolicyRule) => void;
  onCopy?: () => void;
  onDel?: () => void;
}) => {
  const { t } = useTranslation(),
    [stretch1, setStretch1] = useState<boolean>(false),
    [stretch2, setStretch2] = useState<boolean>(false),
    [stretch3, setStretch3] = useState<boolean>(false);

  const
    getTitle = () => {
      const titles: string[] = [];
      titles.push(props.appInfo.name);
      if (props.rule.actions[0] === '*') {
        titles.push(t('all_operation'));
      } else {
        titles.push(t('{{num}}_operations', { num: props.rule.actions.length }));
      }
      return titles.join('/');
    };

  const rowColStyle: CSSProperties = { width: '70px', paddingRight: '20px', textAlign: 'right' };

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
        <Col flex="auto">
          {props.appInfo.name}
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
            <a>{props.rule.actions[0] === '*' ? t('all_operation') : t('{{num}}_operations', { num: props.rule.actions.length })}</a>
          </div>
          <div x-if={stretch1}>
            <div>
              <Radio.Group
                disabled={props.readonly}
                value={props.rule.actions[0] === '*'}
                options={[
                  { label: `${t('all_operation')}(*)`, value: true },
                  { label: t('specify'), value: false },
                ]}
                onChange={(event) => {
                  const nRule = { ...props.rule };
                  if (event.target.value) {
                    nRule.actions = ['*'];
                  } else {
                    nRule.actions = [];
                  }
                  props.onChange?.(nRule);
                }}
              />
            </div>
            {
              props.rule.actions[0] == '*' ? <></> : <>
                <br />
                <ActionsTransfer
                  readonly={props.readonly}
                  targetKeys={props.rule.actions}
                  dataSource={props.appActions}
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
              props.rule.resources ? <>
                <br />
                <AppPolicyRes
                  readonly={props.readonly}
                  appInfo={props.appInfo}
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
                  effect: 'allow',
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
