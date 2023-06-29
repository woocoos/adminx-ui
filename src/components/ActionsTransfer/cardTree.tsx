import { AppAction, AppActionMethod } from '@/__generated__/adminx/graphql';
import { EnumAppActionMethod } from '@/services/adminx/app/action';
import { ProCard } from '@ant-design/pro-components';
import { Checkbox } from 'antd';

export default (props: {
  method: AppActionMethod;
  checkedKeys: string[];
  dataSource: AppAction[];
  appCode?: string;
  readonly?: boolean;
  onChange: (keys: string[]) => void;
}) => {
  const list: AppAction[] = props.dataSource.filter(item => item.method === props.method);

  const
    checkKeys = () => {
      const allKeys = list.map(item => (props.appCode ? `${props.appCode}:${item.name}` : item.name));
      return props.checkedKeys.filter(key => allKeys.includes(key));
    },
    checkAll = () => {
      if (list.length) {
        return checkKeys().length === list.length;
      } else {
        return false;
      }
    },
    indeterminateAll = () => {
      const checkedLength = checkKeys().length;
      return checkedLength > 0 && checkedLength != list.length;
    };

  return (<ProCard
    type="default"
    size="small"
    bordered={false}
    headerBordered={false}
    collapsible
    headStyle={{ backgroundColor: 'transparent' }}
    title={
      <div
        className="actionsTransfer-listAllCheckbox"
        onClick={(event) => {
          event.stopPropagation();
          if (props.readonly) { } else {
            const allKeys = list.map(item => (props.appCode ? `${props.appCode}:${item.name}` : item.name));
            if (checkAll()) {
              props.onChange(props.checkedKeys.filter(key => !allKeys.includes(key)));
            } else {
              props.onChange([...props.checkedKeys, ...allKeys.filter(key => !props.checkedKeys.includes(key))]);
            }
          }
        }}
      >
        <div className="mask" />
        <Checkbox
          disabled={props.readonly}
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
        <div
          key={item.id}
          className="actionsTransfer-listCheckbox"
          onClick={(event) => {
            event.stopPropagation();
            if (!props.readonly) {
              const key = props.appCode ? `${props.appCode}:${item.name}` : item.name;
              if (props.checkedKeys.includes(key)) {
                props.onChange(props.checkedKeys.filter(kitem => kitem != key));
              } else {
                props.onChange([...props.checkedKeys, key]);
              }
            }
          }}
        >
          <div className="mask" />
          <Checkbox
            disabled={props.readonly}
            checked={props.checkedKeys.includes(props.appCode ? `${props.appCode}:${item.name}` : item.name)}
          >
            <div>{props.appCode ? `${props.appCode}:${item.name}` : item.name}</div>
            <div>{item.comments}</div>
          </Checkbox>
        </div>
      ))
    }

  </ProCard >);
};
