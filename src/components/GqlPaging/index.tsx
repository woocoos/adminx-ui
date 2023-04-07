import { Button, Space, Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ListPageInfo, PagingParams } from "@/services/graphql";
import { DefaultOptionType } from "antd/es/select";
import { useState } from "react";
import styles from "./index.module.css";

export default function GqlPaging(props: {
    total?: number
    pageInfo?: ListPageInfo
    style: React.CSSProperties
    pageSize?: number
    pageSizeOption?: DefaultOptionType[]
    onChange?: (paging: PagingParams) => void
}) {

    const { total, pageInfo, pageSize, style, onChange } = props,
        [pageSizeValue, setPageSizeValue] = useState(pageSize || 10),
        options: DefaultOptionType[] = [
            { value: 10, label: '10条/页' },
            { value: 20, label: '20条/页' },
            { value: 50, label: '50条/页' },
            { value: 100, label: '100条/页' },
        ]

    const onPageSize = (value: number) => {
        // 切换页码
        setPageSizeValue(value)
        onChange?.({
            before: pageInfo?.startCursor,
            last: value
        })
    }, onPreviousClick = () => {
        // 上一页
        onChange?.({
            before: pageInfo?.startCursor,
            first: pageSizeValue
        })
    }, onNextClick = () => {
        // 下一页
        onChange?.({
            after: pageInfo?.endCursor,
            last: pageSizeValue
        })
    }

    return (
        <div className={styles.gqlPage} style={style}>
            <Space>
                <Button size='small' type="text" disabled={!pageInfo?.hasPreviousPage} onClick={onPreviousClick} >
                    <LeftOutlined />
                </Button>
                <Button size="small" type="text">共{total || 0}条</Button>
                <Button size='small' type="text" disabled={!pageInfo?.hasNextPage} onClick={onNextClick}>
                    <RightOutlined />
                </Button>
                <Select value={pageSizeValue} size="small" options={props.pageSizeOption || options} onChange={onPageSize} />
            </Space>
        </div>
    );
}
