/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createModel } from 'ice';
import { LoginRes } from '@/services/user'
import { setLoginRes } from '@/localstorage/user'

interface ModelState {
  currentUser: LoginRes
}

export default createModel({
  state: {
    currentUser: {},
  } as ModelState,
  reducers: {
    updateLoginRes(prevState: ModelState, payload) {
      // 存储local
      setLoginRes(payload)
      // 设置状态
      prevState.currentUser = payload;
    },
  },
});
