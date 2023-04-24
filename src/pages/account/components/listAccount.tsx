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
import { TableParams, TableSort, TableFilter, List } from "@/services/graphql";
import { Link } from "ice";
import { EnumUserStatus, User, UserType, delUserInfo, getUserList, resetUserPasswordByEmail } from "@/services/user";
import AccountCreate from "./create";
import { allotOrgUser, getOrgRoleUserList, getOrgUserList, removeOrgUser } from "@/services/org/user";
import { assignOrgRoleUser, revokeOrgRoleUser } from "@/services/org/role";
import ModalAccount from "@/pages/account/components/modalAccount";
import { getDate } from "@/util";

type UserListProps = {
  title?: string
  orgId?: string
  roleId?: string
  scene?: 'user' | 'orgUser' | 'modal' | "roleUser",
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
    [modal, setModal] = useState<{
      open: boolean
      title: string
      scene: "add" | "create" | ""
    }>({
      open: false,
      title: "",
      scene: "",
    })

  if (props?.scene !== 'modal') {
    columns.push(
      {
        title: '操作', dataIndex: 'actions', fixed: 'right',
        align: 'center', search: false, width: 120,
        render: (text, record) => {
          return <Space>
            <Link key="editor" to={`/account/viewer?id=${record.id}`}>
              详情
            </Link>
            <Dropdown trigger={['click']} menu={{
              items: props?.scene === 'orgUser' ? [
                { key: "resetPwd", label: <a onClick={() => onResetPwd(record)}>重置密码</a> },
                { key: "delete", label: <a onClick={() => onRemoveOrg(record)}>移除</a> },
              ] : props.scene === "roleUser" ? [
                { key: "resetPwd", label: <a onClick={() => onResetPwd(record)}>重置密码</a> },
                { key: "delete", label: <a onClick={() => onRemoveRole(record)}>移除</a> },
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
      let result: List<User> | null
      params['userType'] = props.userType
      if (props?.roleId) {
        result = await getOrgRoleUserList(props.roleId, params, filter, sort)
      } else if (props?.orgId) {
        result = await getOrgUserList(props.orgId, params, filter, sort)
      } else {
        result = await getUserList(params, filter, sort);
      }

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
        title: "移除",
        content: `是否移除用户：${record.displayName}`,
        onOk: async (close) => {
          if (props?.orgId) {
            const result = await removeOrgUser(props.orgId, record.id)
            if (result) {
              proTableRef.current?.reload();
              close();
            }
          }
        }
      })
    },
    onRemoveRole = (record: User) => {
      Modal.confirm({
        title: "移除",
        content: `是否移除用户：${record.displayName}`,
        onOk: async (close) => {
          if (props?.roleId) {
            const result = await revokeOrgRoleUser(props.roleId, record.id)
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
      setModal({ open: false, title: '创建账户', scene: "create" })
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
        ["modal", "orgUser", "roleUser"].includes(props?.scene || '') ? (
          <ProTable
            actionRef={proTableRef}
            rowKey={"id"}
            toolbar={{
              title: props.title || (props.userType === 'account' ? "账户列表" : "用户列表"),
              actions: props.scene === "roleUser" ? [
                <Button type="primary" onClick={() => {
                  setModal({ open: true, title: '添加成员', scene: "add" })
                }}>添加成员</Button>
              ] : props.scene === "orgUser" ? [
                <Button type="primary" onClick={() => {
                  setModal({ open: true, title: '创建用户', scene: "create" })
                }}>创建用户</Button>,
                <Button type="primary" onClick={() => {
                  setModal({ open: true, title: '添加用户', scene: "add" })
                }}>添加用户</Button>
              ] : []
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
                  setModal({ open: true, title: '创建', scene: "create" })
                }} >
                  创建
                </Button>
              ]
            }}
          >
            <ProTable
              actionRef={proTableRef}
              rowKey={"id"}
              toolbar={{
                title: props?.title || (props.userType === 'account' ? "账户列表" : "用户列表")
              }}
              scroll={{ x: 'max-content' }}
              columns={columns}
              request={getRequest}
              pagination={{ showSizeChanger: true }}
            />
          </PageContainer>
        )
      }
      {
        // 创建用户
        ['orgUser', 'user'].includes(props.scene || '') && modal.scene === "create" ? <>
          <AccountCreate
            open={modal.open}
            title={modal.title}
            orgId={props.orgId}
            userType={props.userType || "member"}
            scene="create"
            onClose={onDrawerClose} />
        </> : ''
      }
      {
        // 添加用户
        ['roleUser', 'orgUser'].includes(props.scene || '') && modal.scene === "add" ? <>
          <ModalAccount
            open={modal.open}
            title={modal.title}
            userType={props.userType}
            onClose={async (selectData) => {
              const sdata = selectData?.[0]
              if (sdata) {
                let result: boolean | null = null;
                if (props.scene === 'roleUser' && props.roleId) {
                  result = await assignOrgRoleUser({
                    orgRoleID: props.roleId,
                    userID: sdata.id
                  })
                } else if (props.scene === 'orgUser' && props.orgId) {
                  result = await allotOrgUser({
                    joinedAt: getDate(Date.now(), 'YYYY-MM-DDTHH:mm:ssZ') as string,
                    displayName: sdata.displayName,
                    orgID: props.orgId,
                    userID: sdata.id,
                  })
                }
                if (result) {
                  proTableRef.current?.reload();
                }
              }
              setModal({ open: false, title: '', scene: modal.scene })
            }} />
        </> : ''
      }
    </>
  );
};


export default forwardRef(UserList) 