import { Col, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { SwapOutlined, CloseOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import CardTree from './cardTree';
import { useTranslation } from 'react-i18next';
import { AppAction, AppActionMethod } from '@/generated/adminx/graphql';


export default function (props: {
  targetKeys: string[];
  dataSource: AppAction[];
  appCode?: string;
  titles?: [string, string];
  readonly?: boolean;
  onChange?: (targetKeys: string[]) => void;
}) {
  const { t } = useTranslation(),
    [dataSource, setDataSource] = useState<AppAction[]>([...props.dataSource]);

  useEffect(() => {
    setDataSource([...props.dataSource]);
  }, [props.dataSource]);

  return (
    <>
      <Row>
        <Col flex="1">
          <ProCard
            type="inner"
            size="small"
            bordered
            title={props.titles?.[0] || t('all')}
          >
            <Input.Search
              placeholder={`${t('filter_operation')}`}
              onSearch={(value) => {
                if (value) {
                  setDataSource(props.dataSource.filter(item => {
                    return item.name.indexOf(value) > -1 || (item.comments || '').indexOf(value) > -1;
                  }));
                } else {
                  setDataSource([...props.dataSource]);
                }
              }}
            />
            <div style={{ overflow: 'auto', height: '300px', marginTop: '10px' }}>
              <CardTree
                method={AppActionMethod.Read}
                checkedKeys={props.targetKeys}
                dataSource={dataSource}
                appCode={props.appCode}
                readonly={props.readonly}
                onChange={(keys: string[]) => {
                  props.onChange?.(keys);
                }}
              />
              <CardTree
                method={AppActionMethod.Write}
                checkedKeys={props.targetKeys}
                dataSource={dataSource}
                appCode={props.appCode}
                readonly={props.readonly}
                onChange={(keys: string[]) => {
                  props.onChange?.(keys);
                }}
              />
              <CardTree
                method={AppActionMethod.List}
                checkedKeys={props.targetKeys}
                dataSource={dataSource}
                appCode={props.appCode}
                readonly={props.readonly}
                onChange={(keys: string[]) => {
                  props.onChange?.(keys);
                }}
              />
            </div>
          </ProCard>
        </Col>
        <Col flex="40px" style={{ display: 'flex', justifyContent: 'center' }}>
          <SwapOutlined style={{ fontSize: '20px', color: '#ccc' }} />
        </Col>
        <Col flex="1">
          <ProCard
            type="inner"
            size="small"
            bordered
            title={props.titles?.[1] || t('selected')}
          >
            <div style={{ overflow: 'auto', height: '342px' }}>
              {
                props.dataSource.filter(item => props.targetKeys.includes(props.appCode ? `${props.appCode}:${item.name}` : item.name)).map(item => (
                  <Row className="actionsTransfer-listRow" key={`select${item.id}`}>
                    <Col flex="auto">
                      <div>{props.appCode ? `${props.appCode}:${item.name}` : item.name}</div>
                      <div>{item.comments}</div>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'center' }}>
                      {props.readonly ? <span /> : <CloseOutlined
                        className="delIcon"
                        onClick={() => {
                          props.onChange?.([...props.targetKeys.filter(key => (
                            key == props.appCode ? item.name : `${props.appCode}:${item.name}`
                          ))]);
                        }}
                      />}
                    </Col>
                  </Row>
                ))
              }
            </div>
          </ProCard>
        </Col>
      </Row>
    </>
  );
}

