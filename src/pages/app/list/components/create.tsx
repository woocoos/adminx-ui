import { App, AppKind } from '@/__generated__/knockout/graphql';
import { setLeavePromptWhen } from '@/components/LeavePrompt';
import UploadFiles from '@/components/UploadFiles';
import { createAppInfo, getAppInfo, updateAppInfo } from '@/services/knockout/app';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type ProFormData = {
  redirectURI?: string;
  scopes?: string;
  tokenValidity?: number;
  refreshTokenValidity?: number;
  logo?: string;
  name?: string;
  code?: string;
  kind?: AppKind;
  comments?: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string | null;
  scene?: 'conf';
  onClose?: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [appInfo, setAppInfo] = useState<App>(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  setLeavePromptWhen(saveDisabled);

  const
    onOpenChange = (open: boolean) => {
      if (!open) {
        props.onClose?.();
      }
      setSaveDisabled(true);
    },
    getRequest = async () => {
      setSaveLoading(false);
      setSaveDisabled(true);
      if (props.id) {
        const result = await getAppInfo(props.id);
        if (result?.id) {
          setAppInfo(result as App);
          return result;
        }
      }
      return {};
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      const result = props.id
        ? await updateAppInfo(props.id, updateFormat({
          kind: values.kind || AppKind.Native,
          name: values.name || '',
          redirectURI: values.redirectURI,
          scopes: values.scopes,
          tokenValidity: values.tokenValidity,
          refreshTokenValidity: values.refreshTokenValidity,
          logo: values.logo,
          comments: values.comments,
        }, appInfo || {}))
        : await createAppInfo({
          code: values.code || '',
          kind: values.kind || AppKind.Native,
          name: values.name || '',
          redirectURI: values.redirectURI,
          scopes: values.scopes,
          tokenValidity: values.tokenValidity,
          refreshTokenValidity: values.refreshTokenValidity,
          logo: values.logo,
          comments: values.comments,
        });
      if (result?.id) {
        setSaveDisabled(true);
        props.onClose?.(true);
      }
      setSaveLoading(false);
      return false;
    };

  return (
    <DrawerForm
      drawerProps={{
        width: 500,
        destroyOnClose: true,
      }}
      submitter={{
        searchConfig: {
          submitText: t('submit'),
          resetText: t('cancel'),
        },
        submitButtonProps: {
          loading: saveLoading,
          disabled: saveDisabled,
        },
      }}
      title={props.title}
      open={props?.open}
      onReset={getRequest}
      request={getRequest}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
    >
      <div x-if={props.scene == 'conf'}>
        <ProFormText
          name="redirectURI"
          label={t('cb_address')}
          rules={[
            { type: 'url', message: `${t('format_error')}` },
          ]}
        />
        <ProFormText name="scopes" label={t('scope_authority')} />
        <ProFormDigit name="tokenValidity" label={`token ${t('validity')}`} />
        <ProFormDigit name="refreshTokenValidity" label={`refresh_token ${t('validity')}`} />
      </div>
      <div x-else>
        <ProFormText name="logo" label="LOGO" >
          <UploadFiles />
        </ProFormText>
        <ProFormText
          name="name"
          label={t('name')}
          rules={[
            { required: true, message: `${t('please_enter_name')}` },
          ]}
        />
        <ProFormText
          name="code"
          label={t('code')}
          disabled={!!props.id}
          rules={[
            { required: true, message: `${t('please_enter_code')}` },
          ]}
        />
        <ProFormSelect
          name="kind"
          label={t('type')}
          options={[
            { value: AppKind.Web, label: AppKind.Web },
            { value: AppKind.Native, label: AppKind.Native },
            { value: AppKind.Server, label: AppKind.Server },
          ]}
          rules={[
            { required: true, message: `${t('please_enter_type')}` },
          ]}
        />
        <ProFormTextArea
          name="comments"
          label={t('description')}
          placeholder={`${t('please_enter_description')}`}
        />
      </div>
    </DrawerForm>
  );
};
