<template>
  <div class="zw-filters">
    <div class="header">
      <p @click="closeFilter()" class="cp">
        <i class="iconfont iconarrow-left-bold" style="vertical-align: text-bottom;"></i> 滤镜
      </p>
      <p class="cp" @click="changeImageFilter(renderList[0])">恢复原图</p>
    </div>
    <ul class="scroll-bar" :style="'height: ' + ulHeight + 'px'">
      <li v-for="item in renderList" :key="item.code">
        <img :class="{'active': item.checked}" :src="item.img" alt @click="changeImageFilter(item)" />
        <span>{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { _getRender, _changeImgStyle } from "@/apis/gallery.js";
import { changeImageFilter } from "@/utils/gallery.js";
export default {
  props: {},
  data() {
    return {
      renderList: [],
      ulHeight: 0,
    };
  },
  mounted() {
    this.ulHeight = document.getElementById("rightTopContent").getBoundingClientRect().height - 50;
    _getRender().then((res) => {
      res.data.forEach((item) => {
        item.checked = false;
      });
      this.renderList = res.data;
    });
  },
  activated() {
    this.renderList.forEach((item) => {
      item.checked = false;
      if ( item.code == this.$store.state.gallery.curGalleryData.node.attrs.filterType) {
        item.checked = true;
      }
    });
  },
  computed: {
    curGalleryData() {
      return this.$store.state.gallery.curGalleryData;
    },
  },
  // watch: {
  //     "curGalleryData.data.code": {
  //         handler(nv) {
  //             //替换图片还原为无滤镜
  //             if (nv) {
  //                 this.renderList.forEach(item => {
  //                     item.checked = false
  //                     if(!item.code) {
  //                         item.checked = true
  //                     }
  //                 })
  //             }
  //         },
  //     },
  // },
  methods: {
    closeFilter() {
      this.$emit("closeFilter");
    },
    //修改图片滤镜
    changeImageFilter(item) {
      this.renderList.forEach((item) => {
        item.checked = false;
      });
      item.checked = true;
      let curGalleryData = this.curGalleryData;
      changeImageFilter({
        node: this.curGalleryData.node,
        render_code: item.code,
        params: {
          gallery_id: curGalleryData.data.code,
          xFlip: curGalleryData.node.attrs.xFlip ? 1 : 0,
          yFlip: curGalleryData.node.attrs.yFlip ? 1 : 0,
        },
      }).then((res) => {
        if (res) {
          this.$store.commit(
            "gallery/setFilterData",
            Object.assign(res.data, { rendercode: item.code })
          );
        } else {
          this.$store.commit(
            "gallery/setFilterData",
            Object.assign({
              render_id: "",
              url2: curGalleryData.node.attrs.imageData.designImg3,
              rendercode: "",
            })
          );
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.zw-filters {
  .header {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f5ff;
    padding: 0 20px;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    padding: 9px 10px;
    flex-wrap: wrap;
    overflow: auto;
    li {
      width: 33.3%;
      padding: 6px 10px;
      text-align: center;
      img {
        width: 100%;
        border-radius: 5px;
        margin-bottom: 5px;
        &.active {
          border: 3px solid #0453F3;
        }
      }
    }
  }
}
</style>
