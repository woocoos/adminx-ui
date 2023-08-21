import { FileSource, FileSourceKind } from '@/generated/adminx/graphql';
import { updateFormat } from '@/util';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';
import { EnumFileSourceKind, createFileSource, getFileSourceInfo, updateFileSource } from '@/services/adminx/file/source';

type ProFormData = {
  kind: FileSourceKind;
  endpoint?: string;
  region?: string;
  bucket?: string;
  comments?: string;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string;
  onClose?: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [, setLeavePromptWhen] = useLeavePrompt(),
    [oldInfo, setOldInfo] = useState<FileSource>();

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
      const data: ProFormData = {
        kind: FileSourceKind.Local
      };
      if (props.id) {
        const result = await getFileSourceInfo(props.id);
        if (result?.id) {
          data.kind = result.kind;
          data.endpoint = result.endpoint || undefined;
          data.region = result.region || undefined;
          data.bucket = result.bucket || undefined;
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
      let isTrue = false;
      if (props.id) {
        const result = await updateFileSource(props.id, updateFormat(values, oldInfo || {}));
        if (result?.id) {
          isTrue = true;
        }
      } else {
        const result = await createFileSource(values);
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
        label="bucket"
        rules={[
          { required: true, message: `${t('please_enter_file_source_bucket')}` },
        ]}
      />
      <ProFormText
        name="region"
        label="region"
      />
      <ProFormText
        name="endpoint"
        label="endpoint"
      />
      <ProFormTextArea
        name="comments"
        label={t('description')}
        placeholder={`${t('please_enter_description')}`}
      />
    </DrawerForm>
  );
};
