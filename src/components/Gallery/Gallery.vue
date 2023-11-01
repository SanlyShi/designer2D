<template>
  <div class="gallery-box">
    <div class="search-field">
      <div class="tab-row">
        <div class="switch-tab">
          <div class="tab-item" v-for="item in cgTypeData" :key="item.id" :class="{'active': cgType==item.id}" @click="changeCgType(item.id)">
            {{item.name}}
          </div>
        </div>
      </div>
      <template v-if="$sdkConfig.platformIsZWKJ">
        <div class="search-row mt12 pb12">
          <SearchBar
            ref="searchBar"
            placeholder="图片名称/编号/标签"
            v-model="searchForm.keyword"
            :has-filters="hasFilterParams"
            @save="search(true,{})"
            style="flex:1;"
          >
            <template slot="filter" v-if="Object.values(config).length">
              <MaterialFilter :value="filterParams0" @save="changeFilter" v-if="cgType==''&&searchForm.galleryType=='1'"></MaterialFilter>
              <MaterialFilter2 :value="filterParams02" @save="changeFilter" v-else-if="(cgType==''&&searchForm.galleryType=='2')||(cgType=='2'&&searchForm.galleryType=='2')"></MaterialFilter2>
              <GalleryFilter :value="filterParams1" @save="changeFilter" v-else-if="cgType=='1'"></GalleryFilter>
              <GalleryCollectFilter :value="filterParams2" @save="changeFilter" v-else></GalleryCollectFilter>
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
            v-show="isShowCategory && $sdkConfig.platform != 'xcxBackend'"
          >
            <a class="cgitem" :class="{'active': searchForm.cgId[0]!=allCgId}" slot="reference">
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
        <div class="attr-row customer-list mt12" v-show="cgType!=''">
          <el-select
              style="width:100%"
              v-model="searchForm.customer_id"
              size="small"
              class="mr10 __zw-select"
              @change="changeCustomer"
            >
              <el-option label="全部关联账号图库" value v-show="cgType=='1'"></el-option>
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.name || item.realname"
                :value="item.id"
              ></el-option>
            </el-select>
        </div>
        <div class="attr-row gallery-type mt12" v-show="cgType!=1">
          <div class="switch-attr">
            <div class="attr-item" 
              v-for="item in galleryTypeData"
              :key="item.id" 
              :class="{'active': searchForm.galleryType==item.id}"
              @click="changeGalleryType(item.id)"
            >{{item.name}}</div>
          </div>
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
      <template v-else>
        <div class="search-row mt12" style="border-bottom:0">
          <SearchBar
            ref="searchBar"
            :placeholder="searchForm.galleryType==1||cgType!='' ? '搜索图片' : '搜索模板'"
            v-model="searchForm.keyword"
            :has-filters="hasFilterParams"
            :show-filters="false"
            @save="search"
            style="flex:1;"
          >
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
            v-if="isShowCategory && $sdkConfig.platform != 'xcxBackend'"
          >
            <a class="cgitem" :class="{'active': searchForm.cgId[0]!=allCgId}" slot="reference">
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
        <div class="attr-row gallery-type mt12" v-show="galleryTypeData.length>1&&cgType==''">
          <div class="switch-attr">
            <div class="attr-item" 
              v-for="item in galleryTypeData"
              :key="item.id" 
              :class="{'active': searchForm.galleryType==item.id}"
              @click="changeGalleryType(item.id)"
            >{{item.name}}</div>
          </div>
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
            :key="img.src+index"
            class="v-waterfall-item zw-image-box"
            draggable
            @dragstart="dragStartFun($event, img.data)"
            @click="handelClick(img.data)"
            @mouseenter="showimgItemDetail($event, img.data)"
            @mouseleave="hideImgItemDetail($event, img.data)"
            :style="{top:img.top+'px',left:img.left+'px',width:waterfallConfig.imgWidth+'px',height:img.height}"
          >
            <el-card shadow="hover" :body-style="{'padding':'0px','border-radius':'10px'}">
              <!-- 图片懒加载 -->
              <el-image :src="img.src" class="image" :key="img.src" lazy v-if="leftType=='gallery'">
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
            <a class="collect p10" v-if="isLogin&&$sdkConfig.platformIsZWKJ" @click.stop="toggleCollect(img.data)">
              <i class="iconfont iconheart" v-if="!img.data.is_collect"></i>
              <i class="iconfont iconheart-fill fz16" style="color:#FF4D4F" v-else></i>
            </a>
          </div>
        </template>
        <template v-else-if="!waterfallLoading">
          <template v-if="$sdkConfig.platformIsZWKJ">
            <div class="empty-box" v-if="!isLogin && cgType != ''">
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">您需要登录后才可查看图片</div>
              <el-button type="primary" class="mt10 zw-btn" style="width:60px;" @click="toLogin">登录</el-button>
            </div>
            <div class="empty-box" v-else-if="isLogin&&cgType=='1'">
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">您暂未上传图片，请前往上传</div>
              <div class="upload-box mt10">
                <el-upload
                  v-if="uploadImgGuarantee"
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
                  <div class="upload-btn">去上传</div>
                </el-upload>
                <div class="upload-btn" v-else @click="canUploadCheck">去上传</div>
              </div>
            </div>
            <div class="empty-box" v-else-if="isLogin&&cgType=='2'">
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">您可在素材模板中添加收藏</div>
            </div>
            <div class="empty-box" v-else>
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">没有符合条件的素材</div>
            </div>
          </template>
          <template v-else>
            <div class="empty-box" v-if="$sdkConfig.upload&&!checkHasSearchParams()&&(searchForm.galleryType==1 || cgType!='')">
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">您暂未上传图片，请前往上传</div>
              <div class="upload-box mt10">
                <el-upload
                  v-if="uploadImgGuarantee"
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
                  <div class="upload-btn">去上传</div>
                </el-upload>
                <div class="upload-btn" v-else @click="canUploadCheck">去上传</div>
              </div>
            </div>
            <div class="empty-box" v-else>
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">没有符合条件的{{searchForm.galleryType==1||cgType!='' ? '图片' : '模板'}}</div>
            </div>
          </template>
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
            @dragstart="dragStartFun($event, imgItem)"
            @click="handelClick(imgItem)"
            @mouseenter="showimgItemDetail($event, imgItem)"
            @mouseleave="hideImgItemDetail($event, imgItem)"
          >
            <el-image
              :src="imgItem.__isTemplate ? imgItem.images: imgItem.previewImg"
              class="image"
              v-if="leftType=='gallery'"
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
            <a class="collect p10" v-if="isLogin&&$sdkConfig.platformIsZWKJ" @click.stop="toggleCollect(imgItem)">
              <i class="iconfont iconheart" v-if="!imgItem.is_collect"></i>
              <i class="iconfont iconheart-fill fz16" style="color:#FF4D4F" v-else></i>
            </a>
          </div>
        </div>
        <template v-else>
          <template v-if="$sdkConfig.platformIsZWKJ">
            <div class="empty-box" v-if="!isLogin && cgType != '' && $sdkConfig.platform !='xcxBackend'">
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">您需要登录后才可查看图片</div>
              <el-button type="primary" class="mt10 zw-btn" style="width:60px;" @click="toLogin">登录</el-button>
            </div>
            <div class="empty-box" v-else-if="isLogin&&cgType=='1'">
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">您暂未上传图片，请前往上传</div>
              <div class="upload-box mt10">
                <el-upload
                  v-if="uploadImgGuarantee"
                  ref="gridUpload"
                  multiple
                  accept="image/png, image/jpg, image/jpeg"
                  action="#"
                  :show-file-list="false"
                  :http-request="httpRequest"
                  :on-exceed="handleExceed"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                >
                  <div class="upload-btn">去上传</div>
                </el-upload>
                <div class="upload-btn" v-else @click="canUploadCheck">去上传</div>
              </div>
            </div>
            <div class="empty-box" v-else-if="isLogin&&cgType=='2'">
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">您可在素材模板中添加收藏</div>
            </div>
            <div class="empty-box" v-else>
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">没有符合条件的素材</div>
            </div>
          </template>
          <template v-else>
            <div class="empty-box" v-if="$sdkConfig.upload&&!checkHasSearchParams()&&(searchForm.galleryType==1 || cgType!='')&&$sdkConfig.platform != 'xcxBackend'">
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">您暂未上传图片，请前往上传</div>
              <div class="upload-box mt10">
                <el-upload
                  v-if="uploadImgGuarantee"
                  ref="gridUpload"
                  multiple
                  accept="image/png, image/jpg, image/jpeg"
                  action="#"
                  :show-file-list="false"
                  :http-request="httpRequest"
                  :on-exceed="handleExceed"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                >
                  <div class="upload-btn">去上传</div>
                </el-upload>
                <div class="upload-btn" v-else @click="canUploadCheck">去上传</div>
              </div>
            </div>
            <div class="empty-box" v-else>
              <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
              <div class="mt10 f14">没有符合条件的{{searchForm.galleryType==1||cgType!='' ? '图片' : '模板'}}</div>
            </div>
          </template>
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
          <template v-if="!gallery.__isTemplate">
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
          <template v-else>
            <div class="imgPanInfoDesigner flex flex-row-center">
              <img :src="gallery.images" alt />
            </div>
            <div class="info-cont">
              <div class="tempname f14">{{gallery.name}}</div>
              <div class="tempdesc mt5" v-if="$sdkConfig.platformIsZWKJ">编码：{{gallery.code}}</div>
              <div class="tempdesc mt5">适用品类：{{gallery.product_type_category_names}}</div>
              <div class="tempdesc mt5">设计风格：{{gallery.design_style_names}}</div>
              <div class="tempdesc mt5">适用场景：{{gallery.template_category_names}}</div>
            </div>
          </template>
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
import GalleryCollectFilter from "@/components/Gallery/GalleryCollectFilter";
import MaterialFilter from '@/components/Gallery/MaterialFilter';
import MaterialFilter2 from '@/components/Gallery/MaterialFilter2';
import Pagination from "@/components/common/Pagination";
import { deepClone, GetQueryString, getSDKUserCode, genLocalStorageKey } from "@/utils/utils";
import { transformPicOrTemplateListData,transformTemplateData } from "@/utils/dataTrans";
import {
  _getGalleryCategory,
  _getCustomerGalleryCategory,
  _getGallery,
  _galleryTemplate,
  _getGalleryInfoDesc,
  _galleryCollect,
  _galleryCollectCancel,
  _templateCollect,
  _templateCollectCancel
} from "@/apis/gallery.js";
import Sort from "@/components/common/Sort";
import eventBus from "@/utils/eventBus.js";
import { genRiskInfo, isRisk } from "@/utils/gallery.js";
import { _uploadImg, _imgSizeIsOverService } from '@/apis/uploadImg'
import { getProductTemplate } from '@/apis/designer.js'
export default {
  components: {
    GalleryPop,
    SearchBar,
    GalleryFilter,
    GalleryCollectFilter,
    MaterialFilter,
    MaterialFilter2,
    Sort,
    Pagination
  },
  data() {
    return {
      allCgId: this.$sdkConfig.platformIsZWKJ ? '' : -2,
      isLogin: this.$isLogin,
      userInfo: this.$isLogin ? this.$OPTIONS.userInfo : {},
      isInitSearch: true, //页面初始时搜索标志,避免首次重复请求
      // 搜索条件
      cgType: '',
      searchForm: {
        keyword: "",
        cgId: [''],
        customer_id: '',
        galleryType: '1',
        sortField: "combine",
        sortType: "desc",
      },
      filterParams0: {},
      filterParams02: {},
      filterParams1: {},
      filterParams2: {},
      cgData: [],
      isShowCgSelector: false,
      // 切换类型缓存数据start
      cgDataMap: {},
      searchForm0: {
        cgId: [''],
        customer_id: '',
        galleryType: '1',
        sortField: 'combine'
      }, //素材
      searchForm1: {
        cgId: [''],
        customer_id: '',
        galleryType: '',
        sortField: 'created'
      }, //我的
      searchForm2: {
        cgId: [''],
        customer_id: '',
        galleryType: '1',
        sortField: 'created'
      }, //收藏
      // 切换类型缓存数据end
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
      if(this.$sdkConfig.platform == 'ZWKJ'){
        return [
          {id: '', name: '素材模板'},
          {id: '1', name: '我的图片'},
          {id: '2', name: '收藏图片'}
        ]
      } else {
        return [
          {id: '', name: '素材模板'},
          {id: '1', name: '我的图片'}
        ]
      }
    },
    // 是否显示分类， 使用第三方图库接口时，不显示分类
    isShowCategory(){
      if(this.$sdkConfig.platformIsZWKJ){
        return this.cgType != '' && this.$sdkConfig.platform != 'xcxBackend';
      } else {
        if(this.cgType != '' && this.$sdkConfig.platform != 'xcxBackend') return false;
        if(this.$sdkConfig.customGallery?.galleryApi && this.searchForm.galleryType==1) return false;
        return true;
      }
    },
    galleryTypeData(){
      let ret = [];
      if(this.$sdkConfig.platform == 'ZWKJ'){
        switch(this.cgType){
          case '': 
            ret = [{id: '1', name: '图片素材'}, {id: '2', name: '设计模板'}]
            break;
          case '1':
            ret = [];
            break;
          case '2':
            ret = [{id: '1', name: '图片收藏'}, {id: '2', name: '模板收藏'}]
            break;
        }
      } else {
        ret = [{id: '1', name: '图片'}];
        if(this.$sdkConfig.gallery.hasTemplate){
          ret.push({id: '2', name: '模板'});
        }
      }
      return ret;
    },
    customerList(){
      let ret;
      switch(this.cgType){
        case '':
          ret = [];
          break;
        case '1':
          ret = this.config.customerList || []
          break;
        case '2':
          ret = this.config.subAccountList || [];
          break;
      }
      return ret;
    },
    sortData(){
      if(this.cgType=='' || (this.cgType=='2' && this.searchForm.galleryType=='2')){
        return [
          { field: "combine", name: "综合排序" },
          { field: "openTime", name: "上新时间" },
        ]
      } else {
        return [
          { field: "created", name: "创建时间" },
          { field: "modified", name: "更新时间" },
          { field: "size", name: "大小" },
        ]
      }
    },
    leftType() {
      // el-image增加leftType判断，避免用户在数据返回之前切到其它标签页后返回导致图片不加载
      return this.$store.state.layout.leftType;
    },
    isLoading() {
      return this.$store.getters.initLoading;
    },
    hasFilterParams(){
      if(!this.$sdkConfig.platformIsZWKJ) return false;
      if(this.cgType==''){
        if(this.searchForm.galleryType=='1'){
          return Object.values(this.filterParams0).some(item=>item!='');
        } else {
          return Object.values(this.filterParams02).some(item=>item!='');
        }
      } else if(this.cgType=='1'){
        return Object.values(this.filterParams1).some(item=>item!='');
      } else {
        if(this.searchForm.galleryType=='1'){
          return Object.values(this.filterParams2).some(item=>item!='');
        } else {
          return Object.values(this.filterParams02).some(item=>item!='');
        }
      }
    },
    disabled(){
      return this.waterfallLoading || this.noMore;
    },
    product(){
      return this.$store.state.product.selectedProduct
    }
  },
  filters: {
    getExt(value) {
      if (value) {
        let index = value.lastIndexOf(".");
        let ext = value.substr(index);
        ext = ext.split('?')[0]
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
    config: {
      handler(val){
        if(this.$sdkConfig.platformIsZWKJ && this.$isLogin){
          let {subAccountList} = this.config;
          this.searchForm2.customer_id = subAccountList&&subAccountList.length ? subAccountList[0].id : '';
        }
      },
      immediate: true
    },
    'product.code'(){
      // 切换产品，如果是模板， 要自动刷新模板数据，取适用商品的模板
      if(this.searchForm.galleryType=='2'){
        if(this.isInitSearch) return;
        this.search();
      }
    }
  },
  methods: {
    async initData(){
      if(this.$sdkConfig.platformIsZWKJ){
        const gallerySubCg = GetQueryString('gallerySubCg');
        const galleryView = GetQueryString('galView');
        const gallerySortField = GetQueryString('galSortField');
        const gallerySortType = GetQueryString('galSortType');
        const localStorageKey = genLocalStorageKey('galleryParams');
        let paramsCache = localStorage.getItem(localStorageKey);
        paramsCache = paramsCache ? JSON.parse(paramsCache) : null;
        let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : 'unlogin';
        if(paramsCache && paramsCache[customerId]){
          // 初始化搜索参数并搜索
          let params = paramsCache[customerId];
          this.cgType = params.cgType;
          this.searchForm = Object.assign({}, this.searchForm, params.searchForm);
          if(this.cgType=='' || (this.cgType=='2' && params.searchForm.galleryType=='2')){
            if(gallerySortField&&(gallerySortField=='combine' || gallerySortField=='openTime')){
              this.searchForm.sortField = gallerySortField;
            } else {
              this.searchForm.sortField = 'combine';
            }
          } else {
            if(gallerySortField&&(gallerySortField=='created' || gallerySortField=='modified' || gallerySortField=='size')){
              this.searchForm.sortField = gallerySortField;
            } else {
              this.searchForm.sortField = 'created';
            }
          }
          if(gallerySortType==='0') {
            this.searchForm.sortType = 'asc';
          } else if(gallerySortType==='1'){
            this.searchForm.sortType = 'desc';
          }
          if(galleryView==='0') this.listLayout = 'waterfall';
          switch(this.cgType){
            case '':
              this.searchForm0.galleryType = this.searchForm.galleryType;
              this.searchForm0.sortField = this.searchForm.sortField;
              this.searchForm0.sortType = this.searchForm.sortType;
              if(params.filterParams){
                for(let key in params.filterParams){
                  if(this.searchForm.galleryType=='1'){
                    this.$set(this.filterParams0, key, params.filterParams[key]);
                  } else {
                    this.$set(this.filterParams02, key, params.filterParams[key]);
                  }
                }
              }
              break;
            case '1':
              if(this.isLogin){
                var ret = await _getGalleryCategory({is_public: 0, customer_id: this.searchForm.customer_id});
                this.cgData = ret.data || [];
              } else {
                this.cgData = [];
              }
              this.cgDataMap['1'] = this.cgData;
              this.searchForm1.cgId = this.searchForm.cgId;
              this.searchForm1.customer_id = this.searchForm.customer_id;
              this.searchForm1.galleryType = this.searchForm.galleryType;
              this.searchForm1.sortField = this.searchForm.sortField;
              this.searchForm1.sortType = this.searchForm.sortType;
              if(params.filterParams){
                for(let key in params.filterParams){
                  this.$set(this.filterParams1, key, params.filterParams[key]);
                }
              }
              break;
            case '2':
              if(this.isLogin){
                var ret = await _getCustomerGalleryCategory({customer_id: this.searchForm.customer_id});
                this.cgData = ret.data || [];
              } else {
                this.cgData = [];
              }
              this.cgDataMap['2'] = this.cgData;
              this.searchForm2.cgId = this.searchForm.cgId;
              this.searchForm2.customer_id = this.searchForm.customer_id;
              this.searchForm2.galleryType = this.searchForm.galleryType;
              this.searchForm2.sortField = this.searchForm.sortField;
              this.searchForm2.sortType = this.searchForm.sortType;
              if(params.filterParams){
                for(let key in params.filterParams){
                  if(this.searchForm.galleryType=='1'){
                    this.$set(this.filterParams2, key, params.filterParams[key]);
                  } else {
                    this.$set(this.filterParams02, key, params.filterParams[key]);
                  }
                }
              }
              break;
          }
          if(params.listLayout=='grid') this.page = params.page;
          this.isInitSearch = false;
          this.search();
        } else {
          // 没有上次的搜索数据时, 登录情况下默认选择我的图片
          if(this.$isLogin){
            let ret = await _getGalleryCategory({is_public: 0, customer_id: ''});
            this.cgType = '1';
            this.cgData = ret.data || [];
            this.searchForm = Object.assign({}, this.searchForm, this.searchForm1);
            if(gallerySortField&&(gallerySortField=='created' || gallerySortField=='modified' || gallerySortField=='size')){
              this.searchForm1.sortField = gallerySortField;
              this.searchForm.sortField = gallerySortField;
            } else {
              this.searchForm1.sortField = 'created';
              this.searchForm.sortField = 'created';
            }
          } else {
            if(gallerySortField&&(gallerySortField=='combine' || gallerySortField=='openTime')){
              this.searchForm0.sortField = gallerySortField;
              this.searchForm.sortField = gallerySortField;
            } else {
              this.searchForm0.sortField = 'combine';
              this.searchForm.sortField = 'combine';
            }
          }
          if(gallerySortType==='0') {
            this.searchForm.sortType = 'asc';
          } else if(gallerySortType==='1'){
            this.searchForm.sortType = 'desc';
          }
          if(galleryView==='0') this.listLayout = 'waterfall';
          this.isInitSearch = false;
          this.search();
        }
      } else {
        if(!(this.$sdkConfig.customGallery?.galleryApi && !this.$sdkConfig.gallery.hasTemplate)){
          var ret = await _getGalleryCategory();
          this.cgData = ret.data || [];
          this.searchForm.cgId = this.cgData.length ? [this.cgData[0].id] : [this.allCgId];
          this.$set(this.searchForm, 'sortField', 'openTime');
        }
        this.isInitSearch = false;
        this.search();
      }
    },
    async changeCgType(type){
      if(this.cgType == type) return;
      if(this.listLayout=='waterfall' && this.waterfallLoading) return;
      if(this.listLayout=='grid' && this.gridLoading) return;
      this.cgType = type;
      if(this.$sdkConfig.platformIsZWKJ){
        switch(type){
          case '': //素材
            this.searchForm = Object.assign({}, this.searchForm, {
              sortField: 'combine',
              galleryType: '1'
            }, this.searchForm0);
            break;
          case '1': //我的
            this.searchForm = Object.assign({}, this.searchForm, {
              sortField: 'created',
              galleryType: ''
            }, this.searchForm1);
            if(this.cgDataMap['1']){
              this.cgData = this.cgDataMap['1'];
            } else{
              if(this.isLogin){
                var ret = await _getGalleryCategory({is_public: 0, customer_id: this.searchForm.customer_id});
                this.cgData = ret.data || [];
                this.cgDataMap['1'] = this.cgData;
              } else {
                this.cgData = [];
              }
            }
            break;
          case '2': //收藏
            this.searchForm = Object.assign({}, this.searchForm, {
              sortField: 'created',
              galleryType: '1'
            }, this.searchForm2);
            if(this.cgDataMap['2']){
              this.cgData = this.cgDataMap['2'];
            } else {
              if(this.isLogin){
                var ret = await _getCustomerGalleryCategory({customer_id: this.searchForm.customer_id});
                this.cgData = ret.data || [];
                this.cgDataMap['2'] = this.cgData;
              } else {
                this.cgData = [];
              }
            }
            break;
        }
        if(!this.isLogin && type != '') {
          this.gridData = [];
          this.waterfallData = [];
          return;
        }
        this.search();
      } else {
        this.search();
      }
    },
    changeFilter(data){
      // this.filterParams = data;
      if(this.cgType==''){
        if(this.searchForm.galleryType=='1'){
          this.filterParams0 = data;
        } else {
          this.filterParams02 = data;
        }
      } else if(this.cgType=='1'){
        this.filterParams1 = data;
      } else {
        if(this.searchForm.galleryType=='1'){
          this.filterParams2 = data;
        } else {
          this.filterParams02 = data;
        }
      }
      this.search();
    },
    changeCgId(value){
      switch(this.cgType){
        case '':
          this.searchForm0.cgId = value;
          break;
        case '1':
          this.searchForm1.cgId = value;
          break;
        case '2':
          this.searchForm2.cgId = value;
          break;
      }
      this.isShowCgSelector = false;
      // this.$refs.categoryCascader.dropDownVisible = false;
      this.search();
    },
    async changeCustomer(value){
      switch(this.cgType){
        case '1': //我的
          if(this.isLogin){
            var ret = await _getGalleryCategory({is_public: 0, customer_id: this.searchForm.customer_id});
            this.cgData = ret.data || [];
          } else {
            this.cgData = [];
          }
          this.cgDataMap['1'] = this.cgData;
          this.searchForm.cgId = [''];
          this.searchForm1.cgId = [''];
          this.searchForm1.customer_id = value;
          break;
        case '2': //收藏
          if(this.isLogin){
            var ret = await _getCustomerGalleryCategory({customer_id: this.searchForm.customer_id});
            this.cgData = ret.data || [];
          } else {
            this.cgData = [];
          }
          this.cgDataMap['2'] = this.cgData;
          this.searchForm.cgId = [''];
          this.searchForm2.cgId = [''];
          this.searchForm2.customer_id = value;
          break;
      }
      this.search();
    },
    changeGalleryType(type){
      if(type==this.searchForm.galleryType) return;
      if(this.listLayout=='waterfall' && this.waterfallLoading) return;
      if(this.listLayout=='grid' && this.gridLoading) return;
      this.searchForm.galleryType = type;
      if(this.$sdkConfig.platformIsZWKJ){
        switch(this.cgType){
          case '':
            this.searchForm0.galleryType = type;
            this.searchForm0.sortField = 'combine';
            this.searchForm.sortField = 'combine';
            break;
          case '2':
            this.searchForm2.galleryType = type;
            this.searchForm2.sortField = type=='1' ? 'created' : 'combine';
            this.searchForm.sortField = type=='1' ? 'created' : 'combine';
            break;
        }
      }
      this.search();
    },
    changeSort(){
      switch(this.cgType){
        case '':
          this.searchForm0.sortField = this.searchForm.sortField;
          break;
        case '1':
          this.searchForm1.sortField = this.searchForm.sortField;
          break;
        default:
          this.searchForm2.sortField = this.searchForm.sortField;
          break;
      }
      this.search();
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
    // 判断是否有搜索参数,用于sdk搜索为空时的显示判断
    checkHasSearchParams(){
      let ret = false;
      if(this.searchForm.keyword!='' || this.searchForm.customer_id!=''){
        return true;
      }
      let cgId = this.searchForm.cgId;
      if(cgId.length>1 || (cgId.length==1 && cgId[0]!=this.allCgId)){
        return true;
      }
      let page  = this.listLayout=='waterfall' ? this.waterfallPage : this.page;
      if(page>1) return true;
      if(this.hasFilterParams) return true;
      return ret;
    },
    async search(isReload=true, opt={},type=0){
      if(this.isInitSearch) return;
      if(this.listLayout=='waterfall' && this.waterfallLoading) return;
      if(this.listLayout=='grid' && this.gridLoading) return;
      if(!this.isLogin && this.cgType!='' && this.$sdkConfig.platformIsZWKJ) return;
      if(isReload){
        this.page = opt.page || 1;
        this.gridData = [];
        this.total = 0;
        this.waterfallPage = 1;
        this.waterfallData = [];
        this.waterfallHeightTemp = [0, 0];
        this.noMore = false;
      }
      let filterParams;
      if(this.$sdkConfig.platformIsZWKJ){
        if(this.cgType==''){
          filterParams = Object.assign({}, this.searchForm.galleryType=='1' ? this.filterParams0 : this.filterParams02);
        } else if(this.cgType=='1'){
          filterParams = Object.assign({}, this.filterParams1);
        } else {
          filterParams = Object.assign({}, this.searchForm.galleryType=='1' ? this.filterParams2 : this.filterParams02);
        }
      } else {
        filterParams = {};
      }
      let params = {
        type: 1, //1主题图,2背景图
        ...this.searchForm,
        ...filterParams,
        page: this.listLayout=='waterfall' ? this.waterfallPage : this.page,
        pageSize: this.listLayout=='waterfall' ? this.waterfallPageSize : this.pageSize,
        product_type_id: this.$store.state.product.selectedProduct.id,
        is_public: this.cgType=='' ? 1 : '',
        isCustomerCategory: this.cgType==2 ? 1 : ''
      };
      params.cgId = this.searchForm.cgId&&this.searchForm.cgId.length ? this.searchForm.cgId[this.searchForm.cgId.length-1] : [""];
      // 保存搜索参数
      const localStorageKey = genLocalStorageKey('galleryParams');
      if(this.$sdkConfig.platformIsZWKJ){
        if (localStorage.getItem(localStorageKey)) {
          localStorage.removeItem(localStorageKey);
        }
        let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
        let paramsCache = {
          [customerId]: Object.assign({
            searchForm: this.searchForm,
            filterParams: filterParams,
            cgType: this.cgType,
            page: params.page,
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
      let _params = JSON.parse(JSON.stringify(params)); 
      delete _params.galleryType;
      if(params.galleryType=='2') delete _params.type;
      let res, isTemplate = params.galleryType=='2', isExternal = false;
      if(this.$sdkConfig.platformIsZWKJ || this.$sdkConfig.platform == 'xcxBackend'){
        if(this.cgType == ''){
          _params.is_material = 1;
          res = params.galleryType=='1' ? await _getGallery(_params) : await _galleryTemplate(_params);
        } else if(this.cgType == '1'){
          res = await _getGallery(_params);
        } else {
          if(params.galleryType=='2') _params.is_material = 1;
          res = params.galleryType=='1' ? await _getGallery(_params) : await _galleryTemplate(_params, 1);
        }
        if(this.$sdkConfig.platform == 'xcxBackend'){
          res = transformPicOrTemplateListData(res)
        }
      } else {
        delete _params.isCustomerCategory;
        delete _params.is_public;
        if(this.cgType == ''){
          if(params.galleryType == '1'){
            if(this.$sdkConfig.customGallery?.galleryApi){
              const externalParams = {
                type: 1,
                keyword: _params.keyword,
                page: _params.page,
                pageSize: _params.pageSize
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
              res = await _getGallery(_params);
            }
          } else {
            res = await _galleryTemplate(_params)
          }
        } else {
          delete _params.cgId;
          isTemplate = false;
          _params.external_customer_id = getSDKUserCode(this.$OPTIONS)
          res = await _getGallery(_params);
        }
      }
      if(this.listLayout == 'waterfall'){
        this.waterfallLoading = false;
        this.imgPreloading(res.data.data, isTemplate, isExternal);
        this.waterfallPage++;
        if(res.data.data.length < this.waterfallPageSize){
          this.noMore = true;
        }
      } else {
        this.gridLoading = false;
        this.gridData = res.data.data.map(item => {
          if(this.$sdkConfig.platform == 'xcxBackend'){
            if(item.images){
              item.__isTemplate = 1;
            }else{
              item.__riskInfo = genRiskInfo(item);
            }
          }else{
            if(isTemplate){
            item.__isTemplate = 1;
          } else {
            item.__riskInfo = genRiskInfo(item);
          }
          }
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
    imgPreloading(imgList, isTemplate, isExternal){
      let promises = [];
      for (let i = 0; i < imgList.length; i++) {
        let promise = new Promise((resolve, reject) => {
          let aImg = new Image();
          aImg.src = isTemplate ? imgList[i].images : imgList[i].previewImg;
          let imgData = {};
          if(isTemplate){
            imgList[i].__isTemplate = 1;
          } else {
            imgList[i].__riskInfo = genRiskInfo(imgList[i]);
          }
          if(isExternal){
            imgList[i].sdk_info = {
              sdk_gallery_code: imgList[i].code,
              sdk_gallery_url: imgList[i].originImg
            }
          }
          imgData.data = imgList[i];
          aImg.onload = () => {
            imgData.color = "#EEF2F8";
            imgData.height = (this.waterfallConfig.imgWidth / aImg.width) * aImg.height;
            imgData.src = isTemplate ? imgList[i].images : imgList[i].previewImg;
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
    changePage(){
      this.search(false);
    },
    toLogin(){
      if(this.$sdkConfig.platformIsZWKJ){
        eventBus.$emit('showLoginPop')
      }
    },
    async handelClick(data) {
      this.$statisticalreport.addDesignItem('图片')
      if(!data.__isTemplate && isRisk(data)) {
        this.$message.error("图片信息异常，无法使用");
        return;
      }
      if(data.__isTemplate){
        getProductTemplate({code: data.code}).then(res=>{
          if(this.$sdkConfig.platform == 'xcxBackend'){
          res.data = transformTemplateData(res.data)
          }
          if(res.status>0 || res.result_code == 200){
            eventBus.$emit('applyTemplate', {code: data.code, data: res.data});
          }
        }).catch(err=>{
          // this.$message.error('该模板已下架，无法使用');
        })
      } else{
        this.dataItem = data;
        this.$store.commit("layout/changeSelectType", "image");
        eventBus.$emit("galleryClick", { galleryData: data });
      }
    },
    dragStartFun(e, data){
      if(!data.__isTemplate && isRisk(data)) {
        this.$message.error("图片信息异常，无法使用");
        return;
      }
      e.dataTransfer.setData('dragData', JSON.stringify({data}));
    },
    //悬浮弹窗展示图片信息
    showimgItemDetail(e, data) {
      if(data.__isTemplate){
        this.gallery = Object.assign({}, data);
      } else {
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
      }

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
    async toggleCollect(img){
      if(img.is_collect){
        img.__isTemplate ? _templateCollectCancel({ids: img.code}) : _galleryCollectCancel({ids: img.id});
        this.$message.success('取消收藏成功');
      } else {
        img.__isTemplate ? _templateCollect({operate: 2, c_cat_ids: -1, ids: img.code}) : _galleryCollect({operate: 2, c_cat_ids: -1, ids: img.id, isCCatId: 1})
        this.$message.success('收藏成功');
      }
      if(this.cgType != '2'){
        this.$set(img, 'is_collect', !img.is_collect);
      } else {
        setTimeout(()=>{
          this.search();
        }, 1000);
      }
    },
    // 上传图片
    async httpRequest(param){
      let file = param.file; // 相当于input里取得的files
      let formData = new FormData(); // FormData 对象
      formData.append("image", file); // 文件对象
      formData.append("id", file.uid);
      formData.append("name", file.name);
      formData.append("type", file.type);
      formData.append("lastModifiedDate", file.lastModifiedDate);
      formData.append("size", file.size);
      formData.append('gallery_type', 1);
      if(!this.$sdkConfig.platformIsZWKJ && this.$sdkConfig.platform != 'xcxBackend'){
        let userCode = getSDKUserCode(this.$OPTIONS);
        formData.append('external_customer_id', userCode);
      }
      _uploadImg(formData)
        .then(res => {
          this.$message.success("上传成功！");
          // this.search();
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
      this.$refs.gridUpload.clearFiles();
      this.search();
      setTimeout(() => {
        this.$store.commit("layout/changeLeftType", "upload");
      }, 2000)
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
.tab-row{
  border-bottom: 1px solid #F0F2F5;
}
.switch-tab{
  display: flex;
  justify-content: center;
  font-size: 16px;
  width: 300px;
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
.switch-attr{
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  border-radius: 5px;
  .attr-item{
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    background: #F2F2F2;
    color: $primary;
    box-shadow: 0px 6px 12px 0px rgba(4, 83, 243, 0.24);
    &:first-child{
      border-radius: 100px 0px 0px 100px;
    }
    &:last-child{
      border-radius: 0px 100px 100px 0px;
    }
    &.active{
      background: $primary;
      color: #fff;
    }
  }
}
.attr-row{
  margin: 0 20px;
}
.search-row{
  display: flex;
  margin: 0 20px;
  border-bottom: 1px solid #F0F2F5;
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
        &:hover{
          .collect{
            display: inline-block;
          }
        }
        /deep/ .el-card{
          border-radius: 20px;
        }
      }
      /deep/ .el-image{
        img{
          width: 132px !important;
          height: auto;
          z-index: 1;
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
    &:hover{
      .collect{
        display: inline-block;
      }
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
    i {
      color: red;
    }
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
    padding: 10px 15px;
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
    .tempname{
      color: #000;
      line-height: 22px;
      font-weight: 600;
    }
    .tempdesc{
      color: #666;
      line-height: 16px;
      font-size: 12px;
      word-break: break-all;
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
.upload-box{
  display: flex;
  justify-content: center;
}
.upload-btn{
  width: 74px;
  height: 32px;
  border-radius: 16px;
  background: $primary;
  color:#fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}
.collect{
  position: absolute;
  top: 0;
  right: 0;
  display: none;
  z-index: 2;
  .iconfont{
    font-size: 18px;
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
</style>
