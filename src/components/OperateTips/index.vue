<template>
  <div id="boardTipsMask" class="board-tips-mask">
    <!-- <div class="mask-con" id="maskCon"></div> -->
    <img class="mask-img" id="maskImg" src alt />
    <div class="mask-text" id="maskText">
      <p>第一步：选品</p>
      <span>选择您想要定制的空白商品</span>
      <div class="mask-step">
        <span><a>{{step}}</a>/3</span>
        <div class="next-btn">
          <el-button @click="nextClick()">{{nextText}}</el-button>
          <div class="touch_animation" id="tipTouchAnimation">
            <div class="circle_a"></div>
            <div class="circle_b"></div>
            <div class="mouse_tip">
              <svg x="0px" y="0px" viewBox="0 0 24 32" xml:space="preserve">
                <path
                  style="fill:#0453F3;stroke:#FFFFFF;stroke-width:3;stroke-linejoin:round;"
                  d="M4.4,1.9C4.9,1.9,5.5,2,6,2.4l0,0L21,16c0.5,0.5,0.7,0.9,0.7,1.6c0,0.6-0.2,1.1-0.5,1.5
                        c-0.4,0.5-0.9,0.8-1.5,0.8l0,0l-3.7,0.3l2.5,5.2c0.2,0.6,0.2,1.2,0,1.8c-0.2,0.6-0.6,1-1.2,1.3l0,0l-2.9,1.4c-0.6,0.2-1.2,0.2-1.8,0
                        c-0.6-0.2-1-0.6-1.3-1.2l0,0l-2.5-5.3l-2.7,2.7c-0.5,0.5-0.9,0.7-1.6,0.7s-1.2-0.3-1.6-0.7s-0.7-1-0.7-1.6l0,0V4.2
                        c0-0.5,0.2-1.2,0.7-1.6C3.3,2.2,3.8,1.9,4.4,1.9z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <span class="mask-text-triangle"></span>
    </div>
  </div>
</template>
<script>
import { genLocalStorageKey } from "@/utils/utils";
export default {
  name: "operate-tips",
  data() {
    return {
      designOperateTips: null,
      index: -1,
      step: 1,
      nextText: '下一步',
      productBoxBounding: null,
      zwboardContainerBounding: null,
      canvas: null,
      ctx: null
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters.initLoading;
    }
  },
  mounted() {
    const localStorageKey = genLocalStorageKey('designOperateTips');
    this.designOperateTips = JSON.parse(localStorage.getItem(localStorageKey))
    if (this.designOperateTips) {
      this.index = this.designOperateTips.findIndex((item) => { 
        return item.code == this.$OPTIONS.userInfo.code;
      });
    }
  },
  watch: {
    isLoading(nv, ov){
      if(!nv){
        let afterLoginHandler = localStorage.getItem(genLocalStorageKey('afterLoginHandler'));
        if(afterLoginHandler) return;
        this.designOperateTips = JSON.parse(localStorage.getItem(genLocalStorageKey("designOperateTips")))
        if (this.designOperateTips) {
          this.index = this.designOperateTips.findIndex((item) => { 
            return item.code == this.$OPTIONS.userInfo.code;
          });
        }
        if (!this.designOperateTips || (this.designOperateTips && this.index == -1)) {
          if(this.$sdkConfig.platformIsZWKJ) { //sdk没有新手引导
            // let interval = setInterval(() => {
            //   if(document.querySelector('.product-box')) {
            //     clearInterval(interval)
            //     setTimeout(() => {
                  document.getElementById("boardTipsMask").style.display = "block";
                  this.canvas = document.createElement("canvas");
                  this.ctx = this.canvas.getContext("2d");
                  // this.productBoxBounding = document.querySelector('.product-box').getBoundingClientRect()
                  this.productBoxBounding = {
                    left: 65,
                    top: 55,
                    width: 320,
                    height: 900
                  }
                  this.tipStep()
                  window.addEventListener("resize", this.tipStep);
            //     }, 500);
            //   }
            // }, 50)
          }
        }
      }
    },
  },
  methods: {
    nextClick() {
      switch(this.step) {
        case 1:
          this.step = 2
          this.tipStep()
          break;
        case 2:
          this.step = 3
          this.nextText = "知道了"
          document.getElementById('tipTouchAnimation').style.display = "none"
          this.tipStep()
          break;
        case 3:
          window.removeEventListener("resize", this.tipStep);
          document.getElementById("boardTipsMask").style.display = "none";
          break;
      }
    },
    createCanvas() {
      // this.zwboardContainerBounding = document
      // .getElementById('main')
      // .getBoundingClientRect();
      this.zwboardContainerBounding = {
        left: 0,
        top: 0,
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      }
      this.canvas.width = this.zwboardContainerBounding.width;
      this.canvas.height = this.zwboardContainerBounding.height;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "rgba(0, 0, 0, .4)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    tipStep() {
      switch(this.step) {
        case 1:
          this.step1()
          break;
        case 2:
          this.step2()
          break;
        case 3:
          this.step3()
          break;
      }
    },
    step1() {
      this.createCanvas()
      const canvas = this.canvas
      const ctx = this.ctx
      const zwboardContainerBounding = this.zwboardContainerBounding
      const nodeBounding = this.productBoxBounding
      // const toolbarBounding = document.querySelector('.toolbar').getBoundingClientRect()
      const toolbarBounding = {
        left: 0,
        top: 55,
        width: 65
      }
      document.getElementById("maskText").style.left =
        nodeBounding.left -
        zwboardContainerBounding.left +
        nodeBounding.width +
        20 +
        "px";
      document.getElementById("maskText").style.left = '405px'
      document.getElementById("maskText").style.top =
        nodeBounding.top - zwboardContainerBounding.top + "px";
      document.getElementById("maskText").style.top = '55px'
        ctx.clearRect(
        toolbarBounding.left - zwboardContainerBounding.left,
        toolbarBounding.top - zwboardContainerBounding.top,
        toolbarBounding.width,
        70
      )
      ctx.clearRect(
        nodeBounding.left - zwboardContainerBounding.left,
        nodeBounding.top - zwboardContainerBounding.top,
        nodeBounding.width,
        500
      );
      document.getElementById("maskImg").src = canvas.toDataURL();
    },
    step2() {
      this.createCanvas()
      const canvas = this.canvas
      const ctx = this.ctx
      const zwboardContainerBounding = this.zwboardContainerBounding
      // const toolbarBounding = document.querySelector('.toolbar').getBoundingClientRect()
      const toolbarBounding = {
        left: 0,
        top: 55,
        width: 65
      }
      const nodeBounding = this.productBoxBounding
      ctx.clearRect(
        toolbarBounding.left - zwboardContainerBounding.left,
        toolbarBounding.top + 70 - zwboardContainerBounding.top,
        toolbarBounding.width,
        70
      )
      ctx.clearRect(
        nodeBounding.left - zwboardContainerBounding.left,
        nodeBounding.top - zwboardContainerBounding.top,
        nodeBounding.width,
        500
      );
      this.$store.commit("layout/changeLeftType", "gallery")
      document.getElementById("maskText").children[0].innerText = '第二步：设计'
      document.getElementById("maskText").children[1].innerText = '应用图库素材，开启你的创意设计'
      document.getElementById("maskText").style.left =
        nodeBounding.left -
        zwboardContainerBounding.left +
        nodeBounding.width +
        20 +
        "px";
      document.getElementById("maskText").style.top =
        nodeBounding.top - zwboardContainerBounding.top + "px";
      document.getElementById("maskImg").src = canvas.toDataURL();
    },
    step3() {
      this.createCanvas()
      const canvas = this.canvas
      const ctx = this.ctx
      const zwboardContainerBounding = this.zwboardContainerBounding
      const nodeBounding = document
        .querySelector(".save-btn-content")
        .getBoundingClientRect();
      document.getElementById("maskText").children[0].innerText = '第三步：下单'
      document.getElementById("maskText").children[1].innerHTML = '您设计的商品太棒了！马上下一单'
      document.getElementById("maskText").style.left =
        nodeBounding.left -
        zwboardContainerBounding.left -
        document.getElementById("maskText").clientWidth +
        nodeBounding.width + 10 +
        "px";
      document.getElementById("maskText").style.top =
        nodeBounding.top - zwboardContainerBounding.top + 60 + "px";
      document.querySelector('.mask-text-triangle').style.left =
        document.getElementById("maskText").clientWidth - 50 +
        "px"
      document.querySelector('.mask-text-triangle').style.top =
        -10 + "px";
      document.querySelector('.mask-text-triangle').style.borderTop = 0
      document.querySelector('.mask-text-triangle').style.borderBottom = "10px solid #1585FF"
      document.querySelector('.mask-text-triangle').style.borderLeft = "10px solid transparent"
      document.querySelector('.mask-text-triangle').style.borderRight = "10px solid transparent"
      ctx.clearRect(
        nodeBounding.left - zwboardContainerBounding.left,
        nodeBounding.top - zwboardContainerBounding.top - 5,
        nodeBounding.width + 10,
        nodeBounding.height + 10
      )
      document.getElementById("maskImg").src = canvas.toDataURL();
      if (this.designOperateTips == null) {
        this.designOperateTips = [];
      }
      this.designOperateTips.push({
        code: this.$OPTIONS.userInfo.code,
        tips3d: false,
      });
      const localStorageKey = genLocalStorageKey('designOperateTips');
      localStorage.setItem(localStorageKey, JSON.stringify(this.designOperateTips));
    }
  }
};
</script>
<style lang="scss" scoped>
.board-tips-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  // background: rgba($color: #000000, $alpha: .5);
  z-index: 100;
  display: none;
  .mask-img {
    // position: fixed;
    // // background: white;
    // opacity: 0;
    // border-color: rgba(0, 0, 0, 0.5);
    // border-style: solid;
    // border-width: 100px 1500px 1500px 100px;
    // background: transparent;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .mask-text {
    position: absolute;
    color: white;
    padding: 20px;
    border-radius: 6px;
    font-weight: 600;
    background: #1585FF;
    p {
      font-size: 18px;
      margin-bottom: 10px;
    }
    &>span {
      font-size: 14px;
      line-height: 18px;
    }
    .mask-step {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      font-size: 14px;
      &>span {
        color: #AAD0FF;
        a {
          color: white;
        }
      }
      .next-btn {
        position: relative;
        .el-button--small {
          padding: 6px 11px;
          font-size: 14px;
          color: #1585FF;
        }
      }
    }
    .mask-text-triangle {
      position: absolute;
      left: -10px;
      top: 20px;
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-right: 10px solid #1585FF;
      border-bottom: 10px solid transparent;
    }
  }
}
.touch_animation {
  width: 120px;
  height: 120px;
  display: inline-block;
  position: absolute;
  pointer-events: none;
  left: -20px;
  top: -40px;
}
.touch_animation .circle_a {
  display: inline-block;
  width: 0%;
  height: 0%;
  background: #0453F3;
  border-radius: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  animation: circle_animat 1.5s both infinite;
}
.touch_animation .circle_b {
  display: inline-block;
  width: 0%;
  height: 0%;
  background: #0453F3;
  border-radius: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  animation: circle_animat 1.5s 0.4s both infinite;
}
.touch_animation .mouse_tip {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.touch_animation .mouse_tip > svg {
  width: 20%;
  position: absolute;
  top: 22%;
  bottom: 0;
  left: 12%;
  right: 0;
  margin: auto;
  animation: mouse_animat 1.5s both infinite;
}
@keyframes circle_animat {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
@keyframes mouse_animat {
  40% {
    transform: rotateX(30deg) scale(0.9);
  }
  70% {
    transform: rotateX(30deg) scale(0.9);
  }
  100% {
    transform: rotateX(0) scale(1);
  }
}
</style>