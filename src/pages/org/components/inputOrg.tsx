import { Input } from 'antd';
import ModalOrg from './modalOrg';
import { useState } from 'react';
import { CloseCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Org, OrgKind } from '@/generated/adminx/graphql';

export default (props: {
  value?: Org;
  orgId?: string;
  appId?: string;
  kind?: OrgKind;
  disabled?: boolean;
  onChange?: (value?: Org) => void;
}) => {
  const { t } = useTranslation(),
    [modal, setModal] = useState<{
      open: boolean;
    }>({
      open: false,
    });

  return (
    <>
      <Input.Search
        value={props.value?.name || ''}
        disabled={props.disabled}
        placeholder={`${t('click_search_org')}`}
        suffix={props.value && props.disabled != true ? <CloseCircleFilled
          style={{ fontSize: '12px', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.25)' }}
          onClick={() => {
            props.onChange?.(undefined);
          }}
        /> : <span />}
        onSearch={() => {
          modal.open = true;
          setModal({ ...modal });
        }}
      />
      <ModalOrg
        open={modal.open}
        title={`${t('search_org')}`}
        orgId={props.orgId}
        appId={props.appId}
        kind={props.kind}
        onClose={(selectData) => {
          if (selectData?.length) {
            props.onChange?.(selectData[0]);
          }
          modal.open = false;
          setModal({ ...modal });
        }}
      />
    </>
  );
};
