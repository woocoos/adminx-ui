import { history } from 'ice';
import { Button, Result } from 'antd';
import React from 'react';
import { useTranslation } from "react-i18next";



export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t("你访问的页面不存在")}
      extra={
        <Button type="primary" onClick={() => history?.push('/dashboard')}>
          {t("返回")}
        </Button>
      }
    />
  );
} 
