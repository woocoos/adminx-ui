import { history } from 'ice';
import { useEffect } from 'react';

const tipStr = '您还有内容未保存，是否离开！';
const pathName = {
    when: true
}

/**
 * 拦截离开检查确认离开后回调
 * @param callback 确认离开
 */
export const checkLave = (callback: () => void) => {
    if (pathName.when) {
        callback()
    } else {
        if (confirm(tipStr)) {
            pathName.when = true;
            callback()
        }
    }
}

/**
 * 设置是否拦截离开
 * @param when true:不拦截，false:拦截
 */
export const setLeavePromptWhen = (when: boolean) => {
    pathName.when = when
}

/**
 * 一般在layout引入，主要检测浏览器刷新
 * TODO：浏览器的前进和回退无法拦截
 */
export default () => {
    const onBeforeunload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        if (!pathName.when) {
            event.returnValue = tipStr;
            return tipStr
        } else {
            return true
        }
    }

    useEffect(() => {
        window.addEventListener('beforeunload', onBeforeunload)
        return () => {
            window.removeEventListener('beforeunload', onBeforeunload)
        }
    }, [])

    return <></>
}

/**
 * 使用在Link 标签上的处理
 * @param props 
 * @returns 
 */
export const Link = (props: {
    to: string
    children: JSX.Element
}) => {
    return <a onClick={() => {
        checkLave(() => {
            pathName.when = true;
            history?.push(props.to)
        })
    }}>
        {props.children}
    </a>
}