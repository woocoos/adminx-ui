import {
  ActionType,
  PageContainer,
  ProTable,
  useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal, message } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { TableParams, TableSort, TableFilter } from "@/services/graphql";
import { Link } from "ice";
import { User, delUserInfo, getUserList, resetUserPasswordByEmail } from "@/services/user";
import AccountCreate from "./components/create";


export default () => {
  const { token } = useToken(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns = [
      // 有需要排序配置  sorter: true 
      { title: '登录账户', dataIndex: 'principalName', width: 90, align: 'center' },
      { title: '显示名称', dataIndex: 'displayName', width: 120, },
      { title: '邮箱', dataIndex: 'email', width: 120, },
      { title: '手机', dataIndex: 'mobile', width: 160 },
      {
        title: '状态', dataIndex: 'status', filters: true, search: false, width: 100,
        valueEnum: {
          active: { text: "活跃", status: 'success' },
          inactive: { text: "失活", status: 'default' },
          processing: { text: "处理中", status: 'warning' }
        },
      },
      { title: '创建时间', dataIndex: 'createdAt', width: 160, valueType: "dateTime", sorter: true },
      {
        title: '操作', dataIndex: 'actions', fixed: 'right',
        align: 'center', search: false, width: 120,
        render: (text, record) => {
          return <Space>
            <Link key="editor" to={`/account/viewer?id=${record.id}`}>
              编辑
            </Link>
            <Dropdown trigger={['click']} menu={{
              items: [
                { key: "resetPwd", label: <a onClick={() => onResetPwd(record)}>重置密码</a> },
                { key: "delete", label: <a onClick={() => onDelApp(record)}>删除</a> },
              ]
            }} >
              <a><EllipsisOutlined /></a>
            </Dropdown>
          </Space>
        }
      },
    ],
    // 弹出层处理
    [modal, setModal] = useState({
      open: false,
      title: "",
    })


  const
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as User[], success: true, total: 0 };
      // params.userType = "account"
      const result = await getUserList(params, filter, sort);
      if (result) {
        table.data = result.edges.map(item => item.node)
        table.total = result.totalCount
      }
      return table
    },
    onResetPwd = (record: User) => {
      Modal.confirm({
        title: `重置密码-${record.displayName}`,
        content: <>
          <div>重置后密码将发送邮件至客户邮箱</div>
          <div>登录密码重置需要客户登录后重置密码后才可使用系统</div>
        </>,
        onOk: async (close) => {
          const result = await resetUserPasswordByEmail(record.id)
          if (result) {
            message.success('成功重置密码')
            close();
          }
        }
      })
    },
    onDelApp = (record: User) => {
      Modal.confirm({
        title: "删除",
        content: `是否删除用户：${record.displayName}`,
        onOk: async (close) => {
          const result = await delUserInfo(record.id)
          if (result) {
            proTableRef.current?.reload();
            close();
          }
        }
      })
    },
    onDrawerClose = (isSuccess: boolean) => {
      if (isSuccess) {
        proTableRef.current?.reload();
      }
      setModal({ open: false, title: '创建账户' })
    }

  return (
    <PageContainer
      header={{
        title: "账户管理",
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: "系统配置", },
            { title: "账户管理", },
          ],
        },
        extra: [
          <Button key="create" type="primary" onClick={() => {
            setModal({ open: true, title: '创建账户' })
          }} >
            创建账户
          </Button>
        ]
      }}
    >
      <ProTable
        actionRef={proTableRef}
        rowKey={"id"}
        toolbar={{
          title: "账户列表"
        }}
        scroll={{ x: 'max-content' }}
        columns={columns as any}
        request={getRequest}
        pagination={{ showSizeChanger: true }}
      />
      <AccountCreate
        open={modal.open}
        title={modal.title}
        userType="account"
        scene="create"
        onClose={onDrawerClose} />
    </PageContainer>
  );
};
