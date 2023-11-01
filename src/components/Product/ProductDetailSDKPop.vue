<template>
  <div v-if="product&&product.code">
    <div>
      <el-dialog
        width="1000px"
        top="10vh"
        custom-class="product-detail-pop"
        :visible="true"
        :modal-append-to-body="true"
        :destroy-on-close="true"
        @close="close"
      >
        <template slot="title">
          <div class="pop-tit">
            <span class="name">{{product.name}}</span>
            <span class="code ml10">(编码:{{product.code}})</span>
          </div>
        </template>
        <div class="pop-cont mt30">
          <div class="tabs-container">
            <div class="zw-tab">
              <ul>
                <li
                  v-for="(item,index) in tabs"
                  :key="item.id"
                  :class="{'active': activeTab==item.id}"
                  @click="changeTab(item,index)"
                >{{item.name}}</li>
              </ul>
            </div>
          </div>
          <div class="detail-box scroll-bar relative" ref="detailBox">
            <div class="detail-panel info" v-show="activeTab=='0'">
              <div v-html="product.product_details"></div>
            </div>
            <div class="detail-panel size" v-show="activeTab=='1'">
              <div class="__zw-ueeditor-table-box" v-html="productSizes"></div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { throttle, debounce, isEmpty } from "@/utils/utils";
export default {
  data() {
    return {
      // 当前活动标签
      activeTab: "0",
      //记录tabs滚动对应的位置区间范围
      posMap: {},
    };
  },
  computed: {
    tabs() {
      let {designProductDetail} = this.$sdkConfig.product;
      let tabs = [
        { id: "0", name: "产品详情", visible: designProductDetail&&designProductDetail.productDetail },
        { id: "1", name: "尺码说明", visible: designProductDetail&&designProductDetail.productSize }
      ];
      return tabs.filter((a) => a.visible);
    },
    defaultProductTab(){
      return this.$store.state.product.defaultProductTab;
    },
    product() {
      return this.$store.state.product.selectedProduct;
    },
    productSizes(){
      if(this.product.open_product_sizes){
        return this.product.open_product_sizes
      } else {
        if(!this.product.product_type_size_info) return '';
        let {size_info_title_list, size_info_list} = this.product.product_type_size_info;
        const attrRows = size_info_list.map(a => {
          return `<tr>
            <td>${a.size_name}</td>
            ${a.size_info_attr_list.map(k => `<td>${k.attr_name}</td>`).join('')}
          </tr>`
        });
        return `<table>
          <tbody>
            <tr>${size_info_title_list.map(k => `<th>${k.title_name}</th>`).join('')}</tr>
            ${attrRows.join('')}
          </tbody>
        </table>`;
      }
    }
  },
  methods: {
    scrollfun() {
      let $detailBox = this.$refs.detailBox;
      let scrollTop = $detailBox.scrollTop;
      let index = Object.values(this.posMap).findIndex((item) => {
        return scrollTop >= item[0] && scrollTop < item[1];
      });
      if (!this.isTabClicked) {
        this.activeTab = this.tabs[index].id;
      }
      this.isTabClicked = false;
    },
    open() {
      let self = this;
      this.$nextTick(() => {
        let $detailBox = this.$refs.detailBox;
        let nodes = $detailBox.children || $detailBox.childNodes;
        let topArr = Array.from(nodes).map((a) => a.offsetTop);
        topArr.forEach((item, index) => {
          let start = index == 0 ? 0 : item;
          let end = index >= topArr.length - 1 ? 9999999999 : topArr[index + 1];
          this.posMap[index] = [start, end];
        });
        // console.log('posMap => ', this.posMap);
        $detailBox.addEventListener("scroll", debounce(self.scrollfun, 50));
      });
    },
    close() {
      this.$emit("close", false);
    },
    changeTab(data, index) {
      this.isTabClicked = true;
      this.activeTab = data.id;
    },
  },
  mounted() {
    // 初始默认选中标签
    this.activeTab = this.defaultProductTab=='size' ? '1' : '0'
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header {
  padding-top: 0;
  padding-bottom: 0;
  height: 56px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
}
/deep/ .el-dialog__body {
  padding: 0 20px;
  font-size: 14px;
}
.product-detail-pop {
  .pop-tit {
    display: flex;
    align-items: center;
    line-height: 24px;
    .name {
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
    }
    .code {
      color: rgba(0, 0, 0, 0.45);
    }
    .icons {
      padding-top: 3px;
      .iconfont {
        font-size: 20px;
      }
    }
  }
}
.tabs-container {
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .factory {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    .name,
    .area-name {
      cursor: pointer;
      border: 0;
      outline: 0;
      color: rgba(0, 0, 0, 0.85) !important;
      &:hover {
        @include font_color("font_color2");
      }
    }
  }
}
.iconCertification {
  color: #faad14;
}
.detail-box {
  min-height: 273px;
  max-height: calc(80vh - 80px);
  overflow: auto;
  padding-right: 5px;
  padding-bottom: 30px;
}
.detail-panel {
  margin-top: 20px;
}
.detail-panel.info {
  color: rgba(0, 0, 0, 0.65);
  .info-form {
    display: flex;
    flex-wrap: wrap;
    line-height: 20px;
    .info-item {
      width: calc(100% / 3);
      margin-bottom: 2px;
      display: flex;
      &.w100 {
        width: 100%;
      }
      label {
        color: rgba(0, 0, 0, 0.45);
        white-space: nowrap;
        width: 90px;
        height: 32px;
        line-height: 32px;
        background: rgba(0, 0, 0, 0.04);
        border-radius: 5px;
        text-align: center;
        flex-shrink: 0;
      }
      .desc {
        padding: 7px 10px 0 10px;
        max-width: calc(100% - 30px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover{
        .copyicon{
          display: inline-block;
        }
      }
      .copyicon{
        margin-top: 7px;
        display: none;
      }
    }
    .block-item {
      width: 100%;
      > .tit {
        font-size: 16px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
        padding-bottom: 6px;
        &.other-desc{
          .copyicon{
            color: rgba(0, 0, 0, 0.65);
            display: none;
          }
          &:hover{
            .copyicon{
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
.detail-panel.size {
  .img-box {
    width: 280px;
    margin-right: 40px;
    flex-shrink: 0;
  }
  .size-table-box {
    flex: 1;
    .table-box {
      width: 100%;
    }
  }
  .size-tips {
    color: rgba(0, 0, 0, 0.45);
  }
}
.detail-panel.packing {
  .mini-fz {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
}
/deep/ .fba-tabs .el-tabs__nav-prev {
  line-height: 40px;
  left: 4px;
  i{
    line-height: 40px;
  }
}
/deep/ .fba-tabs .el-tabs__nav-next {
  line-height: 40px;
  right: 4px;
  i{
    line-height: 40px;
  }
}
.table-box {
  width: 100%;
  overflow-x: auto;
}
table.normal {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  line-height: 22px;
  th {
    background: rgba(0, 0, 0, 0.04);
    white-space: nowrap;
  }
  td {
    white-space: nowrap;
  }
  tr:hover,
  tbody tr:nth-child(even) {
    background: rgba(0, 0, 0, 0.02);
  }
  th,
  td {
    padding: 9px;
  }
}
table.normal.fbapacking-table {
  td {
    white-space: initial;
  }
}
.detail-panel.detailImgs {
  .imglist {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: auto;
      max-width: 100%;
    }
  }
}
.detail-panel.fbaPacking .fba-pao {
  color: #faad14;
}
.swiper-items {
  display: flex;
  padding: 0 40px;
  background: #fff;
  .swiper-item {
    display: block;
    position: relative;
    margin-right: 15px;
    box-sizing: border-box;
    cursor: pointer;
    @include font_color("font_color4");
    .img-box {
      width: 160px;
      height: 160px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      box-sizing: border-box;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
    &:first-child {
      margin-left: 8px;
    }
    &:last-child {
      margin-right: 0;
    }
    .name {
      line-height: 24px;
      padding: 0 5px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: none;
    }
    &:hover .name {
      display: block;
    }
    .price {
      display: inline-flex;
      align-items: center;
      vertical-align: bottom;
      padding: 8px 5px;
      color: #fa8c16;
      font-size: 12px;
      line-height: 22px;
      .num {
        font-size: 14px;
        font-weight: bold;
      }
      .icon {
        padding: 3px;
        display: inline-block;
        line-height: 1;
        background: #f5222d;
        color: #fff;
        border-radius: 3px;
        text-align: center;
        margin-left: 4px;
        font-style: normal;
        font-size: 12px;
      }
      .unit {
        margin-top: 2px;
      }
    }
  }
}
.updete-level-btn {
  width: 113px;
  height: 32px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  color: #faad14;
}
/deep/ .el-tabs--border-card {
  box-shadow: none;
}
/deep/ .el-carousel__indicator button,
/deep/ .el-carousel__indicator:hover button {
  background-color: #000;
  opacity: 0.2;
}
/deep/ .el-carousel__indicator.is-active button {
  background-color: #1f96f8;
}
/deep/ .el-carousel__arrow {
  top: 42%;
}
/deep/ .el-carousel__arrow--left {
  left: 0;
  display: inline-block !important;
}
/deep/ .el-carousel__arrow--right {
  right: 0;
  display: inline-block !important;
}
.popover-tips {
  font-size: 12px;
  line-height: 1.5;
}
.color-primary {
  @include font_color("font_color2");
}
a {
  text-decoration: none;
  @include font_color("font_color2");
}
.tr {
  text-align: right;
}
.bold {
  font-weight: bold;
}
.fbaimg-content {
  width: 100%;
  max-height: 70vh;
  overflow: auto;
  .fbaimgs-list {
    display: flex;
    width: 100%;
  }
  .empty {
    padding: 60px 0;
    text-align: center;
  }
}
.va-2 {
  vertical-align: -2px;
}
.pointer{
  cursor: pointer;
}
</style>

<style lang="scss">
.__zw-ueeditor-table-box{
  table{
    border-collapse:collapse;
    th, td{
      padding: 5px 10px;
      border: 1px solid #DDD;
    }
    th{
      border-top: 1px solid #BBB;
      background-color: #F7F7F7;
    }
    tr.firstRow{
      th{
        border-top-width: 2px;
      }
    }
  }
}
</style>