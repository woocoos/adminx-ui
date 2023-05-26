import { Alert, Dropdown, MenuProps, Modal } from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";
import { useTranslation } from "react-i18next";
import { checkLave } from "@/components/LeavePrompt";
import store from "@/store";
import { useEffect, useState } from "react";
import { Org, getOrgInfo } from "@/services/org";
import { render } from "react-dom";
import { userRootOrgs } from "@/services/user";



export default () => {
    const { t } = useTranslation(),
        [basis, basisDispatcher] = store.useModel("basis"),
        [orgInfo, setOrgInfo] = useState<Org>();

    const
        getRequest = async () => {
            if (basis.tenantId) {
                const result = await getOrgInfo(basis.tenantId)
                if (result?.id) {
                    setOrgInfo(result)

                    const uros = await userRootOrgs()
                    if (uros) {
                        menu.items = uros.filter(item => item.id != result.id).map(item => {
                            return {
                                key: item.id,
                                label: item.name,
                                onClick: onMenuClick
                            }
                        })
                    }
                }
            }
        },
        onMenuClick = (info: MenuInfo) => {
            const { key } = info;
            checkLave(() => {
                Modal.confirm({
                    title: t('Tenant switch reminder'),
                    content: t('tenant_switch_context'),
                    onOk: () => {
                        basisDispatcher.updateTenantId(key)
                        location.reload()
                    }
                })
            })
        }

    const menu: MenuProps = {
        items: [],
    };

    useEffect(() => {
        if (document.hidden) {
            const tipStr = t('tenant_switch_title')
            window.close();
            document.body.innerHTML = ""
            document.title = tipStr
            render(<>
                <br />
                <div style={{ maxWidth: "600px", margin: '0 auto' }}>
                    <Alert message={tipStr} />
                </div>
            </>, document.querySelector('#perch'))
        } else {
            getRequest()
        }
    }, [basis.tenantId])

    return orgInfo ? <Dropdown menu={menu} disabled={menu.items?.length === 0}>
        <span style={{ margin: '0 12px' }}>
            {orgInfo.name}
        </span>
    </Dropdown> : <></>;
};
