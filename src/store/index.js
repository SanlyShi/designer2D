import Vue from "vue";
import Vuex from "vuex";
import layout from "./layout";
import product from "./product";
import gallery from "./gallery";
import shortcut from './shortcut';
import clip from './clip';
import group from './group';
import multiple from './multiple';
import getters from "./getters";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    view_id: 1, //当前面id
    curNodeId: 'view-1', //当前选中图层的id(_id值)
    allViewsCfg: [], //所有面信息
    curViewCfg: [], //当前面信息
    curViewIndexList: [0, 1, 2, 3], //细节图可视区域Index
    initLoading: true, //项目初始化loading
    //操作记录
    historyListMap: {},
    historyStepMap: {},
    isHistoryFreeze: false, //是否冻结撤销重做按钮，冻结时点击暂时无效
    isSaveBoard: false, //保存自定义底板
    isShowCustomBoard: false, //是否显示自定义底板弹窗
    loginImg: '',
    urlQueryObj: {},
    isUploadImgGuarantee: false,
    // 新功能提示
    newTips: {},
    userPermission: {}, //用户权限相关
  },
  mutations: {
    //切换面信息
    changeView(state, args) {
      state.view_id = args;
      // state.curViewCfg = state.allViewsCfg[args];
    },
    // 修改当前选中的图层id
    changeCurNodeId(state, args) {
      state.curNodeId = args;
    },
    setViewCfg(state, args) {
      // if (state.allViewsCfg[state.view_id]) {
      //   state.allViewsCfg[state.view_id] = [];
      // }
      state.allViewsCfg = args
    },
    changeCurViewIndexList(state, args) {
      state.curViewIndexList = args.curViewIndexList;
    },
    setInitLoading(state, args) {
      state.initLoading = args;
    },
    // 操作记录
    emptyHistory(state, args) {
      delete state.historyListMap[args.view_id];
    },
    addHistory(state, args) {
      let list = state.historyListMap[args.view_id];
      state.historyListMap = Object.assign({}, state.historyListMap, {
        [args.view_id]: list && list.length ? list.concat([args]) : [args]
      })
    },
    updateHistory(state, args) {
      let list = state.historyListMap[args.view_id];
      list[args.index].is_undo = args.is_undo;
      state.historyListMap = Object.assign({}, state.historyListMap, {
        [args.view_id]: list
      });
    },
    updateHistoryStep(state, args) {
      state.historyStepMap = Object.assign({}, state.historyStepMap, {
        [args.view_id]: args.val
      })
    },
    updateHistoryFreeze(state, args){
      state.isHistoryFreeze = args;
    },
    updateSaveBoard(state, args){
      state.isSaveBoard = args;
    },
    updateIsShowCustomBoard(state, args){
      state.isShowCustomBoard = args;
    },
    updateLoginImg(state, args){
      state.loginImg = args;
    },
    updateUrlQueryObj(state, args) {
      state.urlQueryObj = args;
    },
    updateImgGuaranteeStatus(state, args){
      state.isUploadImgGuarantee = args;
    },
    updateNewTips(state, args){
      state.newTips = args;
    },
    updateUserPermission(state, args){
      state.userPermission = args;
    }
  },
  actions: {
    //重置数据
    resetData(context) {
      context.commit("gallery/reset");
    },
    //获取当前图库配置信息
    changeCurGallery(context, args) {
      let data = context.rootState.curViewCfg[args.index];
      context.commit("gallery/setGalleryData", data);
    },
    addViewCfg(context, args) {
      context.commit("setViewCfg", args);
    },
  },
  modules: {
    layout,
    product,
    gallery,
    shortcut,
    clip,
    multiple,
    group
  },
  getters,
});
