import {
  ActionType,
  PageContainer,
  ProTable,
  useToken,
} from "@ant-design/pro-components";
import { getAppList } from "@/services/app";
import defaultApp from "@/assets/images/default-app.png";
import { Button } from "antd";
import GqlPaging from "@/components/GqlPaging";
import { useRef, useState } from "react";
import { ListPageInfo, PagingParams, TableSort } from "@/services/graphql";


export default () => {
  const { token } = useToken(),
    proTableRef = useRef<ActionType>(),
    [total, setTotal] = useState<number>(),
    [pageInfo, setPageInfo] = useState<ListPageInfo>(),
    [paging, setPaging] = useState<PagingParams>(),
    // 有需要排序配置  sorter: true 
    columns = [
      { title: 'LOGO', dataIndex: 'logo', valueType: "image", search: false },
      { title: '名称', dataIndex: 'name', },
      { title: '编码', dataIndex: 'code', },
      {
        title: '类型', dataIndex: 'kind',
        filters: true,
        search: false,
        valueEnum: {
          "web": { text: 'web', },
          "native": { text: 'native', },
          "server": { text: 'server', },
        },
      },
      { title: '描述', dataIndex: 'comments', ellipsis: true, search: false },
      {
        title: '状态', dataIndex: 'status', filters: true, search: false,
        valueEnum: {
          active: { text: "活跃", status: 'success' },
          inactive: { text: "失活", status: 'default' },
          processing: { text: "处理中", status: 'warning' }
        },
      },
      {
        title: '操作', dataIndex: 'actions', flixed: 'right', align: 'center', search: false,
        render: (text, record) => {
          return [
            <Button key="editor" type="link" size="small">
              编辑
            </Button>,
            <Button key="permission" type="link" size="small">
              权限
            </Button>,
          ]
        }
      },
    ];

  const
    getRequest = async (params, sort: TableSort, filter) => {
      const table = { data: [] as any[], success: true, total: 0 };
      const result = await getAppList(params, filter, sort, paging);
      if (result) {
        table.data = result.edges.map(item => {
          item.node.logo = item.node.logo || defaultApp
          return item.node
        })
        table.total = result.totalCount
        setPageInfo(result.pageInfo)
        setTotal(result.totalCount)
      } else {
        setPageInfo(undefined)
        setTotal(0)
      }
      return table
    }, onPaging = (paging: PagingParams) => {
      setPaging(paging)
      proTableRef.current?.reload();
    }


  return (
    <PageContainer
      header={{
        title: "应用管理",
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            {
              path: "",
              title: "系统配置",
            },
            {
              path: "",
              title: "应用管理",
            },
          ],
        },
        extra: [
          <Button key="create" type="primary" >
            创建应用
          </Button>
        ]
      }}
    >
      <ProTable
        actionRef={proTableRef}
        rowKey={"id"}
        toolbar={{
          title: "应用列表"
        }}
        columns={columns}
        request={getRequest}
        pagination={false}
      />
      <GqlPaging
        style={{ background: token.colorBgContainer }}
        pageInfo={pageInfo}
        total={total}
        onChange={onPaging} />
    </PageContainer>
  );
};
