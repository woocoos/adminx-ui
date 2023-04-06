import {
  PageContainer,
  ProTable,
  useToken,
} from "@ant-design/pro-components";
import { getAppList } from "@/services/graphql";
import defaultApp from "@/assets/images/default-app.png";
import { Button } from "antd";

export default () => {
  const { token } = useToken(),
    // align ,search,会导致   columns ts error提醒 先不管
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
        title: '状态', dataIndex: 'status', filters: true,
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
    getRequest = async (params, sort, filter) => {
      const table = { data: [] as any[], success: true, total: 0 };
      const result = await getAppList(params, filter, sort);
      if (result) {
        table.data = result.edges.map(item => {
          item.node.logo = item.node.logo || defaultApp
          return item.node
        })
        table.total = result.totalCount
      }
      return table
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
        rowKey={"id"}
        toolbar={{
          title: "应用列表"
        }}
        columns={columns}
        request={getRequest}
      />
    </PageContainer>
  );
};
