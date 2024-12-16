import { Quota, QuotaItemResourceType } from '@/generated/adminx/graphql';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useLeavePrompt } from '@knockout-js/layout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createQuota, getQuotaInfo, updateQuota } from '@/services/adminx/quotaItem/quota';

type ProFormData = {
  tenantId: number;
  userId: number;
  limit: number;
  used: number;
  startAt: string;
  endAt: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string | null;
  onClose?: (isSuccess?: boolean, newInfo?: Quota) => void;
}) => {
  const {t} = useTranslation(),
    [info, setInfo] = useState<Quota>(),
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
        const result = await getQuotaInfo(props.id);
        if (result?.id) {
          setInfo(result as Quota);
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
        ? await updateQuota(props.id, updateFormat({
          tenantId: values.tenantId,
          userId: values.userId,
          limit: values.limit,
          used: values.used,
          startAt: values.startAt,
          endAt: values.endAt,
        }, info || {}))
        : await createQuota({
          tenantId: values.tenantId,
          userId: values.userId,
          limit: values.limit,
          used: values.used,
          startAt: values.startAt,
          endAt: values.endAt,
        });
      if (result?.id) {
        setSaveDisabled(true);
        props.onClose?.(true, result as Quota);
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
          {required: true, message: `${t('please_enter_name')}`},
        ]}
      />

      <ProFormText
        name="code"
        label={t('code')}
        disabled={!!props.id}
        rules={[
          {required: true, message: `${t('please_enter_code')}`},
        ]}
      />
      <ProFormDigit
        name="defaultLimit"
        label={t('default_limit')}
        rules={[
          {required: true, message: `${t('please_enter_default_limit')}`},
        ]}
      />
      <ProFormText
        name="unit"
        label={t('unit')}
        rules={[
          {required: true, message: `${t('please_enter_unit')}`},
        ]}
      />
      <ProFormSelect
        name="resourceType"
        label={t('resource_type')}
        rules={[
          {required: true, message: `${t('please_select_resource_type')}`},
        ]}
        options={[
          {label: QuotaItemResourceType.Number, value: QuotaItemResourceType.Number},
          {label: QuotaItemResourceType.Network, value: QuotaItemResourceType.Network},
          {label: QuotaItemResourceType.Storage, value: QuotaItemResourceType.Storage},
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
