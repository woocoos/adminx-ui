import { Org, OrgKind, User, UserUserType } from '@/generated/adminx/graphql';
import InputAccount from '@/pages/account/components/inputAccount';
import { createOrgInfo, EnumOrgKind, getOrgInfo, updateOrgInfo } from '@/services/adminx/org';
import { TreeEditorAction, formatTreeData, isValidDomain, updateFormat } from '@/util';
import { DrawerForm, ProFormSelect, ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeavePrompt } from '@knockout-js/layout';
import { getCacheCountryList } from '@/services/adminx/country';
import { getCacheCurrencyList } from '@/services/adminx/currency';
import { getDictItems } from '@knockout-js/api';
import StringsInput from './stringsInput';
import { useForm } from 'antd/es/form/Form';
import { Form } from 'antd';
import store from '@/store';

type SelectTreeData = {
  value: string;
  title: string;
  parentId?: string;
  children?: SelectTreeData[];
};

type ProFormData = {
  name?: string;
  parentID?: string;
  domain?: string;
  countryCode?: string;
  customDomain?: string[];
  owner?: User;
  localCurrency?: string;
  timezone?: string;
  profile?: string;
  logo?: string;
  favicon?: string;
  thumbLogo?: string;
  kind?: OrgKind;
};

export default (props: {
  open?: boolean;
  title?: string;
  id?: string;
  kind: OrgKind;
  scene?: TreeEditorAction;
  parentDataSource: Org[];
  onClose?: (isSuccess?: boolean, newInfo?: Org) => void;
}) => {
  const { t } = useTranslation(),
    [form] = useForm<ProFormData>(),
    [userState] = store.useModel('user'),
    kindValue = Form.useWatch('kind', form),
    parentIDValue = Form.useWatch('parentID', form),
    [saveLoading, setSaveLoading] = useState(false),
    [countryCodeOptions, setCountryCodeOptions] = useState<{ value: string, label: string }[]>([]),
    [currencyOptions, setCurrencyOptions] = useState<{ value: string, label: string }[]>([]),
    [timezoneOptions, setTimezoneOptions] = useState<{ value: string, label: string }[]>([]),
    [saveDisabled, setSaveDisabled] = useState(true),
    [checkLeave, setLeavePromptWhen] = useLeavePrompt(),
    [oldInfo, setOldInfo] = useState<Org>();

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
    getBase = async () => {
      // 获取国家列表
      const countryResult = await getCacheCountryList({ pageSize: 999 });
      setCountryCodeOptions(countryResult?.edges?.map(item => {
        return {
          value: item?.node?.code ?? '',
          label: item?.node?.name ?? '',
        };
      }) ?? []);
      // 获取本位币列表
      const currencyResult = await getCacheCurrencyList({ pageSize: 999 });
      setCurrencyOptions(currencyResult?.edges?.map(item => {
        return {
          value: item?.node?.code ?? '',
          label: item?.node?.code ?? '',
          // label: item?.node?.name ?? '',
        };
      }) ?? []);
      // 获取时区列表
      const dictItemResult = await getDictItems(`resource:DLSH`);
      setTimezoneOptions(dictItemResult?.map(item => {
        return {
          value: item.name,
          label: item.name,
        };
      }) ?? [])
    },
    parentRequest = async () => {
      const list: SelectTreeData[] = [
        {
          value: '0', title: t('top_org'), children: [],
        },
      ];

      if (props.parentDataSource.length) {
        list[0].children = formatTreeData(
          props.parentDataSource.map(item => {
            return {
              value: item.id,
              parentId: item.parentID,
              title: item.name,
            };
          })
          , undefined, { key: 'value', parentId: 'parentId', children: 'children' });
      } else {
      }
      return list;
    },
    onOpenChange = (open: boolean) => {
      if (!open) {
        if (checkLeave()) {
          setSaveDisabled(true);
          props.onClose?.();
        }
      } else {
        setSaveDisabled(true);
      }
    },
    getRequest = async () => {
      setSaveLoading(false);
      setSaveDisabled(true);
      let result: ProFormData = {};
      if (props.id) {
        const orgInfo = await getOrgInfo(props.id);
        if (orgInfo?.id) {
          setOldInfo(orgInfo as Org);
          switch (props.scene) {
            case 'editor':
              result.countryCode = orgInfo.countryCode ?? undefined;
              result.name = orgInfo.name ?? undefined
              result.parentID = orgInfo.parentID ?? undefined
              result.domain = orgInfo.domain ?? undefined
              result.customDomain = orgInfo.customDomain ?? undefined
              result.owner = (orgInfo.owner as User) ?? undefined
              result.localCurrency = orgInfo.localCurrency ?? undefined
              result.timezone = orgInfo.timezone ?? undefined
              result.profile = orgInfo.profile ?? undefined
              result.kind = orgInfo.kind
              result.logo = orgInfo.logo?.logo ?? undefined
              result.favicon = orgInfo.logo?.favicon ?? undefined
              result.thumbLogo = orgInfo.logo?.thumbLogo ?? undefined
              break;
            case 'peer':
              result.parentID = orgInfo.parentID;
              break;
            case 'child':
              result.parentID = orgInfo.id;
              if (orgInfo.kind === OrgKind.Org) {
                result.kind = OrgKind.Org;
              }
              break;
            default:
              break;
          }
        }
      } else {
        result.kind = OrgKind.Root
      }

      return result;
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData) => {
      setSaveLoading(true);
      if (props.scene === 'editor') {
        if (props.id) {
          const result = await updateOrgInfo(props.id, updateFormat({
            name: values.name,
            parentID: values.parentID,
            ownerID: values.owner?.id,
            domain: values.domain,
            customDomain: values.customDomain,
            countryCode: values.countryCode,
            profile: values.profile,
            localCurrency: values.localCurrency,
            timezone: values.timezone,
            logo: {
              logo: values.logo,
              favicon: values.favicon,
              thumbLogo: values.thumbLogo,
            }
          }, oldInfo || {}));
          if (result?.id) {
            setSaveDisabled(true);
            props.onClose?.(true, result as Org);
          }
        } else {
          const result = await createOrgInfo({
            name: values.name as string,
            parentID: values.parentID as string,
            ownerID: values.owner?.id,
            domain: values.domain,
            customDomain: values.customDomain,
            countryCode: values.countryCode,
            profile: values.profile,
            localCurrency: values.localCurrency,
            timezone: values.timezone,
            logo: {
              logo: values.logo,
              favicon: values.favicon,
              thumbLogo: values.thumbLogo,
            }
          }, props.kind);
          if (result?.id) {
            setSaveDisabled(true);
            props.onClose?.(true, result as Org);
          }
        }
      } else if (props.scene === 'peer') {
        const result = await createOrgInfo({
          name: values.name as string,
          parentID: values.parentID as string,
          ownerID: values.owner?.id,
          domain: values.domain,
          customDomain: values.customDomain,
          countryCode: values.countryCode,
          profile: values.profile,
          localCurrency: values.localCurrency,
          timezone: values.timezone,
          logo: {
            logo: values.logo,
            favicon: values.favicon,
            thumbLogo: values.thumbLogo,
          }
        }, values.kind as OrgKind);
        if (result?.id) {
          setSaveDisabled(true);
          props.onClose?.(true, result as Org);
        }
      } else if (props.scene === 'child') {
        const result = await createOrgInfo({
          name: values.name as string,
          parentID: values.parentID as string,
          ownerID: values.owner?.id,
          domain: values.domain,
          customDomain: values.customDomain,
          countryCode: values.countryCode,
          profile: values.profile,
          localCurrency: values.localCurrency,
          timezone: values.timezone,
          logo: {
            logo: values.logo,
            favicon: values.favicon,
            thumbLogo: values.thumbLogo,
          },
        }, values.kind as OrgKind);
        if (result?.id) {
          setSaveDisabled(true);
          props.onClose?.(true, result as Org);
        }
      }
      setSaveLoading(false);
      return false;
    };

  useEffect(() => {
    getBase()
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
      form={form}
      title={props.title}
      open={props?.open}
      onReset={getRequest}
      request={getRequest}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
    >
      <div>
        <ProFormText
          name="name"
          label={t('name')}
          rules={[
            { required: true, message: `${t('please_enter_name')}` },
          ]}
        />
        <ProFormTreeSelect
          name="parentID"
          label={t('parent_org')}
          disabled={!!props.id}
          request={parentRequest}
          rules={[
            { required: true, message: `${t('please_enter_parent_org')}` },
          ]}
        />
        <ProFormSelect
          disabled={!['peer', 'child'].includes(props.scene ?? '')}
          name="kind"
          label={t('type')}
          rules={[
            { required: true, message: `${t('please_select_type')}` },
          ]}
          options={[
            { label: EnumOrgKind[OrgKind.Root].text, value: OrgKind.Root, disabled: (props.scene == 'child') && (oldInfo?.kind != OrgKind.Root) },
            { label: EnumOrgKind[OrgKind.Org].text, value: OrgKind.Org },
          ]}
        />
        <ProFormText
          x-if={kindValue === 'root'}
          disabled={!!oldInfo?.domain}
          name="domain"
          label={t('domain')}
          tooltip={<div>{t('domain_tooltip')}</div>}
        />
        <ProFormText
          x-if={kindValue === 'root'}
          name="customDomain"
          label={t('custom_domain')}
          rules={[
            {
              validator(rule, value) {
                let isTrue = true;
                if (Array.isArray(value)) {
                  value.forEach(item => {
                    if (!isValidDomain(item)) {
                      isTrue = false;
                    }
                  })
                }
                if (isTrue) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(t('domain_format_error'));
                }
              },
            },
          ]}
        >
          <StringsInput />
        </ProFormText>
        <ProFormSelect
          x-if={kindValue === 'root'}
          name="countryCode"
          label={t('country_region')}
          options={countryCodeOptions}
        />
        <ProFormText
          x-if={kindValue === 'root'}
          name="owner"
          label={t('manage_account')}
          tooltip={<div>{t('owner_tooltip')}</div>}
        >
          <InputAccount
            disabled={(props.scene === 'editor' && !!oldInfo?.ownerID)}
            orgId={parentIDValue == '0' ? undefined : userState.tenantId}
            userType={parentIDValue == '0' ? UserUserType.Account : UserUserType.Member}
          />
        </ProFormText>
        <ProFormSelect
          x-if={kindValue === 'root'}
          name="localCurrency"
          label={t('org_currency')}
          options={currencyOptions}
        />
        <ProFormSelect
          x-if={kindValue === 'root'}
          name="timezone"
          label={t('timezone')}
          options={timezoneOptions}
        />
        <ProFormText
          x-if={kindValue === 'root'}
          name="logo"
          label={t('logo')}
          rules={[
            { type: 'url', message: `${t('url_format_error')}` }
          ]}
        />
        <ProFormText
          x-if={kindValue === 'root'}
          name="favicon"
          label={t('favicon')}
          rules={[
            { type: 'url', message: `${t('url_format_error')}` }
          ]}
        />
        <ProFormText
          x-if={kindValue === 'root'}
          name="thumbLogo"
          label={t('thumb_logo')}
          rules={[
            { type: 'url', message: `${t('url_format_error')}` }
          ]}
        />
        <ProFormTextArea
          name="profile"
          label={t('description')}
          placeholder={`${t('please_enter_description')}`}
        />
      </div>
    </DrawerForm>
  );
};
