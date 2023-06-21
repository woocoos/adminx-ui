import store from '@/store';
import { useLocation, useSearchParams } from '@ice/runtime';
import { ReactNode, useEffect } from 'react';
import KeepAlive, { useAliveController } from 'react-activation';

export default (props: {
  children: ReactNode;
  clearAlive?: boolean;
}) => {
  const [basisState] = store.useModel('basis'),
    [searchParams] = useSearchParams(),
    location = useLocation(),
    id = searchParams.get('id') || basisState.tenantId,
    cacheKey = btoa(location.pathname),
    { dropScope, getCachingNodes } = useAliveController();

  useEffect(() => {
    if (props.clearAlive) {
      getCachingNodes().forEach(item => {
        if (item.name && cacheKey != item.name) {
          dropScope(item.name);
        }
      });
    }
  }, [props.clearAlive]);

  // 先关闭掉 等测试通过后开启
  return (<KeepAlive when autoFreeze={false} cacheKey={cacheKey} name={cacheKey} id={id}>
    {props.children}
  </KeepAlive>);
};
