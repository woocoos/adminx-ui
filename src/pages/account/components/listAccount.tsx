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
import { Link, useAuth } from "ice";
import { EnumUserStatus, User, UserType, delUserInfo, getUserList, resetUserPasswordByEmail } from "@/services/user";
import AccountCreate from "./create";
import { getOrgRoleUserList, getOrgUserList, removeOrgUser } from "@/services/org/user";
import { OrgRole, revokeOrgRoleUser } from "@/services/org/role";
import DrawerUser from "@/pages/account/components/drawerUser";
import { useTranslation } from "react-i18next";
import { Org } from "@/services/org";
import DrawerRole from "@/pages/org/components/drawerRole";
import DrawerRolePolicy from "@/pages/org/components/drawerRolePolicy";
import Auth, { checkAuth } from "@/components/Auth";
import { ItemType } from "antd/es/menu/hooks/useItems";
import store from "@/store";

type UserListProps = {
  title?: string
  orgId?: string
  orgRole?: OrgRole
  orgInfo?: Org
  scene?: 'user' | 'orgUser' | 'modal' | "roleUser",
  userType?: UserType
  isMultiple?: boolean,
  ref?: MutableRefObject<UserListRef>
}

export type UserListRef = {
  getSelect: () => User[]
  reload: (resetPageIndex?: boolean) => void
}

const UserList = (props: UserListProps, ref: MutableRefObject<UserListRef>) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [auth] = useAuth(),
    [basisState] = store.useModel("basis"),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    [dataSource, setDataSource] = useState<User[]>([]),
    columns: ProColumns<User>[] = [
      // 有需要排序配置  sorter: true 
      {
        title: t("principal name"), dataIndex: 'principalName', width: 90, search: {
          transform: (value) => ({ principalNameContains: value || undefined })
        }
      },
      {
        title: t('display name'), dataIndex: 'displayName', width: 120, search: {
          transform: (value) => ({ displayNameContains: value || undefined })
        }
      },
      {
        title: t('email'), dataIndex: 'email', width: 120, search: {
          transform: (value) => ({ emailContains: value || undefined })
        }
      },
      {
        title: t('mobile'), dataIndex: 'mobile', width: 160, search: {
          transform: (value) => ({ mobileContains: value || undefined })
        }
      },
      {
        title: t('status'), dataIndex: 'status', filters: true, search: false, width: 100,
        valueEnum: EnumUserStatus,
      },
      { title: t('created at'), dataIndex: 'createdAt', width: 160, valueType: "dateTime", sorter: true },

    ],
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean
      title: string
      data?: User
      scene: "add" | "create" | "addGroup" | "addPermission" | ''
    }>({
      open: false,
      title: "",
      scene: "",
    })

  if (props?.scene !== 'modal') {
    columns.push(
      {
        title: t('operation'), dataIndex: 'actions', fixed: 'right',
        align: 'center', search: false, width: 100,
        render: (text, record) => {
          const items: ItemType[] = []

          if (props.scene === 'orgUser' && props.orgInfo?.kind === 'root') {
            if (checkAuth('assignRoleUser', auth)) {
              items.push(
                {
                  key: "addGroup", label: <a onClick={() => {
                    setModal({ open: true, data: record, title: t("add {{field}}", { field: t('user group') }), scene: "addGroup" })
                  }}>
                    {t("add {{field}}", { field: t('user group') })}
                  </a>
                }
              )
            }
            if (checkAuth('grant', auth)) {
              items.push(
                {
                  key: "addPermission", label: <a onClick={() => {
                    setModal({ open: true, data: record, title: t("add {{field}}", { field: t('permission') }), scene: "addPermission" })
                  }}>
                    {t("add {{field}}", { field: t('permission') })}
                  </a>
                }
              )
            }
          }

          if (checkAuth('resetUserPasswordByEmail', auth)) {
            items.push(
              { key: "resetPwd", label: <a onClick={() => onResetPwd(record)}>{t('reset password')}</a> }
            )
          }
          if (props.scene === 'orgUser') {
            if (props.orgInfo?.kind === 'org' || record.userType === 'member') {
              if (checkAuth('removeOrganizationUser', auth)) {
                items.push(
                  { key: "delete", label: <a onClick={() => onRemoveOrg(record)}>{t('remove')}</a> }
                )
              }
            }
          } else {
            if (checkAuth('deleteUser', auth)) {
              items.push(
                { key: "delete", label: <a onClick={() => onDelApp(record)}>{t('delete')}</a> }
              )
            }
          }
          return props.scene === "roleUser" ? <Space>
            <Auth authKey="revokeRoleUser">
              {record.isAllowRevokeRole ? <a onClick={() => onRemoveRole(record)}>{t("remove")}</a> : ''}
            </Auth>
          </Space> : props.scene === 'orgUser' ? <Space>
            <Link key="editor" to={`/account/viewer?id=${record.id}`}>
              {t('detail')}
            </Link>
            {
              items.length ? <Dropdown trigger={['click']} menu={{
                items
              }} >
                <a><EllipsisOutlined /></a>
              </Dropdown> : ''
            }

          </Space> : <Space>
            <Link key="editor" to={`/account/viewer?id=${record.id}`}>
              {t('detail')}
            </Link>
            {
              items.length ? <Dropdown trigger={['click']} menu={{
                items
              }} >
                <a><EllipsisOutlined /></a>
              </Dropdown> : ''
            }

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
      if (props.orgRole) {
        result = await getOrgRoleUserList(props.orgRole.id, params, filter, sort, {
          orgRoleId: props.orgRole.id
        })
      } else if (props.orgId) {
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
        title: `${t('reset password')} ${record.displayName}`,
        content: <>
          <div>{t("After the password is reset, an email will be sent to the customer's email address")}</div>
          <div>{t("The login password must be reset after the user logs in to the system")}</div>
        </>,
        onOk: async (close) => {
          const result = await resetUserPasswordByEmail(record.id)
          if (result) {
            message.success(t('submit success'))
            close();
          }
        }
      })
    },
    onDelApp = (record: User) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t("confirm delete")}：${record.displayName} ?`,
        onOk: async (close) => {
          const result = await delUserInfo(record.id)
          if (result) {
            proTableRef.current?.reload();
            message.success(t('submit success'))
            close();
          }
        }
      })
    },
    onRemoveOrg = (record: User) => {
      Modal.confirm({
        title: t('remove'),
        content: `${t('confirm remove')}：${record.displayName} ?`,
        onOk: async (close) => {
          if (props?.orgId) {
            const result = props.orgInfo?.kind === 'root' ? await delUserInfo(record.id) : await removeOrgUser(props.orgId, record.id)
            if (result) {
              proTableRef.current?.reload();
              message.success(t('submit success'))
              close();
            }
          }
        }
      })
    },
    onRemoveRole = (record: User) => {
      Modal.confirm({
        title: t('remove'),
        content: `${t('confirm remove')}：${record.displayName}`,
        onOk: async (close) => {
          if (props.orgRole) {
            const result = await revokeOrgRoleUser(props.orgRole.id, record.id)
            if (result) {
              proTableRef.current?.reload();
              message.success(t('submit success'))
              close();
            }
          }
        }
      })
    }

  useImperativeHandle(ref, () => {
    return {
      getSelect: () => {
        return dataSource.filter(item => selectedRowKeys.includes(item.id))
      },
      reload: (resetPageIndex?: boolean) => {
        proTableRef.current?.reload(resetPageIndex);
      }
    }
  })

  useEffect(() => {
    proTableRef.current?.reload(true);
  }, [props?.orgId])

  return (
    <>
      {
        ["modal", "orgUser", "roleUser"].includes(props?.scene || '') ? (
          <ProTable
            actionRef={proTableRef}
            search={{
              searchText: `${t('query')}`,
              resetText: `${t('reset')}`,
              labelWidth: 'auto',
            }}
            rowKey={"id"}
            toolbar={{
              title: props.title || t("{{field}} list", { field: t(props.userType || '') }),
              actions: props.scene === "roleUser" ? [
                <Auth authKey="assignRoleUser">
                  <Button type="primary" onClick={() => {
                    setModal({ open: true, title: t('add {{field}}', { field: t('member') }), scene: "add" })
                  }}>
                    {t('add {{field}}', { field: t('member') })}
                  </Button>
                </Auth>
              ] : props.scene === "orgUser" ? [
                props.orgInfo?.kind === 'root' ?
                  <Auth authKey="createOrganizationUser">
                    <Button type="primary" onClick={() => {
                      setModal({ open: true, title: t('create {{field}}', { field: t('user') }), scene: "create" })
                    }}>
                      {t('create {{field}}', { field: t('user') })}
                    </Button>
                  </Auth> : '',
                props.orgInfo?.kind === 'org' ? <Auth authKey="allotOrganizationUser">
                  <Button type="primary" onClick={() => {
                    setModal({ open: true, title: t('add {{field}}', { field: t('user') }), scene: "add" })
                  }}>
                    {t('add {{field}}', { field: t('user') })}
                  </Button>
                </Auth> : ''
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
              title: t('{{field}} management', { field: t(props.userType || '') }),
              style: { background: token.colorBgContainer },
              breadcrumb: {
                items: [
                  { title: t('System configuration'), },
                  { title: t('{{field}} management', { field: t(props.userType || '') }), },
                ],
              },
            }}
          >
            <ProTable
              actionRef={proTableRef}
              search={{
                searchText: `${t('query')}`,
                resetText: `${t('reset')}`,
                labelWidth: 'auto',
              }}
              rowKey={"id"}
              toolbar={{
                title: props?.title || t("{{field}} list", { field: t(props.userType || '') }),
                actions: [
                  <Auth authKey="createOrganizationAccount">
                    <Button type="primary" onClick={() => {
                      setModal({ open: true, title: t('create {{field}}', { field: t(props.userType || '') }), scene: "create" })
                    }}>
                      {t('create {{field}}', { field: t(props.userType || '') })}
                    </Button>
                  </Auth>
                ]
              }}
              scroll={{ x: 'max-content' }}
              columns={columns}
              request={getRequest}
              pagination={{ showSizeChanger: true }}
            />
          </PageContainer>
        )
      }
      {modal.scene === "create" ?
        // 创建用户
        <AccountCreate
          open={modal.open}
          title={modal.title}
          orgId={props.orgId}
          userType={props.userType || "member"}
          scene="create"
          onClose={(isSuccess) => {
            if (isSuccess) {
              proTableRef.current?.reload();
            }
            setModal({ open: false, title: '', scene: modal.scene })
          }}
        /> : ''}

      {
        // 添加用户
        modal.scene === "add" && props.orgId && modal.open ?
          <DrawerUser
            open={modal.open}
            title={modal.title}
            orgId={basisState.tenantId}
            orgRole={props.orgRole}
            orgInfo={props.orgInfo}
            userType={props.userType}
            onClose={(isSuccess) => {
              if (isSuccess) {
                proTableRef.current?.reload();
              }
              setModal({ open: false, title: '', scene: modal.scene });
            }}
          />
          : ''
      }
      {
        modal.scene === "addGroup" && props.orgId && modal.open ?
          <DrawerRole
            title={modal.title}
            open={modal.open}
            orgId={props.orgId}
            kind={"group"}
            userInfo={modal.data}
            onClose={(isSuccess) => {
              if (isSuccess) {
                proTableRef.current?.reload();
              }
              setModal({ open: false, title: '', scene: modal.scene });
            }}
          /> : ''
      }
      {
        modal.scene === "addPermission" && props.orgId && modal.open ?
          <DrawerRolePolicy
            orgId={props.orgId}
            userInfo={modal.data}
            open={modal.open}
            title={modal.title}
            onClose={(isSuccess) => {
              if (isSuccess) {
                proTableRef.current?.reload();
              }
              setModal({ open: false, title: '', scene: modal.scene });
            }} /> : ''
      }
    </>
  );
};


export default forwardRef(UserList) 