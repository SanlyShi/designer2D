<template>
  <div class="imgList-box">
    <el-upload
      v-if="(uploadImgGuarantee&&isLogin) || !$sdkConfig.platformIsZWKJ"
      class="upload-demo mt20 pl20 pr20"
      action="#"
      ref="upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :http-request="httpRequest"
      :before-upload="beforeUpload"
      multiple
     
      :on-success="handSuccess"
      :on-change="handleChange"
      :show-file-list="false"
      :on-exceed="handleExceed"
      :file-list="fileList"
      accept="image/png, image/gif, image/jpg, image/jpeg"
    >
      <div class="add-img-btn mb20">
        <span class="el-icon-plus mr3"></span>
        <span>上传图片</span>
      </div>
    </el-upload>
    <div class="add-img-btn m20" v-else @click="showDialog">
      <span class="el-icon-plus mr3"></span>
      <span>上传图片</span>
    </div>
    <div class="remark-box f12 mb30 pl20 pr20">
      <div class="mb6">{{$sdkConfig.platformIsZWKJ && '1.' || ''}}仅支持30M以内JPG、JPEG、PNG格式的图片</div>
      <div v-show="$sdkConfig.platformIsZWKJ" class="mb6">2.请勿上传涉政、涉黄、侵权等违法行为，情节严重的将给予封号处理</div>
      <div v-show="$sdkConfig.platformIsZWKJ" class="mb6">
        3.上传代表已阅读并同意
        <a
          target="_blank"
          href="https://www.hicustom.com/frontend/about/legalDeclaration"
        >《法律声明》</a>
      </div>
    </div>
    <div class="upload-title f14 mb10 pl20 pr20">最近上传记录</div>
    <div class="gallery-container">
      <div ref="uploadImgList" class="upload-img-grid scroll-bar">
        <div class="upload-img-list">
          <div
            class="upload-img-item zw-image-box"
            v-for="(imgItem,index) in upLoadImgList"
            :key="index"
            @click="handelClick(imgItem)"
            @mouseenter="showimgItemDetail($event, imgItem)"
            @mouseleave="hideImgItemDetail($event, imgItem)"
          >
            <el-image :src="imgItem.designImg" class="image" :key="index"></el-image>
            <div class="imgbox">
            </div>
            <template v-if="imgItem.__riskInfo && imgItem.__riskInfo.show">
              <el-tooltip
               :enterable='false' effect="dark" placement="top">
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
        style="pl65"
        :total="total"
        :pageSize="page.pageSize"
        :curPage.sync="page.page"
        @change="changePage"
        ref="pagination"
      ></Pagination>
    </div>
    <!-- 图片详情悬浮框 -->
    <transition name="fade">
      <div
        @mouseover="isShowDetail=true"
        @mouseleave="isShowDetail=false"
        ref="galleryDetail"
        class="gallery-info-box scroll-bar"
        :style="{'top': detailPos.top, 'bottom': detailPos.bottom}"
        v-show="isShowDetail"
      >
        <template v-if="gallery">
          <div class="imgPanInfoDesigner">
            <img
              :style="{width:showImgSize.imgWidth+'px',height:showImgSize.imgHeight+'px'}"
              :src="gallery.previewImg"
              alt
            />
          </div>
          <div class="info-cont">
            <div class="row flex flex-col-ct mb10">
              <div class="flex flex-col-ct">
                <span class="f14 name mr6">{{gallery.name|substrString}}{{gallery.imageUrl|getExt}}</span>
              </div>
              <div>
                <!-- <span class="iconfont" v-if="!isLogin&&Number(gallery.price)==0"></span> -->
                <span class="f16 price" v-if="!isLogin&&Number(gallery.price)>0">￥{{gallery.price}}</span>
              </div>
            </div>
            <div class="row flex" style="flex-wrap: wrap;">
              <div class="size f12 mb5">
                <span class="f12 id mr8">ID：{{gallery.id}}</span>
                <span>{{gallery.size.width}}x{{gallery.size.height}} px</span>
              </div>
              <div class="flex flex-col-ct mb5">
                <span class="iconfont"></span>
                <span class="design-name">{{gallery.design_customer_name}}</span>
              </div>
            </div>
          </div>
          <div class="imgPanInfoDesc scroll-bar" v-if="imgPanInfoDesc[gallery.code]">
            <div v-html="imgPanInfoDesc[gallery.code]" class="f12"></div>
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
import Pagination from "@/components/common/Pagination";
import { transformPicOrTemplateListData } from "@/utils/dataTrans";
import {
  _getPrivatePhotos,
  _uploadImg,
  _saveCustomerAgreement,
  _imgSizeIsOverService,
} from "@/apis/uploadImg";
import { genRiskInfo, isRisk } from "@/utils/gallery.js";
import eventBus from "@/utils/eventBus.js";
import {getSDKUserCode} from '@/utils/utils.js'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      publicPath: process.env.VUE_APP_BASE_STATIC_URL, //环境地址暂未配置
      // publicPath:'designer_static/',
      isLogin: this.$isLogin || false,
      userInfo: this.$isLogin ? this.$OPTIONS.userInfo : {},
      form: {},
      page: {
        page: 1,
        pageSize: 20
      },
      total: 0,
      cutDownCount: 10,
      timer: null,
      //图片数据 悬浮
      gallery: null,
      isAgree: false,
      upLoadImgList: [],
      //悬浮图片描述 异步获取
      imgPanInfoDesc: {},
      detailPos: { top: 0, bottom: 0 },
      //图片悬浮弹窗展示
      isShowDetail: false,
      dialog: false,
      showImgSize: {
        imgHeight: 200,
        imgWidth: 200
      },
      fileList: [],
      isShowEmptyGalleryTip: false,
      emptyGalleryHtml: '',
      beforeUploadPromise: [],
      beforeUploadFileList: [],
      allowUpload: 0, //1：允许上传 2：不允许上传
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
    }
  },
  watch: {
    'leftType': function(nv){
      if(nv=='upload'){
        this.search();
      }
    }
  },
  mounted() {
    if (this.$isLogin || !this.$sdkConfig.platformIsZWKJ) {
      let winHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      let height = winHeight - 218;
      this.page.pageSize = Math.floor(height / 100) * 3;
      this.getPrivatePhotos();
    }
  },
  computed: {
    offsetHeight() {
      return this.$refs.uploadImgList.offsetHeight;
    },
    uploadImgGuarantee(){
      return this.$store.state.isUploadImgGuarantee;
    },
    leftType() {
      return this.$store.state.layout.leftType;
    },
  },
  methods: {
    search() {
      this.page.page = 1;
      this.getPrivatePhotos();
    },
    getPrivatePhotos() {
      let params = { ...this.page, sortField: "created", sortType: "desc" };
      if(!this.$sdkConfig.platformIsZWKJ && this.$sdkConfig.platform != 'xcxBackend'){
        params.external_customer_id = getSDKUserCode(this.$OPTIONS);
        params.type = 1;
      }
      _getPrivatePhotos(params)
        .then(res => {
          if(this.$sdkConfig.platform == 'xcxBackend'){
          res = transformPicOrTemplateListData(res)
          }
          this.upLoadImgList = res.data.data.map(item => {
            item.__riskInfo = genRiskInfo(item);
            return item;
          });
          this.total = res.data.total;
        })
        .catch(err => {
          this.$message.error(err.msg);
        });
    },
    changePage() {
      this.getPrivatePhotos();
    },
    showimgItemDetail(e, data) {
      let maxSize = 200,
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
        imgHeight
      };
      this.gallery = Object.assign({}, data);
      this.isShowDetail = true;
      this.$nextTick(() => {
        let winHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        let objPos = e.target.getBoundingClientRect();
        let popHeight = this.$refs.galleryDetail.clientHeight;
        if (winHeight - objPos.top > popHeight) {
          this.detailPos = Object.assign({
            top: objPos.top - 50 + "px",
            bottom: "auto"
          });
        } else {
          this.detailPos = Object.assign({ top: "auto", bottom: 0 });
        }
      });
    },
    handelClick(data) {
      if (isRisk(data)) {
        this.$message.error("图片信息异常，无法使用");
        return;
      }
      this.dataItem = data;
      this.$store.commit("layout/changeSelectType", "image");
      eventBus.$emit("galleryClick", { galleryData: data });
      // this.$store.dispatch("addViewCfg");
    },

    hideImgItemDetail(e, data) {
      this.isShowDetail = false;
    },
    //展示承诺书弹窗
    showDialog() {
      if(!this.$isLogin){
        eventBus.$emit("showLoginPop");
        return;
      }
      eventBus.$emit('showUploadGuaranteePop');
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
      console.log("图片上传前验证")
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
    //图片上传
    async httpRequest(param) {
      let file = param.file; // 相当于input里取得的files

      let formData = new FormData(); // FormData 对象
      // console.log(file)
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
          this.$message.success("成功添加新数据！");
          if(this.$sdkConfig.platform == 'xcxBackend'){
            res.data['size'] = {
              width:res.data.width,
              height:res.data.height
            }
          }
          this.upLoadImgList.unshift(this.$sdkConfig.platformIsZWKJ || this.$sdkConfig.platform == 'xcxBackend' ? res.data : res.data[0]);
          if(this.uploadImgList.length > this.page.pageSize){
            this.upLoadImgList.pop();
          }
        }).catch(err => {
          // this.$message.error(e.msg ? e.msg : "上次失败");
        })
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handSuccess() {
      this.$refs.upload.clearFiles();
      // this.search();
    },
    handleChange() {}
  }
};
</script>
<style lang="scss" scoped>
.fade-leave-active {
  transition: all 1s;
}
.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.remark-box{
  a{
    color: #0453F3;
  }
}
.agreement-upload-dialog {
  /deep/ .el-dialog {
    margin-top: 6vh !important;
  }

  /deep/ .el-dialog__body {
    padding: 20px 30px 30px 30px;
  }
  .agreement-upload-title {
    span {
      font-weight: bold;
    }
  }
  .agreement-upload-cont {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    .guarantee {
      color: #0453F3;
      text-decoration: underline;
    }

    ul {
      &.content {
        li {
          text-indent: 16px;
        }
        li:last-child {
          text-indent: 26px;
        }
      }
    }
  }
  .agree-btn {
    width: 130px;
    height: 32px;
    // background: #0453F3;
    // border-radius: 4px;
    //     border-radius: 4px;
    //     background-color: #428bca;
    //     color: #fff;
    //     display: inline-block;
    //     padding: 4px 12px;
    //     border: 1px solid #428bca;

    cursor: pointer;
    &.disabled {
      background-color: #fafafa;
      border: 1px solid #dddddd;
      color: #999999;
      pointer-events: none;
    }
  }
}

.imgList-box {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
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
.add-img-btn {
  width: 280px;
  height: 40px;
  background: #f0f5ff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.upload-title {
  color: #000000;
}
.gallery-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  padding-bottom: 40px;
  display: flex;
  .upload-img-grid {
    height: 100%;
    // flex: 1;
    overflow: auto;
  }
  .upload-img-list {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 20px;
    justify-content: space-between;
  }
}

.upload-img-item {
  width: 88px;
  height: 88px;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
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
    width: 100%;
    height: 260px;
    padding: 30px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 20px 20px 0px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
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
    overflow-y: auto;
    overflow-x: hidden;
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
</style>