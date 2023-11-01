const getters = {
  view_id: (state) => state.view_id,
  allViewsCfg: (state) => state.allViewsCfg,
  galleryData: (state) => state.gallery.galleryData,
  curViewIndexList: (state) => state.curViewIndexList,
  initLoading: (state) => state.initLoading,
  // 当前面的历史记录
  historyList: (state) => state.historyListMap[state.view_id],
  historyStep: (state) => state.historyStepMap[state.view_id],
};

export default getters;
