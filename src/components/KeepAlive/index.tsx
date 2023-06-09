import store from '@/store';
import { useLocation, useSearchParams } from '@ice/runtime';
import { ReactNode, useEffect } from 'react';
import KeepAlive, { useAliveController } from 'react-activation';

export default (props: {
  children: ReactNode,
  clearAlive?: Boolean
}) => {
  const [basisState] = store.useModel('basis'),
    [searchParams] = useSearchParams(),
    location = useLocation(),
    id = searchParams.get('id') || basisState.tenantId;
  const { dropScope, getCachingNodes } = useAliveController()
  let pathname = location.pathname

  useEffect(() => {
    if (props.clearAlive) {
      let cachingNodes = getCachingNodes() || []
      cachingNodes.forEach(item => {
        console.log(pathname + "  --  " + item.name)
        if (pathname != item.name) {
          item.name ? dropScope(item.name) : null
        }
      });
    }
  }, [])

  // 先关闭掉 等测试通过后开启
  return (<KeepAlive when={true} autoFreeze={false} cacheKey={btoa(pathname)} name={pathname} id={id}>
    {props.children}
  </KeepAlive>);
};
