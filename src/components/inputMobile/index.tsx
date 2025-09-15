import { Country } from "@/generated/adminx/graphql";
import { getCountryList } from "@/services/adminx/country";
import { Input, InputProps, Select } from "antd";
import { useEffect, useState } from "react";

export default (props: {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  inputProps?: InputProps;
}) => {
  const [code, setCode] = useState<string>()
  const [mobile, setMobile] = useState<string>()
  const [countryList, setCountryList] = useState<Country[]>([])

  const reqCountryList = async () => {
    const res = await getCountryList({
      pageSize: 100,
      current: 1,
    })
    setCountryList((res?.edges?.map(item => item?.node) as Country[]) ?? [])
  }

  useEffect(() => {
    reqCountryList()
  }, [])

  useEffect(() => {
    if (props.value) {
      const vlit = props.value.split(' ')
      if (vlit.length === 1) {
        setCode('+86')
        setMobile(vlit[0])
      } else if (vlit.length === 2) {
        setCode(vlit[0])
        setMobile(vlit[1])
      } else {
        setCode('+86')
        setMobile(undefined)
      }
    } else {
      setCode('+86')
      setMobile(undefined)
    }
  }, [props.value])

  return <Input
    value={mobile}
    onChange={(e) => {
      setMobile(e.target.value)
      props.onChange?.(`${code} ${e.target.value}`)
    }}
    disabled={props.disabled}
    addonBefore={
      <Select
        style={{ width: 90 }}
        value={code}
        onChange={(v) => {
          setCode(v)
          props.onChange?.(`${v} ${mobile}`)
        }}
        popupMatchSelectWidth={false}
        options={
          countryList.map(item => ({
            label: `+${item.code}`, value: `+${item.code}`,
            optionLabel: `${item.name}(+${item.code})`
          }))
        }
        optionRender={(option) => option.data.optionLabel}
      />
    }
    {...props.inputProps}
  />
}