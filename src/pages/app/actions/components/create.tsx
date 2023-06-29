import { AppAction, AppActionKind, AppActionMethod, UpdateAppActionInput } from '@/__generated__/adminx/graphql';
import { setLeavePromptWhen } from '@/components/LeavePrompt';
import { EnumAppActionKind, EnumAppActionMethod, createAppAction, getAppActionInfo, updateAppAction } from '@/services/adminx/app/action';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type ProFormData = {
  name: string;
  kind: AppActionKind;
  method: AppActionMethod;
  comments?: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string;
  appId?: string;
  onClose?: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [appActionInfo, setAppActionInfo] = useState<AppAction>(),
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
        const result = await getAppActionInfo(props.id);
        if (result?.id) {
          setAppActionInfo(result);
          return result;
        }
      }
      return {};
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      let isTrue = false;
      setSaveLoading(true);
      if (props.id) {
        const result = await updateAppAction(props.id, updateFormat<UpdateAppActionInput>({
          comments: values.comments,
          kind: values.kind,
          method: values.method,
          name: values.name,
        }, appActionInfo || {}));
        if (result?.id) {
          isTrue = true;
        }
      } else {
        if (props.appId) {
          const result = await createAppAction(props.appId, {
            appID: props.appId,
            comments: values.comments,
            kind: values.kind,
            method: values.method,
            name: values.name,
          });
          if (result?.[0]?.id) {
            isTrue = true;
          }
        }
      }
      if (isTrue) {
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
      <ProFormText
        name="name"
        label={t('name')}
        rules={[
          { required: true, message: `${t('please_enter_name')}}` },
        ]}
      />
      <ProFormSelect
        name="kind"
        label={t('type')}
        valueEnum={EnumAppActionKind}
        rules={[
          { required: true, message: `${t('please_enter_type')}` },
        ]}
      />
      <ProFormSelect
        name="method"
        label={t('method')}
        valueEnum={EnumAppActionMethod}
        rules={[
          { required: true, message: `${t('please_enter_method')}` },
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
