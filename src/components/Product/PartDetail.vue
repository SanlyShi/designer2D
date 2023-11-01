<template>
  <div class="zw-part-detail">
    <div class="header">
      <p class="header-desc">请选择需要定制的{{partDetailObj.part_name}}：</p>
<!--      <p @click="closePartDetail()" class="cp">-->
<!--        <i class="iconfont iconarrow-left-bold" style="vertical-align: text-bottom;"></i> {{partDetailObj.part_name}}-->
<!--      </p>-->
      <p v-if="checkedPart.part_detail_price > 0" class="customized-price">
        定制价格
        <span>¥{{checkedPart.part_detail_price}}</span> &nbsp;
        <el-tooltip
          :enterable="false"
          effect="dark"
          content="所选定制部件在货款中需增加所示价格"
          placement="top"
        >
          <i class="iconfont iconquestion-fill"></i>
        </el-tooltip>
      </p>
    </div>
    <ul class="scroll-bar">
      <li v-for="item in partDetailObj.detail_parts" :key="item.part_detail_id">
<!--        <template v-if="item.colors.length > 1 || item.sizes.length > 1">-->
<!--          <el-popover-->
<!--            placement="bottom"-->
<!--            width="200"-->
<!--            popper-class="spu-color-size-poper"-->
<!--            trigger="click">-->
<!--              <div>-->
<!--                <div class="spu-item" v-if="item.colors.length > 1">-->
<!--                  <span>配件颜色</span>-->
<!--                  <el-select-->
<!--                    v-model="item.defaultColor"-->
<!--                    placeholder="请选择"-->
<!--                    popper-class="spu-color-size-poper"-->
<!--                    @change="spuChange(item, 2)"-->
<!--                    >-->
<!--                    <el-option-->
<!--                      v-for="color in item.colors"-->
<!--                      :key="color.id"-->
<!--                      :label="color.name"-->
<!--                      :value="color.id"-->
<!--                      :disabled="item.disabled">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </div>-->
<!--                <div class="spu-item" v-if="item.sizes.length > 1">-->
<!--                  <span>配件尺寸</span>-->
<!--                  <el-select-->
<!--                    v-model="item.defaultSize"-->
<!--                    placeholder="请选择"-->
<!--                    popper-class="spu-color-size-poper"-->
<!--                    @change="spuChange(item, 2)"-->
<!--                    >-->
<!--                    <el-option-->
<!--                      v-for="size in item.sizes"-->
<!--                      :key="size.id"-->
<!--                      :label="size.name"-->
<!--                      :value="size.id"-->
<!--                      :disabled="item.disabled">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div :class="{'active': item.checked}" slot="reference" @click="spuChange(item, 1)">-->
<!--                <img :src="item.part_detail_img" alt />-->
<!--                <span class="part-detail-name">{{item.part_detail_name}}</span>-->
<!--              </div>-->
<!--          </el-popover>-->
<!--        </template>-->
        <div :class="{'active': item.checked}" class="part-item" @click="spuChange(item, 1)">
          <div class="part-item-img">
            <img :src="item.part_detail_img" alt />
          </div>
          <el-tooltip
            :enterable="false"
            effect="dark"
            :content="item.part_detail_name"
            placement="top"
            slot="reference"
          >
            <span class="part-detail-name">{{item.part_detail_name}}</span>
          </el-tooltip>
        </div>
      </li>
    </ul>
    <template v-if="checkedPart.colors.length > 1 || checkedPart.sizes.length > 1">
      <p class="color-size-cut">请选择部件规格：</p>
      <div class="color-size-wrap">
        <div class="color-size-dl" v-if="checkedPart.colors.length > 1">
          <div class="color-size-dt">颜色：</div>
          <div class="color-size-block-wrap">
            <el-tooltip
              v-for="color in checkedPart.colors"
              :key="color.id"
              :enterable="false"
              effect="dark"
              :content="color.name"
              placement="top"
              slot="reference"
            >
              <span
                    :class="{'active': checkedPart.defaultColor === color.id}"
                    class="color-size-block"
                    @click="spuChange(checkedPart, 2, color.id)"
                    v-show="!color.disabled">
                    <span class="color-item-block">
                      <span
                        v-show="color.tone1"
                        :style="{
                          backgroundColor: `#${color.tone1}`,
                          paddingRight: `${color.tone2 ? '10px' : '0'}`
                        }">
                      </span>
                      <span
                        v-show="color.tone2"
                        style="padding-left: 10px"
                        :style="{backgroundColor: `#${color.tone2}`}">
                      </span>
                    </span>
              </span>
            </el-tooltip>
          </div>
        </div>
        <div class="color-size-dl" v-if="checkedPart.sizes.length > 1">
          <div class="color-size-dt">尺码：</div>
          <div class="color-size-block-wrap">
          <span v-for="size in checkedPart.sizes"
                :key="size.id"
                :class="{active: size.id === checkedPart.defaultSize}"
                class="size-block"
                @click="spuChange(checkedPart, 3, size.id)"
                v-show="!size.disabled">
            {{size.name}}
          </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    partDetailObj: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      partCheckedList: [],
      partCheckedObj: {}
    };
  },
  mounted() {
    this.init()
  },
  activated() {
  },
  computed: {
    checkedPart() {
      return this.partDetailObj.detail_parts.find(item => item.checked) || {colors: [], sizes: []}
    },
  },
  methods: {
    init() {
      this.partCheckedList = this.$store.state.product.partCheckedList
      const partIndex = this.partCheckedList.findIndex(p => {return p.partId == this.partDetailObj.part_id})
      this.partCheckedObj = this.partCheckedList[partIndex]
      this.partDetailObj.detail_parts.forEach((item) => {
        this.$set(item, 'defaultColor', item.colors[0].id)
        this.$set(item, 'defaultSize', item.sizes[0].id)
        if(item.part_detail_id == this.partCheckedObj.childPartId) {
          this.$set(item, 'checked', true)
          this.$set(item, 'defaultColor', this.partCheckedObj.colorId)
          this.$set(item, 'defaultSize', this.partCheckedObj.sizeId)
        }else {
          this.$set(item, 'checked', false)
        }
        for(let it of item.items) {
          if(it.color_id == item.defaultColor && it.size_id == item.defaultSize) {
            this.$set(item, 'part_detail_img', it.img)
          }
        }
        this.skuFilter(item, item.defaultColor, item.defaultSize)
      });
    },
    skuFilter(partDetail, colorId, sizeId) {
      partDetail.sizes.forEach(size => {
        this.$set(size, 'disabled', true)
      })
      partDetail.colors.forEach(colors => {
        this.$set(colors, 'disabled', true)
      })
      for(const item of partDetail.items) {
        if(item.color_id == colorId || item.size_id == sizeId) {
          this.$set(partDetail.colors[partDetail.colors.findIndex(color => {return color.id == item.color_id})], 'disabled', false)
          this.$set(partDetail.sizes[partDetail.sizes.findIndex(size => {return size.id == item.size_id})], 'disabled', false)
        }
      }
    },
    closePartDetail() {
      this.$store.commit('product/updatePartDetail', {showPartDetail: false})
    },
    spuChange(item, type, sizeOrColorId) {
      if(type == 1) {
        this.partDetailObj.detail_parts.forEach((de) => {
          if(de.part_detail_id == item.part_detail_id) {
            this.$set(de, 'checked', true)
          }else {
            this.$set(de, 'checked', false)
          }
        })
      }
      this.partCheckedList.map(part => {
        part.isChecked = false
      })

      if (type === 2) {
        item.defaultColor = sizeOrColorId
      }

      if (type === 3) {
        item.defaultSize = sizeOrColorId
      }

      this.partCheckedObj.childPartId = item.part_detail_id
      this.partCheckedObj.colorId = item.defaultColor
      this.partCheckedObj.sizeId = item.defaultSize
      this.$set(this.partCheckedObj, 'price', item.part_detail_price)
      this.partCheckedObj.isChecked = true
      this.$store.commit('product/updatepartCheckedList', this.partCheckedList)
      const partChangeTimes = this.$store.state.product.partChangeTimes
      this.$store.commit('product/updatePartChange', partChangeTimes + 1)

      this.partDetailObj.detail_parts.forEach(part => {
        if(part.part_detail_id == item.part_detail_id) {
          part.items.forEach(i => {
            if(i.color_id == item.defaultColor && i.size_id == item.defaultSize) {
              this.$set(part, 'part_detail_img', i.img)
            }
          })
        }
      })
    }
  },
  watch: {
    'partDetailObj.part_id'() {
      this.init()
    }
  },
};
</script>

<style lang="scss" scoped>
.size-block {
  font-size: 14px;
  padding: 2px 12px;
  background: #EBECF8;
  border-radius: 5px;
  line-height: 24px;
  cursor: pointer;
  color: #333333;
  margin: 0 8px 8px 0;
  display: inline-block;
  &.active {
    background: #0453F3;
    color: #FFFFFF;
  }
}
.color-size-cut {
  margin-top: 40px;
  font-size: 14px;
  color: #666666;
}
.color-size-wrap {
  background: #FAFAFA;
}
.color-size-dl {
  margin-top: 10px;
  display: flex;
  padding: 12px 0 12px 10px;
  .color-size-dt {
    font-size: 14px;
    color: #666666;
    line-height: 26px;
    width: 42px;
  }
  .color-size-block-wrap {
    flex: 1;
  }
  .color-size-block {
    width: 24px;
    height: 24px;
    margin: 0 8px 8px 0;
    display: inline-block;
    cursor: pointer;
    border-radius: 12px;
    &.active {
      .color-item-block {
        background-clip: content-box;
        padding: 1px;
        border: 1px solid #0453F3;
      }
    }
    .color-item-block {
      height: 100%;
      display: flex;
      border-radius: 20px;
      padding: 2px;
      span {
        border: 1px solid #ccc;
        border-radius: 20px;
        width: 20px;
        background-clip: content-box;
        position: absolute;
        height: 20px;
      }
    }
  }
}
.part-detail-name {
  color: #37474F;
  font-size: 14px;
  white-space: pre;
  width: 106%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.header-desc {
  font-size: 14px;
  line-height: 22px;
  color: #666666;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.zw-part-detail {
  padding: 20px 20px 0;
  .header {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0 0;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    li {
      width: 80px;
      margin: 10px 20px 0 0;
      text-align: center;
      .part-item {
        text-align: center;
        width: 80px;
        cursor: pointer;
        .part-item-img {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 80px;
          margin: 3px 0 8px;
          border-radius: 5px;
          overflow: hidden;
          img {
            max-width: 100%;
            max-height: 100%;
          }
        }
        &.active {
          .part-item-img {
            border: 3px solid #0453F3;
          }
          span {
            color: #0453F3;
            font-weight: 500;
          }
        }
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
  .customized-price {
    &>span {
      color: #faad14;
    }
    .iconfont {
      color: #0453F3
    }
  }
  
}
.spu-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  &>span {
    margin-right: 10px;
  }
  .el-select {
    flex: 1
  }
}

</style>
<style lang="scss">
.spu-color-size-poper {
  margin-top: 0 !important;
  .popper__arrow {
    display: none !important;
    &::after {
      display: none !important;
    }
  }
}
</style>