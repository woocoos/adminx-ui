import { formatTreeData, } from "@/util"
import { Transfer, Tree } from "antd"
import { ReactElement, ReactNode } from "react"

export type TransferTreeAndListdataSource<T> = {
    key: string
    title: string
    parentId: string
    disabled?: boolean,
    node?: T
    children?: TransferTreeAndListdataSource<T>[]
}

type TransferTreeAndListdataProps<T> = {
    targetKeys: string[]
    dataSource: TransferTreeAndListdataSource<T>[]
    titles?: [string, string]
    render?: (data: TransferTreeAndListdataSource<T>) => string | ReactNode | ReactElement
    onChange?: (targetKeys: string[]) => void
}

export default function <T>(props: TransferTreeAndListdataProps<T>) {
    const
        getTreeData = () => {
            return formatTreeData(props.dataSource || [])
        },
        render = (item: TransferTreeAndListdataSource<T>) => {
            if (props.render) {
                return props.render(item) as any
            }
            return item.title
        }

    return (
        <Transfer
            showSelectAll={false}
            targetKeys={props.targetKeys}
            dataSource={props.dataSource}
            titles={props.titles || ["可选项", "已选项"]}
            listStyle={{
                maxHeight: "300px",
            }}
            render={render}
            onChange={(targetKeys) => {
                props.onChange?.(targetKeys)
            }} >
            {({ direction, onItemSelectAll, selectedKeys }) => {
                if (direction === 'left') {
                    const checkedKeys = [...selectedKeys, ...props.targetKeys]
                    return (
                        <div style={{ overflow: 'auto', maxHeight: '250px' }}>
                            <Tree
                                key="rule"
                                blockNode
                                checkable
                                expandedKeys={props.dataSource.map(item => item.key)}
                                checkedKeys={checkedKeys}
                                titleRender={render}
                                treeData={getTreeData()}
                                onCheck={(cks: string[], { checked }) => {
                                    onItemSelectAll(cks, checked)
                                }}
                                onSelect={(cks: string[], { selected }) => {
                                    onItemSelectAll(cks, selected)
                                }}
                            />
                        </div>
                    );
                }
            }}
        </Transfer>
    )
}

