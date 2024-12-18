import { Input, Tag } from "antd"
import { useState } from "react"
import { useTranslation } from "react-i18next"


export default (props: {
  value?: string[]
  onChange?: (value: string[]) => void
  disabled?: boolean
}) => {
  const { t } = useTranslation(),
    [value, setValue] = useState<string>()

  return (
    <div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`${t('input_enter')}`}
        disabled={props.disabled}
        onPressEnter={() => {
          if (value) {
            props.onChange?.([...(props.value || []), value])
            setValue('')
          }
        }}
      />
      <div style={{ paddingTop: 10 }}>
        {props.value?.map((item, index) => (
          <Tag key={index} bordered={false} closable={!props.disabled}
            onClose={() => {
              props.onChange?.(props.value?.filter(v => v !== item) ?? [])
            }}>
            {item}
          </Tag>
        ))}
      </div>
    </div>
  )
}
