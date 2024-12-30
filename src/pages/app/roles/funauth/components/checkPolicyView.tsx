import { App, AppPolicyView, AppPolicyViewKind, OrgRole } from "@/generated/adminx/graphql"
import { getAppPolicyView } from "@/services/adminx/app/policy"
import { formatTreeData, TreeDataState } from "@/util"
import { Checkbox, Empty, Flex, Space } from "antd"
import { ReactNode, useEffect, useState } from "react"
import style from "./checkPolicyView.module.css"
import { getOrgPolicyView } from "@/services/adminx/org/policy"

export default (props: {
  appInfo: App
  isOrg?: boolean
  value?: string[]
  disabled?: boolean
  onChange?: (value: string[]) => void
}) => {
  const [treeData, setTreeData] = useState<TreeDataState<AppPolicyView>[]>([])

  const reqAppPolicyView = async () => {
    const result = props.isOrg ? await getOrgPolicyView(props.appInfo.code) : await getAppPolicyView(props.appInfo.code)
    setTreeData(
      formatTreeData(
        result.map(item => ({
          key: item.id,
          title: item.name,
          parentId: item.parentID,
          node: item as AppPolicyView,
        })),
      ),
    );
  }, getRealkey = (data: TreeDataState<AppPolicyView>) => {
    return props.isOrg ? (data.node?.orgPolicy?.id as string) : (data.node?.policyID as string)
  }, checkboxDirChangeKeys = (data: TreeDataState<AppPolicyView>) => {
    const keys: string[] = []
    if (data.node?.kind === AppPolicyViewKind.Policy) {
      keys.push(getRealkey(data))
    }
    data.children?.forEach(item => {
      keys.push(...checkboxDirChangeKeys(item))
    })
    return keys
  }, treeItemRender = (data: TreeDataState<AppPolicyView>) => {
    const list: ReactNode[] = []
    if (data.node?.kind === AppPolicyViewKind.Dir) {
      const keys = checkboxDirChangeKeys(data),
        valueKeys = [...(props.value ?? [])],
        includeLength = valueKeys.filter(key => keys.includes(key)).length,
        value = includeLength === keys.length,
        indeterminate = (includeLength > 0) && (includeLength < keys.length);
      list.push(
        <Flex key={data.key} className={style.dir}>
          <Checkbox
            disabled={props.disabled}
            checked={value}
            indeterminate={indeterminate}
            onChange={(e) => {
              if (e.target.checked) {
                props.onChange?.(Array.from(new Set([...valueKeys, ...keys])))
              } else {
                props.onChange?.(valueKeys.filter(key => !keys.includes(key)))
              }
            }}
          >{data.title}</Checkbox>
        </Flex>
      )
    }
    if (data.children?.length) {
      const kind = data.children[0].node?.kind
      if (kind === AppPolicyViewKind.Dir) {
        list.push(...data.children.map(item => treeItemRender(item)))
      } else {
        list.push(<Flex key={`child${data.key}`} className={style.policy} flex={1}>
          <Space>
            <Checkbox.Group
              value={props.value}
              disabled={props.disabled}
              options={data.children.map(item => ({
                label: `${item.title}`,
                value: getRealkey(item),
              }))}
              onChange={(value) => {
                const currentKeys = data.children?.map(item => getRealkey(item)) ?? []
                const valueKeys = [...(props.value ?? [])].filter(key => !currentKeys.includes(key))
                valueKeys.push(...value)
                props.onChange?.(valueKeys)
              }}
            />
          </Space>
        </Flex>)
      }
    }
    return list
  }

  useEffect(() => {
    reqAppPolicyView()
  }, [props.appInfo])

  return treeData.length != 0 ? <>
    <div className={style.header}>应用：{props.appInfo.name}</div>
    {treeData.length === 0 ? <Empty /> : <></>}
    {
      treeData.map(item => <Flex key={`row${item.key}`} className={style.row}>
        {treeItemRender(item)}
      </Flex>)
    }
  </> : <></>
}
