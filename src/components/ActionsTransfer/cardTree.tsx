import { AppAction, AppActionMethod, EnumAppActionMethod } from "@/services/app/action"
import { ProCard } from "@ant-design/pro-components"
import { Checkbox, Divider } from "antd"
import { useState } from "react"


export default (props: {
    method: AppActionMethod
    checkedKeys: string[]
    dataSource: AppAction[]
    appCode: string
    onChange: (keys: string[]) => void
}) => {

    const list: AppAction[] = props.dataSource.filter(item => item.method === props.method)

    const
        checkKeys = () => {
            const allKeys = list.map(item => `${props.appCode}:${item.name}`);
            return props.checkedKeys.filter(k => allKeys.includes(k))
        },
        checkAll = () => {
            if (list.length) {
                return checkKeys().length === list.length
            } else {
                return false
            }
        },
        indeterminateAll = () => {
            const checkedLength = checkKeys().length;
            return checkedLength > 0 && checkedLength != list.length
        }

    return <ProCard
        type="default"
        size="small"
        bordered={false}
        headerBordered={false}
        collapsible
        headStyle={{ backgroundColor: "transparent" }}
        title={
            <div className="actionsTransfer-listAllCheckbox" onClick={(e) => {
                e.stopPropagation();
                const allKeys = list.map(item => `${props.appCode}:${item.name}`);
                if (!checkAll()) {
                    props.onChange([...props.checkedKeys, ...allKeys.filter(k => !props.checkedKeys.includes(k))])
                } else {
                    props.onChange(props.checkedKeys.filter(k => !allKeys.includes(k)))
                }
            }}>
                <div className="mask"></div>
                <Checkbox
                    checked={checkAll()}
                    indeterminate={indeterminateAll()}
                >
                    {EnumAppActionMethod[props.method].text}
                    {`（${checkKeys().length} / ${list.length}）`}
                </Checkbox>
            </div>
        }
    >
        {
            list.map(item => (
                <div key={item.id} className="actionsTransfer-listCheckbox" onClick={(e) => {
                    e.stopPropagation()
                    const key = `${props.appCode}:${item.name}`
                    if (props.checkedKeys.includes(key)) {
                        props.onChange(props.checkedKeys.filter(k => k != key))
                    } else {
                        props.onChange([...props.checkedKeys, key])
                    }
                }}>
                    <div className="mask"></div>
                    <Checkbox checked={props.checkedKeys.includes(`${props.appCode}:${item.name}`)} >
                        <div>{props.appCode}:{item.name}</div>
                        <div>{item.comments}</div>
                    </Checkbox>
                </div>
            ))
        }

    </ProCard >

}