import { OrgKind, Quota, QuotaItemResourceType, UserUserType } from '@/generated/adminx/graphql';
import { updateFormat } from '@/util';
import {
  DrawerForm, ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components';
import { useLeavePrompt } from '@knockout-js/layout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createQuota, getQuotaInfo, updateQuota } from '@/services/adminx/quotaItem/quota';
import InputOrg from "@/pages/org/components/inputOrg";
import InputAccount from "@/pages/account/components/inputAccount";

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
          used: values.used ?? 0,
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
        name="tenantId"
        label={t('organization')}
        rules={[
          {required: true, message: `${t('please_enter_org')}`},
        ]}>
      <InputOrg orgId={OrgKind.Root} />
      </ProFormText>

      <ProFormText
        name="userId"
        label={t('user')}
        rules={[
          {required: true, message: `${t('please_enter_user')}`},
        ]}
      >
        <InputAccount userType={UserUserType.Account} />
      </ProFormText>
      <ProFormDigit
        name="limit"
        label={t('limit')}
        rules={[
          {required: true, message: `${t('please_enter_limit')}`},
        ]}
      />
      <ProFormDigit
        name="used"
        label={t('used')}
        disabled
        initialValue={0}
      />
      <ProFormDateTimePicker
        name="startAt"
        label={t('start_at')}
        rules={[
          {required: true, message: `${t('please_select_start_at')}`},
        ]}
      />
      <ProFormDateTimePicker
        name="entAt"
        label={t('end_at')}
        rules={[
          {required: true, message: `${t('please_select_end_at')}`},
        ]}
      />

    </DrawerForm>
  );
};
