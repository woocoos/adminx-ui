import { Org, OrgKind, Quota, QuotaItemResourceType, User, UserUserType } from '@/generated/adminx/graphql';
import { getDate, updateFormat } from '@/util';
import {
  DrawerForm, FormInstance, ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components';
import { useLeavePrompt } from '@knockout-js/layout';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createQuota, getQuotaInfo, updateQuota } from '@/services/adminx/quotaItem/quota';
import InputOrg from "@/pages/org/components/inputOrg";
import InputAccount from "@/pages/account/components/inputAccount";
import { Form, message } from "antd";

type ProFormData = {
  tenant?: Org;
  user?: User;
  limit?: number;
  used?: number;
  startAt?: string;
  endAt?: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string | null;
  quotaItemID: string,
  onClose?: (isSuccess?: boolean, newInfo?: Quota) => void;
}) => {
  const {t} = useTranslation(),
    [info, setInfo] = useState<Quota>(),
    [checkLeave, setLeavePromptWhen] = useLeavePrompt(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [form] = Form.useForm<ProFormData>();

  const tenantValue = Form.useWatch('tenant', form);


  const formRef = React.useRef<FormInstance>();

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
          return {
            tenant: result.quotaOrg as Org,
            user: result.quotaUser as User,
            limit: result.limit,
            used: result.used,
            startAt: result.startAt,
            endAt: result.endAt,
          } as ProFormData;
        }
      }
      return {};
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      if (!values.tenant && !values.user) {
        message.warning(t('please_select_tenant_or_user'));
        return false;
      }
      setSaveLoading(true);
      const result = props.id
        ? await updateQuota(props.id, updateFormat({
          quotaOrgID: values.tenant?.id,
          quotaUserID: values.user?.id,
          limit: values.limit,
          used: values.used,
          startAt: values.startAt ? getDate(values.startAt, 'YYYY-MM-DDTHH:mm:ssZ') : undefined,
          endAt: values.endAt ? getDate(values.endAt, 'YYYY-MM-DDTHH:mm:ssZ') : undefined,
        }, info || {}))
        : await createQuota({
          quotaItemID: props.quotaItemID,
          quotaOrgID: values.tenant?.id,
          quotaUserID: values.user?.id,
          limit: values.limit ?? 0,
          startAt: values.startAt ? getDate(values.startAt, 'YYYY-MM-DDTHH:mm:ssZ') : undefined,
          endAt: values.endAt ? getDate(values.endAt, 'YYYY-MM-DDTHH:mm:ssZ') : undefined,
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
        name="tenant"
        label={t('organization')}
        >
        <InputOrg
          orgId={OrgKind.Root}
        />
      </ProFormText>

      <ProFormText
        name="user"
        label={t('user')}
      >
        <InputAccount
          orgId={tenantValue?.id}
          userType={UserUserType.Member}
          />
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
        name="endAt"
        label={t('end_at')}
        rules={[
          {required: true, message: `${t('please_select_end_at')}`},
        ]}
      />

    </DrawerForm>
  );
};
