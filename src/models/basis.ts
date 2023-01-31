import { createModel } from 'ice';

interface ModelState {
  locale: "zh-CN" | "zh-TW" | "en-US";
}

export default createModel({
  state: {
    locale: "zh-CN",
  } as ModelState,
  reducers: {
    updateLocale(prevState: ModelState, payload) {
      prevState.locale = payload;
    },
  },
});
