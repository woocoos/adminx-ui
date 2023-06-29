import { PageContainer, ProCard, useToken } from '@ant-design/pro-components';
import { Tree, Input, Button, Row, Col, message } from 'antd';
import { useEffect, useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { UserList } from '@/pages/account/components/listAccount';
import { formatTreeData, getTreeDropData } from '@/util';
import { getOrgPathList, moveOrg } from '@/services/adminx/org';
import store from '@/store';
import { useTranslation } from 'react-i18next';
import { TreeDataState } from '@/services/graphql';
import KeepAlive from '@/components/KeepAlive';
import styles from './index.module.css';
import Auth from '@/components/Auth';
import { Org, OrgKind } from '@/__generated__/adminx/graphql';
import { Link } from '@ice/runtime';

export const PageOrgUsers = (props: {
  orgId: string;
  isFromSystem?: boolean;
}) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [basisState] = store.useModel('basis'),
    [treeDraggable, setTreeDraggable] = useState(false),
    [stretch, setStretch] = useState(false),
    [loading, setLoading] = useState(false),
    [allOrgList, setAllOrgList] = useState<Org[]>([]),
    [treeData, setTreeData] = useState<TreeDataState<Org>[]>([]),
    [selectedData, setSelectedData] = useState<Org>();

  const
    getRequest = async () => {
      setLoading(true);
      const orgList = await getOrgPathList(props.orgId, OrgKind.Org),
        topData = orgList[0];
      if (topData?.id) {
        setSelectedData(topData);
      } else {
        setSelectedData(undefined);
      }

      setAllOrgList(orgList);
      setTreeData(
        formatTreeData(
          orgList.map(item => ({
            key: item.id,
            title: item.name,
            parentId: item.parentID,
            node: item,
          })),
          undefined,
          undefined,
          topData?.parentID || 0,
        ),
      );

      setStretch(orgList.length <= 1);
      setLoading(false);
    },
    onSearch = (keyword: string) => {
      const orgInfo = allOrgList.find(item => item.name.indexOf(keyword) > -1);
      if (orgInfo) {
        setSelectedData(orgInfo);
      }
    },
    onTreeSelect = (_selectedKeys, { node }) => {
      setSelectedData(node.node);
    },
    onTreeDrop = async (dragInfo) => {
      const { sourceId, targetId, action } = getTreeDropData(treeData, dragInfo);
      const targetData = allOrgList.find(item => item.id == targetId);
      if (targetData?.parentID == '0' && ['up', 'down'].includes(action)) {
        message.warning(t('unable_move_root_node'));
      } else {
        // 传给后端数据效果
        const result = await moveOrg(sourceId, targetId, action);
        if (result) {
          await getRequest();
          // 前端拖拽效果
          // setTreeData(newTreeData)
        }
      }
    },
    proCardtitle = () => {
      if (selectedData) {
        return `${selectedData.name}-${t('user_list')}`;
      }
      return `${t('user_list')}`;
    };

  useEffect(() => {
    getRequest();
  }, [props.orgId]);

  token;
  return (
    <PageContainer
      className={styles.users}
      header={{
        title: t('user_manage'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: props.isFromSystem ? [
            { title: t('system_conf') },
            { title: <Link to={'/system/org'}>{t('org_manage')}</Link> },
            { title: t('user_manage') },
          ] : [
            { title: t('org_cooperation') },
            { title: t('user_manage') },
          ],
        },
      }}
      loading={loading}
    >
      <Row gutter={16} wrap={false}>
        <Col flex="280px" x-if={!stretch}>
          <div style={{ background: token.colorBgContainer, height: '100%' }}>
            <ProCard colSpan="280px">
              <Row wrap={false}>
                <Col flex="auto">
                  <Input.Search style={{ width: '100%' }} placeholder={`${t('search_keyword')}`} onSearch={onSearch} />
                </Col>
                <Col >
                  <Auth authKey="moveOrganization">
                    <Button
                      type="text"
                      onClick={() => {
                        setTreeDraggable(!treeDraggable);
                      }}
                    >{treeDraggable ? t('cancel') : t('drag')}</Button>
                  </Auth>
                </Col>
              </Row>
              <br />
              <Tree
                draggable={treeDraggable ? { icon: false, nodeDraggable: () => true } : false}
                treeData={treeData}
                onSelect={onTreeSelect}
                onDrop={onTreeDrop}
                selectedKeys={selectedData ? [selectedData.id] : []}
                defaultExpandAll
              />
            </ProCard>
          </div>
        </Col>
        <Col flex="auto">
          <div x-if={allOrgList.length > 1} className={`stretch ${basisState.darkMode ? 'dark' : ''}`} onClick={() => { setStretch(!stretch); }}>
            {stretch ? <RightOutlined /> : <LeftOutlined />}
          </div>
          <UserList
            x-if={selectedData}
            title={proCardtitle()}
            scene="orgUser"
            orgInfo={selectedData}
            orgId={selectedData?.id}
            isFromSystem={props.isFromSystem}
          />
        </Col>
      </Row>
    </PageContainer>

  );
};


export default () => {
  const [basisState] = store.useModel('basis');

  return (<KeepAlive clearAlive>
    <PageOrgUsers orgId={basisState.tenantId} />
  </KeepAlive>
  );
};
