export default {
  namespaced: true,
  state: {
    isShowClip: false, //是否显示裁切列表
    clipData: {}, //当前选中的裁切路径
    isPathChange: {
      status: false,
      init: false, //是否初始状态，初始状态需要还原之前的原图和路径
    },
    isClipSave: false,
    isCliping: false, //是否正在裁切
  },
  getters: {},
  mutations: {
    updateIsShowClip(state, args){
      state.isShowClip = args;
    },
    setClipData(state, args){
      state.clipData = args;
    },
    updateIsPathChange(state, args){
      state.isPathChange = args;
    },
    updateIsClipSave(state, args){
      state.isClipSave = args;
    },
    updateClipStatus(state, args){
      state.isCliping = args;
    }
  }
}
