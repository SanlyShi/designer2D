import {
  _getProductInfoByCode,
  _getProductDetailByCode,
  _getPartPackInfo,
  _get3dModelInfo,
  _getFbaInfo,
  _getFactoryInfo,
  _getCommonCatIdProduct,
  _getCommonFactoryProduct,
  _getProductViews,
  _getProductDetailEffect,
  _getProductDetail,
  _getProductDetailImages,
  _getProductPackages,
  _getSizeSaid,
  _getProductPrices, _getProductBaseInfo
} from "@/apis/product";
import { transModelData, transPartSpuData, transActiveColorSize, transViews, convert3dData } from "@/utils/dataTrans";
import { showLoading, hideLoading } from "@/plugins/element/loading/loading.js";
import { SDKCONFIG } from "@/utils/sdkConfig";
export default {
  namespaced: true,
  state: {
    productCache: {}, //点击过的产品加入缓存, 下次直接从缓存中取值
    productDetailCache: {}, //点击过的产品详情加入缓存
    selectedProduct: {}, //当前选中的产品
    selectedProductDetail: {}, //当前选中产品的详情
    productPrice: {}, //产品价格信息
    editingProduct: {}, //存储当前产品的操作属性，用于其它组件保存数据用
    isShowProductPop: false, //是否显示当前产品详情弹窗
    isShowProductOptTip: false, //是否显示产品详情操作提示
    defaultProductTab: "", //产品详情弹窗打开时默认选中的标签，'size'
    customBoardSupport: false, //是否显示自定义入口
    amazonViewImgObj: {}, //亚马逊定制订单
    amazonOriginalLayer: {
      // 亚马逊定制订单图层数据
      done: false,
    },
    partsList: [], //部件列表
    partCheckedList: [], //选中的部件
    partChangeTimes: 0, //切换部件更新细节图
    showPartDetail: false, //显示部件详情
    partDetail: {}, //部件详情
    isChangeProduct: false, //是否切换产品
    changeProductCode: "", //要切换的产品code
    selectedProductView:{
      name:'',//选中面的名称
      size:"" //选中面的推荐尺寸
    }
  },
  getters: {},
  mutations: {
    UPDATE_SELECTED_VIEW_NAME(state, args){
      state.selectedProductView.name = args
    },
    UPDATE_SELECTED_VIEW_SIZE(state, args){
      state.selectedProductView.size = args
    },
    updateSelectedProduct(state, args) {
      //当前颜色尺码明细没有配置图片则给他默认图片
      if (args.spu_details?.length) {
        args.spu_details?.forEach((spu) => {
          spu.detail_parts?.forEach((part) => {
            part.items?.forEach((i) => {
              if (!i.img) {
                i.img = part.part_detail_img;
              }
            });
          });
        });
      }
      state.selectedProduct = Object.assign({}, args);
    },
    updateSelectedProductDetail(state, args) {
      state.selectedProductDetail = Object.assign({}, args);
    },
    updateProductCache(state, args) {
      if (!state.productCache.code) {
        state.productCache = Object.assign({}, state.productCache, {
          [args.code]: args.data,
        });
      }
    },
    updateProductDetailCache(state, args) {
      if (!state.productDetailCache.code) {
        state.productDetailCache = Object.assign({}, state.productDetailCache, {
          [args.code]: args.data,
        });
      }
    },
    updateProductPrice(state, args){
      state.productPrice = args;
    },
    updateEditingProduct(state, args) {
      state.editingProduct = Object.assign({}, args);
    },
    toggleProductPop(state, args) {
      state.isShowProductPop = args;
    },
    updateIsShowProductOptTip(state, args) {
      state.isShowProductOptTip = args;
    },
    updateDefaultProductTab(state, args) {
      state.defaultProductTab = args;
    },
    updateCustomBoardSupport(state, args) {
      state.customBoardSupport = args;
    },
    updateAmazonViewImgObj(state, args) {
      state.amazonViewImgObj = args;
    },
    updateAmazonOriginalLayer(state, args) {
      state.amazonOriginalLayer = args;
    },
    updatePartsList(state, args) {
      state.partsList = args;
    },
    updatepartCheckedList(state, args) {
      state.partCheckedList = args;
    },
    updatePartChange(state, args) {
      state.partChangeTimes = args;
    },
    updatePartDetail(state, args) {
      if (args.showPartDetail != undefined) {
        state.showPartDetail = args.showPartDetail;
      }
      if (args.partDetail) {
        state.partDetail = args.partDetail;
      }
    },
    updateIsChangeProduct(state, args) {
      state.isChangeProduct = args;
    },
    updateChangeProductCode(state, args) {
      state.changeProductCode = args;
    },
  },
  actions: {
    async updateSelectedProduct({ commit }, args) {
      // const baseInfo = await _getProductInfoByCode(args);

      // //@@@从java获取模型数据并转换格式
      // let modelInfo = await _get3dModelInfo(args);
      // let transModelDataInfo = transModelData(modelInfo.data);
      // //@@@从java获取部件spu，包装，标签信息并转换格式
      // let partPackInfo = await _getPartPackInfo(args);
      const baseInfo = await _getProductBaseInfo(args);
      const [viewsInfo, colorsInfo, modelInfo, partPackInfo] = await Promise.all([
        _getProductViews({code: baseInfo.data.code}),
        _getProductDetailEffect({code: baseInfo.data.code}),
        _get3dModelInfo({code: baseInfo.data.code}),
        _getPartPackInfo({code: baseInfo.data.code})
      ]);
      let transModelDataInfo = transModelData(modelInfo.data);
      let packSpu = transPartSpuData(partPackInfo.data);
      const productData = Object.assign(baseInfo.data || {}, {
        active_color_size: transActiveColorSize(baseInfo.data.active_color_size),
        defaultValues: baseInfo.data.default_values,
        hasDetail: baseInfo.data.has_detail,
        imgFull: baseInfo.data.img_full,
        views: transViews(viewsInfo.data),
        colors: colorsInfo.data.map(color => {
            return {
                ...color,
                detail: color.detail.map(de => {
                  if(de.is_user_defined == 1){
                    de.detail = de.detail.map(_de => {
                      if(_de.type == 5){ //布局
                        _de.layoutData = _de.layout_data;
                      } else if(_de.type == 1 || _de.type == 2){ //底板, 1: 底板图  2：底板模型
                        _de.layoutId = _de.layout_id;
                        if(_de.parts && _de.parts[0].type == 2){
                          _de.parts = convert3dData(_de.parts);
                        }
                      } else if(_de.type == 3){ //文字
                        _de.strokeValue = _de.stroke_value;
                        _de.strokeWidth = _de.stroke_width;
                      } else if(_de.type == 4){ //背景色
                        _de.bgColor = _de.bg_color;
                      } else if(_de.type == 6){ //图片
                        _de.layoutId = _de.layout_id;
                      }
                      return _de;
                    })
                    return de;
                  } else if(de.parts && de.parts[0].type == 2) {
                      return {
                          ...de,
                          parts: convert3dData(de.parts)
                      }
                  } else {
                      return de
                  }
                })
            }
        }),
        show_3d_model: transModelDataInfo,
        spu_details: packSpu.spu_details,
        pack_list: packSpu.pack_list,
        custom_logo_list: packSpu.custom_logo_list,
        show_custom_logo_icon: packSpu.show_custom_logo_icon,
      });
      if(args.isUpdate != -1){
        // 保存记录获取产品后暂时不更新store，等设置完其它值后再手动更新
        commit("updateSelectedProduct", productData);
      }

      // 加入缓存
      if (productData) {
        commit("updateProductCache", {
          code: productData.code,
          data: productData,
        });
      }
      return productData;
    },
    async updateSelectedProductDetail({ commit }, args) {
      showLoading();
      // let ret = await _getProductDetailByCode(args);
      // @@@重构php推荐产品，生产商品，工厂信息，fba相关接口
      // let factoryInfo = await _getFactoryInfo(args);
      // let commonCatIdProduct = await _getCommonCatIdProduct(args);
      // let commonFactoryProduct = await _getCommonFactoryProduct(args);
      const [detail, detailImages, packages, sizeSaid, fbaInfo] = await Promise.all([
        _getProductDetail(args),  //详情
        _getProductDetailImages(args), //细节图
        _getProductPackages(args), //包装规格
        _getSizeSaid(args), //尺码说明
        _getFbaInfo(args) //FBA推荐
      ])
      
      hideLoading();
      const productDetailData = {
        code: args.code,
        detail: detail.data,
        detail_images: detailImages.data,
        packing_list: packages.data,
        size_info:sizeSaid.data,
        fba_package_list: fbaInfo.data.fba_package_list,
        is_fba_package: fbaInfo.data.is_fba_package,
        all_fba_package_list: fbaInfo.data.all_fba_package_list,
        // factoryInfo: factoryInfo.data,
        // commonCatIdProduct: commonCatIdProduct.data,
        // commonFactoryProduct: commonFactoryProduct.data,
      };
      commit("updateSelectedProductDetail", productDetailData);
      // 加入详情缓存
      if (productDetailData) {
        commit("updateProductDetailCache", {
          code: args.code,
          data: productDetailData,
        });
      }
      return productDetailData;
    },
    async updateProductPrice({ commit }, args){
      let ret = await _getProductPrices(args);
      const price = Object.assign({code: args.code}, SDKCONFIG.platformIsZWKJ || SDKCONFIG.platform == 'xcxBackend' ? 
        ret.data : 
        (ret?.data?.length ? ret.data[0] : {})
      );
      commit("updateProductPrice", price);
      return price;
    }
  },
};
