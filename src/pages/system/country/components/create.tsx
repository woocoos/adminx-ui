import { updateFormat } from '@/util';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea, ProFormDigit } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';
import { Country, CountrySimpleStatus } from '@/generated/adminx/graphql';
import { createCountryInfo, getCountryInfo, updateCountryInfo } from '@/services/adminx/country';

type ProFormData = {
  code?: string;
  name?: string;
  nameEn?: string;
  status?: CountrySimpleStatus;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string | null;
  onClose?: (isSuccess?: boolean, newInfo?: Country) => void;
}) => {
  const { t } = useTranslation(),
    [info, setInfo] = useState<Country>(),
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
        const result = await getCountryInfo(props.id);
        if (result?.id) {
          setInfo(result as Country);
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
        const result = await updateCountryInfo(props.id, updateFormat({
          code: values.code ?? '',
          name: values.name,
          nameEn: values.nameEn,
          status: values.status,
        }, info || {}))

        if (result?.id) {
          setSaveDisabled(true);
          props.onClose?.(true, result as Country);
        }
      } else {
        const result = await createCountryInfo({
          code: values.code ?? '',
          name: values.name,
          nameEn: values.nameEn,
          status: values.status,
        });
        if (result?.id) {
          setSaveDisabled(true);
          props.onClose?.(true, result as Country);
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
      <ProFormText
        name="nameEn"
        label={t('name_en')}
      />
      {/* 编码有需要设置不能修改在设置 disabled={!!props.id} */}
      <ProFormText
        name="code"
        label={t('code')}
        rules={[
          { required: true, message: `${t('please_enter_code')}` },
        ]}
      />
      <ProFormSelect
        name="status"
        label={t('status')}
        options={[
          { value: CountrySimpleStatus.Active, label: CountrySimpleStatus.Active },
          { value: CountrySimpleStatus.Disabled, label: CountrySimpleStatus.Disabled },
          { value: CountrySimpleStatus.Inactive, label: CountrySimpleStatus.Inactive },
          { value: CountrySimpleStatus.Processing, label: CountrySimpleStatus.Processing },
        ]}
      />
    </DrawerForm>
  );
};
