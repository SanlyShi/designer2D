<template>
  <div class="gallery-box">
    <div class="search-field mt12">
      <div class="search-row">
        <SearchBar
          ref="searchBar"
          placeholder="搜索图片"
          v-model="searchForm.keyword"
          :has-filters="hasFilterParams"
          :show-filters="$sdkConfig.platformIsZWKJ"
          @save="search"
          style="flex:1;"
        >
          <template slot="filter">
            <GalleryFilter :value="filterParams" @save="changeFilter"></GalleryFilter>
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
          ref="categoryCascader"
          v-model="isShowCgSelector"
          v-show="isShowCategory"
          v-if="$sdkConfig.platform != 'xcxBackend'"
        >
           <a class="cgitem" :class="{'active': searchForm.cgId[0]!=allCgId}" slot="reference">
             <!-- <span>
              <i class="iconfont iconmenu"></i>
             </span> -->
             <span>
              分类
              </span>
          </a>
          <el-cascader-panel 
            v-model="searchForm.cgId"
            :options="cgData"
            :props="{ expandTrigger: 'hover',checkStrictly:true,label:'name',value:'id',children:'subCg'}"
            size="small"
            @change="changeCgId"
          >
          </el-cascader-panel>
        </el-popover>
      </div>
      <div class="upload-box" v-if="$sdkConfig.upload">
        <el-upload
          v-if="(uploadImgGuarantee&&isLogin) || !$sdkConfig.platformIsZWKJ"
          ref="upload"
          multiple
          accept="image/png, image/jpg, image/jpeg"
          action="#"
          :show-file-list="false"
          :http-request="httpRequest"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
        >
          <div class="upload-btn"><span class="el-icon-plus mr3"></span>上传背景图</div>
        </el-upload>
        <div class="upload-btn" v-else @click="canUploadCheck"><span class="el-icon-plus mr3"></span>上传背景图</div>
      </div>
      <div class="attr-row mt12">
        <div class="switch-attr">
          <div class="attr-item" 
            v-for="item in cgTypeData" 
            :key="item.id" 
            :class="{'active': cgType==item.id}" 
            @click="changeCgType(item.id)"
          >
            <a>{{item.name}}</a>
          </div>
        </div>
      </div>
      <template v-if="$sdkConfig.platformIsZWKJ">
        <div class="attr-row customer-list mt12" v-show="cgType!=''">
          <el-select
            style="width:100%"
            v-model="searchForm.customer_id"
            size="small"
            class="mr10 __zw-select"
            @change="changeCustomer"
          >
            <el-option label="全部关联账号图库" value v-show="cgType!=''"></el-option>
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.name || item.realname"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="mt12 ml20 mr20">
          <Sort
            :data="sortData"
            :sortField.sync="searchForm.sortField"
            :sortType.sync="searchForm.sortType"
            @change="changeSort"
          >
            <template slot="other">
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                :content="listLayout=='waterfall' ? '切换为网格显示' : '切换为瀑布流显示'"
                placement="top"
                slot="reference"
              >
                <span
                  @click="changeListLayout()"
                  :class="['iconfont', 'cp', listLayout=='waterfall'?'iconsort-Irregular':'iconsort-neat']"
                ></span>
              </el-tooltip>
            </template>
          </Sort>
        </div>
      </template>
    </div>
    <!-- 搜索结果 -->
    <div ref="galleryWaterfullList" class="gallery-container gallery-pull" v-show="listLayout=='waterfall'">
      <div
        class="v-waterfall-content scroll-bar"
        id="v-waterfall"
        v-infinite-scroll="getMoreData"
        infinite-scroll-distance="10"
        :infinite-scroll-disabled="disabled"
      >
        <template v-if="waterfallData.length">
          <div
            v-for="(img,index) in waterfallData"
            class="v-waterfall-item zw-image-box"
            :key="img.src+index"
            draggable
            @dragstart="dragStartFun($event, img.data)"
            @click="handelClick(img.data)"
            @mouseenter="showimgItemDetail($event, img.data)"
            @mouseleave="hideImgItemDetail($event, img.data)"
            :style="{top:img.top+'px',left:img.left+'px',width:waterfallConfig.imgWidth+'px',height:img.height}"
          >
            <el-card shadow="hover" :body-style="{'padding':'0px','border-radius':'10px'}">
              <!-- 图片懒加载 -->
              <el-image :src="img.src" class="image" :key="img.src" lazy v-if="leftType=='background' && selectedBgTab==1">
                <!-- 加载前占位 -->
                <div slot="placeholder" class="image-slot">
                  <div
                    :style="{height:img.height+'px',width:waterfallConfig.imgWidth+'px',backgroundColor:img.color}"
                  ></div>
                </div>
                <!-- 加载失败占位 -->
                <div slot="error" class="image-slot">
                  <div
                    :style="{height:img.height+'px',width:waterfallConfig.imgWidth+'px',backgroundColor:img.color}"
                  >失败</div>
                </div>
              </el-image>
            </el-card>
            <template v-if="img.data.__riskInfo && img.data.__riskInfo.show">
              <el-tooltip :enterable="false" effect="dark" placement="top">
                <div slot="content" v-html="img.data.__riskInfo.tips"></div>
                <span class="risk-tips">
                  <i
                    class="iconfont iconcaveat-triangle-fill"
                    :style="{'color': img.data.__riskInfo.color}"
                  ></i>
                </span>
              </el-tooltip>
            </template>
          </div>
        </template>
        <template v-else-if="!waterfallLoading">
          <div class="empty-box" v-if="!isLogin&&cgType!=''&&$sdkConfig.platformIsZWKJ&&$sdkConfig.platform != 'xcxBackend'">
            <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">您需要登录后才可查看图片</div>
              <el-button type="primary" class="mt10 zw-btn" style="width:60px;" @click="toLogin">登录</el-button>
          </div>
          <div class="empty-box" v-else>
            <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
            <div class="mt10 f14">没有符合条件的背景图</div>
          </div>
        </template>
      </div>
      <div class="loadmore-tips" v-show="waterfallLoading">
        <div class="el-icon-loading"></div>
        <div>加载中</div>
      </div>
    </div>
    <div class="gallery-grid-container" v-show="listLayout=='grid'">
      <div ref="galleryGridList" class="gallery-grid scroll-bar" v-zwloading="gridLoading">
        <div class="gallery-list" v-if="gridData.length&&!gridLoading">
          <div
            class="gallery-item zw-image-box"
            v-for="(imgItem,index) in gridData"
            :key="index"
            draggable
            @dragstart="dragStartFun($event, imgItem)"
            @click="handelClick(imgItem)"
            @mouseenter="showimgItemDetail($event, imgItem)"
            @mouseleave="hideImgItemDetail($event, imgItem)"
          >
            <el-image
              :src="imgItem.previewImg"
              class="image"
              :key="index"
              v-if="leftType=='background' && selectedBgTab==1"
            ></el-image>
            <template v-if="imgItem.__riskInfo && imgItem.__riskInfo.show">
              <el-tooltip :enterable="false" effect="dark" placement="top">
                <div slot="content" v-html="imgItem.__riskInfo.tips"></div>
                <span class="risk-tips">
                  <i
                    class="iconfont iconcaveat-triangle-fill"
                    :style="{'color': imgItem.__riskInfo.color}"
                  ></i>
                </span>
              </el-tooltip>
            </template>
          </div>
        </div>
        <template v-else>
          <div class="empty-box" v-if="!isLogin&&cgType!=''&&$sdkConfig.platformIsZWKJ &&$sdkConfig.platform != 'xcxBackend'">
            <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
            <div class="mt10 f14">您需要登录后才可查看图片</div>
            <el-button type="primary" class="mt10 zw-btn" style="width:60px;" @click="toLogin">登录</el-button>
          </div>
          <div class="empty-box" v-else>
            <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
            <div class="mt10 f14">没有符合条件的背景图</div>
          </div>
        </template>
      </div>
      <Pagination
        :total="total"
        :pageSize="pageSize"
        :curPage.sync="page"
        @change="changePage"
        ref="pagination"
      ></Pagination>
    </div>

    <!-- 图片详情悬浮框 -->
    <transition name="fade" :duration="{ enter: 0, leave: 300 }">
      <div
        @mouseover="isShowDetail=true"
        @mouseleave="isShowDetail=false"
        ref="galleryDetail"
        class="gallery-info-box scroll-bar"
        :style="{'top': detailPos.top, 'bottom': detailPos.bottom}"
        v-show="isShowDetail"
      >
        <template v-if="gallery">
          <div class="imgPanInfoDesigner flex flex-row-center">
            <img :src="gallery.designImg" alt />
          </div>
          <div class="info-cont">
            <div class="row flex flex-col-ct mb10">
              <div class="flex flex-col-ct">
                <span class="f14 name mr6">
                  {{gallery.name|substrString}}{{(gallery.imageUrl || gallery.previewImg)|getExt}}
                </span>
              </div>
              <div v-if="$sdkConfig.platformIsZWKJ">
                <span style="color:#02D392" v-if="!cgType&&Number(gallery.price)==0">限时免费</span>
                <!-- <el-tooltip
                  :enterable="false"
                  v-if="!cgType&&Number(gallery.price)==0"
                  class="item"
                  effect="dark"
                  content="限时免费"
                  placement="top"
                >
                  <span class="iconfont iconfree f16" style="color:#02D392"></span>
                  <svg
                    class="zw-svg-icon iconfree"
                    aria-hidden="true"
                    style="width:16px;height:16px"
                  >
                    <use xlink:href="#iconfree" />
                  </svg>
                </el-tooltip>-->
                <span class="f16 price" v-if="!cgType&&Number(gallery.price)>0">￥{{gallery.price}}</span>
              </div>
            </div>
            <div class="row flex" style="flex-wrap: wrap;">
              <div class="size f12 mb5">
                <span class="f12 id mr8" v-if="$sdkConfig.platformIsZWKJ">ID：{{gallery.id}}</span>
                <span class="f12 id mr8" v-else>{{gallery.code}}</span>
                <!-- <span>{{gallery.size.width}}x{{gallery.size.height}} px</span> -->
              </div>
              <div class="flex flex-col-ct mb5" v-if="$sdkConfig.platformIsZWKJ">
                <span class="iconfont iconavatar mr4" style="color:#0453F3"></span>
                <span class="design-name">{{gallery.design_customer_name}}</span>
              </div>
            </div>
            <div class="row mt5">
              <span>{{gallery.size.width}}*{{gallery.size.height}}px</span>
            </div>
          </div>
          <div class="imgPanInfoDesc" v-if="imgPanInfoDesc[gallery.code]">
            <div v-html="imgPanInfoDesc[gallery.code]" class="f12 content scroll-bar"></div>
          </div>
        </template>
      </div>
    </transition>
    <el-dialog
      :visible.sync="isShowEmptyGalleryTip"
      custom-class="zw-empty-gallery-pop"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      width="480px"
    >
      <div slot="title" class="dialog-title">
      温馨提示
      </div>
      <div class="dialog-content pl25">
        <template v-if="$sdkConfig.platformIsZWKJ">
          <p>您的图库剩余可用容量不足！<span class="js-empty-gallery-tip" v-html="emptyGalleryHtml"></span></p>
          <p>如需要上传图片，可执行以下方案后继续操作：</p>
          <p v-if="userInfo.groupLevel==4">1、图库扩容：前往 <a target="_blank" class="blue" href="/merchant/payValueAddedService/index">增值服务</a> 中购买库存容量。</p>
          <p v-else>1、图库扩容：前往 <a target="_blank" class="blue" href="/merchant/vipLevel/index">VIP服务</a> 中升级会员，或通过 <a target="_blank" class="blue" href="/merchant/payValueAddedService/index">增值服务</a> 中购买库存容量。</p>
          <p>2、释放图库：及时清理 <a target="_blank" class="blue" href="/merchant/customerGallery/index">我的图库</a> 和 <a target="_blank" class="blue" href="/merchant/material/index">素材管理</a> 中可释放图库容量</p>
        </template>
        <template v-else>
          <p>图库容量不足，请联系商家处理！</p>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowEmptyGalleryTip = false">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import GalleryPop from '@/components/Gallery/GalleryPop'
import SearchBar from "@/components/common/SearchBar";
import GalleryFilter from "@/components/Gallery/GalleryFilter";
import Pagination from "@/components/common/Pagination";
import { deepClone, GetQueryString } from "@/utils/utils";
import { _uploadImg, _imgSizeIsOverService } from '@/apis/uploadImg'
import { transformPicOrTemplateListData } from "@/utils/dataTrans";
import {
  _getGalleryCategory,
  _getCustomerGalleryCategory,
  _getGallery,
  _getGalleryInfoDesc
} from "@/apis/gallery.js";
import {_getPrivatePhotos} from '@/apis/uploadImg.js'
import Sort from "@/components/common/Sort";
import eventBus from "@/utils/eventBus.js";
import { genRiskInfo, isRisk } from "@/utils/gallery.js";
import {getSDKUserCode, genLocalStorageKey} from '@/utils/utils.js'
export default {
  components: {
    GalleryPop,
    SearchBar,
    GalleryFilter,
    Sort,
    Pagination,
  },
  data() {
    return {
      allCgId: this.$sdkConfig.platformIsZWKJ ? '' : -2,
      isInitSearch: true, //页面初始时搜索标志,避免首次重复请求
      isLogin: this.$isLogin,
      userInfo: this.$isLogin ? this.$OPTIONS.userInfo : {},
      // 搜索条件
      cgType: '',
      searchForm: {
        keyword: "",
        cgId: [''],
        customer_id: '',
        sortField: "position",
        sortType: "desc",
      },
      filterParams: {},
      cgData: [],
      isShowCgSelector: false,
      // 搜索结果
      listLayout: 'grid', //waterfall或grid
      gridData: [],
      gridLoading: false,
      page: 1,
      pageSize: 30,
      total: 0,
      // 瀑布流
      waterfallConfig: {
        column: 2,
        imgWidth: 132,
        marginRight: 8,
        marginBottom: 8
      },
      waterfallHeightTemp: [0,0],
      waterfallData: [],
      waterfallLoading: false,
      waterfallPage: 1,
      waterfallPageSize: 30,
      noMore: false,
      //图片悬浮弹窗展示
      isShowDetail: false,
      showImgSize: {
        imgHeight: 200,
        imgWidth: 200,
      },
      imgPanInfoDesc: {},
      detailPos: { top: 0, bottom: 0 },
      gallery: null, //图片数据 悬浮
      dataItem: {}, //图片数据 点击
      // 上传图片
      fileList: [],
      isShowEmptyGalleryTip: false,
      emptyGalleryHtml: '',
      beforeUploadPromise: [],
      beforeUploadFileList: [],
      allowUpload: 0, //1：允许上传 2：不允许上传
    };
  },
  computed: {
    config() {
      return this.$store.state.layout.designerConfig;
    },
    uploadImgGuarantee(){
      return this.$store.state.isUploadImgGuarantee;
    },
    cgTypeData(){
      return [
        {id: '1', name: '我的图片'},
        {id: '', name: '图片素材'}
      ]
    },
    // 是否显示分类， 使用第三方图库接口时，不显示分类
    isShowCategory(){
      if(this.$sdkConfig.platformIsZWKJ){
        return this.cgType != '';
      } else {
        return this.cgType == '' && !this.$sdkConfig.customGallery?.galleryApi;
      }
    },
    customerList(){
      return this.config.customerList
    },
    sortData(){
      if(this.cgType==''){
        return [
          { field: "combine", name: "综合排序" },
          { field: "openTime", name: "上新时间" },
        ]
      } else {
        return [
          { field: "position", name: "系统排序" },
          { field: "created", name: "创建时间" },
          { field: "size", name: "大小" },
        ]
      }
    },
    leftType() {
      // el-image增加leftType判断，避免用户在数据返回之前切到其它标签页后返回导致图片不加载
      return this.$store.state.layout.leftType;
    },
    selectedBgTab(){
      return this.$store.state.layout.selectedBgTab;
    },
    isLoading() {
      return this.$store.getters.initLoading;
    },
    hasFilterParams(){
      return Object.values(this.filterParams).some(item=>item!='');
    },
    disabled(){
      return this.waterfallLoading || this.noMore;
    }
  },
  filters: {
    getExt(value) {
      if (value) {
        let index = value.lastIndexOf(".");
        let ext = value.substr(index);
        return ext;
      } else {
        return ".jpg";
      }
    },
    substrString(name='') {
      if (name.length > 15) {
        return name.slice(0, 9) + "..." + name.slice(-3);
      } else {
        return name;
      }
    },
  },
  watch: {
    isLoading(nv, ov){
      if(!nv){
        this.initData();
      }
    },
  },
  methods: {
    async initData(){
      if(this.$sdkConfig.platformIsZWKJ){
        const localStorageKey = genLocalStorageKey('backgroundParams');
        let paramsCache = localStorage.getItem(localStorageKey);
        paramsCache = paramsCache ? JSON.parse(paramsCache) : null;
        let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : 'unlogin';
        if(paramsCache && paramsCache[customerId]){
          // 初始化搜索参数并搜索
          this.initParams(paramsCache[customerId]);
        } else {
          if(this.$isLogin){
            let ret = await _getGalleryCategory({is_public: 0, customer_id: ''});
            this.cgData = ret.data || [];
            this.isInitSearch = false;
            this.search();
          } else {
            this.isInitSearch = false;
            this.search();
          }
        }
      } else {
        if(!this.$sdkConfig.customGallery?.galleryApi){
          var ret = await _getGalleryCategory();
          this.cgData = ret.data || [];
          this.searchForm.cgId = this.cgData.length ? [this.cgData[0].id] : [this.allCgId];
          this.$set(this.searchForm, 'sortField', 'openTime');
        }
        this.isInitSearch = false;
        this.search();
      }
    },
    // 初始化搜索参数
    async initParams(params){
      this.cgType = params.cgType;
      this.searchForm = params.searchForm;
      if(this.$isLogin){
        if(this.cgType == 1){
          let ret = await _getGalleryCategory({is_public: 0, customer_id: this.searchForm.customer_id});
          this.cgData = ret.data || [];
        }
      } else {
        this.searchForm.customer_id = '';
        this.searchForm.cgId = [''];
      }
      this.filterParams = params.filterParams;
      this.listLayout = params.listLayout;
      this.page = this.listLayout == 'grid' ? params.page : 1;
      this.isInitSearch = false;
      this.search(true, {page: this.page});
    },
    changeCgType(type){
      if(this.cgType == type) return;
      if(this.listLayout=='waterfall' && this.waterfallLoading) return;
      if(this.listLayout=='grid' && this.gridLoading) return;
      this.cgType = type;
      if(this.$sdkConfig.platformIsZWKJ){
        switch(this.cgType){
          case '':
            this.searchForm.customer_id = '';
            this.searchForm.cgId = [''];
            this.searchForm.sortField = 'combine';
            break;
          default:
            this.searchForm.sortField = 'position';
            break;
        }
      } else {
        this.searchForm.sortField = this.cgType=='' ? 'openTime' : 'created';
      }
      if(!this.isLogin && type!=''&&this.$sdkConfig.platformIsZWKJ) {
        this.gridData = [];
        this.waterfallData = [];
        return;
      }
      this.search();
    },
    changeCgId(value){
      this.searchForm.cgId = value;
      this.isShowCgSelector = false;
      // this.$refs.categoryCascader.dropDownVisible = false;
      this.search();
    },
    async changeCustomer(val){
      if(this.$isLogin){
        let ret = await _getGalleryCategory({is_public: 0, customer_id: this.searchForm.customer_id});
        this.cgData = ret.data || [];
      } else {
        this.cgData = [];
      }
      this.searchForm.cgId = [''];
      this.search();
    },
    changeFilter(data){
      this.filterParams = data;
      this.search();
    },
    changeSort(){
      this.search();
    },
    changePage(){
      this.search(false);
    },
    toLogin(){
      eventBus.$emit('showLoginPop')
    },
    changeListLayout() {
      this.listLayout = this.listLayout=='waterfall' ? 'grid' : 'waterfall';
      if(this.listLayout == 'waterfall'){
        if(!this.waterfallData.length){
          this.search();
        }
      } else {
        if(!this.gridData.length){
          this.search();
        }
      }
    },
    async search(isReload=true, opt={}){
      if(this.isInitSearch) return;
      if(!this.isLogin&&this.cgType!=''&&this.$sdkConfig.platformIsZWKJ) return;
      if(this.listLayout=='waterfall' && this.waterfallLoading) return;
      if(this.listLayout=='grid' && this.gridLoading) return;
      if(isReload){
        this.page = opt.page || 1;
        this.total = 0;
        this.gridData = [];
        this.waterfallPage = 1;
        this.noMore = false;
        this.waterfallData = [];
        this.waterfallHeightTemp = [0, 0];
      }
      let params = {
        type: 2, //1主题图,2背景图
        ...this.searchForm,
        ...this.filterParams,
        page: this.listLayout=='waterfall' ? this.waterfallPage : this.page,
        pageSize: this.listLayout=='waterfall' ? this.waterfallPageSize : this.pageSize,
        product_type_id: this.$store.state.product.selectedProduct.id,
        is_public: this.cgType=='' ? 1 : '',
      };
      if(this.cgType==''){
        params.is_material = 1;
      }
      params.cgId = this.searchForm.cgId&&this.searchForm.cgId.length ? this.searchForm.cgId[this.searchForm.cgId.length-1] : [""];
      // 保存搜索参数
      const localStorageKey = genLocalStorageKey('backgroundParams');
      if(this.$sdkConfig.platformIsZWKJ){
        if (localStorage.getItem(localStorageKey)) {
          localStorage.removeItem(localStorageKey);
        }
        let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
        let paramsCache = {
          [customerId]: Object.assign({
            searchForm: this.searchForm,
            filterParams: this.filterParams,
            page: params.page,
            cgType: this.cgType,
            listLayout: this.listLayout,
          })
        };
        localStorage.setItem(localStorageKey, JSON.stringify(paramsCache));
      }
      if(this.listLayout == 'waterfall'){
        this.waterfallLoading = true;
      } else {
        this.gridLoading = true;
      }
      let res, isExternal = false;
      if(this.$sdkConfig.platformIsZWKJ || this.$sdkConfig.platform == 'xcxBackend'){
        res = await _getGallery(params);
        if(this.$sdkConfig.platform == 'xcxBackend'){
          res = transformPicOrTemplateListData(res)
        }
      } else {
        delete params.is_material;
        delete params.is_public;
        if(this.cgType==''){
          if(this.$sdkConfig.customGallery?.galleryApi){
            const externalParams = {
              type: 2,
              keyword: params.keyword,
              page: params.page,
              pageSize: params.pageSize
            };
            isExternal = true;
            try {
              res = await _getGallery(externalParams, true);
              // 将外部摄图网返回的格式转成内部格式
              res.data.data = res.data.data?.map(item => {
                return {
                  code: item.code,
                  name: item.name,
                  size: item.size,
                  previewImg: item.preview_img,
                  designImg: item.preview_img,
                  designImg2: item.preview_img,
                  designImg3: item.preview_img,
                  originImg: item.design_img
                }
              });
            } catch (error) {}
          } else {
            res = await _getGallery(params);
          }
        } else {
          delete params.product_type_id
          delete params.cgId
          if(this.$sdkConfig.platform != 'xcxBackend') {
            params.external_customer_id = getSDKUserCode(this.$OPTIONS); //第三方的会员id
          }else{
            delete params.external_customer_id
          }
          res = await _getPrivatePhotos(params);
        }
      }
      if(this.listLayout == 'waterfall'){
        this.waterfallLoading = false;
        this.imgPreloading(res.data.data, isExternal);
        this.waterfallPage++;
        if(res.data.data.length < this.waterfallPageSize){
          this.noMore = true;
        }
      } else {
        this.gridLoading = false;
        this.gridData = res.data.data.map(item => {
          item.__riskInfo = genRiskInfo(item);
          if(isExternal) {
            item.sdk_info = {
              sdk_gallery_code: item.code,
              sdk_gallery_url: item.originImg
            };
          }
          return item;
        });
        this.total = res.data.total;
      }
      this.isInitSearch = false;
    },
    imgPreloading(imgList, isExternal){
      let promises = [];
      for (let i = 0; i < imgList.length; i++) {
        let promise = new Promise((resolve, reject) => {
          let aImg = new Image();
          aImg.src = imgList[i].previewImg;
          let imgData = {};
          imgList[i].__riskInfo = genRiskInfo(imgList[i]);
          if(isExternal) {
            imgList[i].sdk_info = {
              sdk_gallery_code: imgList[i].code,
              sdk_gallery_url: imgList[i].originImg
            }
          }
          imgData.data = imgList[i];
          aImg.onload = () => {
            imgData.color = "#EEF2F8";
            imgData.height = (this.waterfallConfig.imgWidth / aImg.width) * aImg.height;
            imgData.src = imgList[i].previewImg;
            this.waterfallData.push(imgData);
            this.rankImg(imgData);
            resolve();
          }
          aImg.onerror = (e) => {
            resolve();
          };
        }); 
        promises.push(promise);
      }
      // 当前页加载完后如果内容高度小于容器高度，则获取下一页数据，避免无法触发下拉滚动导致数据不全
      Promise.all(promises).then(res => {
        if(imgList.length){
          let containerHeight = this.$refs.galleryWaterfullList.clientHeight;
          if(containerHeight > Math.max(...this.waterfallHeightTemp)){
            this.getMoreData();
          }
        }
      })
    },
    rankImg(imgData){
      // 找到最短的列并返回下标
      let minItem = Math.min.apply(null, this.waterfallHeightTemp);
      let minIndex = this.waterfallHeightTemp.indexOf(minItem);
      imgData.top = this.waterfallHeightTemp[minIndex];
      imgData.left = minIndex * (this.waterfallConfig.imgWidth + this.waterfallConfig.marginRight);
      this.waterfallHeightTemp[minIndex] += imgData.height + this.waterfallConfig.marginBottom;
    },
    getMoreData(){
      this.search(false);
    },
    handelClick(data) {
      this.$statisticalreport.addDesignItem('背景图')
      if (isRisk(data)) {
        this.$message.error("图片信息异常，无法使用");
        return;
      }
      this.dataItem = data;
      this.$store.commit("layout/changeSelectType", "image");
      eventBus.$emit("galleryClick", { galleryData: data,  isBg: true});
    },
    dragStartFun(e, data){
      if (isRisk(data)) {
        this.$message.error("图片信息异常，无法使用");
        return;
      }
      e.dataTransfer.setData('dragData', JSON.stringify({data, isBg: true}));
    },
    //悬浮弹窗展示图片信息
    showimgItemDetail(e, data) {
      let maxSize = 260,
        imgWidth = 0,
        imgHeight = 0,
        size = data.size;
      if (size.width > size.height) {
        imgWidth = maxSize;
        imgHeight = (maxSize * size.height) / size.width;
      } else {
        imgHeight = maxSize;
        imgWidth = (maxSize * size.width) / size.height;
      }

      this.showImgSize = {
        imgWidth,
        imgHeight,
      };

      this.gallery = Object.assign({}, data);
      this.getImgPanInfoDesc(data);

      this.$nextTick(() => {
        let winHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        let objPos = e.target.getBoundingClientRect();
        let popHeight = this.$refs.galleryDetail.clientHeight;
        if (winHeight - objPos.top > popHeight) {
          this.detailPos = Object.assign({
            top: objPos.top - 50 + "px",
            bottom: "auto",
          });
        } else {
          this.detailPos = Object.assign({ top: "auto", bottom: 0 });
        }
        this.isShowDetail = true;
      });
    },
    hideImgItemDetail(e, data) {
      this.isShowDetail = false;
    },
    getImgPanInfoDesc(data) {
      if(this.$sdkConfig.platformIsZWKJ){
        let id = data.code;
        if (!this.imgPanInfoDesc.hasOwnProperty(id)) {
          _getGalleryInfoDesc({
            id: id,
            data: {
              type: "designInfo",
              mediaType: "json",
            },
          }).then((res) => {
            this.imgPanInfoDesc[id] = res.data.desc;
          });
        }
      }
    },
    // 上传背景图
    async httpRequest(param){
      let file = param.file; // 相当于input里取得的files
      let formData = new FormData(); // FormData 对象
      formData.append("image", file); // 文件对象
      formData.append("id", file.uid);
      formData.append("name", file.name);
      formData.append("type", file.type);
      formData.append("lastModifiedDate", file.lastModifiedDate);
      formData.append("size", file.size);
      formData.append('gallery_type', 2);
      if(!this.$sdkConfig.platformIsZWKJ && this.$sdkConfig.platform != 'xcxBackend'){
        let userCode = getSDKUserCode(this.$OPTIONS);
        formData.append('external_customer_id', userCode);
      }
      _uploadImg(formData)
        .then(res => {
          this.$message.success("上传成功！");
        })
        .catch(e => {
          this.$message.error(e.msg ? e.msg : "上次失败");
        });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    debounce(func, wait) {
      if(this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        func();
      }, wait);
    },
    getAllFileListBeforeUpload() {
      for(let file of this.beforeUploadFileList) {
        const isLt30M = file.size / 1024 / 1024 < 30;
        if (!isLt30M) {
          this.$message.error("上传图片大小不能超过 30MB!");
          this.allowUpload = 2
          setTimeout(() => {
            this.beforeUploadPromise = []
            this.beforeUploadFileList = []
            this.allowUpload = 0
          }, 2000);
          return
        }
      }
      // let isAgree= this.isAgree
      // if(!isAgree){
      //   this.$message.warning("请先阅读并同意法律声明协议");
      // }
      const imgSize = this.beforeUploadFileList.reduce((size, item) => {return size + item.size;}, 0);
      _imgSizeIsOverService().then(res => {
        if (res.status > 0) {
          // 超出图库容量
          let {
            gallery_over_capacity,
            gallery_all_used_capacity,
            gallery_all_used_capacity_size,
            gallery_capacity
          } = res.data;
          const gallery_capacity_size = parseFloat(gallery_capacity)*1073741824;
          if (gallery_over_capacity == 1 || gallery_capacity_size <= (imgSize + gallery_all_used_capacity_size)) {
            this.emptyGalleryHtml = `当前图库容量已使用<span style="font-weight: bold">${gallery_all_used_capacity}</span>G，${
              gallery_all_used_capacity_size > gallery_capacity_size ? 
              `<span style="color: red">超出${Math.abs(((gallery_capacity_size - gallery_all_used_capacity_size)/1073741824).toPrecision(2))}G</span>`:
              `剩余${((gallery_capacity_size - gallery_all_used_capacity_size)/1073741824).toPrecision(2)}G`
            }。`
            this.isShowEmptyGalleryTip = true
            this.allowUpload = 2
          } else {
            this.allowUpload = 1
          }
          setTimeout(() => {
            this.beforeUploadPromise = []
            this.beforeUploadFileList = []
            this.allowUpload = 0
          }, 2000);
        }
      })
    },
    //图片上传前验证
    beforeUpload(file) {
      if(this.$sdkConfig.platformIsZWKJ){
        this.beforeUploadPromise.push(new Promise((resolve, reject) => {
          this.beforeUploadFileList.push(file)
          let inter = setInterval(() => {
            if(this.allowUpload == 1) {
              resolve()
              clearInterval(inter)
            } else if(this.allowUpload == 2) {
              reject()
              clearInterval(inter)
            }
          }, 50)
        }))
        this.debounce(this.getAllFileListBeforeUpload, 200)
        return this.beforeUploadPromise[this.beforeUploadPromise.length - 1]
      } else {
        const isLt30M = file.size / 1024 / 1024 < 30;
          if (!isLt30M) {
          this.$message.error("上传图片大小不能超过 30MB!");
        }
        return isLt30M;
      }
    },
    handleSuccess() {
      this.$refs.upload.clearFiles();
      setTimeout(()=>{
        if(this.$sdkConfig.platformIsZWKJ){
          this.$store.commit("layout/changeLeftType", 'upload');
        } else {
          this.search();
        }
      }, 2000);
      this.$statisticalreport.clickDesignItemEditBtn('上传背景图','背景')
    },
    canUploadCheck(){
      if(this.$sdkConfig.platformIsZWKJ){
        if(!this.$isLogin){
          eventBus.$emit("showLoginPop");
          return;
        }
        eventBus.$emit('showUploadGuaranteePop');
      } else {
        if(!this.$isLogin){
          this.$message.error('请先登录');
        }
      }
    }
  },
};
</script>

<style lang="scss" scoped>
$primary: #0453F3;
.fade-leave-active {
  transition: all 0.4s;
}
.fade-enter-active {
  // transition: all 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.search-row{
  display: flex;
  margin: 0 20px;
}
.attr-row{
  margin: 0 20px;
  &.gallery-type{
    background: #efefef;
  }
}
.switch-attr{
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  .attr-item{
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    background: #F2F2F2;
    color: $primary;
    &:first-child{
      border-radius: 100px 0px 0px 100px;
    }
    &:last-child{
      border-radius: 0px 100px 100px 0px;
    }
    &.active{
      background: $primary;
      color: #fff;
      box-shadow: 0px 6px 12px 0px rgba(4, 83, 243, 0.24);
    }
  }
}
.gallery-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .gallery-pull {
    flex: 1;
    margin: 10px 0 0px 20px;
    box-sizing: border-box;
    position: relative;
    .loadmore-tips {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 99;
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
    #v-waterfall {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      .v-waterfall-item {
        float: left;
        position: absolute;
        cursor: pointer;
      }
      /deep/ .el-image{
        img{
          width: 132px !important;
          height: auto;
          z-index: 1
        }
      }
    }
  }
  .gallery-grid-container {
    flex: 1;
    overflow: hidden;
    position: relative;
    padding-bottom: 44px;
    display: flex; //兼容小屏safari
    flex-direction: column;
    .gallery-grid {
      height: 100%;
      // flex: 1;
      overflow: auto;
    }
    .gallery-list {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 0px 10px 20px;
    }
  }
  .gallery-item {
    width: 132px;
    height: 132px;
    border-radius: 4px;
    margin-right: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    position: relative;
    &:nth-child(2n) {
      margin-right: 0;
    }
    /deep/ .el-image{
      img{
        z-index: 1;
      }
    }
  }
  .risk-tips {
    position: absolute;
    top: 6px;
    left: 6px;
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    z-index: 2;
    i {
      color: red;
    }
  }
  .zw-empty-gallery-pop {
    .dialog-title {
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
    }
    .dialog-content {
      p {
        line-height: 24px;
      }
    }
  }
}
.gallery-info-box {
  width: 260px;
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(210, 231, 247, 0.2);
  border: 1px solid #e8eaec;
  border-radius: 20px;
  position: fixed;
  top: 0;
  left: 385px;
  z-index: 999;
  max-height: calc(100vh);
  box-sizing: content-box;
  overflow: hidden;
  .imgPanInfoDesigner {
    width: 260px;
    height: 260px;
    padding: 30px;
    background: rgba(0, 0, 0, 0.06);
    // border-radius: 20px 20px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    img {
      max-width: 260px;
      max-height: 260px;
      width: auto;
      height: auto;
    }
  }
  .info-cont {
    padding: 20px 15px;
    background-color: #fff;
    .row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .name {
        color: #000;
      }
      .id {
        color: rgba(0, 0, 0, 0.45);
      }
      .size {
        color: rgba(0, 0, 0, 0.45);
      }
      .price {
        color: #fa8c16;
      }
      .design-name {
        color: $primary;
      }
    }
  }
  .imgPanInfoDesc {
    width: 260px;
    height: 104px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 0px 0px 16px 16px;
    padding: 10px;
    overflow-y: hidden;

    .content {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
.upload-box{
  margin: 12px 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F2F5;
}
.upload-btn{
  width: 280px;
  height: 40px;
  border-radius: 20px;
  border: 2px dashed rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
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
.empty-box{
  text-align: center;
  margin: 0 auto;
}
.zw-btn{
  font-size: 14px;
  padding: 8px 0;
  border-radius: 16px;
}
</style>
