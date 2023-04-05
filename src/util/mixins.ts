import { useEffect } from 'react';

/**
 * 检测页面离开时候没保存提示
 */
export const useLeavePageDetection = () => {

    // TODO 后续处理  需要看如何多层级监听

    // const tipStr = '还有未保存内容，是否离开！';

    // const onBeforeunload = (event) => {
    //     event.preventDefault();
    //     event.returnValue = tipStr;
    //     return tipStr
    // }

    // useEffect(() => {

    //     window.addEventListener('beforeunload', onBeforeunload)


    //     return () => {
    //         window.removeEventListener('beforeunload', onBeforeunload)

    //         // if (!confirm(tipStr)) {
    //         // }
    //         console.log('leavePage')
    //     }
    // },)
}