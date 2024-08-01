import { updateFormat } from '@/util';
import { DrawerForm, ProFormDigit, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';
import { FileIdentity, Org, OrgKind } from '@/generated/adminx/graphql';
import { createFileIdentity, getFileIdentityInfo, updateFileIdentity } from '@/services/adminx/file/identities';
import InputOrg from '@/pages/org/components/inputOrg';
import Editor from '@/components/editor';

type ProFormData = {
  accessKeyID?: string
  accessKeySecret?: string
  durationSeconds?: number
  isDefault?: boolean
  org?: Org;
  policy?: string;
  roleArn?: string
  sourceID?: string
  comments?: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string;
  fsId: string;
  onClose?: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [checkLeave, setLeavePromptWhen] = useLeavePrompt(),
    [oldInfo, setOldInfo] = useState<FileIdentity>();

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
      const data: ProFormData = {};
      if (props.id) {
        const result = await getFileIdentityInfo(props.id);
        if (result?.id) {
          data.accessKeyID = result.accessKeyID
          data.accessKeySecret = result.accessKeySecret
          data.durationSeconds = result.durationSeconds ?? undefined
          data.isDefault = result.isDefault
          data.org = result.org as Org
          data.policy = ''
          if (result.policy) {
            try {
              data.policy = JSON.stringify(JSON.parse(result.policy), null, 4)
            } catch (error) {
            }
          }
          data.roleArn = result.roleArn
          data.sourceID = result.fileSourceID
          data.comments = result.comments || undefined;
          setOldInfo(result as FileIdentity);
        }
      } else {
        setOldInfo(undefined);
        data.durationSeconds = 3600
      }
      return data;
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      let isTrue = false;
      const data = {
        accessKeyID: values.accessKeyID ?? '',
        accessKeySecret: values.accessKeySecret ?? '',
        comments: values.comments,
        durationSeconds: values.durationSeconds ?? 3600,
        isDefault: values.isDefault,
        orgID: values.org?.id ?? '',
        policy: values.policy,
        roleArn: values.roleArn ?? '',
        sourceID: props.fsId,
      }
      if (props.id) {
        const result = await updateFileIdentity(props.id, updateFormat(data, oldInfo || {}));
        if (result?.id) {
          isTrue = true;
        }
      } else {
        const result = await createFileIdentity(data);
        if (result?.id) {
          isTrue = true;
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
        name="org"
        label={t('organization')}
        rules={[
          { required: true, message: `${t('please_enter_org')}` },
        ]}
      >
        <InputOrg kind={OrgKind.Root} />
      </ProFormText>
      <ProFormText
        name="accessKeyID"
        label="AccessKeyID"
        rules={[
          { required: true, message: `${t('please_enter_file_source_kind')}` },
        ]}
      />
      <ProFormText
        name="accessKeySecret"
        label="AccessKeySecret"
        rules={[
          { required: true, message: `${t('please_enter_file_source_bucket')}` },
        ]}
      />
      <ProFormDigit
        name="durationSeconds"
        label={`STS ${t('validity')}(s)`}
        min={0}
      />
      <ProFormText
        name="policy"
        label={t('policy')}
        rules={[
          {
            validator(rule, value) {
              if (value) {
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch (error) {
                  return Promise.reject(new Error(t('format_error') ?? 'Formatting error'));
                }
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Editor
          className="adminx-editor"
          height="200px"
          defaultLanguage="json"
        />
      </ProFormText>
      <ProFormText
        name="roleArn"
        label="RoleArn"
        rules={[
          { required: true, message: `${t('please_enter_role_arn')}` },
        ]}
      />
      <ProFormSwitch
        name="isDefault"
        label={t('default')}
      />
      <ProFormTextArea
        name="comments"
        label={t('description')}
        placeholder={`${t('please_enter_description')}`}
      />
    </DrawerForm>
  );
};
