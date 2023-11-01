import { _getDesignerConfigure } from "@/apis/common";
export default {
  namespaced: true,
  state: {
    isLeftHidden: false, //是否隐藏左侧栏
    isRightHidden: false, //是否隐藏右侧栏
    isShowLeftSec: true, //整个左侧栏是否隐藏，适用于当左侧操作栏都隐藏的情况
    leftType: "product", //左侧栏当前显示类型
    selectedBgTab: 1, //左侧背景默认选中的tab索引, 2代表背景色
    showType: null, //右侧栏当前显示类型
    isShowProductDetail: false, //左侧是否显示商品详情
    isShowLayer: false, //左侧栏是否显示图层
    isFullScreen: false, //是否全屏
    prevFStatus: "normal", //用于记录上一次全屏状态, normal/full, 用于区分快捷键F作为全屏使用还是左右折叠使用
    prevAlignStatus: "", //用于记录上一次对齐的类型，1-9分别为9个方向，用于区分快捷键对齐的下一个操作类型
    designerConfig: {},
    textFamilyOptions: [],
    stateCurNode: {},
    isShowGridLine: false, //是否显示网格线
    isShowAuxiliaryLine: true, //是否显示辅助线
    isShowRuler: false, //是否显示标尺(包含标尺线)
    isShowRulerLine: false, //是否显示标尺线
    textKeepRatioLock: true,
    imgKeepRatioLock: true,
    isEffectFixed: false, //效果图是否脱离文档流(fixed)
    isEffectMini: false, //效果图是否最小化
    isShowPositionOpt: false, //是否显示位置与变换弹窗
    saveProductLoading: false, //保存加入购物车等按钮loading
    saveTemplateLoading: false, //保存模板loading
  },
  getters: {},
  mutations: {
    toggleLeft(state, args) {
      state.isLeftHidden = args;
    },
    toggleRight(state, args) {
      state.isRightHidden = args;
    },
    changeFullScreen(state, args) {
      state.isFullScreen = args;
    },
    changeLeftType(state, args) {
      state.leftType = args;
    },
    toggleProductDetail(state, args){
      state.isShowProductDetail = args;
    },
    toggleLayer(state, args){
      state.isShowLayer = args;
    },
    setDesignerConfig(state, args) {
      state.designerConfig = Object.assign({}, args);
    },
    setfontFamilyList(state, args) {
      state.textFamilyOptions = args;
    },
    changeSelectType(state, args) {
      state.showType = args;
    },
    changeSelectNode(state, args) {
      state.stateCurNode = args;
    },
    toggleGridLine(state, args) {
      state.isShowGridLine = args;
    },
    toggleAuxiliaryLine(state, args) {
      state.isShowAuxiliaryLine = args;
    },
    toggleRuler(state, args) {
      state.isShowRuler = args;
    },
    toggleRulerLine(state, args) {
      state.isShowRulerLine = args;
    },
    changePrevFStatus(state, args) {
      state.prevFStatus = args;
    },
    changePrevAlignStatus(state, args) {
      state.prevAlignStatus = args;
    },
    changeTextKeepRatioLock(state, args) {
      state.textKeepRatioLock = args;
    },
    changeImgKeepRatioLock(state, args) {
      state.imgKeepRatioLock = args;
    },
    changeEffectFixedStatus(state, args){
      state.isEffectFixed = args;
    },
    changeEffectMiniStatus(state, args){
      state.isEffectMini = args;
    },
    changePositionOptStatus(state, args){
      state.isShowPositionOpt = args;
    },
    updateIsShowLeftSec(state, args){
      state.isShowLeftSec = args;
    },
    updateSelectedBgTab(state, args){
      state.selectedBgTab = args;
    },
    updateSaveProductLoading(stage, args) {
      stage.saveProductLoading = args
    },
    updateSaveTemplateLoading(stage, args) {
      stage.saveTemplateLoading = args
    },
  },
  actions: {
    async getDesignerConfig({ commit }, args) {
      let ret = await _getDesignerConfigure();
      commit("setDesignerConfig", ret.data);
      return ret;
    },
  },
};
