import { OauthClient, OauthClientSimpleStatus } from "@/generated/adminx/graphql";
import { EnumUserAccessKeyStatus, delAccessKey, disableAccessKey, enableAccessKey, getAccessKeyList } from "@/services/adminx/user";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Row, Col, Button, Space, Popconfirm, message } from "antd";
import { useRef, useState } from "react";
import styles from "../index.module.css";
import { useTranslation } from "react-i18next";
import CreateAccessKey from "./createAccessKey";
import Auth from "@/components/auth";

export default (props: {
  userId: string;
}) => {
  const { t } = useTranslation(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<OauthClient>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
      },
      {
        title: t('Client ID'),
        dataIndex: 'clientID',
        width: 120,
      },
      {
        title: t('Client Secret'),
        dataIndex: 'clientSecret',
        width: 120,
      },
      {
        title: t('last_auth_at'),
        dataIndex: 'lastAuthAt',
        width: 120,
        valueType: "dateTime",
      },
      {
        title: t('status'),
        dataIndex: 'status',
        width: 120,
        valueEnum: EnumUserAccessKeyStatus,
      },
      {
        title: t('created_at'),
        dataIndex: 'createdAt',
        width: 120,
        valueType: "dateTime",
      },
      {
        title: t('operation'),
        dataIndex: 'actions',
        fixed: 'right',
        align: 'center',
        search: false,
        width: 170,
        render: (text, record) => {
          return <Space>
            {record.status === OauthClientSimpleStatus.Active ?
              <Auth authKey="disableOauthClient">
                <Popconfirm
                  title={t('disable')}
                  description={t('confirm_disable')}
                  onConfirm={async () => {
                    const result = await disableAccessKey(record.id);
                    if (result?.id) {
                      message.success('submit_success')
                      proTableRef.current?.reload();
                    }
                  }}
                >
                  <a >
                    {t('disable')}
                  </a>
                </Popconfirm>
              </Auth> : <Auth authKey="enableOauthClient">
                <Popconfirm title={t('enable')}
                  description={t('confirm_enable')}
                  onConfirm={async () => {
                    const result = await enableAccessKey(record.id);
                    if (result?.id) {
                      message.success('submit_success')
                      proTableRef.current?.reload();
                    }
                  }}
                >
                  <a >
                    {t('enable')}
                  </a>
                </Popconfirm>
              </Auth>
            }
            <Auth authKey="deleteOauthClient" >
              <Popconfirm title={t('delete')}
                description={t('confirm_delete')}
                onConfirm={async () => {
                  const result = await delAccessKey(record.id);
                  if (result) {
                    message.success('submit_success')
                    proTableRef.current?.reload();
                  }
                }}
              >
                <a >
                  {t('delete')}
                </a>
              </Popconfirm>
            </Auth >
          </Space >
        }
      }
    ],
    [modal, setModal] = useState({
      open: false,
      title: ''
    })

  return <div>
    <Row>
      <Col flex="auto">
        <span style={{
          fontWeight: '600',
          fontSize: '16px'
        }}>{t('user')} AccessKey</span>
      </Col>
      <Col>
        <Auth authKey={"createOauthClient"}>
          <Button onClick={() => {
            setModal({ open: true, title: `${t('created')} AccessKey` })
          }}>{t('created')}</Button>
        </Auth>
      </Col>
    </Row>
    <br />
    <ProTable
      className={styles.viewerTable}
      actionRef={proTableRef}
      rowKey={'id'}
      search={false}
      scroll={{ x: 'max-content' }}
      options={false}
      columns={columns}
      request={async () => {
        const table = { data: [] as OauthClient[], success: true, total: 0 }

        const result = await getAccessKeyList(props.userId);
        if (result?.length) {
          table.data = result as OauthClient[];
          table.total = result.length;
        }

        return table;
      }}
      pagination={false}
    />
    <CreateAccessKey
      open={modal.open}
      title={modal.title}
      userId={props.userId}
      onClose={(isSuccess) => {
        if (isSuccess) {
          proTableRef.current?.reload()
        }
        setModal({ open: false, title: modal.title })
      }}
    />
  </div>
}
