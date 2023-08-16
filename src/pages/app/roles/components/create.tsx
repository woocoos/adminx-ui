import { AppRole } from '@/generated/adminx/graphql';
import { createAppRole, getAppRoleInfo, updateAppRole } from '@/services/adminx/app/role';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';

type ProFormData = {
  name: string;
  autoGrant: boolean;
  editable: boolean;
  comments: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string;
  appId?: string;
  onClose?: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [appRoleInfo, setAppRoleInfo] = useState<AppRole>(),
    [, setLeavePromptWhen] = useLeavePrompt(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

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
        const info = await getAppRoleInfo(props.id);
        if (info?.id) {
          setAppRoleInfo(info as AppRole);
          return info;
        }
      }
      return {
        autoGrant: true,
        editable: true,
      };
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      let isTrue = false;
      if (props.id) {
        const result = await updateAppRole(props.id, updateFormat({
          autoGrant: values.autoGrant,
          comments: values.comments,
          editable: values.editable,
          name: values.name,
        }, appRoleInfo || {}));
        if (result?.id) {
          isTrue = true;
        }
      } else {
        if (props?.appId) {
          const result = await createAppRole(props.appId, {
            appID: props.appId,
            autoGrant: values.autoGrant,
            comments: values.comments,
            editable: values.editable,
            name: values.name,
          });
          if (result?.id) {
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
          { required: true, message: `${t('please_enter_name')}` },
        ]}
      />
      <ProFormRadio.Group
        name="autoGrant"
        label={t('auto_authorization')}
        options={[
          { label: t('yes'), value: true },
          { label: t('no'), value: false },
        ]}
      />
      <ProFormRadio.Group
        name="editable"
        label={t('post_auth_editing')}
        options={[
          { label: t('yes'), value: true },
          { label: t('no'), value: false },
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
