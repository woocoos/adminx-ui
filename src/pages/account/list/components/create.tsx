import { CreateUserPasswordInput, User, UserLoginProfile, UserLoginProfileSetKind, UserPasswordScene, UserPasswordSimpleStatus, UserSimpleStatus, UserUserType } from '@/generated/adminx/graphql';
import { getOrgInfo } from '@/services/adminx/org';
import { UpdateUserInfoScene, createUserInfo, getUserInfoLoginProfile, restoreRecycleUser, updateUserInfo, updateUserProfile } from '@/services/adminx/user';
import store from '@/store';
import { DrawerForm, ProFormText, ProFormTextArea, ProFormSwitch } from '@ant-design/pro-components';
import { Alert, Radio, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sha256 from 'crypto-js/sha256';
import { updateFormat } from '@/util';
import UploadFiles from '@/components/UploadFiles';
import { useLeavePrompt } from '@knockout-js/layout';

type ProFormData = {
  principalName?: string;
  password?: string;
  displayName?: string;
  email?: string;
  mobile?: string;
  comments?: string;
  canLogin?: boolean;
  passwordReset?: boolean;
};

export default (props: {
  open: boolean;
  title?: string;
  id?: string | null;
  orgId?: string;
  userType: UserUserType;
  recycleInfo?: User;
  scene: UpdateUserInfoScene;
  onClose: (isSuccess?: boolean) => void;
}) => {
  const { t } = useTranslation(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [, setLeavePromptWhen] = useLeavePrompt(),
    [initValues, setInitValues] = useState<User | UserLoginProfile | null>(null),
    [domain, setDomain] = useState<string>(''),
    [setKind, setSetKind] = useState<UserLoginProfileSetKind>(UserLoginProfileSetKind.Auto),
    [userState] = store.useModel('user');

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
    getBase = async () => {
      if (userState.tenantId) {
        const result = await getOrgInfo(userState.tenantId);
        if (result?.id) {
          setDomain(result.domain || '');
        }
      }
    },
    onOpenChange = (open: boolean) => {
      if (!open) {
        props.onClose();
      }
      setSaveDisabled(true);
    },
    getRequest = async () => {
      let info: User | UserLoginProfile | null = null;
      if (props.id) {
        const result = await getUserInfoLoginProfile(props.id);
        if (result?.id) {
          if (props.scene === 'loginProfile') {
            if (result?.loginProfile) {
              info = result.loginProfile as UserLoginProfile;
            }
          } else {
            info = result as User;
          }
        }
      } else if (props.scene === 'recycle' && props.recycleInfo) {
        info = props.recycleInfo;
        if (domain) {
          info.principalName = info.principalName.replace(`@${domain}`, '');
        }
      }
      setSaveLoading(false);
      setSaveDisabled(true);
      setInitValues(info);
      return info || {};
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      let isTrue = false;
      if (props.id) {
        if (props.scene === 'base') {
          const result = await updateUserInfo(props.id, updateFormat(values, initValues || {}));
          if (result?.id) {
            isTrue = true;
          }
        } else if (props.scene === 'loginProfile') {
          const result = await updateUserProfile(props.id, updateFormat(values, initValues || {}));
          if (result?.id) {
            isTrue = true;
          }
        }
      } else {
        if (props.userType === 'member' && domain) {
          values.principalName = `${values.principalName}@${domain}`;
        }
        if (props.scene == 'recycle' && props.recycleInfo) {
          let pwdInput: CreateUserPasswordInput | undefined;
          if (setKind === UserLoginProfileSetKind.Customer) {
            pwdInput = {
              scene: UserPasswordScene.Login,
              status: UserPasswordSimpleStatus.Active,
              password: Sha256(values.password || '').toString(),
              userID: props.recycleInfo.id,
            };
          }
          const result = await restoreRecycleUser(props.recycleInfo.id, {
            comments: values.comments,
            displayName: values.displayName,
            email: values.email,
            mobile: values.mobile,
            principalName: values.principalName,
          }, setKind, pwdInput);
          if (result?.id) {
            isTrue = true;
          }
        } else {
          let password: CreateUserPasswordInput | undefined;
          if (setKind === UserLoginProfileSetKind.Customer) {
            password = {
              scene: UserPasswordScene.Login,
              status: UserPasswordSimpleStatus.Active,
              password: Sha256(values.password || '').toString(),
            };
          }
          const result = await createUserInfo(props?.orgId || userState.tenantId, {
            mobile: values.mobile,
            email: values.email,
            principalName: values.principalName || '',
            displayName: values.displayName || '',
            comments: values.comments,
            status: UserSimpleStatus.Active,
            loginProfile: {
              setKind,
              verifyDevice: false,
            },
            password,
          }, props.userType);
          if (result?.id) {
            isTrue = true;
          }
        }
      }
      if (isTrue) {
        message.success(t('submit_success'));
        setSaveDisabled(true);
        props.onClose(true);
      }
      setSaveLoading(false);
      return false;
    };

  useEffect(() => {
    getBase();
  }, []);

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
      <div x-if={['recycle'].includes(props.scene)}>
        <Alert showIcon type="warning" message={t('recycle_alert')} />
        <br />
      </div>
      <div x-if={['create', 'recycle'].includes(props.scene)}>
        <ProFormText
          name="principalName"
          label={t('principal_name')}
          rules={[
            { required: true, message: `${t('please_enter_principal_name')}` },
          ]}
          fieldProps={{
            suffix: props.userType === 'member' ? `${domain ? `@${domain}` : ''}` : '',
          }}
        />
        <div>
          <Radio.Group
            value={setKind}
            options={[
              { label: t('manually_set_pwd'), value: 'customer' },
              { label: t('auto_create_password'), value: 'auto' },
            ]}
            onChange={(event) => setSetKind(event.target.value)}
          />
        </div>
        <br />
        <ProFormText.Password
          x-if={setKind === 'customer'}
          name="password"
          label={t('password')}
          fieldProps={{ autocomplete: 'new-password' } as any}
          rules={[
            { required: true, message: `${t('please_enter_password')}` },
          ]}
        />
      </div>
      <ProFormText
        x-if={['base'].includes(props.scene)}
        name="avatarFileID"
      >
        <UploadFiles accept='.jpg,.png' />
      </ProFormText>
      <div x-if={['create', 'base', 'recycle'].includes(props.scene)}>
        <ProFormText
          name="displayName"
          label={t('display_name')}
          rules={[
            { required: true, message: `${t('please_enter_display_name')}` },
          ]}
        />
        <ProFormText
          name="email"
          label={t('email')}
          rules={[
            { required: true, message: `${t('please_enter_email')}` },
            { type: 'email', message: `${t('format_error')}` },
          ]}
        />
        <ProFormText name="mobile" label={t('mobile')} />
        <ProFormTextArea
          name="comments"
          label={t('introduction')}
          placeholder={`${t('please_enter_introduction')}`}
        />
      </div>
      <div x-if={['loginProfile'].includes(props.scene)}>
        <ProFormSwitch name="canLogin" label={t('allow_pwd_login')} />
        <ProFormSwitch name="passwordReset" label={t('reset_login_pwd')} />
      </div>
    </DrawerForm>
  );
};
