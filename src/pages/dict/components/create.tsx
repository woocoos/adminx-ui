import { App, AppDict } from '@/generated/adminx/graphql';
import InputApp from '@/pages/app/components/inputApp';
import { createAppDictInfo, getAppDictInfo, updateAppDictInfo } from '@/services/adminx/dict';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useLeavePrompt } from '@knockout-js/layout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ProFormData = {
  app?: App;
  name: string;
  code: string;
  comments?: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string | null;
  onClose?: (isSuccess?: boolean, newInfo?: AppDict) => void;
}) => {
  const { t } = useTranslation(),
    [info, setInfo] = useState<AppDict>(),
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
        const result = await getAppDictInfo(props.id);
        if (result?.id) {
          setInfo(result as AppDict);
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
        ? await updateAppDictInfo(props.id, updateFormat({
          code: values.code,
          name: values.name,
          comments: values.comments,
        }, info || {}))
        : await createAppDictInfo(values.app?.id ?? '', {
          code: values.code,
          name: values.name,
          comments: values.comments,
        });
      if (result?.id) {
        setSaveDisabled(true);
        props.onClose?.(true, result as AppDict);
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
      <ProFormText
        name="app"
        label={t('app')}
        disabled={!!props.id}
        rules={[
          { required: true, message: `${t('please_enter_app')}` },
        ]}
      >
        <InputApp />
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
      <ProFormTextArea
        name="comments"
        label={t('description')}
        placeholder={`${t('please_enter_description')}`}
      />
    </DrawerForm>
  );
};
