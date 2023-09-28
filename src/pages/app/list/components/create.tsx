import { App, AppKind } from '@/generated/adminx/graphql';
import { createAppInfo, getAppInfo, updateAppInfo } from '@/services/adminx/app';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadAvatar, useLeavePrompt } from '@knockout-js/layout';

type ProFormData = {
  redirectURI?: string;
  scopes?: string;
  tokenValidity?: number;
  refreshTokenValidity?: number;
  logoFileID?: string;
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
    [checkLeave, setLeavePromptWhen] = useLeavePrompt(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
    onOpenChange = (open: boolean) => {
      if (!open) {
        if (checkLeave()) {
          props.onClose?.();
          setSaveDisabled(true);
        }
      } else {
        setSaveDisabled(true);
      }
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
          logoFileID: values.logoFileID,
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
          logoFileID: values.logoFileID,
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
        <ProFormText name="logoFileID" label="LOGO" >
          <UploadAvatar accept=".png,.jpeg,.jpg" directory="images" />
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
