import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './locales/en-US';
import zhCN from './locales/zh-CN';
import { LocaleType } from '@knockout-js/layout';

// 多语言文件
const resources = {
  [LocaleType.enUS]: enUS,
  [LocaleType.zhCN]: zhCN,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: LocaleType.zhCN,
    // 后端会使用到:输出文案因此修改约定解析
    nsSeparator: '::',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
