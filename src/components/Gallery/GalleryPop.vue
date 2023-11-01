<template>
  <div>
    <el-dialog
      width="1000px"
      top="50px"
      custom-class="login-pop __zw-gallerypop"
      title
      :visible="true"
      :show-close="false"
      :modal-append-to-body="true"
      :destroy-on-close="true"
      @close="close"
    > 
      <i class="iconfont iconclose-bold close-pop-btn" @click="close"></i>
      <div class="gallery-pop">
        <section class="left-sec">
          <div class="tabs">
            <a class="tab-item" 
              v-for="item in cgTypeData" 
              :key="item.id"
              :class="{'active': item.id==cgType}"
              @click="changeCgType(item.id)"
            >{{item.name}}</a>
          </div>
          <div>
            <div class="tips">
              <i class="el-icon-info"></i>请勿上传涉政、涉黄、侵权等违法行为，情节严重的将给予封号处理
            </div>
            <div class="agreement vertical-center mt10">
              <label>
                <!-- <el-checkbox :value="true" disabled></el-checkbox> -->
                <span>我已阅读并同意此</span>
              </label>
              <a class="primary-color underline" target="_blank" href="https://www.hicustom.com/frontend/about/legalDeclaration">法律声明</a>
            </div>
            <div class="mt20 mb20 mr15">
              <el-upload
                v-if="(uploadImgGuarantee&&isLogin) || !$sdkConfig.platformIsZWKJ"
                ref="upload"
                class="upload-btn"
                :multiple="$sdkConfig.platformIsZWKJ"
                accept="image/png, image/jpg, image/jpeg"
                action="#"
                :show-file-list="false"
                :http-request="httpRequest"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
              >
                <el-button size="small" type="primary"><span class="el-icon-plus mr3"></span>上传图片</el-button>
              </el-upload>
              <el-button v-else size="small" type="primary" style="width:100%" @click="canUploadCheck">
                <span class="el-icon-plus mr3"></span>上传图片
              </el-button>
            </div>
            <div class="mr15">
              <el-upload
                v-if="(uploadImgGuarantee&&isLogin) || !$sdkConfig.platformIsZWKJ"
                ref="dragUpload"
                class="upload-drag"
                drag
                :multiple="$sdkConfig.platformIsZWKJ"
                accept="image/png, image/jpg, image/jpeg"
                action="#"
                :show-file-list="false"
                :http-request="httpRequest"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将图片拖到此处上传</div>
                <p class="el-upload__desc">JPG、JPEG、PNG格式<br/>30M以内</p>
              </el-upload>
              <div v-else class="upload-drag" @dragover="dragoverHandler" @drop="canUploadCheck" @click="canUploadCheck">
                <div class="el-upload-dragger">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将图片拖到此处上传</div>
                  <p class="el-upload__desc">JPG、JPEG、PNG格式<br/>30M以内</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="right-sec">
          <div class="search-filed">
            <template v-if="$sdkConfig.platformIsZWKJ && $sdkConfig.platform !='xcxBackend'">
              <el-select
                v-show="cgType!=''"
                v-model="searchForm.customer_id"
                size="small"
                class="mr10 __zw-select"
                popper-class="__zw-gallerypop__dropdown"
                style="width: 120px"
                @change="changeCustomer"
              >
                <el-option label="全部关联账号图库" value v-show="cgType==1"></el-option>
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.name || item.realname"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
            <el-cascader
              v-show="(cgType!='' || !$sdkConfig.platformIsZWKJ) && $sdkConfig.platform !='xcxBackend'"
              ref="categoryCascader"
              v-model="searchForm.cgId"
              :options="cgData"
              :props="{ expandTrigger: 'hover',checkStrictly:true,label:'name',value:'id',children:'subCg'}"
              size="small"
              class="mr10 __zw-select"
              style="width: 100px"
              popper-class="__zw-gallerypop__dropdown"
              @change="changeCgId"
              >
              <template slot-scope="{ node, data }">
                <span :data-cgid="data.id">{{ data.name }}</span>
              </template>
            </el-cascader>
            <el-input
              class="keyword-search"
              v-model="searchForm.keyword"
              placeholder="搜索图片"
              @focus="handleFocus"
              @blur="handleBlur"
              @change="search"
            >
              <i class="iconfont iconzoom" slot="prefix" @click="search"></i>
            </el-input>
          </div>
          <div class="search-result scroll-bar">
            <div class="loading" v-if="isLoading">正在搜索...</div>
            <template v-else>
              <div class="gallery-list" v-if="resultData.length">
                <div class="gallery-item zw-image-box" v-for="imgItem in resultData" :key="imgItem.id" @click="selectGallery(imgItem)">
                  <el-image 
                    :src="imgItem.previewImg"
                    class="image" 
                    lazy
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
                <div class="empty-box" v-if="!isLogin && cgType != '' && $sdkConfig.platform !='xcxBackend'">
                  <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
                  <div class="mt10 f14">您需要登录后才可查看图片</div>
                  <el-button type="primary" class="mt10 zw-btn" style="width:60px;" @click="toLogin">登录</el-button>
                </div>
                <div class="empty-box" v-else>
                  <img src="@/assets/img/img_hi.png" width="100" class="mt40" />
                  <div class="mt10 f14">没有符合条件的图片</div>
                </div>
              </template>
            </template>
          </div>
          <div class="search-pagination">
            <Pagination
              :total="total"
              :pageSize="pageSize"
              :curPage.sync="page"
              @change="changePage"
              ref="pagination"
            ></Pagination>
          </div>
        </section>
      </div>
    </el-dialog>
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
import Pagination from "@/components/common/Pagination";
import { _uploadImg, _imgSizeIsOverService } from '@/apis/uploadImg'
import { _getGalleryCategory, _getCustomerGalleryCategory, _getGallery, _getGalleryInfoDesc} from "@/apis/gallery.js";
import { genRiskInfo, isRisk } from "@/utils/gallery.js";
import { transformPicOrTemplateListData } from "@/utils/dataTrans";
import eventBus from "@/utils/eventBus.js";
import { getSDKUserCode } from "@/utils/utils";
export default {
  components: {
    Pagination
  },
  props: {
    isBg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      allCgId: this.$sdkConfig.platformIsZWKJ ? '' : -2,
      isLogin: this.$isLogin,
      userInfo: this.$isLogin ? this.$OPTIONS.userInfo : {},
      cgType: '',
      searchForm: {
        customer_id: '',
        cgId: [this.$sdkConfig.platformIsZWKJ ? '' : -2],
        keyword: '',
      },
      cgData: [],
      isLoading: true,
      resultData: [],
      total: 0,
      page: 1,
      pageSize: 30,
      // 上传图片
      fileList: [],
      isShowEmptyGalleryTip: false,
      emptyGalleryHtml: '',
      beforeUploadPromise: [],
      beforeUploadFileList: [],
      allowUpload: 0, //1：允许上传 2：不允许上传
    }
  },
  computed: {
    config() {
      return this.$store.state.layout.designerConfig;
    },
    uploadImgGuarantee(){
      return this.$store.state.isUploadImgGuarantee;
    },
    cgTypeData() {
      if(this.$sdkConfig.platformIsZWKJ){
        return [
          {id: 1, name: '我的图片'},
          {id: 2, name: '收藏图片'},
          {id: '', name: '图片素材'}
        ]
      } else if(this.$sdkConfig.platform == 'xcxBackend'){
        return [
          {id: 1, name: '我的图片'},
          {id: '', name: '图片素材'}
        ]
      }
      else {
        return [{id: '', name: '图片素材'}]
      }
    },
    customerList(){
      if(this.cgType == 1){
        return this.config.customerList;
      } else if(this.cgType == 2){
        return this.config.subAccountList;
      }
    },
  },
  methods: {
    async initCgData(){
      if(this.$sdkConfig.platformIsZWKJ){
        if(this.$isLogin){
          this.cgType = 1;
          let ret = await _getGalleryCategory({is_public: 0, customer_id: ''});
          this.cgData = ret.data || [];
        }
      } else {
        let ret = await _getGalleryCategory();
        this.cgData = ret.data || [];
      }
      this.search();
    },
    async changeCgType(id){
      if(this.cgType == id) return;
      this.cgType = id;
      let ret;
      switch(this.cgType){
        case 1:
          this.searchForm.customer_id = '';
          this.searchForm.cgId = [this.allCgId];
          if(this.isLogin){
            ret = await _getGalleryCategory({is_public: 0, customer_id: ''});
            this.cgData = ret.data || [];
          } else {
            this.cgData = [];
          }
          break;
        case 2:
          this.searchForm.customer_id = this.customerList.length ? this.customerList[0].id : '';
          this.searchForm.cgId = [this.allCgId];
          if(this.isLogin){
            ret = await _getCustomerGalleryCategory({customer_id: this.searchForm.customer_id});
            this.cgData = ret.data || [];
          } else {
            this.cgData = [];
          }
          break;
        default: 
          this.searchForm.customer_id = '';
          this.searchForm.cgId = [this.allCgId];
          break;
      }
      if(!this.isLogin && id != '' && this.$sdkConfig.platform != 'xcxBackend') {
        this.resultData = [];
        return;
      }
      this.search();
    },
    async changeCustomer(){
      let ret;
      switch(this.cgType){
        case 1:
          ret = await _getGalleryCategory({is_public: 0, customer_id: this.searchForm.customer_id});
          this.cgData = ret.data || [];
          break;
        case 2:
          ret = await _getCustomerGalleryCategory({customer_id: this.searchForm.customer_id});
          this.cgData = ret.data || [];
          break;
        default:
          break;
      }
      this.searchForm.cgId = [this.allCgId];
      this.search();
    },
    changeCgId(){
      this.$refs.categoryCascader.dropDownVisible = false;
      this.search();
    },
    changePage(){
      this.search(false);
    },
    async search(isReload = true){
      if(isReload) {
        this.page = 1;
        this.total = 0;
      }
      let cgId = this.searchForm.cgId[this.searchForm.cgId.length - 1];
      let params = Object.assign({}, this.searchForm, {
        type: this.isBg ? 2 : 1, //1主题图,2背景图
        page: this.page, 
        pageSize: this.pageSize,
        is_public: this.cgType=='' ? 1 : '',
        isCustomerCategory: this.cgType==2 ? 1 : '',
        product_type_id: this.$store.state.product.selectedProduct.id
      });
      params.cgId = cgId;
      if(!this.$sdkConfig.platformIsZWKJ && this.$sdkConfig.platform != 'xcxBackend'){
        delete params.is_public;
        delete params.isCustomerCategory;
        delete params.customer_id;
      }
      if(this.$sdkConfig.platform == 'xcxBackend'){
        if(this.cgType == ''){
          params = {
        customer_id: '',
        cgId: '',
        keyword: params.keyword,
        type: 1,
        page: params.page,
        pageSize: params.pageSize,
        is_public: 1,
        isCustomerCategory: '',
        product_type_id: '',
        is_material:1
      }
        }else{
          params = {
        customer_id: '',
        cgId: '',
        keyword: params.keyword,
        type: 1,
        page: params.page,
        pageSize: params.pageSize,
        is_public: 0,
        isCustomerCategory: '',
        product_type_id: ''
      }
        }
      }
      this.isLoading = true;
      let ret = await _getGallery(params);
      if(this.$sdkConfig.platform == 'xcxBackend'){
          ret = transformPicOrTemplateListData(ret)
      }
      this.isLoading = false;
      this.resultData = ret.data.data.map(item=>{
        item.__riskInfo = genRiskInfo(item);
        return item;
      })
      this.total = ret.data.total;
    },
    close() {
      this.$emit('close');
    },
    toLogin(){
      eventBus.$emit('showLoginPop')
    },
    handleFocus(e) {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    selectGallery(data){
      if(isRisk(data)){
        this.$message.error("图片信息异常，无法使用");
        return;
      }
      // eventBus.$emit("galleryClick", { galleryData: data, isReplace: true });
      if(this.isBg){
        eventBus.$emit("galleryClick", { galleryData: data,  isBg: true});
      } else {
        eventBus.$emit('replaceImage', {galleryData: data});
      }
      this.$emit('close');
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
      formData.append('gallery_type', this.isBg ? 2 : 1);
      if(!this.$sdkConfig.platformIsZWKJ && this.$sdkConfig.platform != 'xcxBackend'){
        let userCode = getSDKUserCode(this.$OPTIONS);
        formData.append('external_customer_id', userCode);
      }
      _uploadImg(formData).then( async res => {
        this.$message.success("上传成功！");
        // sdk上传成功后直接替换
        if(!this.$sdkConfig.platformIsZWKJ){
          let galleryData = res.data[0]
          if (isRisk(galleryData)) {
            this.$message.error("图片信息异常，无法使用");
            return;
          }
          if(this.isBg){
            eventBus.$emit("galleryClick", { galleryData,  isBg: true});
          } else {
            eventBus.$emit('replaceImage', {galleryData});
          }
          this.close();
        }
      }).catch(error => {
        // this.$message.error(e.msg ? e.msg : "上次失败");
      })
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
    handleSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles();
      this.$refs.dragUpload.clearFiles();
      if(this.$sdkConfig.platformIsZWKJ){
        setTimeout(()=>{
          this.search();  
        }, 2000)
      }
    },
    dragoverHandler(e){
      e.preventDefault();
    },
    canUploadCheck(e){
      e.preventDefault();
      if(this.$sdkConfig.platformIsZWKJ){
        if(!this.$isLogin) {
          eventBus.$emit("showLoginPop");
          return;
        }
        eventBus.$emit('showUploadGuaranteePop');
      } else {
        if(!this.$isLogin){
          this.$message.error('请先登录');
        }
      }
    },
  },
  created(){
    this.initCgData();
  }
}
</script>

<style lang="scss" scoped>
  .close-pop-btn{
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
    cursor: pointer;
    padding: 15px;
  }
  .gallery-pop{
    display: flex;
    min-height: 550px;
  }
  .vertical-center{
    display: flex;
    align-items: center;
  }
  .primary-color{
    color: #0453F3;
  }
  .underline{
    text-decoration: underline;
  }
  .left-sec{
    width: 220px;
    background: #FAFAFA;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 5px 0px 0px 5px;
    border-right: 1px solid #E4E4E4;
    padding: 15px 0 20px 20px;
    .tab-item{
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: #fff;
      color: #333;
      border-radius: 5px 0px 0px 5px;
      display: block;
      margin-bottom: 10px;
      text-align: center;
      cursor: pointer;
      box-sizing: content-box;
      &.active{        
        background: #EBECF8;
        color: #0453F3;
        border-right: 2px solid #0453F3;
      }
    }
    .tips{
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 18px;
    }
    .agreement{
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 20px;
    }
  }
  /deep/ .el-upload{
    width: 100%;
    .el-button{
      width: 100%;
    }
  }
  .upload-drag{
    width: 180px;
    height: 180px;
    &:hover{
      border-color: #0453F3;
    }
    .el-upload__text{
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
    .el-upload__desc{
      font-size: 12px;
      color: rgba(0, 0, 0, 0.25);
      line-height: 18px;
    }
    .el-icon-upload{
      font-size: 34px;
      color: #C0C4CC;
      margin:38px 0 0 0;
      line-height: 1;
    }
  }
  .right-sec{
    flex: 1;
    position: relative;
    padding-bottom: 44px;
    &>.title{
      line-height: 50px;
      font-weight: bold;
      font-size: 16px;
      border-bottom: 1px solid #efefef;
      padding: 0 15px;
    }
  }
  /deep/ .el-input--small .el-input__inner{
    height: 32px !important;
    line-height: 32px !important;
  }
  .search-filed{
    margin: 15px 20px;
    display: flex;
  }
  .search-result{
    flex: 1;
    // max-height: calc(100vh - 300px);
    height: calc(100vh - 400px);
    overflow-y: auto;
    padding: 0 20px;
    .empty-box{
      text-align: center;
      margin: 0 auto;
    }
    .empty{
      text-align: center;
      padding: 60px 0;
    }
    .loading{
      text-align: center;
      padding: 60px 0;
    }
  }
  /deep/ .keyword-search{
    width: 200px;
    .el-input__inner{
      text-indent: 14px !important;
      background: #F0F2F5;
      border-radius: 16px;
    }
    .el-input__prefix{
      display: flex;
      align-items: center;
    }
  }
  .gallery-list{
    display: flex;
    flex-wrap: wrap;
    .gallery-item{
      width: calc((100% - 60px)/5);
      height: 136px;
      margin-bottom: 15px;
      margin-right: 15px;
      border-radius: 5px;
      position: relative;
      &:nth-child(5n+5){
        margin-right: 0;
      }
    }
  }
  .search-pagination{
    width: 100%;
    height: 44px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .upload-btn{
    width: 100%;
    display: flex;
    justify-content: center;
    /deep/ .el-button--small{
      border-radius: 16px;
    }
  }
  .upload-drag{
    width: 100%;
    margin-top: 10px;
  }
  /deep/ .el-upload-dragger{
    width: 100%;
    border-radius: 20px;
  }
  .imgbox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 5px;
  }
  /deep/ .el-checkbox__label{
    padding-left:5px !important;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45) !important;
  }
  /deep/ .el-button--small{
    border-radius: 16px;
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
<style lang="scss">
.__zw-gallerypop{
  z-index: 2000 !important;
}
.__zw-gallerypop__dropdown{
  z-index: 3000 !important;
}
</style>