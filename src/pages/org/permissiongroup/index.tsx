import store from '@/store';
import { useSearchParams } from '@ice/runtime';
import { definePageConfig } from 'ice';
import {useEffect, useState} from 'react';
import { getAppPolicyView } from '@/services/adminx/app/policy';

export default (props: {
  isFromSystem?: boolean;
}) => {
  // 外部设置state
  const [userState] = store.useModel('user'),
    [searchParams] = useSearchParams();

  const [data, setData] = useState<{
    dataList: any[];
  }>({
    dataList: [],
  });
  const getRequest = async () => {
    const dataList = await getAppPolicyView('deo.backend');
    setData({
      dataList: dataList,
    });
    alert(JSON.stringify(dataList));
  };

  useEffect(() => {
    getRequest();
  }, []);

  const GroupView = (props: {
    title?: string;
  }) => {
    let dataList = [{
      id: 1,
      name: '组1',
      parentId: 0,
      childList: [
        {
          id: 2,
          name: '组1+2',
          parentId: 1,
          childList: [
            {
              id: 4,
              name: '组1+2+4',
              parentId: 2,
            },
            {
              id: 5,
              name: '组1+2+5',
              parentId: 2,
            },
          ],
        },
        {
          id: 3,
          name: '组1+3',
          parentId: 1,
          childList: [
            {
              id: 6,
              name: '组1+3+6',
              parentId: 3,
            },
            {
              id: 7,
              name: '组1+3+7',
              parentId: 7,
            },
          ],
        },
      ],
    },
      {
        id: 1,
        name: '组1+1',
        parentId: 0,
        childList: [
          {
            id: 2,
            name: '组1+2+1',
            parentId: 1,
            childList: [
              {
                id: 4,
                name: '组1+2+4+1',
                parentId: 2,
              },
              {
                id: 5,
                name: '组1+2+5+1',
                parentId: 2,
              },
            ],
          },
          {
            id: 3,
            name: '组1+3+1',
            parentId: 1,
            childList: [
              {
                id: 6,
                name: '组+3+6+1',
                parentId: 3,
              },
              {
                id: 7,
                name: '组+3+7+1',
                parentId: 7,
              },
            ],
          },
        ],
      }];
    // setData({
    //   dataList: dataList,
    // });
    // const updateCheck = (item: {
    //   id: number;
    //   checked: boolean;
    // })=> {
    //   // 通过id，找到
    // };
    const checkFlexDirection = (item: {
      childList: any;
    }) => {
      // 如果下级的其中一个存在下级，则需要处理成列展示
      if (item.childList && item.childList.length > 0 && item.childList[0].childList && item.childList[0].childList.length > 0) {
        return 'column';
      }
      return 'row';
    };
    const checkBorder = (item: {
      childList: any;
    }) => {
      // 如果下级的其中一个存在下级，则需要处理成列展示
      if (item.childList && item.childList.length > 0) {
        return '1px solid #ccc';
      }
      return '';
    };

    const ItemView = (props: {
      item: {
        name: string;
        childList: any;
      };
    }) => {
      return (
        <div className="parent">
          <div style={{ display: 'flex', flexDirection: 'row', border: checkBorder(props.item) }}>
            <div>
              <span>{props.item.name}</span>
              <input type={'checkbox'} />
            </div>
            <div style={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: checkFlexDirection(props.item),
              border: checkBorder(props.item),
            }}
            >
              {
                (props.item.childList || []).map(child => {
                  return <ItemView item={child} />;
                })
              }
            </div>
          </div>
        </div>
      );
    };
    return (
      <>
        {
          dataList.map(item => {
            return (<ItemView item={item} />);
          })
        }
      </>
    );
  };
  return (
    <GroupView />
  );
};


export const pageConfig = definePageConfig(() => ({
  auth: ['/org/permissiongroup'],
}));
