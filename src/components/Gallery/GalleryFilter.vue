<template>
  <div class="search-filter-form __zw-search-filter-form">
    <div class="search-title">
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div class="search-field">
      <div class="form-item" v-show="cgType==''">
        <div class="label">
          素材类型
          <el-popover placement="top" title="标题" width="240" trigger="hover" popper-class="zw-rest-prop">
            <div class="label-tips">
              <div class="content tc">
                <p>1、素材图适合组成更多设计</p>
                <p>2、成品图适合直接应用设计</p>
              </div>
            </div>
            <span slot="reference" class="iconfont iconcaveat-circle"></span>
          </el-popover>
        </div>
        <div class="cont flex">
          <CheckBox :data="filterData.sourceType" v-model="form.source_type"></CheckBox>
        </div>
      </div>
      <div class="form-item">
        <div class="label" :style="{'padding-top': cgType=='' ? '0' : '20px' }">
          是否设计
          <el-popover placement="top" title="标题" width="280" trigger="hover" popper-class="zw-rest-prop">
            <div class="label-tips">
              <div class="title">
                <span class="title-icon iconfont iconcaveat-circle blue"></span>
                <span class="f14 title-text">已出单的图片</span>
              </div>
              <div class="content tc">
                <p>搜索当前空白产品是否设计过的图片；</p>
                <p>搜索范围：群组。</p>
              </div>
            </div>
            <span slot="reference" class="iconfont iconcaveat-circle"></span>
          </el-popover>
        </div>
        <div class="cont flex" :style="{'padding-top': cgType=='' ? '0' : '20px' }">
          <CheckBox :data="filterData.Imgfull" v-model="form.is_design"></CheckBox>
        </div>
      </div>
      <div class="form-item">
        <div class="label">图片格式</div>
        <div class="cont">
          <CheckBox :data="filterData.extList" v-model="form.ext" :isMultiple="true"></CheckBox>
        </div>
      </div>
      <div class="form-item">
        <div class="label">标记</div>
        <div class="cont">
          <CheckBox :data="filterData.signList" v-model="form.sign" :isMultiple="true" :checkItemType="'color'"></CheckBox>
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          图片形状
          <el-popover placement="top" title="标题" width="420" trigger="hover" popper-class="zw-rest-prop">
            <div class="label-tips">
              <div class="title">
                <span class="title-icon iconfont iconcaveat-circle blue"></span>
                <span class="f14 title-text">通过图片形状的“宽”、“高”比例值，划分产品类型</span>
              </div>
              <div class="content">
                <div class="shapeList-cont">
                  <div class="shapeList-item-cont" v-for="(item,index) in filterData.design_area_shape_list" :key="index">
                    <div class="mb10 shapeList-item-imgoutCont">
                      <div :class="['shapeList-item','item'+item.id]"></div>
                    </div>
                    <div class="item-name mb1">{{item.name}}</div>
                    <div class="item-detail">{{shape_detail_list[index]}}</div>
                  </div>
                </div>
              </div>
            </div>
            <span slot="reference" class="iconfont iconcaveat-circle"></span>
          </el-popover>
        </div>
        <div class="cont flex">
          <CheckBox :data="filterData.design_area_shape_list" v-model="form.shapeType" :isMultiple="true"></CheckBox>
        </div>
      </div>

      <div class="form-item">
        <div class="label">图片编号</div>
        <div class="cont flex">
          <input type="text" placeholder="多个图片编号用逗号、空格隔开" class="form-input" v-model="form.ids" @focus="handleFocus" @blur="handleBlur" />
        </div>
      </div>
      <div class="form-item" v-show="cgType!=''">
        <div class="label">
          出单次数
          <el-popover placement="top" title="标题" width="250" trigger="hover" popper-class="zw-rest-prop">
            <div class="label-tips">
              <div class="title">
                <span class="title-icon iconfont iconcaveat-circle blue"></span>
                <span class="f14 title-text">已出单的图片</span>
              </div>
              <div class="content tc">
                <p>已发货的订单才算出单</p>
                <p>可设置起始值为1，搜索已出单图片。</p>
              </div>
            </div>
            <span slot="reference" class="iconfont iconcaveat-circle"></span>
          </el-popover>
        </div>
        <div class="cont flex flex-col-center w100">
          <input type="text" placeholder class="form-input" v-model="form.order_number_from" @focus="handleFocus" @blur="handleBlur" />
          <span style="width:40px" class="tc">~</span>
          <input type="text" placeholder class="form-input" v-model="form.order_number_to" @focus="handleFocus" @blur="handleBlur" />
        </div>
      </div>
      <div class="form-item" v-show="cgType==''">
        <div class="label">图片价格</div>
        <div class="cont flex flex-col-center w100">
          <input type="text" placeholder class="form-input" v-model="form.price_from" @focus="handleFocus" @blur="handleBlur" />
          <span style="width:40px" class="tc">~</span>
          <input type="text" placeholder class="form-input" v-model="form.price_to" @focus="handleFocus" @blur="handleBlur" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">宽度范围</div>
        <div class="cont flex flex-col-center w100">
          <input type="text" placeholder class="form-input" v-model="form.width_from" @focus="handleFocus" @blur="handleBlur" />
          <span style="width:40px" class="tc">~</span>
          <input type="text" placeholder class="form-input" v-model="form.width_to" @focus="handleFocus" @blur="handleBlur" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">高度范围</div>
        <div class="cont flex flex-col-center w100">
          <input type="text" placeholder class="form-input" v-model="form.height_from" @focus="handleFocus" @blur="handleBlur" />
          <span style="width:30px" class="tc">~</span>
          <input type="text" placeholder class="form-input" v-model="form.height_to" @focus="handleFocus" @blur="handleBlur" />
        </div>
      </div>
      <div class="form-item">
        <div class="label">创建时间</div>
        <div class="cont flex flex-col-center">
          <el-date-picker class="__zw-date-picker" clearable style="width:100%" v-model="form.created_from" type="date" placeholder="起始时间" :picker-options="datePickerOptions1" value-format="yyyy-MM-dd"></el-date-picker>
          <span style="width:40px" class="tc">~</span>
          <el-date-picker class="__zw-date-picker" clearable style="width:100%" v-model="form.created_to" type="date" placeholder="结束时间" :picker-options="datePickerOptions2" value-format="yyyy-MM-dd"></el-date-picker>
        </div>
      </div>
      <div class="form-item">
        <div class="label">更新时间</div>
        <div class="cont flex flex-col-center">
          <el-date-picker class="__zw-date-picker" clearable style="width:100%" v-model="form.modified_from" type="date" placeholder="起始时间" :picker-options="datePickerOptions3" value-format="yyyy-MM-dd"></el-date-picker>
          <span style="width:40px" class="tc">~</span>
          <el-date-picker class="__zw-date-picker" clearable style="width:100%" v-model="form.modified_to" type="date" placeholder="结束时间" :picker-options="datePickerOptions4" value-format="yyyy-MM-dd"></el-date-picker>
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

export default {
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    cgType: ''
  },
  components: {
    CheckBox,
  },
  computed: {
    config() {
      return this.$store.state.layout.designerConfig;
    },
  },
  watch: {
    config: {
      handler(val) {
        this.designerConfig = val;
        this.formateFilterParams();
      },
      immediate: true,
    },
    value: {
      handler(val) {
        this.form = Object.assign({}, this.form, val);
      },
      immediate: true,
    },
  },
  data() {
    return {
      designerConfig: [],
      shape_detail_list: [
        "1:(0.9~1)",
        "1:(0.6~0.9)",
        "1:(1.1~1.8)",
        "1:(0.1~0.6)",
        "1:(1.9+)",
      ],
      filterData: {
        extList: [],
      },
      sortingList: [
        { field: "default", name: "系统排序" },
        { field: "created", name: "上新时间" },
        { field: "order_qty", name: "产品销量" },
      ],
      form: {
        source_type: "",
        ext: "",
        shapeType: "",
        is_design: "",
        order_number_from: "",
        order_number_to: "",
        width_from: "",
        width_to: "",
        height_from: "",
        height_to: "",
        created_from: "",
        created_to: "",
        modified_from: "",
        modified_to: "",
        price_from: "",
        price_to: "",
      },
      datePickerOptions1: {
        disabledDate: (time) => {
          if (this.created_to != "") {
            return time.getTime() > new Date(this.form.created_to).getTime();
          }
          return time;
        },
      },
      datePickerOptions2: {
        disabledDate: (time) => {
          if (this.created_from != "") {
            return time.getTime() < new Date(this.form.created_from).getTime();
          }
          return time;
        },
      },
      datePickerOptions3: {
        disabledDate: (time) => {
          if (this.modified_to != "") {
            return time.getTime() > new Date(this.form.modified_to).getTime();
          }
          return time;
        },
      },
      datePickerOptions4: {
        disabledDate: (time) => {
          if (this.modified_from != "") {
            return time.getTime() < new Date(this.form.modified_from).getTime();
          }
          return time;
        },
      },
    };
  },
  created() {
    // this.formateFilterParams();
  },

  methods: {
    // datePickerLimit(type){
    //   if(type=='created'){
    //     if(this.form.created_from){
    //       this.createDatePickerOptions = Object.assign({}, {
    //         'disabledDate': function(time){

    //         }
    //       });
    //     } else {
    //       this.createDatePickerOptions = Object.assign({});
    //     }
    //   } else if(type=='modified'){
    //     if(this.form.modified_from){
    //       this.modefiedDatePickerOptions = Object.assign({}, {
    //         'disabledDate': function(time){

    //         }
    //       })
    //     } else {
    //       this.modefiedDatePickerOptions = Object.assign({});
    //     }
    //   }
    // },
    formateFilterParams() {
      let extList = [];
      let signList = []; 
      let sourceType = [];
      for (let o in this.designerConfig.extList) {
        let obj = {};
        obj.id = o;
        obj.name = this.designerConfig.extList[o];
        extList.push(obj);
      }
      for (let sign in this.designerConfig.signList) {
        let obj = {};
        obj.id = sign;
        obj.color = "#" + this.designerConfig.signList[sign];
        signList.push(obj);
      }
      for(let s in this.designerConfig.sourceType){
        sourceType.push({id: s, name: this.designerConfig.sourceType[s] });
      }
      this.filterData = { ...this.designerConfig, extList, signList, sourceType};
    },
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
};
</script>

<style lang="scss" scoped>
$primary: #0453F3;
.label-tips {
  .title {
    padding: 9px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .title-icon {
      color: $primary;
      margin-right: 4px;
    }
    .title-text {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .content {
    padding: 8px 8px 10px 8px;
    .shapeList-cont {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding: 11px 0 13px 0;
      .shapeList-item-cont {
        display: flex;
        flex-direction: column;
        align-items: center;

        .shapeList-item-imgoutCont {
          width: 40px;
          height: 40px;
          background: #ffffff;
          padding: 4px;
          border: 1px dashed rgba(0, 0, 0, 0.15);
          box-sizing: border-box;
          .shapeList-item {
            // width: 32px;
            // height: 32px;
            background: #e6f7ff;
            border: 1px solid #91d5ff;
            &.item1 {
              width: 100%;
              height: 100%;
            }
            &.item2 {
              width: 100%;
              height: 24px;
            }
            &.item3 {
              width: 24px;
              height: 100%;
            }
            &.item4 {
              width: 100%;
              height: 16px;
            }
            &.item5 {
              width: 16px;
              height: 100%;
            }
          }
        }
        .item-name {
          color: rgba(0, 0, 0, 0.85);
        }
        .item-detail {
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
}
.w100 {
  width: 100%;
}
</style>