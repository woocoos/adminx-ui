import { history } from 'ice';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('你访问的页面不存在')}
      extra={
        <Button type="primary" onClick={() => history?.push('/dashboard')}>
          {t('返回')}
        </Button>
      }
    />
  );
};
