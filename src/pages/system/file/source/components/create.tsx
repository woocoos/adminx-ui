import { FileSource, FileSourceKind } from '@/generated/adminx/graphql';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';
import { EnumFileSourceKind, createFileSource, getFileSourceInfo, updateFileSource } from '@/services/adminx/file/source';

type ProFormData = {
  kind: FileSourceKind;
  endpoint: string;
  stsEndpoint: string;
  endpointImmutable?: boolean;
  region: string;
  bucket: string;
  bucketURL: string;
  comments?: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string;
  onClose?: (isSuccess?: boolean, newInfo?: FileSource) => void;
}) => {
  const { t } = useTranslation(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [checkLeave, setLeavePromptWhen] = useLeavePrompt(),
    [oldInfo, setOldInfo] = useState<FileSource>();

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
      const data: ProFormData = {
        kind: FileSourceKind.Local,
        endpoint: '',
        stsEndpoint: '',
        region: '',
        bucket: '',
        bucketURL: ''
      };
      if (props.id) {
        const result = await getFileSourceInfo(props.id);
        if (result?.id) {
          data.kind = result.kind;
          data.endpoint = result.endpoint;
          data.stsEndpoint = result.stsEndpoint;
          data.region = result.region;
          data.bucket = result.bucket;
          data.bucketURL = result.bucketURL;
          data.endpointImmutable = result.endpointImmutable;
          data.comments = result.comments || undefined;
          setOldInfo(result as FileSource);
        }
      } else {
        setOldInfo(undefined);
      }
      return data;
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      if (props.id) {
        const result = await updateFileSource(props.id, updateFormat(values, oldInfo || {}));
        if (result?.id) {
          setSaveLoading(false);
          setSaveDisabled(true);
          props.onClose?.(true, result as FileSource);
        }
      } else {
        const result = await createFileSource(values);
        if (result?.id) {
          setSaveLoading(false);
          setSaveDisabled(true);
          props.onClose?.(true, result as FileSource);
        }
      }
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
      <ProFormSelect
        name="kind"
        label={t('file_source_kind')}
        valueEnum={EnumFileSourceKind}
        rules={[
          { required: true, message: `${t('please_enter_file_source_kind')}` },
        ]}
      />
      <ProFormText
        name="bucket"
        label="Bucket"
        rules={[
          { required: true, message: `${t('please_enter_file_source_bucket')}` },
        ]}
      />
      <ProFormText
        name="bucketURL"
        label="Bucket Url"
        rules={[
          { required: true, message: `${t('please_enter_file_source_bucket_url')}` },
        ]}
      />
      <ProFormText
        name="region"
        label="Region"
        rules={[
          { required: true, message: `${t('please_enter_file_source_region')}` },
        ]}
      />
      <ProFormText
        name="endpoint"
        label="Endpoint"
        rules={[
          { required: true, message: `${t('please_enter_file_source_endpoint')}` },
        ]}
      />
      <ProFormText
        name="stsEndpoint"
        label="Sts Endpoint"
        rules={[
          { required: true, message: `${t('please_enter_file_source_sts_endpoint')}` },
        ]}
      />
      <ProFormSwitch
        name="endpointImmutable"
        label={t('custDomain')}
      />
      <ProFormTextArea
        name="comments"
        label={t('description')}
        placeholder={`${t('please_enter_description')}`}
      />
    </DrawerForm>
  );
};
