import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
  useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal, message } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TableParams, TableSort, TableFilter } from "@/services/graphql";
import { Link } from "ice";
import { EnumUserStatus, User, UserType, delUserInfo, getUserList, resetUserPasswordByEmail } from "@/services/user";
import AccountCreate from "./components/create";
import { getOrgUserList, removeOrgUser } from "@/services/org/user";

type UserListProps = {
  title?: string
  orgId?: string
  scene?: 'user' | 'orgUser' | 'modal',
  userType?: UserType
  isMultiple?: boolean,
  ref?: MutableRefObject<UserListRef>
}

export type UserListRef = {
  getSelect: () => User[]
  reload: () => void
}

const UserList = (props: UserListProps, ref: MutableRefObject<UserListRef>) => {
  const { token } = useToken(),
    userType = props.userType || "account",
    // 表格相关
    proTableRef = useRef<ActionType>(),
    [dataSource, setDataSource] = useState<User[]>([]),
    columns: ProColumns<User>[] = [
      // 有需要排序配置  sorter: true 
      { title: '登录账户', dataIndex: 'principalName', width: 90, },
      { title: '显示名称', dataIndex: 'displayName', width: 120, },
      { title: '邮箱', dataIndex: 'email', width: 120, },
      { title: '手机', dataIndex: 'mobile', width: 160 },
      {
        title: '状态', dataIndex: 'status', filters: true, search: false, width: 100,
        valueEnum: EnumUserStatus,
      },
      { title: '创建时间', dataIndex: 'createdAt', width: 160, valueType: "dateTime", sorter: true },

    ],
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    // 弹出层处理
    [modal, setModal] = useState({
      open: false,
      title: "",
    })

  if (props?.scene !== 'modal') {
    columns.push(
      {
        title: '操作', dataIndex: 'actions', fixed: 'right',
        align: 'center', search: false, width: 120,
        render: (text, record) => {
          return <Space>
            <Link key="editor" to={`/account/viewer?id=${record.id}`}>
              编辑
            </Link>
            <Dropdown trigger={['click']} menu={{
              items: props?.scene === 'orgUser' ? [
                { key: "resetPwd", label: <a onClick={() => onResetPwd(record)}>重置密码</a> },
                { key: "delete", label: <a onClick={() => onRemoveOrg(record)}>移除</a> },
              ] : [
                { key: "resetPwd", label: <a onClick={() => onResetPwd(record)}>重置密码</a> },
                { key: "delete", label: <a onClick={() => onDelApp(record)}>删除</a> },
              ]
            }} >
              <a><EllipsisOutlined /></a>
            </Dropdown>
          </Space>
        }
      }
    )
  }


  const
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as User[], success: true, total: 0 };
      const result = props?.orgId ?
        await getOrgUserList(props.orgId, params, filter, sort) :
        await getUserList(params, filter, sort);
      if (result) {
        table.data = result.edges.map(item => item.node)
        table.total = result.totalCount
      }
      setDataSource(table.data)
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
    onRemoveOrg = (record: User) => {
      Modal.confirm({
        title: "从组织中移除",
        content: `是否从组织中移除用户：${record.displayName}`,
        onOk: async (close) => {
          if (props?.orgId) {
            const result = await removeOrgUser(props?.orgId, record.id)
            if (result) {
              proTableRef.current?.reload();
              close();
            }
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

  useImperativeHandle(ref, () => {
    return {
      getSelect: () => {
        return dataSource.filter(item => selectedRowKeys.includes(item.id))
      },
      reload: () => {
        proTableRef.current?.reload();
      }
    }
  })

  useEffect(() => {
    proTableRef.current?.reload();
  }, [props?.orgId])

  return (
    <>
      {
        ["modal", "orgUser"].includes(props?.scene || '') ? (
          <ProTable
            actionRef={proTableRef}
            rowKey={"id"}
            toolbar={{
              title: props?.title || userType === 'account' ? "账户列表" : "用户列表"
            }}
            scroll={{ x: 'max-content', y: 300 }}
            columns={columns}
            request={getRequest}
            pagination={{ showSizeChanger: true }}
            rowSelection={props?.scene === 'modal' ? {
              selectedRowKeys: selectedRowKeys,
              onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys) },
              type: props.isMultiple ? "checkbox" : "radio"
            } : false}
          />
        ) : (
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
                title: props?.title || userType === 'account' ? "账户列表" : "用户列表"
              }}
              scroll={{ x: 'max-content' }}
              columns={columns}
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
        )
      }

    </>
  );
};


export default forwardRef(UserList) 