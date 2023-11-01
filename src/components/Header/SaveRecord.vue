<template>
  <div class="save-record-cont">
    <div class="title-cont">
     <div>
        <span class="title-icon iconfont iconskin f14"></span>
        <span class="title-text f14">我最近设计的产品</span>
      </div>
      <div class="go-publish" @click="goPublish">去刊登
         <el-tooltip class="item" effect="dark" content="可将保存的产品刊登至销售平台进行售卖" placement="bottom">
           <i class="el-icon-question go-publish-icon"></i>
         </el-tooltip> 
      </div>
    </div>
    <div class="content" >
      <div class="flex data-cont" v-if="tableData.length">
        <div v-for="(item) in tableData" :key="item.src" class="product-item" @click="choiceDesign(item.code)">
          <img :src="item.src" alt  />
          <span v-zwcopy="{value: item.id, toast: '复制定制产品编号成功'}" class="product-id" @click.stop>{{item.id}}</span>
        </div>
        <Pagination
          class="mb5"
          :total.sync="total"
          :pageSize="page.pageSize"
          :curPage.sync="page.page"
          @change="changePage"
          ref="pagination"
        ></Pagination>
      </div>
      <div class="empty-box" v-if="!tableData.length">
        <img src="@/assets/img/empty-box.svg"/>
        <p>无最近设计，快去保存自己喜欢的商品吧~ </p>
    </div>
    </div>
   
  </div>
</template>
<script>
import Pagination from "@/components/common/Pagination";

import { _getSaveRecord, _getProductByCode } from "@/apis/product.js";
import eventBus from "@/utils/eventBus.js";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      total: 0,
      page: {
        page: 1,
        pageSize: 8
      },
      tableData: [
        // {
        //   id: 273943494,
        //   code: "H3KV2X",
        //   src:
        //     "https://nimg5.hicustom.com/static/productDet/H3KV2X-2-29-1-150-5b6c82f2679abefa9bdbe936e35a18fe.jpg"
        // },
        // {
        //   id: 267725513,
        //   code: "8RJSBU",
        //   src:
        //     "https://nimg5.hicustom.com/static/productDet/8RJSBU-3-29-1-150-2b887d986be5a93d37cbe135dbcfd6dc.jpg"
        // },
        // {
        //   id: 266115699,
        //   code: "IOXYJH",
        //   src:
        //     "https://nimg5.hicustom.com/static/productDet/IOXYJH-2-29-1-150-dec1d5ec8a5898b3bf25cd8c9f04bee7.jpg"
        // },
        // {
        //   id: 266034217,
        //   code: "LQNDFE",
        //   src:
        //     "https://nimg5.hicustom.com/static/productDet2/LQNDFE-1-29-1-150-7dce7bdd0b012a3673675c632dd4b1cb.jpg"
        // },
        // {
        //   id: 265942831,
        //   code: "EW5A6L",
        //   src:
        //     "https://nimg5.hicustom.com/static/productDet2/EW5A6L-1-171-1-150-c2aa5d7038b50e4df306d24f0340311c.jpg"
        // },
        // {
        //   id: 265942406,
        //   code: "QE72G4",
        //   src:
        //     "https://nimg5.hicustom.com/static/productDet2/QE72G4-1-171-1-150-e5a1b8520a3db207b3b8f8b11f722056.jpg"
        // }
      ]
    };
  },
  created() {
    if (this.$isLogin) {
      this.search();
    }
    eventBus.$on("saveDesign", data => {
      if (data.data) {
        this.tableData.unshift(data.data);
        if (this.tableData.length >= 8) {
          this.tableData.pop();
        }
      }
    });
  },
  methods: {
    goPublish(){
      this.$OPTIONS.permission.productAuth? 
       window.open('/merchant/customerProduct/index')
       : this.$message.error({ message: "无刊登权限" });
    },
    search() {
      this.page.page = 1;
      this.getTable();
    },
    getTable() {
      const params = {
        ...this.page,
        type: "self"
      };
      _getSaveRecord(params)
        .then(res => {
          this.tableData = res.data.data;
          if (res.data.total) {
            this.total = res.data.total < 40 ? res.data.total : 40;
          } else {
            this.total = 40;
          }
        })
        .catch(err => {
          this.$message.error(err.msg);
        });
    },
    changePage() {
      this.getTable();
    },
    choiceDesign(code) {
      eventBus.$emit("getProductByCode", code);
    },
    // copyProductId(id) {
    //   document.execCommand("copy"); 
    //   // document.addEventListener("copy", function (e) {

    //   //   e.clipboardData.setData(
    //   //     "design",
    //   //     JSON.stringify({
    //   //       type: "text",
    //   //       data: nodeAttr,
    //   //     })
    //   //   );
    //   // })
    // }
  }
};
</script>
<style lang="scss" scoped>
.empty-box{
  text-align: center;
  padding-top: 15px;
 
  p{
    font-weight: 400;
    color: #86909C;
    line-height: 22px;
    font-size: 14px;
    margin-top: -7px;
    
  }
  img{
    height: 95px;
    width: 135px;
  }
}
.save-record-cont {
  width: 100%;
  height: auto;
  .title-cont {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding:9px 15px;
    align-content: center;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .title-text {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
    }
    .title-icon {
      margin-right: 6px;
    }
    .go-publish{
      margin-top: 2px;
      color: #0453F3;
      cursor: pointer;
      .go-publish-icon{
        font-size: 15px;
        color: #579AFF ;
      }
    }
  }
  .content {
    padding: 15px 20px 45px 20px;

    .data-cont {
      flex-wrap: wrap;

      .product-item {
        position: relative;
        cursor: pointer;
        width: 80px;
        height: 80px;
        background: rgba(0, 0, 0, 0.06);
        margin-right: 10px;
        margin-bottom: 10px;
        &:nth-child(4n) {
          margin-right: 0;
        }
        &::before{
          content: "";
          background: radial-gradient(
            closest-side at 0% 100%,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.04) 100%
          );
          width: 100%;
          height: 100%;
          position: absolute;
          display: inline-block;
          z-index: 0;
          top: 0;
          bottom: 0;
        }
        img {
          width: 100%;
          height: 100%;
        }
        .product-id {
          display: none;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 80px;
          height: 20px;
          z-index: 99;
          text-align: center;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.65);
        }
        &:hover {
          .product-id {
            display: block;
          }
        }
      }
    }
  }
}
</style>