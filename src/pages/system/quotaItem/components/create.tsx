import { App, AppDict, Quota, QuotaItem, QuotaItemResourceType } from '@/generated/adminx/graphql';
import InputApp from '@/pages/app/components/inputApp';
import { createAppDictInfo, getAppDictInfo, updateAppDictInfo } from '@/services/adminx/dict';
import { createQuotaItem, getQuotaItemInfo, updateQuotaItem } from '@/services/adminx/quotaItem';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useLeavePrompt } from '@knockout-js/layout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ProFormData = {
  name: string;
  code: string;
  resourceType: QuotaItemResourceType;
  defaultLimit: number;
  unit: string;
  description: string;
  active: boolean;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string | null;
  onClose?: (isSuccess?: boolean, newInfo?: QuotaItem) => void;
}) => {
  const { t } = useTranslation(),
    [info, setInfo] = useState<QuotaItem>(),
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
        const result = await getQuotaItemInfo(props.id);
        if (result?.id) {
          setInfo(result as QuotaItem);
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
        ? await updateQuotaItem(props.id, updateFormat({
            name: values.name,
          code: values.code,
          resourceType: values.resourceType,
          defaultLimit: values.defaultLimit,
          unit: values.unit,
          description: values.description,
          active: values.active,
        }, info || {}))
        : await createQuotaItem({
          name: values.name,
          code: values.code,
          resourceType: values.resourceType,
          defaultLimit: values.defaultLimit,
          unit: values.unit,
          description: values.description,
          active: values.active,
        });
      if (result?.id) {
        setSaveDisabled(true);
        props.onClose?.(true, result as QuotaItem);
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
        disabled={!!props.id}
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
      <ProFormDigit
        name="defaultLimit"
        label={t('default_limit')}
        rules={[
          { required: true, message: `${t('please_enter_default_limit')}` },
        ]}
      />
      <ProFormText
        name="unit"
        label={t('unit')}
        rules={[
          { required: true, message: `${t('please_enter_unit')}` },
        ]}
      />
      <ProFormSelect
        name="resourceType"
        label={t('resource_type')}
        rules={[
          { required: true, message: `${t('please_select_resource_type')}` },
        ]}
        options={[
          { label: QuotaItemResourceType.Number, value: QuotaItemResourceType.Number },
          { label: QuotaItemResourceType.Network, value: QuotaItemResourceType.Network },
          { label: QuotaItemResourceType.Storage, value: QuotaItemResourceType.Storage },
        ]}
      />
      <ProFormTextArea
        name="description"
        label={t('description')}
        placeholder={`${t('please_enter_description')}`}
      />
    </DrawerForm>
  );
};
