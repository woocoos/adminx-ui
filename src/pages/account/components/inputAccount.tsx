import { User, UserType } from "@/services/user"
import { Input } from "antd"
import ModalAccount from "./modalAccount"
import { useState } from "react"
import { CloseCircleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export default (props: {
    value?: User,
    disabled?: boolean
    userType: UserType
    onChange?: (value?: User) => void
}) => {
    const
        { t } = useTranslation(),
        [modal, setModal] = useState<{
            open: boolean
        }>({
            open: false
        })

    return (
        <>
            <Input.Search
                value={props.value?.displayName}
                disabled={props.disabled}
                suffix={props.value && props.disabled != true ?
                    <CloseCircleFilled
                        style={{ fontSize: "12px", cursor: "pointer", color: "rgba(0, 0, 0, 0.25)" }}
                        onClick={() => {
                            props.onChange?.(undefined)
                        }}
                    /> : <span />}
                onSearch={() => {
                    modal.open = true;
                    setModal({ ...modal })
                }}
            />
            <ModalAccount
                open={modal.open}
                title={t("search {{field}}", { field: t('account') })}
                userType={props.userType}
                onClose={(selectData) => {
                    if (selectData?.length) {
                        props.onChange?.(selectData[0])
                    }
                    modal.open = false;
                    setModal({ ...modal })
                }}
            />
        </>
    )
}