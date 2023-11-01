<template>
  <div class="search-filter-form __zw-search-filter-form">
    <div class="search-title">
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div class="search-field">
      <div class="form-item">
        <div class="label">产品等级</div>
        <div class="cont">
          <CheckBox :data="groupLevelList" v-model="form.group_level"></CheckBox>
        </div>
      </div>
      <div class="form-item">
        <div class="label">采购价格</div>
        <div class="cont flex">
          <CheckBox :data="purchasePriceList" :from.sync="form.purchase_price_from" :to.sync="form.purchase_price_to" :isRange="true"></CheckBox>
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          设计区域形状
          <el-popover popper-class="shape-tips" placement="top" trigger="hover">
            <div class="popover-tips">
              <div class="shape-title pb10">
                <i class="iconfont iconcaveat-circle mr2"></i> 通过设计区域的“宽”、“高”比例值，划分产品类型
              </div>
              <ul class="shape-list">
                <li>
                  <div class="rect">
                    <div class="shape1"></div>
                  </div>
                  <p class="name">似方形</p>
                  <p class="ratio">1:(0.9~1)</p>
                </li>
                <li>
                  <div class="rect">
                    <div class="shape2"></div>
                  </div>
                  <p class="name">横向形</p>
                  <p class="ratio">1:(0.6~0.9)</p>
                </li>
                <li>
                  <div class="rect">
                    <div class="shape3"></div>
                  </div>
                  <p class="name">竖向形</p>
                  <p class="ratio">1:(1.1~1.8)</p>
                </li>
                <li>
                  <div class="rect">
                    <div class="shape4"></div>
                  </div>
                  <p class="name">超横形</p>
                  <p class="ratio">1:(0.1~0.6)</p>
                </li>
                <li>
                  <div class="rect">
                    <div class="shape5"></div>
                  </div>
                  <p class="name">超竖形</p>
                  <p class="ratio">1:(1.9+)</p>
                </li>
              </ul>
            </div>
            <i class="iconfont iconcaveat-circle" slot="reference"></i>
          </el-popover>
        </div>
        <div class="cont flex">
          <CheckBox :data="designAreaShapeList" v-model="form.design_area_shape" :isMultiple="true"></CheckBox>
        </div>
      </div>
      <div class="form-item">
        <div class="label">发货时效</div>
        <div class="cont flex">
          <CheckBox :data="deliveryTimeList" :from.sync="form.delivery_time_from" :to.sync="form.delivery_time_to" :isRange="true"></CheckBox>
        </div>
      </div>
      <div class="form-item">
        <div class="label">全副产品</div>
        <div class="cont">
          <CheckBox :data="imgFull" v-model="form.img_full"></CheckBox>
        </div>
      </div>
      <div class="form-item">
        <div class="label">产品编号</div>
        <div class="cont flex" style="width:100%">
          <input type="text" placeholder="多个产品编号用逗号或空格分开" class="form-input" v-model="form.ids" @focus="handleFocus" @blur="handleBlur" />
        </div>
      </div>
    </div>
    <div class="operates pr20">
      <a class="button mr10" @click="formHandler('reset')">清除</a>
      <a class="button primary" @click="formHandler('save')">应用筛选条件</a>
    </div>
  </div>
</template>

<script>
import CheckBox from "@/components/common/CheckBox";
import { _getProductSearchCondition } from "@/apis/product";
// import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    CheckBox,
  },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      groupLevelList: [],
      purchasePriceList: [],
      designAreaShapeList: [],
      deliveryTimeList: [],
      imgFull: [],
      // purchasePriceList: [
      //   { id: 1, name: "1-10元", from: 1, to: 10 },
      //   { id: 2, name: "10-20元", from: 10, to: 20 },
      //   { id: 3, name: "20-40元", from: 20, to: 40 },
      //   { id: 4, name: "40-60元", from: 40, to: 60 },
      //   { id: 5, name: "大于60元", from: 60, to: "" },
      // ],
      // deliveryTimeList: [
      //   { id: 1, name: "0-2天", from: 0, to: 2 },
      //   { id: 2, name: "2-3天", from: 2, to: 3 },
      //   { id: 3, name: "3-4天", from: 3, to: 4 },
      //   { id: 4, name: "大于4天", from: 4, to: "" },
      // ],
      sortingList: [
        { field: "default", name: "系统排序" },
        { field: "created", name: "上新时间" },
        { field: "order_qty", name: "产品销量" },
      ],
      form: {
        group_level: "",
        design_area_shape: "",
        img_full: "",
        purchase_price_from: "",
        purchase_price_to: "",
        delivery_time_from: "",
        delivery_time_to: "",
        ids: "",
      },
    };
  },
  computed: {
    // groupLevelList() {
    //   return this.$store.state.layout.designerConfig.groupLevelList || [];
    // },
    // design_area_shape_list() {
    //   return (
    //     this.$store.state.layout.designerConfig.design_area_shape_list || []
    //   );
    // },
    // Imgfull() {
    //   return this.$store.state.layout.designerConfig.Imgfull || [];
    // },
  },
  methods: {
    formHandler(type) {
      switch (type) {
        case "reset":
          Object.keys(this.form).forEach((key) => {
            this.$set(this.form, key, "");
          });
          this.$emit("reset", this.form);
          break;
        case "cancel":
          this.$parent.hideFilter();
          this.$emit("cancel", this.form);
          break;
        case "save":
          this.$parent.hideFilter();
          this.$emit("save", this.form);
          break;
      }
    },
    handleFocus(e) {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    close() {
      this.$parent.hideFilter();
    },
  },
  watch: {
    value: {
      handler: function (nv, ov) {
        this.form = Object.assign({}, {
          group_level: "",
          design_area_shape: "",
          img_full: "",
          purchase_price_from: "",
          purchase_price_to: "",
          delivery_time_from: "",
          delivery_time_to: "",
          ids: "",
        }, nv);
      },
      deep: true,
      immediate: true
    },
  },
  async beforeCreate(){
    if(!this.$sdkConfig.platformIsZWKJ) return;
    const ret = await _getProductSearchCondition();
    const {
      group_level_list, 
      price_list,
      design_area_shape_list,
      delivery_time_list,
      image_full_list,
    } = ret.data;
    this.groupLevelList = group_level_list;
    this.purchasePriceList = price_list.map((item,i) => {
      item.id = i+1;
      return item;
    });
    let designAreaShapeList = [];
    for(let key in design_area_shape_list){ 
      designAreaShapeList.push({id: key, name: design_area_shape_list[key]});
    }
    this.designAreaShapeList = designAreaShapeList; 
    this.deliveryTimeList = delivery_time_list.map((item, i) => {
      item.id = i+1;
      return item;
    });
    this.imgFull = image_full_list;
  },
};
</script>

<style lang="scss">
.el-popover.shape-tips {
  padding: 12px 0 !important;
}
</style>
<style lang="scss" scoped>
.shape-title {
  padding: 0 15px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.85);
  display: inline-flex;
  align-items: center;
  i {
    color: #0453F3;
  }
}
.shape-list {
  padding: 0 15px;
  display: flex;
  font-size: 14px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  li {
    margin-right: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &:last-child {
      margin-right: 0;
    }
  }
  .rect {
    width: 40px;
    height: 40px;
    border: 1px dashed rgba(0, 0, 0, 0.15);
    display: flex;
    padding-top: 3px;
    padding-left: 3px;
    > div {
      background: #e6f7ff;
      border: 1px solid #91d5ff;
    }
    .shape1 {
      width: 32px;
      height: 32px;
    }
    .shape2 {
      width: 32px;
      height: 24px;
    }
    .shape3 {
      width: 24px;
      height: 32px;
    }
    .shape4 {
      width: 32px;
      height: 16px;
    }
    .shape5 {
      width: 16px;
      height: 32px;
    }
  }
  .name {
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    margin-top: 10px;
  }
  .ratio {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
  }
}
</style>