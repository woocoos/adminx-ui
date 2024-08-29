import { updateFormat } from '@/util';
import { DrawerForm, ProFormDigit, ProFormInstance, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';
import { FileIdentity, Org, OrgKind } from '@/generated/adminx/graphql';
import { createFileIdentity, getAccessKeySecret, getFileIdentityInfo, updateFileIdentity } from '@/services/adminx/file/identities';
import InputOrg from '@/pages/org/components/inputOrg';
import Editor from '@/components/editor';
import { Button } from 'antd';

type ProFormData = {
  accessKeyID?: string
  accessKeySecret?: string
  durationSeconds?: number
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
    formRef = useRef<ProFormInstance>(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [checkLeave, setLeavePromptWhen] = useLeavePrompt(),
    [aksLoading, setAksLoading] = useState(false),
    [aks, setAks] = useState<string>(),
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
      setAks(undefined);
      const data: ProFormData = {};
      if (props.id) {
        const result = await getFileIdentityInfo(props.id);
        if (result?.id) {
          data.accessKeyID = result.accessKeyID
          data.durationSeconds = result.durationSeconds ?? undefined
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
    getAks = async () => {
      if (oldInfo) {
        setAksLoading(true)
        const result = await getAccessKeySecret(oldInfo.id);
        setAks(result);
        setAksLoading(false)
      }
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

  useEffect(() => {
    if (aks) {
      formRef.current?.setFieldValue("accessKeySecret", aks);
    }
  }, [aks]);

  return (
    <DrawerForm
      formRef={formRef}
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
      {oldInfo ? <>
        {aks ? <ProFormText
          name="accessKeySecret"
          label="AccessKeySecret"
          rules={[
            { required: true, message: `${t('please_enter_file_source_bucket')}` },
          ]}
        /> : <div>
          如要变更 AccessKeySecret <Button
            type="link"
            loading={aksLoading}
            onClick={() => {
              getAks()
            }}>
            请点击这里
          </Button>
          <br />
          <br />
        </div>}
      </> :
        <ProFormText
          name="accessKeySecret"
          label="AccessKeySecret"
          rules={[
            { required: true, message: `${t('please_enter_file_source_bucket')}` },
          ]}
        />
      }
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
      <ProFormTextArea
        name="comments"
        label={t('description')}
        placeholder={`${t('please_enter_description')}`}
      />
    </DrawerForm>
  );
};
