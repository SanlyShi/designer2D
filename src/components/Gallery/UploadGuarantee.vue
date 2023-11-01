<template>
  <el-dialog
    title="提示"
    :visible="true"
    :modal-append-to-body="true"
    :destroy-on-close="true"
    class="agreement-upload-dialog"
    width="1000px"
    @close="close"
  >
    <div slot="title" class="tc agreement-upload-title">
      <span class="f16">指纹平台用户上传图片承诺保证书</span>
    </div>
    <div class="agreement-upload-cont">
      <!-- <div class="tc mb20">
        <p class="f16 fw600">指纹平台用户上传图片承诺保证书</p>
      </div>-->
      <div class="f14">
        <p class="mb20">
          尊敬的用户，您在此承诺并保证上传图片、文字
          <span class="fw600">不得含有</span>下述内容：
        </p>
        <ul class="content">
          <li>（1）反对宪法所确定的基本原则的；</li>
          <li>（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的，损害中国及国家领导人、国家机关、执法人员或革命领袖肖像的；</li>
          <li>（3）损害国家荣誉和利益的；</li>
          <li>（4）歪曲、丑化、亵渎、否定英雄烈士事迹和精神，以侮辱、诽谤或者其他方式侵害英雄烈士的姓名、肖像、名誉、荣誉的；</li>
          <li>（5）宣扬恐怖主义、极端主义或者煽动实施恐怖活动、极端主义活动的；</li>
          <li>（6）煽动民族仇恨、民族歧视，破坏民族团结的；</li>
          <li>（7）破坏国家宗教政策，宣扬邪教和封建迷信的；</li>
          <li>（8）散布谣言，扰乱经济秩序和社会秩序的；</li>
          <li>（9）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
          <li>（10）侮辱或者诽谤他人，侵害他人名誉、隐私、肖像或者其他合法权益；</li>
          <li>（11）侵犯第三方知识产权（包括但不限于著作权、商标权、专利权、隐私权或肖像权）、商业秘密及其他专有权利的；</li>
          <li>（12）侵害未成年人权益、教唆犯罪或任何其他违反公序良俗的；</li>
          <li>（13）欺诈、虚假、不准确或存在误导性的；</li>
          <li>（14）可能构成或助长犯罪或侵权；</li>
          <li>（15）包含基于种族、宗教、性别、性取向、年龄、残疾、血统或国籍而歧视他人的任何信息；</li>
          <li>（16）法律、行政法规禁止的其他内容，以及其他违背社会公共利益或公共道德或依据相关指纹平台协议、条款{{$sdkConfig.platformIsZWKJ && '、规则的规定不适合在指纹平台上发布的。' || ''}}</li>
          <li v-show="$sdkConfig.platformIsZWKJ" class="mt20">
            <span>如您违反上述承诺保证的，您需以自己的名义独立承担全部法律责任；且指纹平台有权对您采取</span>

            <span class="fw600">警告、锁定订单、冻结账户、关闭账号</span>等处理措施，如您的行为涉嫌违法的，指纹有权
            <span class="fw600">向相关监管机构报告</span>。
          </li>
        </ul>
      </div>
      <div class="flex flex-row-end mt20">
        <div>
          <a
            class="flex flex-col-center link-el guarantee"
            download
            target="_blank"
            :href="publicPath+'zwGuarantee.pdf'"
          >
            <i class="zw_icon-xiazai f12 mr5"></i>
            <span class="f14">指纹平台用户上传图片承诺保证书.pdf</span>
          </a>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer tc">
      <el-button
        type="primary"
        :class="[cutDownCount?'agree-btn disabled':'agree-btn']"
        @click="agreeGuarantee"
      >
        我已阅读并同意
        <span class="cu-down" v-show="cutDownCount">({{cutDownCount}})</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  _getPrivatePhotos,
  _uploadImg,
  _saveCustomerAgreement
} from "@/apis/uploadImg";
import eventBus from "@/utils/eventBus.js";
export default {
  data() {
    return {
      publicPath: process.env.VUE_APP_BASE_STATIC_URL, //环境地址暂未配置: value
      cutDownCount: null,
      timer: null,
    }
  },
  methods: {
    // 清除按钮倒计时
    restartCountDown() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.cutDownCount = 10;
    },
    countDown(second) {
      let _this = this;
      this.timer = setInterval(() => {
        second--;
        _this.cutDownCount = second;
        if (!second) {
          clearInterval(_this.timer);
        }
      }, 1000);
    },
    agreeGuarantee() {
      if (!this.cutDownCount) {
        _saveCustomerAgreement().then(() => {
          this.$emit('agree')
        });
      }
    },
    close(){
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
$primary: #0453F3;
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
      color: $primary;
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
    cursor: pointer;
    &.disabled {
      background-color: #fafafa;
      border: 1px solid #dddddd;
      color: #999999;
      pointer-events: none;
    }
  }
}
</style>