<template>
  <div class="zw-clip scroll-bar">
    <div class="title pointer">
      <div>
        <span class="text" @click="close"><i class="iconfont iconarrow-left-bold"></i> 裁剪</span>
        <!-- <el-popover popper-class="tips" placement="top" trigger="hover">
          <div class="popover-tips">
            组件=图片+裁切蒙版的组合；亮的地方为裁剪区
          </div>
          <i class="iconfont iconcaveat-circle" slot="reference"></i>
        </el-popover> -->
      </div>
      <a class="pointer" @click="clipRestore">恢复原图</a>
    </div>
    <div class="path-list">
      <div
        class="path-item"
        :class="{ 'active': path.code == selectedPath }"
        v-for="path in list"
        :key="path.code"
        @click="changeClipPath(path)"
      >
        <img :src="path.image" />
        <!-- <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          enable-background="new 0 0 512 512"
          fill="#0453F3"
        >
          <path :d="path.image" />
        </svg> -->
      </div>
    </div>
  </div>
</template>

<script>
import {_getCuttingList} from '@/apis/gallery.js'
export default {
  data() {
    return {
      // list: [
      //   {id: 0, val: ''},
      //   {id: 1, val: 'M256 136l120-87.8-16.1 147.8 136.1 60-136.1 60 16.1 147.8-120-87.8-120 87.8 16.1-147.8-136.1-60 136.1-60-16.1-147.8z'},
      //   {id: 2, val: 'M294.9 16.4l15.7 42.2c-171.4 70.3-294 242.3-289.1 437.4l14.7-1c9.1-.6 18.1-1.2 27.1-1.9l14.7-1c-4.3-170.1 102.5-320 252-381.3l15.7 42.2c34.7-40.5 83.1-76.6 144.8-99.8-58.1-26.2-124.9-39.6-195.6-36.8z'}
      // ]
      list: [
        // {code: 'default', image: require('@/assets/img/gallery/path4.svg')},
      ],
    };
  },
  computed: {
    selectedPath(){
      return this.$store.state.clip.clipData?.code || '';
    }
  },
  methods: {
    changeClipPath(path) {
      this.$store.commit('clip/setClipData', path);
      this.$store.commit('clip/updateIsPathChange', {
        status: !this.$store.state.clip.isPathChange.status,
        init: false
      });
    },
    clipRestore(){
      const noPath = {code: '', image: ''};
      this.$store.commit('clip/setClipData', noPath);
      this.$store.commit('clip/updateIsPathChange', {
        status: !this.$store.state.clip.isPathChange.status,
        init: false
      });
    },
    close(type){
      this.$emit('close');
      this.$store.commit('clip/updateIsClipSave', !this.$store.state.clip.isClipSave);
    },
  },
  async activated(){
    if(!this.list.length){
      const ret = await _getCuttingList();
      this.list.push(...ret.data);
    }
    // 路径可能出现禁用情况，禁用的路径也需要还原
    let path = this.selectedPath ? (this.list.find(a=>a.code == this.selectedPath) || this.$store.state.clip.clipData) : this.list[0];
    this.$store.commit('clip/setClipData', path);
    this.$store.commit('clip/updateIsPathChange', {
      status: !this.$store.state.clip.isPathChange.status,
      init: true
    });
  },
};
</script>

<style lang="scss" scoped>
.zw-clip{
  .title {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f5ff;
    padding: 0 15px;
    .text {
      display: flex;
      align-items: center;
    }
    &>div{
      display: flex;
      align-items: center;
    }
  }
  .pointer{
    cursor: pointer;
  }
  .path-list {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 20px 0 20px;
    .path-item {
      width: 78px;
      height: 78px;
      background: #F2F2F2;;
      border: 3px solid #F2F2F2;
      border-radius: 20px;
      margin-right: 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: 2px solid transparent;
      padding: 15px;
      &:nth-child(3n+3) {
        margin-right: 0;
      }
      &.active {
        @include border(3px, solid, "font_color2");
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
