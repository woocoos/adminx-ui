import { App, AppPolicyView, AppPolicyViewKind } from "@/generated/adminx/graphql"
import { getAppPolicyView } from "@/services/adminx/app/policy"
import { formatTreeData, TreeDataState } from "@/util"
import { Checkbox, Flex, Space } from "antd"
import { ReactNode, useEffect, useState } from "react"
import style from "./checkPolicyView.module.css"

export default (props: {
  appInfo: App
  value?: string[]
  onChange?: (value: string[]) => void
}) => {
  const [treeData, setTreeData] = useState<TreeDataState<AppPolicyView>[]>([])

  const reqAppPolicyView = async () => {
    const result = await getAppPolicyView(props.appInfo.code)
    setTreeData(
      formatTreeData(
        result.map(item => ({
          key: item.id,
          title: item.name,
          parentId: item.parentID,
          node: item,
        })),
      ),
    );
  }, checkboxDirChangeKeys = (data: TreeDataState<AppPolicyView>) => {
    const keys: string[] = []
    if (data.node?.kind === AppPolicyViewKind.Policy) {
      keys.push(data.key)
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
              options={data.children.map(item => ({
                label: `${item.title}`,
                value: item.key,
              }))}
              onChange={(value) => {
                const currentKeys = data.children?.map(item => item.key) ?? []
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

  return <>
    <div className={style.header}>应用：{props.appInfo.name}</div>
    {
      treeData.map(item => <Flex key={`row${item.key}`} className={style.row}>
        {treeItemRender(item)}
      </Flex>)
    }
  </>
}
