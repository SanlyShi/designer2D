<template>
  <div id="app" v-cloak>
    <div class="zw-loader" v-if="isLoading">
      <span class="spinner"></span>
    </div>
    <Main></Main>
    <dynamic-source :src="bdStatisticsSrc" @loaded="bdStatistics"></dynamic-source>
  </div>
</template>

<script>
let bdStatisticsSrc = "";
if (location.href.includes("hicustom.com")) {
  bdStatisticsSrc =
    "https://hm.baidu.com/hm.js?0a8307b98c9ef80793212a9dcd0d108e";
} else if (location.href.includes("sandbox2.zhiwendiy.com")) {
  bdStatisticsSrc =
    "https://hm.baidu.com/hm.js?e35c45a95e45d2981cb936e553a562c0";
} else {
  bdStatisticsSrc =
    "https://hm.baidu.com/hm.js?53dfe6f9a350615856f821ca1891e969";
}
import Main from "@/Layout/Main";
// import { _getFontFamily } from "@/apis/text.js";
import { checkPlatform, GetAllQueryString, genLocalStorageKey } from "@/utils/utils";
import { SDKCONFIG } from "@/utils/sdkConfig";
import TIPS from "@/mixins/tips";
import { _getCustomerConfigs } from "@/apis/common";
export default {
  name: "App",
  mixins: [TIPS],
  components: {
    Main,
  },
  data() {
    return {
      bdStatisticsSrc: bdStatisticsSrc,
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters.initLoading;
    }
  },
  async beforeCreate() {
    // 判断当前系统是Windows或MAC;
    window.sysPlatform = checkPlatform();

    this.$store.commit('updateUrlQueryObj', GetAllQueryString());
    this.$store.commit('updateImgGuaranteeStatus', this.$uploadImgGuarantee);

    if(SDKCONFIG.platformIsZWKJ){
      // 设计器配置
      this.$store.dispatch("layout/getDesignerConfig");

      // 用户权限
      if(this.$isLogin){
        const ret = await _getCustomerConfigs({
          url_names: ['shipping_rule_calculation']
        });
        this.$store.commit('updateUserPermission', ret.data);
      }
    }
  },
  async created() {
    // if (this.$sdkConfig.platformIsZWKJ) {
    //   document.title = "设计专属于你的个性化T恤、手机壳、杯子等礼品 | 指纹定制 - 一站式跨境电商柔性供应链服务平台，让创业更简单"
    // }

    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    // beforeunload事件在页面刷新时先触发
    // window.addEventListener("beforeunload", () => {
    //   sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    //   return true;
    // });
    // // 在页面加载时读取sessionStorage里的状态信息
    // if (sessionStorage.getItem("store")) {
    //   this.$store.replaceState(
    //     Object.assign(
    //       {},
    //       this.$store.state,
    //       JSON.parse(sessionStorage.getItem("store"))
    //     )
    //   );
    // }
    // if(SDKCONFIG.platformIsZWKJ){
    //   await this.$store.dispatch("layout/getDesignerConfig");
    // }
    // this.$store.commit('updateImgGuaranteeStatus', this.$uploadImgGuarantee);

    this.m_tips_init();
  },
  mounted() {
    this.refreshRem();
    window.addEventListener("resize", this.refreshRem);

    document.documentElement.setAttribute("data-theme", "default");

    //记录用户最近一次进入的是哪个设计器，在下次进入的时候需要进入相应的设计器
    let designEdition = JSON.parse(localStorage.getItem(genLocalStorageKey("designEdition")))
    let designEditionIndex = -1
    let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
    if (designEdition) {
      designEditionIndex = designEdition.findIndex((item) => {
        return item.code == customerId;
      });
    } else {
      designEdition = []
    }
    if(designEdition && designEditionIndex > -1) {
      designEdition.splice(designEditionIndex, 1)
    }
    designEdition.push({
      code: customerId,
      edition: 'create'
    });
    localStorage.setItem(genLocalStorageKey("designEdition"), JSON.stringify(designEdition));
  },
  methods: {
    refreshRem() {
      var whdef = 100 / 1920; // 表示1920的设计图,使用100PX的默认值
      var wH = window.innerHeight; // 当前窗口的高度
      var wW = window.innerWidth; // 当前窗口的宽度
      var rem = wW * whdef; // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
      document.documentElement.style.fontSize = rem + "px";
    },
    // 添加百度统计代码
    bdStatistics() {
      var _hmt = _hmt || [];
      _hmt.push([
        "_requirePlugin",
        "UrlChangeTracker",
        {
          shouldTrackUrlChange: function (newPath, oldPath) {
            return newPath && oldPath;
          },
        },
      ]);
    },
  },
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
[v-cloak] {
  display: none;
}
</style>
<style lang="scss" scoped>
.zw-loader {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  .spinner {
    &::before {
      // width: 6rem;
      // height: 6rem;
      width: px2rem(96);
      height: px2rem(96);
    }
  }
}
</style>
