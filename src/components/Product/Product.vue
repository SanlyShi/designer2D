<template>
  <div class="product-box">
    <div class="search-field">
      <div class="tab-row" v-if="$sdkConfig.platformIsZWKJ">
        <div class="switch-tab">
          <div class="tab-item" v-for="item in cgTypeData" :key="item.id" :class="{'active': cgType==item.id}" @click="changeCgType(item.id)">
            {{item.name}}
          </div>
        </div>
      </div>
      <div class="search-row mt12 ml20 mr20">
        <SearchBar 
          :placeholder="$sdkConfig.platformIsZWKJ ? '产品名称/编码/SPU编码' : '搜索商品名'"
          v-model="searchParams.name"
          :has-filters="hasFilters"
          :show-filters="$sdkConfig.platformIsZWKJ"
          @save="changeKeyword"
        >
          <template slot="filter">
            <ProductFilter :value="searchParams.filters" @save="changeFilter"></ProductFilter>
          </template>
        </SearchBar>
        <el-popover
          placement="top-start"
          trigger="click"
          :visible-arrow="false"
          popper-class="cgselector-popover"
          :open-delay="0"
          :close-delay="0"
          transition=""
          ref="cgSelector"
          v-model="isShowCgSelector"
          v-if="$sdkConfig.platform != 'xcxBackend'"
        >
          <a class="cgitem" :class="{'active': searchParams.cg[0]!=allCgId}" slot="reference">
            <span>
              分类
            </span>
          </a>
          <el-cascader-panel
            v-if="!isChangingCgType"
            v-model="searchParams.cg"
            :options="cgData"
            :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'id', label: 'name', children: 'sub_categorys' }"
            size="small"
            @change="changeCg"
          >
          </el-cascader-panel>
        </el-popover>
      </div>
      <div class="mt12 ml20 mr20" v-if="$sdkConfig.platformIsZWKJ">
        <Sort
          :data="sortData"
          :sortField.sync="searchParams.sortField"
          :sortType.sync="searchParams.sortType"
          @change="changeSort"
        >
          <template slot="other">
          <i :class="['iconfont pointer', searchParams.showAllCg==1 ? 'iconsort-neat' : 'iconfolder']"
            @click="changeListDisplayType(searchParams.showAllCg)">
          </i>
          </template>
        </Sort>
      </div>
    </div>
    <div class="search-result" ref="resultBox">
      <div class="empty-box" v-if="!isLogin&&(cgType==2||searchParams.sortField=='order_qty')">
        <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
        <div class="mt10 f14">您需要登录后才可查看收藏商品</div>
        <el-button type="primary" class="mt10 zw-btn" style="width:60px;" @click="toLogin">登录</el-button>
      </div>
      <template v-else>
        <div class="zw-loader" v-if="isLoading">
          <span class="spinner"></span>
        </div>
        <div class="list-box relative" v-else>
          <div class="filter-title" v-if="result.historyCg.length">
            <div @click="showLess">
              <i class="iconfont iconarrow-left-bold"></i>
              {{result.path.join('/')}}
            </div>
          </div>
          <!-- <div class="content scroll-bar"
            v-infinite-scroll="loadMore" 
            :infinite-scroll-disabled="waterfallDisable"
            :infinite-scroll-immediate="false"
            :infinite-scroll-distance="10"
          > -->
          <div class="content scroll-bar">
            <ProductList
              :data="result.data"
              :layout.sync="result.layout"
              :historyCg="result.historyCg"
              @showMore="showMore"
              @refresh="collectCb"
            ></ProductList>
            <!-- <div class="loadmore-tips" v-if="waterfall.isLoading && result.layout==1">
              <div class="el-icon-loading"></div>
              <div>加载中</div>
            </div> -->
          </div>
          <Pagination
            :total="result.total"
            :pageSize="pageSize"
            :curPage.sync="result.curPage"
            @change="changePage"
            ref="pagination"
            v-if="result.layout==2"
          ></Pagination>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { GetQueryString, genLocalStorageKey } from "@/utils/utils";
import SearchBar from "@/components/common/SearchBar";
import ProductFilter from "@/components/Product/ProductFilter";
import Sort from "@/components/common/Sort";
import Pagination from "@/components/common/Pagination";
import ProductList from "@/components/Product/ProductList";
import {
  _getProductListFromJava,
  _getCategoryProductListFromJava,
  _getProductTypeCategoryFromJava,
  _getCustomerProductTypeCategoryFromJava
} from "@/apis/product.js";
import eventBus from "@/utils/eventBus.js";
const __searchParams = {
  name: "",
  filters: {},
  cg: [0], //默认选中全部分类
  sortField: "general_heat",
  sortType: "desc",
  showAllCg: 0 //列表搜索结果显示类型，1不按分类，0按分类
};
export default {
  components: {
    SearchBar,
    ProductFilter,
    Sort,
    Pagination,
    ProductList
  },
  data() {
    return {
      initProductAfterGetProductList: false,
      isLogin: this.$isLogin,
      allCgId: this.$sdkConfig.platformIsZWKJ ? 0 : -99,
      // 分类类型
      isChangingCgType: false, //解决级联选择器在切换类型的时候，由于组件同时watch数据value,options的变化，导致控制台报错的问题
      cgType: 1,
      cgTypeData: [
        {id: 1, name: '全部商品'},
        {id: 2, name: '收藏商品'}
      ],
      // 分类
      isShowCgSelector: false,
      sdkCgData: [],
      defaultCgData: [],
      customCgData: [],
      sortData: [
        { field: "general_heat", name: "热力值" },
        { field: "new_time", name: "上架时间" },
        { field: "order_qty", name: "我的销量" },
      ],
      searchParams: {
        name: "",
        filters: {},
        cg: [this.$sdkConfig.platformIsZWKJ ? 0 : -99], //默认选中全部分类
        sortField: "general_heat",
        sortType: "desc",
        showAllCg: 0 //列表搜索结果显示类型，1不按分类，0按分类
      },
      searchParams1: JSON.parse(JSON.stringify(__searchParams)),
      searchParams2: JSON.parse(JSON.stringify(__searchParams)),
      result: {
        layout: 2, //列表布局类型，1分类2分页
        total: 0,
        curPage: 1,
        historyCg: [], //存储查看更多的分类路径,用于返回上一级分类
        path: [], //存储查看更多的路径名称
        isUndefined: false, //是否是未定义分类，如果查看的是未定义分类，返回上一级不需要联动搜索条件的分类(早期接口数据格式问题，现在已废弃)
        data: [],
      },
      isLoading: false,
      pageSize: 30,
      // 按分类搜索，每次加载6个分类的数据，拉到底部加载更多
      waterfall: {
        page: 1,
        pageSize: 7,
        isLoading: false,
        noMore: true, //初始值设置为true, 避免刷新页面首次进入
      }
    };
  },
  computed: {
    cgData(){
      if(this.$sdkConfig.platformIsZWKJ){
        return this.cgType==1 ? this.defaultCgData : this.customCgData;
      } else {
        return this.sdkCgData;
      }
    },
    hasFilters(){
      return Object.values(this.searchParams.filters||{}).some(item=>item!=='');
    },
    // waterfallDisable(){
    //   return this.result.layout==2 || this.isLoading || this.waterfall.isLoading || this.waterfall.noMore;
    // }
  },
  methods: {
    // 通过地址传参改变搜索字段
    changeSearchField(cgType){
      const productSubCg = GetQueryString('productSubCg');
      const productView = GetQueryString('proView');
      const productSortField = GetQueryString('proSortField');
      const productSortType = GetQueryString('proSortType');
      if(productSubCg) this.searchParams.cg = [parseInt(productSubCg)];
      if(productView==='0') this.$set(this.searchParams, 'showAllCg', 1);
      if(productSortField==='general_heat' || productSortField==='new_time' || productSortField==='order_qty'){
        this.$set(this.searchParams, 'sortField', productSortField)
      }
      if(productSortType=== '0'){
        this.$set(this.searchParams, 'sortType', 'asc')
      } else if(productSortType=== '1'){
        this.$set(this.searchParams, 'sortType', 'desc');
      }
    },
    resetHistory() {
      this.result.historyCg = [];
      this.result.path = [];
    },
    changeKeyword(data) {
      this.resetHistory();
      this.search();
    },
    changeFilter(data) {
      this.searchParams.filters = data;
      this.search();
    },
    async changeCgType(type) {
      if(this.cgType == type) return;
      if(this.isLoading) return;
      this.isChangingCgType = true;
      this.cgType = type;
      if(type == 1){
        this.searchParams = Object.assign({}, JSON.parse(JSON.stringify(this.searchParams1)));
        if(!this.defaultCgData.length){
          this.getProductTypeCategory("default");
        } 
      } else if(type == 2){
        this.searchParams = Object.assign({}, JSON.parse(JSON.stringify(this.searchParams2)));
        if(!this.customCgData.length){
          this.getProductTypeCategory("custom");
        }
      }
      this.resetHistory();
      this.search();
      setTimeout(()=>{
        this.isChangingCgType = false;
      }, 300)
    },
    changeCg(data) {
      this.isShowCgSelector = false;
      this.resetHistory();
      this.search();
    },
    changeSort(data) {
      this.search();
    },
    changeListDisplayType(data){
      this.searchParams.showAllCg = (data==1 ? 0 : 1);
      this.resetHistory();
      this.search();
    },
    changePage(data) {
      this.search({ page: data });
    },
    // 查看更多
    showMore(data) {
      let nowCg = [...this.searchParams.cg];
      let isUndefined;
      // 判断查看的是否是未定义分类
      if (nowCg[nowCg.length - 1] == data.id) {
        isUndefined = true;
      } else {
        isUndefined = false;
        if (nowCg.length == 1 && nowCg[0] == this.allCgId) {
          // this.searchParams.cg = [data.id];
          // -1会被转化为字符串
          this.searchParams.cg = [data.id==-1 ? Number(data.id) : data.id];
        } else {
          this.searchParams.cg = [...nowCg].concat([data.id]);
        }
      }
      this.result.isUndefined = isUndefined;
      this.result.historyCg.push(nowCg);
      this.result.path.push(data.name);
      this.search({ isUndefined: isUndefined });
    },
    // 返回上一级
    showLess() {
      let newCg = [...this.searchParams.cg];
      if (!this.result.isUndefined) {
        newCg.pop();
      }
      if (!newCg.length) {
        newCg = [this.allCgId];
      }
      this.searchParams.cg = newCg;
      this.result.isUndefined = false;
      this.result.historyCg.pop();
      this.result.path.pop();
      this.search();
    },
    searchParamsToCache(){
      if(this.cgType == 1){
        this.searchParams1 = JSON.parse(JSON.stringify(this.searchParams));
      } else {
        this.searchParams2 = JSON.parse(JSON.stringify(this.searchParams));        
      }
    },
    async search(options, cb) {
      if(this.$sdkConfig.platformIsZWKJ){
        this.searchParamsToCache();
        if(!this.isLogin&&(this.cgType==2 || this.searchParams.sortField=='order_qty')) return;
      }
      if(this.isLoading) return;
      // if(this.isLoading || this.waterfall.isLoading) return;
      let searchParams = JSON.parse(JSON.stringify(this.searchParams));
      let dataItem = Object.assign(searchParams, {...searchParams.filters}, {is_custom: 1});
      delete dataItem.filters;
      dataItem.cg = dataItem.cg[dataItem.cg.length - 1];
      let resLayout;
      if(dataItem.showAllCg==1){
        dataItem.pageSize = this.pageSize;
        dataItem.page = options && options.page ? options.page : 1;
        resLayout = 2;
      } else {
        let isLastCg = options && options.page ? true : this.checkIsLastCg();
        if (isLastCg) {
          dataItem.pageSize = this.pageSize;
          dataItem.page = options && options.page ? options.page : 1;
          resLayout = 2;
        } else {
          resLayout = 1;
        }
      }

      this.isLoading = true;
      // if(options?.loadMore){
      //   this.waterfall.isLoading = true;
      //   this.waterfall.page++;
      // } else {
      //   this.isLoading = true;
      //   this.waterfall.page = 1;
      // }

      let ret;
      let defaultProductCode;
      // 接口重构，将参数转化为java接口需要的数据 start
      if(this.$sdkConfig.platformIsZWKJ || this.$sdkConfig.platform == 'xcxBackend'){
        dataItem.is_collection = this.cgType != 1;
        dataItem.sys_cat_id = this.$sdkConfig.platform == 'xcxBackend' ? 0 :dataItem.cg;
      } else {
        dataItem.cat_id = dataItem.cg;
        if(this.$sdkConfig.platform == 'xcxBackend'){
          dataItem.cat_id = 0
        }
      }
      delete dataItem.cg;
      if(this.$sdkConfig.platformIsZWKJ || this.$sdkConfig.platform == 'xcxBackend'){
        if(dataItem.name){
          dataItem.keyword = dataItem.name;
        }
        delete dataItem.name;
      }
      if(dataItem.group_level){
        dataItem.level = [dataItem.group_level];
      }
      delete dataItem.group_level;
      if(dataItem.purchase_price_from || dataItem.purchase_price_to){
        dataItem.price_range = {
          from: dataItem.purchase_price_from,
          to: dataItem.purchase_price_to
        }
      }
      delete dataItem.purchase_price_from;
      delete dataItem.purchase_price_to;
      if(dataItem.delivery_time_from || dataItem.delivery_time_to){
        dataItem.ship_range_list = [{
          from: dataItem.delivery_time_from,
          to: dataItem.delivery_time_to
        }]
      }
      delete dataItem.delivery_time_from;
      delete dataItem.delivery_time_to;
      if(dataItem.design_area_shape){
        dataItem.design_area_shapes = dataItem.design_area_shape.split(',');
      }
      delete dataItem.design_area_shape;
      if(dataItem.ids){
        dataItem.ids = dataItem.ids.trim().replace(/\s+/g, ',').replace(/，/g,',').replace(/[\u4e00-\u9fa5]/g, '').split(',').filter(a=>a!='');
      } else {
        delete dataItem.ids;
      }
      dataItem.sort = [{
        "sort_by": dataItem.sortField=='sort' ? 'general_heat' : dataItem.sortField, //解决不明原因请求sort_by发送值为'sort'的情况
        "sort_type": dataItem.sortType=='asc' ? 1 : 2
      }];
      delete dataItem.sortField;
      delete dataItem.sortType;
      delete dataItem.showAllCg;
      // 接口重构，将参数转化为java接口需要的数据 end
      if(resLayout == 2){ //按分页
        dataItem.page_size = dataItem.pageSize;
        delete dataItem.pageSize;
        ret = await _getProductListFromJava(dataItem);
      } else { //按分类
        dataItem.page = 1;
        dataItem.page_size = 199;
        // dataItem.page = this.waterfall.page;
        // dataItem.page_size = this.waterfall.pageSize;
        ret = await _getCategoryProductListFromJava(dataItem);
      }

      this.result.layout = resLayout;
      this.result.total = resLayout==2 ? ret.data.total : 0;
      if(resLayout==2){
        this.result.total = ret.data.total;
        this.result.data = ret.data.list;
        this.result.curPage = dataItem.page;
      } else {
        this.result.total = 0;
        options?.loadMore ? this.result.data.push(...ret.data) : this.result.data = ret.data;
        // this.waterfall.noMore = !ret.data.length;
      }
      this.isLoading = false;
      // this.waterfall.isLoading = false;

      if (this.$sdkConfig.platformIsZWKJ && this.initProductAfterGetProductList) {
        this.initProductAfterGetProductList = false
        // 如果产品列表数据第一项没有拿到code，是因为收藏列表为空，取非收藏列表第一项的code
        if (
            !ret.data.list?.[0].code ||
            !ret.data.items?.list?.[0].code
        ) {
          dataItem.is_collection = false
          let ret
          if(resLayout == 2){
            ret = await _getProductListFromJava(dataItem);
          }else {
            ret = await _getCategoryProductListFromJava(dataItem);
          }
          defaultProductCode = ret.data[0].code || ret.data[0].items?.list?.[0].code
        }
        this.initSelectedProduct(defaultProductCode)
      }

      const localStorageKey = genLocalStorageKey('productParams');
      if(this.$sdkConfig.platformIsZWKJ){
        // 保存搜索参数到localStorage
        if (localStorage.getItem(localStorageKey)) {
          localStorage.removeItem(localStorageKey);
        }
        let customerId = this.isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
        let paramsCache = {
          [customerId]: {
            cgType: this.cgType,
            params: this.searchParams
          },
        };
        localStorage.setItem(localStorageKey, JSON.stringify(paramsCache));
      }
      if (cb) cb(isLastCg, ret.data);
    },
    loadMore(){
      this.search({loadMore: true});
    },
    // 计算分页加载个数
    calcPageSize() {
      return this.pageSize;
      // let boxHeight = this.$refs.resultBox.clientHeight;
      // if(boxHeight<=0){
      //   boxHeight = document.documentElement.clientHeight || document.body.clientHeight - 211;
      // }
      // let paginationHeight = 44,
      //   imgHeight = 98,
      //   column = 3;
      // return parseInt(
      //   Math.floor((boxHeight - paginationHeight) / imgHeight) * column
      // );
    },
    // 获取分类
    async getProductTypeCategory(type) {
      let res;
      if(type == 'sdk'){
        res = await _getProductTypeCategoryFromJava();
        this.sdkCgData = res.data || [];
      } else if (type == "default") {
        res =await _getProductTypeCategoryFromJava({ type: "1" })
        this.defaultCgData = res.data || [];
      } else if (type == "custom") {
        if(this.isLogin){
          res = await _getCustomerProductTypeCategoryFromJava({ type: "1" })
          this.customCgData = res.data || [];
        } else {
          this.customCgData = [];
        }
      }
      return res&&res.data ? res.data : [];

    },
    // 判断当前选中分类是否最后一级，如果是最后一级分类则分页查找该分类下的所有产品，否则显示该分类的子分类
    checkIsLastCg() {
      let data = this.cgType == 1 ? this.defaultCgData : this.customCgData;
      let selected = this.searchParams.cg;
      if (selected.length === 1 && selected[0] == this.allCgId) {
        return false;
      } else {
        let newData = [...data];
        for (let i = 0; i < selected.length; i++) {
          let node = newData.find((a) => a.id == selected[i]);
          newData = node ? node.sub_categorys : [];
        }
        return newData && newData.length ? false : true;
      }
    },
    // 初始化默认选中的产品，有传产品code时，默认选中该产品，否则取接口返回值
    async initSelectedProduct(code) {
      if(GetQueryString("customProId") || GetQueryString("product_code")) return //替换产品，直接使用定制产品code设计
      let params = {default: 1, code: ''};
      if (GetQueryString("blankProId") || GetQueryString("product_type_id")) {
        params.code = GetQueryString("blankProId") || GetQueryString("product_type_id")
      } else if(GetQueryString('comProduct')==1){ //comProduct=1表示热力值第一的产品
        params.comProduct = 1;
        delete params.default;
      } else if (localStorage.getItem(genLocalStorageKey("blankProId"))) {
        params.code = localStorage.getItem(genLocalStorageKey("blankProId"));
      }

      if (!params.code) {
        const firstProductCode = this.result.data[0]?.items?.list[0]?.code || this.result.data[0]?.code || code
        if (!firstProductCode) {
          this.initProductAfterGetProductList = true
          return
        }

        params.code = firstProductCode
      }

      this.$store.commit('product/updateSelectedProduct', Object.assign(this.$store.state.product.selectedProduct, {isLoading: true}))
      const productData = await this.$store.dispatch("product/updateSelectedProduct", params);

      localStorage.setItem(genLocalStorageKey("blankProId"), productData.code);
      if(GetQueryString("blankProId")){
        this.$store.commit('layout/toggleProductDetail', true);
      }
      // 更新价格
      // this.$store.dispatch("product/updateProductPrice", {code: productData.code});
      // 更新详情
      // this.$store.dispatch("product/updateSelectedProductDetail", {code: productData.code});
    },
    collectCb(data){
      if(this.cgType == 1){
        this.$set(data, 'is_collect', !data.is_collect);
      } else {
        setTimeout(()=>{
          this.resetHistory();
          this.search();
        }, 1000)
      }
    },
    toLogin(){
     eventBus.$emit('showLoginPop')
    },
    async init(){
      if(this.$sdkConfig.platformIsZWKJ){
        this.initSelectedProduct();
        // this.pageSize = this.calcPageSize();
        // 未登录只显示默认分类，已登录且有自定义分类优先显示自定义分类
        // 已登录时，如果之前有搜索过产品，刷新页面保持之前的搜索参数
        let productSubCg = GetQueryString('productSubCg');
        let paramsCache = localStorage.getItem(genLocalStorageKey("productParams"));
        paramsCache = paramsCache ? JSON.parse(paramsCache) : null;
        let customerId = this.isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
        if(productSubCg || !this.isLogin){
          this.cgType = 1;
          if(paramsCache && paramsCache[customerId] && paramsCache[customerId].cgType == 1){
            this.searchParams = paramsCache[customerId].params;
          }
          this.changeSearchField(this.cgType);
          await this.getProductTypeCategory("default");
        } else {
          if(paramsCache && paramsCache[customerId] && paramsCache[customerId].cgType == 1){
            this.cgType = 1;
            this.searchParams = paramsCache[customerId].params;
            this.changeSearchField(this.cgType);
            await this.getProductTypeCategory("default");
          } else {
            this.cgType = 2;
            if(paramsCache && paramsCache[customerId]){
              this.searchParams = paramsCache[customerId].params;
            }
            this.changeSearchField(this.cgType);
            await this.getProductTypeCategory("custom");
          }
        }
        this.search();
      } else {
        const customProId = GetQueryString("customProId") || GetQueryString("product_code")
        if(!customProId){ //替换产品，直接使用定制产品code设计
          let params = {default: 1, code: ''};
          if (GetQueryString("product_type_id")) {
            params.code = GetQueryString("product_type_id");
            params.default = -1;
          } else {
            let localStorageKey = genLocalStorageKey("blankProId");
            if(localStorage.getItem(localStorageKey)){
              params.code = localStorage.getItem(localStorageKey);
              params.default = -1;
            }
          }
          this.$store.commit('product/updateSelectedProduct', Object.assign(this.$store.state.product.selectedProduct, {isLoading: true}))
          const productData = await this.$store.dispatch("product/updateSelectedProduct", params);
          // 更新详情
          this.$store.commit('product/updateSelectedProductDetail', productData);
          this.$store.commit('product/updateProductDetailCache', {
            code: productData.code,
            data: productData
          })
        }
        if(GetQueryString("product_type_id") || !this.$sdkConfig.product.isSupportList){
          this.$store.commit('layout/toggleProductDetail', true);
        }
        this.getProductTypeCategory("sdk");
        if(this.$sdkConfig.product.isSupportList){
          this.searchParams = Object.assign({}, this.searchParams, {
            sortField: "new_time",
            showAllCg: 1
          })
          this.search();
        }
      }
    }
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
$primary: #0453F3;
.product-box {
  width:100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tab-row{
  border-bottom: 1px solid #F0F2F5;
}
.switch-tab{
  display: flex;
  justify-content: center;
  font-size: 16px;
  width: 200px;
  height: 48px;
  line-height: 48px;
  margin: 0 auto;
  font-weight: 600;
  .tab-item{
    width: 100%;
    text-align: center;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    &.active{
      @include font_color("font_color2");
      border-color:$primary;
    }
  }
}
.search-row{
  display: flex;
  justify-content: space-between;
}
.search-result {
  flex: 1;
  overflow: hidden;
  display: flex; //兼容小屏safari
  flex-direction: column;
  .zw-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
.list-box {
  height: 100%;
  overflow: hidden;
  & > .content {
    height: 100%;
    overflow: auto;
    position: relative;
  }
}
.filter-title {
  padding: 0 20px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  width: 100%;
  height: 52px;
  line-height: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  @include font_color("font_color2");
  background: #fff;
  margin-right: 10px;
  font-size: 14px;
  i {
    vertical-align: -2px;
  }
}
.cgitem{
  flex-shrink: 0;
  width: 42px;
  height: 32px;
  border-radius: 16px;
  @include border(1px, solid, "border_color1");
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 7px;
  cursor: pointer;
  &.active {
    @include font_color("font_color2");
    @include background_color("background_color3");
    border-color: transparent !important;
  }
  &:hover {
    @include border(1px, solid, "border_color2");
  }
}
.pagination {
  width: calc(100% - 10px);
}
.pointer{
  cursor: pointer;
}
.empty-box{
  text-align: center
}
.zw-btn{
  font-size: 14px;
  padding: 8px 0;
  border-radius: 16px;
}
/deep/ .el-loading-spinner i {
  @include font_color("font_color2");
}
/deep/ .el-loading-spinner .el-loading-text {
  @include font_color("font_color2");
}
.loadmore-tips {
  width: 100%;
  height: 60px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  color: #9cb1c3;
  line-height: 17px;
  background: linear-gradient(
    180deg,
    rgba(96, 115, 127, 0) 0%,
    rgba(96, 115, 127, 0.2) 100%
  );
}
</style>
<style lang="scss">
  .cgselector-popover{
    margin-top: 0 !important;
    padding: 0 !important;
  }
</style>