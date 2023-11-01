<template>
  <div class="replace-product-dialog">
    <el-dialog
      :visible.sync="showReplaceDialog"
      title="提示"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      @close="cancle(true)"
      width="30%"
    >
      <div class="save-tip-content">
        <div>请确认是否替换原订单的产品？</div>
      </div>
      <div slot="footer" class="dialog-footer save-tip-footer">
        <el-button class="mr15" @click="cancle(true)">取消</el-button>
        <el-button v-if="product.sku == urlQueryObj.sku" class="mr5" id="replaceAndrelation" type="primary">
          替换并关联 
        </el-button>
        <el-popover
          v-if="product.sku == urlQueryObj.sku"
          placement="top"
          trigger="hover"
          :visible-arrow="false"
          popper-class="replace-product-dialog-popover"
          :open-delay="0"
          :close-delay="0"
        >
          <div class="tips-cont">
            <div class="pt5 pb10">
              <p>已导出的定制产品，出单后需要修改成其它同类型产品时，</p>
              <p>可点击“替换并关联”按钮，保存产品的“转换关系”；</p>
              <p>再次导入订单将自动转换产品</p>
            </div>
          </div>
          <div slot="reference">
            <i class="iconfont iconquestion-fill img-replace-tip-icon mr10"></i>
          </div>
        </el-popover>
        <el-button class="ml10" id="replace" type="primary">替换</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getConvertProductInfo } from '@/apis/product.js'
import { GetQueryString } from "@/utils/utils";
import eventBus from "@/utils/eventBus.js";
export default {
  props: {
  },
  data() {
    return {
      isAmazonOrder: GetQueryString('isAmazonOrder') ? true : false, //亚马逊订单替换产品
      showReplaceDialog: false
    }
  },
  mounted() {
    
  },
  computed: {
    urlQueryObj() {
      return this.$store.state.urlQueryObj;
    },
    product() {
      return this.$store.state.product.selectedProduct;
    },
  },
  methods: {
    replaceProduct(type) {
      return new Promise((resolve, reject) => {
        if(this.isAmazonOrder) {
          this.$confirm('请确认是否替换原订单的产品', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: ''
          }).then(() => {
            resolve({type: 'replaceItem'});
          }).catch(() => {
            
          });
        } else if(type == 'replaceItem') {
          this.showReplaceDialog = true
          this.$nextTick(() => {
            document.getElementById("replace").onclick = () => {
              resolve({type: 'replaceItem'});
              this.cancle()
            }
            document.getElementById("replaceAndrelation").onclick = () => {
              this.cancle()
              setTimeout(() => {
                this.$store.commit('layout/updateSaveProductLoading', true)
              });
              getConvertProductInfo({order_id: this.urlQueryObj.orderId, product_code: this.urlQueryObj.customProId || this.urlQueryObj.product_code}).then((res) => {
                if(res.status > 0) {
                  if (res.data.qty && res.data.qty > 0) {
                    let order = ''
                    for (var i = 0; i < res.data.data.length; i++) {
                      var item = res.data.data[i];
                      order += `<p>${item.url}</p>`
                    }
                    this.cancle()
                    this.$alert(`<p>以下订单存在相同的定制产品，是否一起修改为新的定制产品？（${res.data.qty}单）</p>
                    ${order}`, '提示', {
                      showCancelButton: true,
                      dangerouslyUseHTMLString: true,
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: ''
                    }).then(() => {
                      resolve({type: 'relateItem'})
                    }).catch(() => {
                      eventBus.$emit("saveDesign", { redesign: 2 });
                    });
                  } else {
                    resolve({type: 'relateItem'})
                    this.cancle()
                  }
                }
              }).catch(() => {
                this.cancle(true)
                reject()
              })
            }
          })
        } else {
          this.$confirm('是否确认关联平台产品', '提示', {
            confirmButtonText: '关联',
            cancelButtonText: '取消',
            type: ''
          }).then(() => {
            resolve({type: 'relateItem'});
          }).catch(() => {
            eventBus.$emit("saveDesign", { redesign: 2 });
          });
        }
      })
    },
    cancle(cancelLoading) {
      this.showReplaceDialog = false
      if(cancelLoading) {
        eventBus.$emit("saveDesign", { redesign: 2 });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.save-tip-footer {
  justify-content: flex-end;
  .img-replace-tip-icon {
    color:  #0453F3;;
  }
}

</style>
<style lang="scss">
.replace-product-dialog-popover {
  z-index: 9999 !important;
}
</style>