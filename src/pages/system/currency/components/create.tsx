import { updateFormat } from '@/util';
import { DrawerForm, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';
import { Currency, CurrencySimpleStatus } from '@/generated/adminx/graphql';
import { createCurrencyInfo, getCurrencyInfo, updateCurrencyInfo } from '@/services/adminx/currency';

type ProFormData = {
  code?: string;
  name?: string;
  sign?: string;
  status?: CurrencySimpleStatus;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string | null;
  onClose?: (isSuccess?: boolean, newInfo?: Currency) => void;
}) => {
  const { t } = useTranslation(),
    [info, setInfo] = useState<Currency>(),
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
        const result = await getCurrencyInfo(props.id);
        if (result?.id) {
          setInfo(result as Currency);
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
      if (props.id) {
        const result = await updateCurrencyInfo(props.id, updateFormat({
          code: values.code ?? '',
          name: values.name,
          sign: values.sign,
          status: values.status,
        }, info || {}))

        if (result?.id) {
          setSaveDisabled(true);
          props.onClose?.(true, result as Currency);
        }
      } else {
        const result = await createCurrencyInfo({
          code: values.code ?? '',
          name: values.name ?? '',
          sign: values.sign,
          status: values.status,
        });
        if (result?.id) {
          setSaveDisabled(true);
          props.onClose?.(true, result as Currency);
        }
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
      {/* 编码有需要设置不能修改在设置 disabled={!!props.id} */}
      <ProFormText
        name="code"
        label={t('code')}
        rules={[
          { required: true, message: `${t('please_enter_code')}` },
        ]}
      />
      <ProFormText
        name="sign"
        label={t('sign')}
      />
      <ProFormSelect
        name="status"
        label={t('status')}
        options={[
          { value: CurrencySimpleStatus.Active, label: CurrencySimpleStatus.Active },
          { value: CurrencySimpleStatus.Disabled, label: CurrencySimpleStatus.Disabled },
          { value: CurrencySimpleStatus.Inactive, label: CurrencySimpleStatus.Inactive },
          { value: CurrencySimpleStatus.Processing, label: CurrencySimpleStatus.Processing },
        ]}
      />
    </DrawerForm>
  );
};
