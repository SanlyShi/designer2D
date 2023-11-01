export default {
  namespaced: true,
  state: {
    gallery_id: "",
    galleryData: [],
    curGalleryData: {
      data: {}
    },
    curGalleryDataRealTime: {},
    detailImageList: [],
    designImgList: [],
    isLargePreview: false, //是否预览大图
    largeDetailImageList: [], //细节图弹窗大图
    swiperCurId: 0,
    pickDefineColor: '#000000',
    pickColorData: {
      color: '',
      isPickColor: false,
      type: ''
    },
    is3dModel: false,
    isSelectedProduct: true,
    // isImgReplace: true, //是否替换图片
    filterData: {}, //滤镜接口返回的图片信息
    isAddingBg: false, //是否正在添加背景图
  },
  getters: {},
  mutations: {
    changeCurGalleryData(state, args) {
      state.curGalleryData = args;
    },
    changeCurGalleryDataRealTime(state, args) {
      state.curGalleryDataRealTime = args;
    },
    addGallaryData(state, args) {
      state.galleryData.push(args.data);
      state.curGalleryData = args;
    },

    reset(state) {
      state.galleryData = [];
    },
    getDetailImageList(state, args) {
      state.detailImageList = args.data;
    },
    getDesignImgList(state, args) {
      state.designImgList = args.data
    },
    getLargeDetailImageList(state, args) {
      state.largeDetailImageList = args.data;
    },
    setLargePreviewState(state, args) {
      state.isLargePreview = args;
    },
    setSwiperCurId(state, args) {
      state.swiperCurId = args;
    },
    setpickDefineColor(state, args) {
      state.pickDefineColor = args;
    },
    setPickColor(state, args) {
      state.pickColorData = args;
    },
    changeDetailType(state, args) {
      state.is3dModel = args.type;
      state.isSelectedProduct = args.isSelectedProduct;
    },
    // changeImgReplaceStatus(state, args){
    //   state.isImgReplace = args;
    // },
    setFilterData(state, args){
      state.filterData = args;
    },
    updateIsAddingBg(state, args){
      state.isAddingBg = args;
    },
  },
  actions: {
    addGallaryData(context, args) {
      context.commit("addGallaryData", args);
    },
    // getDetailImageList(context, args) {
    //   context.commit("getDetailImageList", args);
    // },
  },
};
