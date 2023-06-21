import { getAppResList } from '@/services/knockout/app/resource';
import { Checkbox, Col, Popconfirm, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './index.module.css';
import Create from './create';
import { App } from '@/__generated__/knockout/graphql';

export type AppResItem = {
  title: string;
  typeName: string;
  arn: string;
  arnParams: string[];
  allArn: string;
};

export default (props: {
  appInfo: App;
  isShowAppCode?: boolean;
  orgId?: string;
  values?: string[];
  readonly?: boolean;
  onChange: (values: string[]) => void;
}) => {
  const { t } = useTranslation(),
    [dataSource, setDataSource] = useState<AppResItem[]>([]),
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      data: string;
      scene: 'create' | 'editor';
    }>({
      open: false,
      title: '',
      data: '',
      scene: 'create',
    });

  const
    getRequest = async () => {
      const result = await getAppResList(props.appInfo.id, {
        pageSize: 999,
      });
      if (result?.totalCount) {
        const list: AppResItem[] = result.edges?.map(item => {
          const arn = props.isShowAppCode ? `${props.appInfo.code}${item?.node?.arnPattern}` : (item?.node?.arnPattern || ''),
            arnParams = arn.split(':').filter(sItem => sItem.indexOf('/') > -1).map(sItem => sItem.split('/')[0]);

          return {
            title: item?.node?.name || '',
            typeName: item?.node?.typeName || '',
            arn,
            arnParams,
            allArn: props.orgId ? arn.replace(':tenant_id:', `:${props.orgId}:`) : arn,
          };
        }) || [];

        setDataSource(list);
      }
    },
    valueArns = (item: AppResItem) => {
      return props.values?.filter(vsItem =>
        (vsItem.indexOf(`:${item.typeName}:`) > -1) &&
        (vsItem.split(':').filter(sItem => sItem.indexOf('/') > -1).map(sItem => sItem.split('/')[0]).join(',') === item.arnParams.join(',')),
      ) || [];
    };


  useEffect(() => {
    getRequest();
  }, [props.appInfo]);

  return (<div className={style.appPolicyRes}>
    {
      dataSource.map(item =>
      (<div className="appPolicyRes-box" key={item.title}>
        <div className="appPolicyRes-title">{item.title}</div>
        <div className="appPolicyRes-content">
          <Row>
            <Col flex="auto">
              {`${t('res_arn_format')} ${item.arn}`}
            </Col>
            <Col>
              <Space>
                {
                  props.values?.find(vsItem => vsItem == item.allArn) ? ''
                    : props.readonly ? '' : <a onClick={() => {
                      setModal({ open: true, title: t('add_resources'), data: item.allArn, scene: 'create' });
                    }}
                    >
                      {t('add_resources')}
                    </a>
                }
                <Checkbox
                  disabled={props.readonly}
                  checked={!!props.values?.find(vsItem => vsItem == item.allArn)}
                  onChange={(event) => {
                    let values: string[] = [];
                    if (event.target.checked) {
                      values = props.values?.filter(vsItem => !(
                        (vsItem.indexOf(`:${item.typeName}:`) > -1) &&
                        (vsItem.split(':').filter(sItem => sItem.indexOf('/') > -1).map(sItem => sItem.split('/')[0]).join(',') === item.arnParams.join(','))
                      )) || [];
                      values.push(item.allArn);
                    } else {
                      values = props.values?.filter(vsItem => vsItem != item.allArn) || [];
                    }
                    props.onChange(values);
                  }}
                >
                  {t('match_all')}
                </Checkbox>
              </Space>
            </Col>
          </Row>
          {
            valueArns(item).map(vItem => (<Row key={vItem} gutter={20}>
              <Col >
                . {vItem}
              </Col>
              <Col flex="auto">
                {!props.readonly && !props.values?.find(vsItem => vsItem == item.allArn) ? <Space>
                  <a onClick={() => {
                    setModal({ open: true, title: `${t('amend')} ${vItem}`, data: vItem, scene: 'editor' });
                  }}
                  >
                    {t('edit')}
                  </a>
                  <Popconfirm
                    title={t('delete')}
                    description={t('confirm_delete')}
                    okText={t('confirm')}
                    cancelText={t('cancel')}
                    onConfirm={() => {
                      props.onChange(props.values?.filter(vsItem => vsItem != vItem) || []);
                    }}
                  >
                    <a>
                      {t('delete')}
                    </a>
                  </Popconfirm>
                </Space> : ''}

              </Col>
            </Row>))
          }

        </div>
      </div>),
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
            props.onChange([...props.values || [], newArn]);
          } else if (modal.scene === 'editor') {
            const values = props.values || [];
            props.onChange(values.map(vsItem => {
              if (vsItem === modal.data) {
                return newArn;
              }
              return vsItem;
            }));
          }
        }
        setModal({ open: false, title: modal.title, data: '', scene: modal.scene });
      }}
    />
  </div>);
};
