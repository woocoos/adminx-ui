import { getFilesRaw, updateFiles } from "@/services/files";
import store from "@/store";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, message } from "antd"
import { RcFile } from "antd/es/upload";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ICE_APP_CODE = process.env.ICE_APP_CODE ?? '';

export default (props: {
  bucket?: string;
  appCode?: string;
  tid?: string;
  /**
   * 目录格式  xxx/ss
   */
  directory?: string;
  /**
   * 强制使用目录当前缀
   */
  forceDirectory?: boolean;
  value?: string;
  maxSize?: number;
  accept?: string;
  onChange?: (value: string) => void;
}) => {
  const { t } = useTranslation(),
    [userState] = store.useModel('user'),
    [loading, setLoading] = useState(false),
    [imgsrc, setImgsrc] = useState<string>();

  const
    //字节大小处理
    formatFileSize = (fileSize: number) => {
      if (fileSize < 1024) {
        return fileSize + 'B';
      } else if (fileSize < (1024 * 1024)) {
        return (fileSize / 1024).toFixed(2) + 'KB';
      } else if (fileSize < (1024 * 1024 * 1024)) {
        return (fileSize / (1024 * 1024)).toFixed(2) + 'MB';
      } else {
        return (fileSize / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
      }
    },
    // 随机数
    randomId = (len: number) => {
      let str = '';
      for (; str.length < len; str += Math.random().toString(36).substring(2));
      return str.substring(0, len);
    },
    updateFile = async (file: RcFile) => {
      const suffix = file.name.split('.').pop(),
        bucket = props.bucket ?? 'local',
        tid = props.tid ?? userState.tenantId,
        appCode = props.appCode ?? ICE_APP_CODE,
        keys: string[] = [];

      if (props.forceDirectory && props.directory) {
        keys.push(props.directory)
      } else {
        if (appCode) {
          keys.push(appCode)
        }
        if (tid) {
          keys.push(tid)
        }
        if (props.directory) {
          keys.push(props.directory)
        }
      }

      keys.push(`${randomId(16)}.${suffix}`)

      setLoading(true)
      if (bucket === 'local') {
        try {
          const result = await updateFiles({
            key: `/${keys.join('/')}`.replace('//', '/'),
            bucket,
            file,
          })
          if (result) {
            props.onChange?.(result)
          }
        } catch (error) {

        }
      }
      setLoading(false)
    }

  useEffect(() => {
    if (props.value) {
      const bucket = props.bucket ?? 'local';
      if (bucket === 'local') {
        getFilesRaw(props.value, 'url').then(result => {
          if (typeof result === 'string') {
            setImgsrc(result)
          }
        })
      }
    } else {
      setImgsrc(undefined)
    }
  }, [props.value])

  return <Upload
    accept={props.accept}
    listType="picture-card"
    showUploadList={false}
    beforeUpload={(file) => {
      let isTrue = true;
      const maxSize = props.maxSize || 1024 * 5000

      if (file.size > maxSize) {
        isTrue = false
        message.error(t('file_size_<_{{str}}', { str: formatFileSize(maxSize) }));
      }
      if (isTrue) {
        updateFile(file)
      }
      return false
    }}
  >
    {
      imgsrc ? <img
        src={imgsrc} alt="avatar" style={{ width: '100%' }}
      /> : <>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}></div>
      </>
    }
  </Upload>
}
