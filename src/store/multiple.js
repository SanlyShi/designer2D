export default {
  namespaced: true,
  state: {
    multipleSelectNodes: [],
    shiftKeyDown: false,
    fireClickState: 0,
  },
  getters: {},
  mutations: {
    //@@@ 选中图片信息在这里更新
    updateMultipleSelectNodes(state, args) {
      state.multipleSelectNodes = args;
    },
    updateShiftKeyDown(state, args) {
      state.shiftKeyDown = args;
    },
    updateFireClickState(state, args) {
      state.fireClickState = args;
    },
  },
};
