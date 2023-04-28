import { Input } from "antd"
import ModalApp from "./modalApp"
import { useState } from "react"
import { CloseCircleFilled } from "@ant-design/icons";
import { App } from "@/services/app";
import { useTranslation } from "react-i18next";

export default (props: {
    value?: App,
    orgId?: string
    disabled?: boolean
    onChange?: (value?: App) => void
}) => {
    const { t } = useTranslation(),
        [modal, setModal] = useState<{
            open: boolean
        }>({
            open: false
        })

    return (
        <>
            <Input.Search
                value={props.value?.name || ''}
                disabled={props.disabled}
                placeholder={`${t("click search {{field}}", { field: t("app") })}`}
                suffix={props.value && props.disabled != true ?
                    <CloseCircleFilled
                        style={{ fontSize: "12px", cursor: "pointer", color: "rgba(0, 0, 0, 0.25)" }}
                        onClick={() => {
                            props.onChange?.(undefined)
                        }}
                    /> : ""}
                onSearch={() => {
                    modal.open = true;
                    setModal({ ...modal })
                }}
            />
            <ModalApp
                open={modal.open}
                title={`${t("search {{field}}", { field: t('app') })}`}
                orgId={props.orgId}
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