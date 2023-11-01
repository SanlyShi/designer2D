<template>
  <div class="gallery-box">
    <div class="search-header">
      <div class="mt20 ml20 mr20">
        <SearchBar
          ref="searchBar"
          placeholder="搜索图片 名称/编号/标签"
          v-model="searchForm.keyword"
          :has-filters="hasFilterParams"
          @save="search"
        >
          <template slot="filter">
            <GalleryFilter :value="filterParams" @save="changeFilter"></GalleryFilter>
          </template>
        </SearchBar>
      </div>
      <div class="mt12 ml20 mr20">
        <div class="category-box">
          <el-select v-model="cgType" size="small" class="mr10" @change="changeCgType">
            <el-option
              v-for="item in cgTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-show="cgType"
            v-model="cgObj.customer_id"
            size="small"
            class="mr10"
            @change="changeCustomer"
          >
            <el-option label="全部关联账号图库" value v-show="cgType=='2'"></el-option>
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.name || item.realname"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-cascader
            ref="categoryCascader"
            v-model="cgObj.cgId"
            :options="cgIdOptions"
            :props="{ expandTrigger: 'hover',checkStrictly:true,label:'name',value:'id',children:'subCg'}"
            size="small"
            @change="changeCgId"
            >
            <template slot-scope="{ node, data }">
              <span :data-cgid="data.id">{{ data.name }}</span>
            </template>
          </el-cascader>
        </div>
      </div>
      <div class="mt12 ml20 mr20" onselectstart="return false;">
        <Sort
          :data="sortData"
          :sortField.sync="sortField"
          :sortType.sync="sortType"
          @change="changeSort"
        >
          <template slot="other">
            <span
              @click="changeUItype()"
              :class="['iconfont', galleryUItype=='pull'?'iconsort-Irregular':'iconsort-neat', 'cp']"
            ></span>
          </template>
        </Sort>
      </div>
    </div>
    <div ref="galleryWaterfullList" class="gallery-container gallery-pull" v-show="galleryUItype=='pull'">
      <div
        class="v-waterfall-content scroll-bar"
        id="v-waterfall"
        v-infinite-scroll="getMoreData"
        infinite-scroll-distance="10"
        :infinite-scroll-disabled="disabled"
      >
        <div
          v-for="(img,index) in waterfallList"
          class="v-waterfall-item"
          :key="img.src+index"
          @click="handelClick(img.data)"
          @mouseenter="showimgItemDetail($event, img.data)"
          @mouseleave="hideImgItemDetail($event, img.data)"
          :style="{top:img.top+'px',left:img.left+'px',width:waterfallImgWidth+'px',height:img.height}"
        >
          <el-card shadow="hover" :body-style="{'padding':'0px','border-radius':'10px'}">
            <!-- 图片懒加载 -->
            <el-image :src="img.src" class="image" :key="img.src" lazy v-if="leftType=='gallery'">
              <!-- 加载前占位 -->
              <div slot="placeholder" class="image-slot">
                <div
                  :style="{height:img.height+'px',width:waterfallImgWidth + 'px',backgroundColor:img.colour}"
                ></div>
              </div>
              <!-- 加载失败占位 -->
              <div slot="error" class="image-slot">
                <div
                  :style="{height:img.height+'px',width:waterfallImgWidth + 'px',backgroundColor:img.colour}"
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
      </div>
      <!-- <div class="loadmore-tips" v-show="!noMore&&!loading">
        <div>icon</div>
        <div>滚动加载更多</div>
      </div>-->
      <div class="loadmore-tips" v-show="loading">
        <div class="el-icon-loading"></div>
        <div>加载中</div>
      </div>
    </div>
    <div class="gallery-grid-container" v-show="galleryUItype=='grid'">
      <div ref="galleryGridList" class="gallery-grid scroll-bar" v-zwloading="gridLoading">
        <div class="gallery-list">
          <div
            class="gallery-item imgbox"
            v-for="(imgItem,index) in cgList"
            :key="index"
            @click="handelClick(imgItem)"
            @mouseenter="showimgItemDetail($event, imgItem)"
            @mouseleave="hideImgItemDetail($event, imgItem)"
          >
            <div class="imgbox">
              <el-image
                :src="imgItem.previewImg"
                class="image"
                :key="index"
                v-if="leftType=='gallery'"
              ></el-image>
            </div>
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
      </div>
      <Pagination
        :total="total"
        :pageSize="page.pageSize"
        :curPage.sync="page.page"
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
                  {{gallery.name|substrString}}
                  <span v-if="gallery.name">{{gallery.imageUrl|getExt}}</span>
                </span>
              </div>
              <div>
                <span style="color:#02D392" v-if="!cgType&&Number(gallery.price)==0">免费</span>
                <!-- <el-tooltip
                  :enterable="false"
                  v-if="!cgType&&Number(gallery.price)==0"
                  class="item"
                  effect="dark"
                  content="免费"
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
                <span class="f12 id mr8">ID：{{gallery.id}}</span>
                <!-- <span>{{gallery.size.width}}x{{gallery.size.height}} px</span> -->
              </div>
              <div class="flex flex-col-ct mb5">
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
  </div>
</template>

<script>
import SearchBar from "@/components/common/SearchBar";
import GalleryFilter from "@/components/Gallery/GalleryFilter";
import Pagination from "@/components/common/Pagination";
import { deepClone, GetQueryString, genLocalStorageKey } from "@/utils/utils";
// import utilsMixin from "@/mixins/utils.js";
import {
  _getGalleryCategory,
  _getCustomerGalleryCategory,
  _getGallery,
  _getGalleryInfoDesc,
} from "@/apis/gallery.js";
import Sort from "@/components/common/Sort";
import eventBus from "@/utils/eventBus.js";
import { genRiskInfo, isRisk } from "@/utils/gallery.js";
export default {
  components: {
    SearchBar,
    GalleryFilter,
    Sort,
    Pagination,
  },
  // mixins: [utilsMixin],
  data() {
    return {
      isInit: true,
      hasSearch: false,
      isLogin: this.$isLogin || false,
      //图片悬浮弹窗展示
      isShowDetail: false,
      showImgSize: {
        imgHeight: 200,
        imgWidth: 200,
      },
      //悬浮图片描述 异步获取
      imgPanInfoDesc: {},
      detailPos: { top: 0, bottom: 0 },
      //图片数据 悬浮
      gallery: null,
      //图片数据 点击
      dataItem: {},
      //布局格式 grid网格 pull瀑布流
      galleryUItype: "grid",
      //分页
      page: {
        page: 1,
        pageSize: 30,
      },
      //总数
      total: 0,
      //查询框
      searchForm: {
        keyword: "",
        is_public: 1,
        product_type_id: "",
        isCustomerCategory: "",
        cgId: "",
      },
      //筛选条件
      filterParams: {},
      customerList: [],
      //登录账号信息
      loginData: {
        // customer_id: this.$OPTIONS.customer_id || ""
      },

      // 图库类型
      cgType: "",
      cgObj: {
        cgId: [""],
        customer_id: "",
      },
      customCgObj: {
        cgId: [""],
        customer_id: "",
      },
      myCgObj: {
        cgId: [""],
        customer_id: "",
      },
      commonCgObj: {
        cgId: [""],
        customer_id: "",
      },
      // 图库类型list
      cgTypeOptions: [
        { id: "1", name: "归档图库" },
        { id: "2", name: "我的图库" },
        { id: "", name: "示例图库" },
        // { id: "3", name: "收藏图库" }
      ],
      //图库分类
      cgIdOptions: [],
      cgIdOptionsList: [],
      //图片数据
      cgList: [],
      cgPullList: [],
      cgPullPage: {
        page: 1,
        pageSize: 30,
      },
      // 排序
      // sortData: [
      //   { field: "position", name: "系统排序" },
      //   { field: "created", name: "创建时间" },
      //   // { field: "modified", name: "更新时间" },
      //   { field: "size", name: "大小" },
      // ],
      sortField: "position",
      sortType: "desc",
      dialogVisible: true,
      //瀑布流数据
      waterfallList: [],
      waterfallImgWidth: 90,
      waterfallImgCol: 3,
      waterfallImgRight: 4,
      waterfallImgBottom: 4,
      waterfallDeviationHeight: [],
      noMore: false,
      loading: false,
      gridLoading: false,
    };
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

  computed: {
    sortData(){
      if(this.cgType==''){
        return [
          { field: "position", name: "系统排序" },
          { field: "created", name: "创建时间" },
          { field: "size", name: "大小" },
        ]
      } else {
        return [
          { field: "created", name: "创建时间" },
          { field: "modified", name: "更新时间" },
          { field: "size", name: "大小" },
        ]
      }
    },
    config() {
      return this.$store.state.layout.designerConfig;
    },
    disabled() {
      return this.loading || this.noMore;
    },
    leftType() {
      // el-image增加leftType判断，避免用户在数据返回之前切到其它标签页后返回导致图片不加载
      return this.$store.state.layout.leftType;
    },
    isLoading() {
      return this.$store.getters.initLoading;
    },
    hasFilterParams(){
     return Object.values(this.filterParams).some(item=>item!='');
    }
  },
  watch: {
    config: {
      handler(val) {
        this.customerList = val.customerList ? val.customerList : [];
        if (this.customerList.length > 0) {
          this.customCgObj.customer_id = this.customerList[0].id;
        }
      },
      immediate: true,
    },
    page: {
      handler(val) {
        // console.log("watch page ====> ", val);
      },
      deep: true,
    },
    isLoading: {
      handler(val) {
        if(!val){
          this.getGalleryCategory();
        }   
      },
     
    },
  },
  created() {
    if (this.$isLogin) {
      this.cgTypeOptions = [
        { id: "1", name: "归档图库" },
        { id: "2", name: "我的图库" },
        { id: "", name: "示例图库" },
        // { id: "3", name: "收藏图库" }
      ];
      this.sortField = 'created';
    } else {
      this.cgTypeOptions = [{ id: "", name: "示例图库" }];
      this.sortField = 'position';
    }
  },
  mounted() {
    this.calculationWidth();
  },
  methods: {
    // 初始化搜索参数
    initParams() {
      const gallerySubCg = GetQueryString('gallerySubCg');
      const galleryView = GetQueryString('galView');
      const gallerySortField = GetQueryString('galSortField');
      const gallerySortType = GetQueryString('galSortType');
      const localStorageKey = genLocalStorageKey('galleryParams');
      let paramsCache = localStorage.getItem(localStorageKey);
      paramsCache = paramsCache ? JSON.parse(paramsCache) : null;
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      if (paramsCache && paramsCache[customerId]) {
        this.searchForm = Object.assign(
          this.searchForm,
          paramsCache[customerId].searchForm
        );
        if (paramsCache[customerId].filterParams) {
          for (let key in paramsCache[customerId].filterParams) {
            this.$set(
              this.filterParams,
              key,
              paramsCache[customerId].filterParams[key]
            );
          }
        }
        if(!(gallerySubCg || this.$OPTIONS.isNewUser || !this.$isLogin)){
          this.cgType = paramsCache[customerId].cgType;
          if (paramsCache[customerId].cgObj) {
            this.cgObj = Object.assign(this.cgObj, paramsCache[customerId].cgObj);
          }
        }
        if (this.cgType == "1") {
          this.cgIdOptions = this.cgIdOptionsList[1];
        } else if (this.cgType == "2") {
          this.cgIdOptions = this.cgIdOptionsList[0];
        } else {
          this.cgIdOptions = this.cgIdOptionsList[2];
        }
        this.galleryUItype = paramsCache[customerId].galleryUItype;
        if (this.galleryUItype == "grid") {
          this.$set(this.page, "page", paramsCache[customerId].page.page);
        }
        if (paramsCache[customerId].sort) {
          this.sortField = paramsCache[customerId].sort.sortField;
          this.sortType = paramsCache[customerId].sort.sortType;
        }
      }
      if(gallerySubCg || this.$OPTIONS.isNewUser || !this.$isLogin ){
        this.searchForm.is_public = 1;
        this.searchForm.isCustomerCategory = "";
      }
      if(galleryView==='0') this.galleryUItype = 'pull';
      if(gallerySortField==='position' || gallerySortField==='modified' || gallerySortField==='size') this.sortField = gallerySortField;
      if(gallerySortType==='0') {
        this.sortType = 'asc';
      } else if(gallerySortType==='1'){
        this.sortType = 'desc';
      }
    },
    //获取图库分类
    getGalleryCategory() {
      const gallerySubCg = GetQueryString('gallerySubCg');
      if (this.$isLogin) {
        Promise.all([
          _getGalleryCategory({
            is_public: 0,
          }),
          _getCustomerGalleryCategory({
            customer_id: this.customCgObj.customer_id,
          }),
          _getGalleryCategory({
            is_public: 1,
          }),
        ]).then((res) => {
          // let cgIdOptions = res[0].data ? res[0].data : [];
          // cgIdOptions.unshift({ count: 1, id: "", name: "全部", parent_id: 0 });
          // this.cgIdOptions = cgIdOptions;
          let totalList = [];
          res.forEach((i, index) => {
            let data = i.data ? i.data : [];
            if (data.length === 0) {
              data.unshift({ count: 1, id: "", name: "全部", parent_id: 0 });
            }
            // if (index == 0) {
            //   //我的图库添加全部选项
            //   data.unshift({ count: 1, id: "", name: "全部", parent_id: 0 });
            // } else if (index == 1 && data.length === 0) {
            //   //归档图库没数据时
            //   data.unshift({ count: 1, id: "", name: "全部", parent_id: 0 });
            // }
            totalList.push(data);
          });
          this.cgIdOptionsList = totalList;
          if(gallerySubCg){
            this.changeCgType("", true);
            this.commonCgObj.cgId = [gallerySubCg!='' ? parseInt(gallerySubCg) : ''];
          } else if(this.$OPTIONS.isNewUser){
            // 新人用户默认选中特定图库分类
            this.changeCgType("", true);
            this.commonCgObj.cgId = [863];
          }else {
            if (res[1].data) {
              this.changeCgType("1", true);
            } else {
              this.changeCgType("2", true);
            }
          }
          this.initParams();
          this.search();
        });
      } else {
        _getGalleryCategory({
          is_public: 1,
        }).then((res) => {
          let data = res.data ? res.data : [];
          if (data.length === 0) {
            data.unshift({ count: 1, id: "", name: "全部", parent_id: 0 });
          }
          this.cgIdOptions = data;
          this.cgIdOptionsList[2] = data;
          this.commonCgObj.cgId = gallerySubCg&&gallerySubCg!='' ? [parseInt(gallerySubCg)] : [863];
          this.cgObj = this.commonCgObj;
          this.initParams();
          this.search();
        });
      }
    },

    //修改图库类型
    changeCgType(val, isinit) {
      this.cgType = val;
      if (!val) {
        //示例图库
        this.searchForm.is_public = 1;
        this.searchForm.isCustomerCategory = "";
        this.cgIdOptions = this.cgIdOptionsList[2];
        this.cgObj = this.commonCgObj;
        this.sortField = 'position';
      } else if (val == "1") {
        //归档图库
        this.searchForm.is_public = "";
        this.searchForm.isCustomerCategory = 1;
        this.customerList= this.config.subAccountList
        this.cgIdOptions = this.cgIdOptionsList[1];
        this.cgObj = this.customCgObj;
        this.sortField = 'created';
      } else {
        //我的图库
        this.customerList= this.config.customerList
        this.searchForm.is_public = "";
        this.searchForm.isCustomerCategory = "";
        this.cgIdOptions = this.cgIdOptionsList[0];
        this.cgObj = this.myCgObj;
        this.sortField = 'created';
      }
      if (!isinit) {
        this.search();
      }
    },
    changeCustomer(value) {
      if (this.cgType == "1") {
        this.customCgObj.customer_id = value;
        _getCustomerGalleryCategory({
          customer_id: value,
        }).then((res) => {
          this.cgIdOptionsList[1] = res.data
            ? res.data
            : [{ count: 1, id: "", name: "全部", parent_id: 0 }];
          this.cgIdOptions = res.data
            ? res.data
            : [{ count: 1, id: "", name: "全部", parent_id: 0 }];
        });
      } else if (this.cgType == "2") {
        _getGalleryCategory({
          is_public: 0,
          customer_id: value,
        }).then((res) => {
          this.cgIdOptionsList[0] = res.data
            ? res.data
            : [{ count: 1, id: "", name: "全部", parent_id: 0 }];
          this.cgIdOptions = res.data
            ? res.data
            : [{ count: 1, id: "", name: "全部", parent_id: 0 }];
        });
        this.myCgObj.customer_id = value;
      }
      this.search();
    },
    //修改筛选变量
    changeFilter(data) {
      this.filterParams = data;
      this.search();
    },
    //修改分页
    changePage() {
      this.getgallery();
    },
    //修改排序
    changeSort(data) {
      this.search();
    },
    //修改分类
    changeCgId(value) {
      if (!this.cgType) {
        this.commonCgObj.cgId = value;
      } else if (this.cgType == "1") {
        this.customCgObj.cgId = value;
      } else if (this.cgType == "2") {
        this.myCgObj.cgId = value;
      }
      this.searchForm.cgId = value;
      this.$refs.categoryCascader.dropDownVisible = false;
      this.search();
    },
    getgallery() {
      if (this.galleryUItype == "grid") {
        this.gridLoading = true;
      }
      // let target =
      //   this.galleryUItype == "pull" ? ".gallery-pull" : ".gallery-grid";

      let params = {};
      let page = this.galleryUItype == "pull" ? this.cgPullPage : this.page;
      let sort = {
        sortField: this.sortField,
        sortType: this.sortType,
      };

      params = {
        ...this.searchForm,
        ...this.filterParams,
        ...page,
        ...sort,
      };
      params.product_type_id = this.$store.state.product.selectedProduct.id;
      params.cgId = this.cgObj.cgId[this.cgObj.cgId.length - 1];
      if (this.cgObj.customer_id) {
        params.customer_id = this.cgObj.customer_id;
      }
      // 保存搜索参数到localStorage
      const localStorageKey = genLocalStorageKey('galleryParams');
      if (localStorage.getItem(localStorageKey)) {
        localStorage.removeItem(localStorageKey);
      }
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let paramsCache = {
        [customerId]: {
          searchForm: this.searchForm,
          filterParams: this.filterParams,
          cgType: this.cgType,
          cgObj: this.cgObj,
          page: this.page,
          sort,
          galleryUItype: this.galleryUItype,
        },
      };
      localStorage.setItem(localStorageKey, JSON.stringify(paramsCache));
      _getGallery(params).then((res) => {
        if (this.galleryUItype == "pull") {
          this.imgPreloading(res.data.data);
          this.cgPullPage.page++;
          if (res.data.data.length < this.cgPullPage.pageSize) {
            this.noMore = true;
          }
          this.loading = false;
        } else {
          this.gridLoading = false;
          this.cgList = res.data.data.map((item) => {
            item.__riskInfo = genRiskInfo(item);
            return item;
          });

          this.total = res.data.total;
        }
      });
    },
    //查询图库
    search() {
      this.loading = true;
      this.page.page = 1;
      this.hasSearch = true;
      this.resetPullData();
      this.getgallery();
    },
    resetPullData() {
      this.cgPullPage.page = 1;
      this.noMore = false;
      this.waterfallDeviationHeight = [];
      this.calculationWidth();
      this.waterfallList = [];
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
    getImgPanInfoDesc(data) {
      let id = data.code;
      if (!this.imgPanInfoDesc.hasOwnProperty(id)) {
        _getGalleryInfoDesc({
          id: id,
          data: {
            type: "designInfo",
            mediaType: "json",
            // isNewCreate: true
          },
        }).then((res) => {
          this.imgPanInfoDesc[id] = res.data.desc;
        });
      }
    },
    handelClick(data) {
      if (isRisk(data)) {
        this.$message.error("图片信息异常，无法使用");
        return;
      }
      this.dataItem = data;

      this.$store.commit("layout/changeSelectType", "image");

      eventBus.$emit("galleryClick", { galleryData: data });
    },

    hideImgItemDetail(e, data) {
      this.isShowDetail = false;
    },

    //修改布局方式
    changeUItype() {
      this.galleryUItype = this.galleryUItype == "grid" ? "pull" : "grid";
      if (this.galleryUItype == "pull" && this.waterfallList.length == 0) {
        if (this.isInit) {
          this.imgPreloading(this.cgList);
          this.cgPullPage.page++;
          if (this.cgList.length < this.cgPullPage.pageSize) {
            this.noMore = true;
          }
          this.loading = false;
          this.isInit = false;
        } else {
          this.getMoreData();
        }

        this.hasSearch = false;
      } else {
        if (this.hasSearch) {
          this.search();
          this.hasSearch = false;
        }
      }
    },
    //计算每个图片的宽度或者是列数
    calculationWidth() {
      // let domWidth = document.getElementById("v-waterfall").offsetWidth;
      // if (!this.waterfallImgWidth && this.waterfallImgCol) {
      //   this.waterfallImgWidth =
      //     (domWidth - this.waterfallImgRight * this.waterfallImgCol) /
      //     this.waterfallImgCol;
      // } else if (this.waterfallImgWidth && !this.waterfallImgCol) {
      //   this.waterfallImgCol = Math.floor(
      //     domWidth / (this.waterfallImgWidth + this.waterfallImgRight)
      //   );
      // }
      //初始化偏移高度数组
      this.waterfallDeviationHeight = new Array(this.waterfallImgCol);
      for (let i = 0; i < this.waterfallDeviationHeight.length; i++) {
        this.waterfallDeviationHeight[i] = 0;
      }
    },
    //图片预加载
    imgPreloading(imgList) {
      let promises = [];
      for (let i = 0; i < imgList.length; i++) {
        let promise = new Promise((resolve, reject) => {
          let aImg = new Image();
          aImg.src = imgList[i].previewImg;
          let imgData = {};
          imgList[i].__riskInfo = genRiskInfo(imgList[i]);
          imgData.data = imgList[i];
          aImg.onload = (e) => {
            imgData.colour = "#EEF2F8";
            imgData.height = (this.waterfallImgWidth / aImg.width) * aImg.height;
            imgData.src = imgList[i].previewImg;
            this.waterfallList.push(imgData);
            this.rankImg(imgData);
            resolve();
          };
          aImg.onerror = (e) => {
            resolve();
          };
        });
        promises.push(promise);

        // aImg.onerror = e => {
        //   let imgData = {};
        //   //加载失败 用错误图片替换
        //   imgData.colour = "#EEF2F8";
        //   imgData.height = 100;
        //   imgData.src = this.imgArr[1];
        //   this.waterfallList.push(imgData);
        //   this.rankImg(imgData);
        // };
      }
      Promise.all(promises).then(res => {
        // 当前页加载完后如果内容高度小于容器高度，则获取下一页数据，避免无法触发下拉滚动导致数据不全
        if(imgList.length){
          let containerHeight = this.$refs.galleryWaterfullList.clientHeight;
          if(containerHeight > Math.max(...this.waterfallDeviationHeight)){
            this.getMoreData();
          }
        }
      });
    },
    //瀑布流布局
    rankImg(imgData) {
      let {
        waterfallImgWidth,
        waterfallImgRight,
        waterfallImgBottom,
        waterfallDeviationHeight,
        waterfallImgCol,
      } = this;
      //for (let i = 0;i < this.waterfallList.length;i++){
      let minIndex = this.filterMin();
      imgData.top = waterfallDeviationHeight[minIndex];
      imgData.left = minIndex * (waterfallImgRight + waterfallImgWidth);
      waterfallDeviationHeight[minIndex] += imgData.height + waterfallImgBottom;
      //}
    },
    /**
     * 找到最短的列并返回下标
     * @returns {number} 下标
     */
    filterMin() {
      const min = Math.min.apply(null, this.waterfallDeviationHeight);
      return this.waterfallDeviationHeight.indexOf(min);
    },
    getMoreData() {
      this.loading = true;
      this.getgallery();
    },
  },
};
</script>

<style lang="scss" scoped>
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
.category-box {
  display: flex;
  justify-content: space-between;
}
.gallery-box {
  display: flex;
  flex-direction: column;
  height: 100%;
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
      // overflow-x: hidden !important;
      // overflow-y: scroll !important;
      .v-waterfall-item {
        float: left;
        position: absolute;
        cursor: pointer;
      }
      .v-waterfall-item img {
        width: 90px;
        height: auto;
      }
    }
  }
  .gallery-grid-container {
    flex: 1;
    overflow: hidden;
    position: relative;
    padding-bottom: 30px;
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
      // justify-content: space-between;
    }
  }

  .gallery-item {
    width: 88px;
    height: 88px;
    border-radius: 4px;
    margin-right: 8px;
    margin-bottom: 8px;

    &:nth-child(3n) {
      margin-right: 0;
    }
    // margin-bottom: 10px;
    cursor: pointer;

    position: relative;
    .imgbox {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.06);
    }
    .el-image img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
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
    i {
      color: red;
    }
  }
  /deep/ .gallery-item .el-image__error,
  /deep/ .gallery-item .el-image__inner,
  /deep/ .gallery-item .el-image__placeholder {
    max-width: 88px !important;
    max-height: 88px !important;
    width: auto !important;
    height: auto !important;
  }
}
.gallery-info-box {
  width: 260px;
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(210, 231, 247, 0.2);
  border: 1px solid #e8eaec;
  border-radius: 6px;
  position: fixed;
  top: 0;
  left: 385px;
  z-index: 999;
  max-height: calc(100vh);

  .imgPanInfoDesigner {
    width: 260px;
    height: 260px;
    padding: 30px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 5px 5px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
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
        color: #0453F3;
      }
    }
  }
  .imgPanInfoDesc {
    width: 260px;
    height: 104px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 0px 0px 5px 5px;
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
</style>
