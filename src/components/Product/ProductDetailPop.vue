<template>
  <div v-if="product.code && productInfo.code && product.code==productInfo.code">
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
        <template slot="title" v-if="product.code">
          <div class="pop-tit">
            <span class="name">{{product.name}}</span>
            <span class="code ml10">(编号:{{product.id}})</span>
            <span class="icons ml10">
              <!-- 新品(接口缺少字段) -->
              <i class="iconfont iconnewproduct mr6" v-if="product.is_new_time==1"></i>
              <!-- 促销 -->
              <i class="iconfont iconlabel_promotion mr6" v-if="product.is_promotion==2"></i>
              <!-- 优选 -->
              <i class="iconfont iconlabel_select mr6" v-if="product.is_preferred==2"></i>
              <!-- 尊享 -->
              <i class="iconfont iconlabel_prerogative mr6" v-if="product.respect_product==1"></i>
                <!-- 是否超时赔付 -->
              <i class="iconfont iconicon-label_overtime-payment mr5" style="color:#FF4701" v-if="product.is_auto_pay==1"></i>
              <!-- 创业 -->
              <!-- <i class="iconfont iconmember-level1 mr6" v-if="product.group_level_product.indexOf(3) != -1"></i> -->
              <!-- 专业 -->
              <!-- <i class="iconfont iconmember-level2 mr6" v-if="product.group_level_product.indexOf(2) != -1"></i> -->
              <!-- 企业 -->
              <!-- <i class="iconfont iconmember-level3 mr6" v-if="product.group_level_product.indexOf(4) != -1"></i> -->
            </span>
          </div>
        </template>
        <div class="pop-cont mt30" v-if="product.code">
          <div class="tabs-container">
            <!-- <el-tabs v-model="activeTab" :stretch="true" @tab-click="changeTab" type="card">
              <el-tab-pane v-for="(item,index) in tabs" :key="index" :label="item.name" :name="item.id">
                <label slot="label">{{item.name}}</label>
              </el-tab-pane>
            </el-tabs>-->
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
            <div class="factory" v-if="productInfo.factoryInfo">
              <el-popover
                placement="bottom-end"
                trigger="hover"
                v-if="productInfo.factoryInfo.factory_name"
              >
                <div class="popover-tips">查看{{productInfo.factoryInfo.factory_name}}生产的产品</div>
                <a
                  class="name"
                  slot="reference"
                  :href="productInfo.factoryInfo.factory_link"
                  target="_blank"
                >{{productInfo.factoryInfo.factory_name}}</a>
              </el-popover>
              <el-popover
                placement="bottom-end"
                trigger="hover"
                v-if="productInfo.factoryInfo.factory_area"
              >
                <div class="popover-tips">查看{{productInfo.factoryInfo.factory_area}}区域生产的产品</div>
                <a
                  class="area-name"
                  slot="reference"
                  :href="productInfo.factoryInfo.factory_area_link"
                  target="_blank"
                >（{{productInfo.factoryInfo.factory_area}}）</a>
              </el-popover>
              <i class="iconfont iconCertification va-2"></i>
            </div>
          </div>
          <div class="detail-box scroll-bar relative" ref="detailBox">
            <div class="detail-panel info" v-show="activeTab=='0'">
              <div>
                <div class="info-form">
                  <!-- <template
                    v-if="productInfo.detailInfoText&&productInfo.detailInfoText.alias_name"
                  >
                    <div class="info-item w100">
                      <label>{{productInfo.detailInfoText.alias_name.name}}</label>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="productInfo.detailInfoText.alias_name.value"
                        placement="top"
                      >
                        <div class="desc">{{productInfo.detailInfoText.alias_name.value}}</div>
                      </el-tooltip>
                      <el-tooltip class="item copyicon" effect="dark" content="点击复制" placement="top">
                        <span class="iconfont iconfile-copy" v-zwcopy="{value: productInfo.detailInfoText.alias_name.value, toast: '复制成功'}" @click.stop></span>
                      </el-tooltip>
                    </div>
                  </template> -->
                  <!-- <template v-if="productInfo.detailInfoText">
                    <div
                      class="info-item"
                      v-for="(value, key) in productInfo.detailInfoText"
                      :key="key"
                      v-if="key!='alias_name'"
                    >
                      <label>{{value.name}}</label>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="String(value.value)"
                        placement="top"
                      >
                        <div class="desc">{{value.value}}</div>
                      </el-tooltip>
                      <el-tooltip class="item copyicon" effect="dark" content="点击复制" placement="top" v-if="key=='name' || key=='en_name' || key=='id' || key=='product_technology' || key=='product_material'">
                        <span class="iconfont iconfile-copy" v-zwcopy="{value: value.value, toast: '复制成功'}" @click.stop></span>
                      </el-tooltip>
                    </div>
                  </template> -->
                  <template v-if="productInfo.detail.detail_info_texts">
                    <div
                      class="info-item"
                      :class="{'w100': item.name=='产品别名'}"
                      v-for="item in productInfo.detail.detail_info_texts"
                      :key="item.name"
                    >
                      <label>{{item.name}}</label>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="String(item.value)"
                        placement="top"
                      >
                        <div class="desc">{{item.value}}</div>
                      </el-tooltip>
                      <el-tooltip 
                        class="item copyicon" effect="dark" content="点击复制" placement="top" 
                        v-if="item.name=='中文名称' || item.name=='英文名称' || item.name=='产品编号' || item.name=='生产工艺' || item.name=='产品材质'"
                      >
                        <span class="iconfont iconfile-copy" v-zwcopy="{value: item.value, toast: '复制成功'}" @click.stop></span>
                      </el-tooltip>
                    </div>
                  </template>
                  <!-- 其他描述 -->
                  <template v-if="productInfo.detail.detail_info_descs">
                    <div
                      class="block-item mt24"
                      v-for="item in productInfo.detail.detail_info_descs"
                      :key="item.name"
                    >
                      <div class="tit other-desc">
                        {{item.name}}
                        <el-tooltip class="item copyicon" effect="dark" content="点击复制所有描述" placement="top">
                          <span class="iconfont iconfile-copy" v-zwcopy="{value: toHtml(item.value), isHtml: true, toast: '复制成功'}" @click.stop></span>
                        </el-tooltip>
                      </div>
                      <div v-if="item.value" v-html="toHtml(item.value)"></div>
                    </div>
                  </template>
                  <div
                    class="block-item mt24"
                    v-if="productInfo.detail.transport_type"
                  >
                    <div class="tit">{{productInfo.detail.transport_type.name}}</div>
                    <div>
                      {{productInfo.detail.transport_type.value}}
                      <el-popover placement="right" trigger="hover">
                        <div class="popover-tips">
                          <p>特货指的是需通过特殊物流渠道发运的商品。</p>
                          <p>不同物流方式可寄送的特货类型不同，如邮政</p>
                          <p>
                            E邮宝不支持寄送“含电”商品。具体可查看
                            <a
                              v-if="shippingCalculationAuth"
                              target="_blank"
                              href="/merchant/shippingRule/calculation"
                            >运费试算</a>
                            <span v-else>运费试算</span>
                          </p>
                        </div>
                        <i class="tips-icon iconfont iconquestion-fill color-primary pointer" slot="reference"></i>
                      </el-popover>
                    </div>
                  </div>
                  <div class="block-item mt24">
                    <div class="tit">设计提示</div>
                    <div>
                      <div
                        v-if="parseFloat(productInfo.detail.view_price)!=0"
                      >每增加设计一面，加收费用"{{productInfo.detail.view_price}}"元</div>
                      <template v-if="views.length">
                        <div v-for="view in views" :key="view.name">
                          <div>{{view.name}}印刷区域图片大小：{{view.width}} * {{view.height}} px</div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div class="block-item mt24">
                    <div class="tit">温馨提示</div>
                    <div>该图片展示效果仅供参考，最终效果以实物为准！由于生产批次、机器设备等客观因素原因，难以避免或将存在微小色差、位置及大小等误差，如遇以上问题均属于正常现象，将不予纳入售后处理范畴。</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="detail-panel size" v-show="activeTab=='1'" v-if="isShowSizeAttrs">
              <div class="flex">
                <!-- <div class="img-box">
                  <img src="@/assets/img/product/sizeimg.png" width="100%" />
                </div>-->
                <div class="size-table-box">
                  <div class="table-box scroll-bar">
                    <table class="normal size-table mt10">
                      <thead>
                        <tr>
                          <th v-for="item in sizeAttrs.thead" :key="item">{{item}}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in sizeAttrs.tbody" :key="index">
                          <td v-for="(value,sIndex) in item" :key="`${index}-${sIndex}`">{{value}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="size-tips mt10 tr">*尺码数据仅供参考，因测量方式不同，可能存在一定误差，请以实物为准</div>
                </div>
              </div>
            </div>
            <div class="detail-panel packing" v-show="activeTab=='2'" v-if="isShowPackingList">
              <div class="table-box pt10 scroll-bar">
                <table class="normal packing-table">
                  <thead>
                    <tr>
                      <th style="min-width:200px;max-width:300px;">{{sizeAlias}}</th>
                      <th>
                        包装尺寸（cm）
                        <br />
                        <span class="mini-fz">（长*宽*高）</span>
                      </th>
                      <th>
                        包装尺寸（in）
                        <br />
                        <span class="mini-fz">（长*宽*高）</span>
                      </th>
                      <th>包装体积（cm³）</th>
                      <th>包装体积（in³）</th>
                      <th>含包装重量（g）</th>
                      <th>含包装重量（lb）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(pack,index) in packingList" :key="index">
                      <td
                        style="white-space:initial;"
                      >{{pack.size_name}}{{pack.color_name ? `（${pack.color_name}）` : ''}}</td>
                      <td>{{pack.length.toFixed(2)}} * {{pack.width.toFixed(2)}} * {{pack.height.toFixed(2)}}</td>
                      <td>{{pack.in_length.toFixed(2)}} * {{pack.in_width.toFixed(2)}} * {{pack.in_height.toFixed(2)}}</td>
                      <td>{{pack.volume.toFixed(2)}}</td>
                      <td>{{pack.in_volume.toFixed(2)}}</td>
                      <td>{{pack.weight.toFixed(2)}}</td>
                      <td>{{pack.in_weight.toFixed(2)}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              class="detail-panel fbaPacking"
              v-show="activeTab=='3'"
              v-if="isShowFBAPackingList"
            >
              <div>
                <el-tabs type="border-card" class="fba-tabs" v-if="fbaPackingList.length">
                  <el-tab-pane v-for="(item,index) in fbaPackingList" :key="item.package_id">
                    <span slot="label">
                      {{item.name}}
                      <i class="recommend" v-if="item.is_recommend==1">(推荐)</i>
                    </span>
                    <div>
                      <span class="mr20">纸箱标准外径尺寸：{{item.outer}}</span>
                      <span class="mr20">纸箱体积：{{item.volume}}{{item.max_volume ? ' ~ '+item.max_volume: ''}}cm³</span>
                      <span class="mr20">纸箱重量：{{item.weight}}g</span>
                      <a class="pointer" @click="showFbAPackingImg(item,index)">纸箱图示</a>
                    </div>
                    <table class="normal mt10 fbapacking-table">
                      <thead>
                        <tr>
                          <th>{{sizeAlias}}</th>
                          <th style="width:250px;max-width:250px;">{{colorAlias}}</th>
                          <th>预计可装箱数量</th>
                          <th>预计装箱总体积（cm³）</th>
                          <th>预计装箱总重量（g）</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="jItem in item.items">
                          <tr v-for="(kItem,kIndex) in jItem">
                            <td v-if="kIndex==0" :rowspan="jItem.length">{{kItem.size_name}}</td>
                            <td>{{kItem.color_name}}</td>
                            <td>
                              ≤{{kItem.enble_num}}件
                              <i
                                class="fba-pao"
                                v-if="kItem.is_volume_count==1"
                              >(泡)</i>
                            </td>
                            <td>≤{{kItem.total_volume}}</td>
                            <td>≤{{kItem.total_weight<=22000 ? kItem.total_weight : '22000.00'}}</td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>
            <div
              class="detail-panel detailImgs"
              v-show="activeTab=='4'"
              v-if="detailImages&&detailImages.length && !productInfo.detail.product_detail && $sdkConfig.platform != 'xcxBackend'"
            >
              <div class="imglist">
                <img :src="img.src" v-for="(img,index) in detailImages" :key="index" />
              </div>
            </div>
            <div
              class="detail-panel detailImgs"
              v-show="activeTab=='4'"
              v-if="productInfo.detail.product_detail && $sdkConfig.platform == 'xcxBackend'"
            >
              <!-- <div class="imglist"> -->
                <div v-html="productInfo.detail.product_detail"></div>
              <!-- </div> -->
            </div>
            <div
              class="detail-panel recommendProduct"
              v-show="activeTab=='5'"
              v-if="commonCatIdProduct&&commonCatIdProduct.length"
            >
              <div class="pt10">
                <el-carousel
                  trigger="click"
                  height="230px"
                  :autoplay="false"
                  arrow="always"
                  :loop="false"
                >
                  <el-carousel-item v-for="(item,index) in commonCatIdProduct" :key="index">
                    <div class="swiper-items">
                      <a
                        class="swiper-item"
                        v-for="product in item"
                        :key="product.id"
                        :href="product.url"
                        target="_blank"
                      >
                        <div class="img-box">
                          <img :src="product.mainImg" />
                          <div class="name">{{product.name}}</div>
                        </div>
                        <template v-if="product.showPrice==1">
                          <div class="price mt10">
                            <span class="unit">￥</span>
                            <span class="num mr2">{{product.__price}}</span>
                            起
                            <i
                              class="icon"
                              v-if="product.__isPromotion"
                            >促</i>
                          </div>
                          <div style="display:none">
                            {{_data.ship_name}}￥
                            <b class="color-primary">{{product.__priceAddShip}}</b>起
                          </div>
                        </template>
                        <div class="tc mt10" v-else>
                          <button class="updete-level-btn o8" href="/merchant/vipLevel/index">升级专业版</button>
                        </div>
                      </a>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
            <div
              class="detail-panel factoryProduct"
              v-show="activeTab=='6'"
              v-if="commonFactoryProduct&&commonFactoryProduct.length"
            >
              <div class="pt10">
                <el-carousel
                  trigger="click"
                  height="230px"
                  :autoplay="false"
                  arrow="always"
                  :loop="false"
                >
                  <el-carousel-item v-for="(item,index) in commonFactoryProduct" :key="index">
                    <div class="swiper-items">
                      <a
                        class="swiper-item"
                        v-for="product in item"
                        :key="product.id"
                        :href="product.url"
                        target="_blank"
                      >
                        <div class="img-box">
                          <img :src="product.mainImg" />
                          <div class="name">{{product.name}}</div>
                        </div>
                        <template v-if="product.showPrice==1">
                          <div class="price mt10">
                            <span class="unit">￥</span>
                            <span class="num mr2">{{product.__price}}</span>
                            起
                            <i
                              class="icon"
                              v-if="product.__isPromotion"
                            >促</i>
                          </div>
                          <div style="display:none">
                            {{_data.ship_name}}￥
                            <b class="color-primary">{{product.__priceAddShip}}</b>起
                          </div>
                        </template>
                        <div class="tc mt10" v-else>
                          <button class="updete-level-btn o8" href="/merchant/vipLevel/index">升级专业版</button>
                        </div>
                      </a>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
            <div
              class="detail-panel sampleProduct"
              v-show="activeTab=='7'"
              v-if="samples&&samples.length"
            >
              <div class="pt10">
                <el-carousel
                  trigger="click"
                  height="230px"
                  :autoplay="false"
                  arrow="always"
                  :loop="false"
                >
                  <el-carousel-item v-for="(item,index) in samples" :key="index">
                    <div class="swiper-items">
                      <a
                        class="swiper-item"
                        v-for="product in item"
                        :key="product.code"
                        :href="product.url"
                        target="_blank"
                      >
                        <div class="img-box">
                          <img :src="product.src" />
                          <div class="name">{{product.name}}</div>
                        </div>
                        <div class="price">
                          <span class="unit">￥</span>
                          <span class="num mr2">{{product.price}}</span>
                        </div>
                      </a>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>

    <!-- FBA纸箱图示 -->
    <el-dialog
      title="纸箱图示"
      width="900px"
      top="10vh"
      :visible.sync="isShowFBAImg"
      :modal-append-to-body="false"
    >
      <div class="pt10 pb20">
        <el-tabs type="border-card" class="fba-tabs" v-model="activeFBATab">
          <el-tab-pane v-for="(item) in fbaPackingList" :key="item.package_id" :name="item.name">
            <span slot="label">
              {{item.name}}
              <i class="recommend" v-if="item.is_recommend==1">推荐</i>
            </span>
            <div class="fbaimg-content scroll-bar">
              <div v-if="item.img_arr.length" class="fbaimgs-list">
                <div v-for="(img,i) in item.img_arr" :key="i" class="mr5">
                  <img :src="img.src" width="350" height="auto" />
                  <p class="mt10 tc" v-if="i==0">重量: {{item.weight/1000}}kg</p>
                </div>
              </div>
              <div class="empty" v-else>无相关图示</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="全部纸箱" name="全部纸箱">
            <div class="fbaimg-content scroll-bar all-package">
              <div class="fbaimgs-list">
                <div class="mr5" style="width:390px">
                  <img src="/static/merchant/images/FBApackageAll-1.png" width="390" height="auto" />
                </div>
                <div>
                  <!-- <img
                    src="/static/merchant/images/FBApackageAllData-1.png?v=1"
                    width="390"
                    height="auto"
                  /> -->
                  <table class="normal" style="width:390px">
                    <thead><tr><th></th><th>外体积</th><th>箱子重量</th></tr></thead>
                    <tbody>
                      <tr v-for="(item,index) in allFbaPackingList" :key="index">
                        <td>{{item.name}}</td>
                        <td>{{item.outer}}</td>
                        <td>{{item.weight/1000}}kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
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
      isShowFBAImg: false,
      activeFBATab: "",
      colorAlias: '',
      sizeAlias: ''
    };
  },
  computed: {
    tabs() {
      let tabs = [
        { id: "0", name: "产品详情", visible: true },
        { id: "1", name: "尺码说明", visible: this.isShowSizeAttrs },
        { id: "2", name: "包装规格", visible: this.isShowPackingList },
        { id: "3", name: "FBA装箱", visible: this.isShowFBAPackingList },
        {
          id: "4",
          name: "产品细节图",
          visible: (this.detailImages && this.detailImages.length && this.$sdkConfig.platform != 'xcxBackend') || (this.productInfo.detail.product_detail && this.$sdkConfig.platform == 'xcxBackend'),
        },
        {
          id: "5",
          name: "推荐产品",
          visible: this.commonCatIdProduct && this.commonCatIdProduct.length,
        },
        {
          id: "6",
          name: "生产商产品",
          visible:
            this.commonFactoryProduct && this.commonFactoryProduct.length,
        },
        {
          id: "7",
          name: "推荐设计",
          visible: this.samples && this.samples.length,
        },
      ];
      return tabs.filter((a) => a.visible);
    },
    defaultProductTab(){
      return this.$store.state.product.defaultProductTab;
    },
    product() {
      const product = this.$store.state.product.selectedProduct
      this.colorAlias = product.color_alias || '颜色'
      this.sizeAlias = product.size_alias || '尺码'
      return product;
    },
    productInfo() {
      return this.$store.state.product.selectedProductDetail;
    },
    // 运费试算链接权限
    shippingCalculationAuth(){
      const {url_permission_list} = this.$store.state.userPermission;
      return url_permission_list?.find(a=>a.url_name=='shipping_rule_calculation')?.has_permission;
    },
    // 设计面说明信息
    views() {
      let ret = [];
      if (this.product.views.length) {
        for (let i = 0; i < this.product.views.length; i++) {
          let view = this.product.views[i];
          let name = view.name,
            printArea = view.print_area;
          if (!isEmpty(printArea)) {
            let width = parseFloat(printArea.width).toFixed(2),
              height = parseFloat(printArea.height).toFixed(2),
              dpi = this.product.dpi;
            ret.push({
              name,
              width: Math.ceil((width / 25.4) * dpi),
              height: Math.ceil((height / 25.4) * dpi),
            });
          }
        }
      }
      return ret;
    },
    // 尺码说明
    isShowSizeAttrs() {
      return this.productInfo?.size_info?.size_info_list?.length;
    },
    sizeAttrs() {
      let { size_info } = this.productInfo;
      let { size_info_list, size_info_title_list  } = size_info
      let thead = [],
        tbody = [];
      if (size_info_list.length) {
        for (let i = 0; i < size_info_title_list.length; i++) {
          thead.push(size_info_title_list[i].title_name)
        }
        for (let i = 0; i < size_info_list.length; i++) {
          let item = [];
          let attrData = size_info_list[i].size_info_attr_list;
          item.push(size_info_list[i].size_name);
          for (let j = 0; j < attrData.length; j++) {
            item.push(attrData[j].attr_name);
          }
          tbody.push(item);
        }
      }
      return { thead, tbody };
    },
    // 包装规则
    isShowPackingList() {
      let packingList = this.productInfo.packing_list || [];
      if (!packingList.length || this.$sdkConfig.platform == 'xcxBackend') return false;
      if (
        packingList.length == 1 &&
        packingList[0].in_length == 0 &&
        packingList[0].in_width == 0 &&
        packingList[0].in_height == 0 &&
        packingList[0].in_volume == 0 &&
        packingList[0].in_weight == 0 &&
        packingList[0].weight == 0
      ) {
        return false;
      }
      return true;
    },
    packingList() {
      if(this.$sdkConfig.platform == 'xcxBackend'){
        return false
      }else{
      return this.productInfo.packing_list;}
    },
    // FBA包装规则
    isShowFBAPackingList() {
      if(this.$sdkConfig.platform == 'xcxBackend'){
        return false
      }else{
        return this.productInfo?.is_fba_package == 1;
      }
    },
    fbaPackingList() {
      if(this.$sdkConfig.platform == 'xcxBackend'){
        return false
      }else{
      let { fba_package_list } = this.productInfo;
      return fba_package_list?.length ? fba_package_list : [];
      }
    },
    allFbaPackingList(){
      if(this.$sdkConfig.platform == 'xcxBackend'){
        return false
      }else{
      let {all_fba_package_list} = this.productInfo;
      return all_fba_package_list?.length ? all_fba_package_list : [];
      }
    },
    // 产品细节图
    detailImages() {
      return this.productInfo?.detail_images || [];
    },
    // 推荐产品
    commonCatIdProduct() {
      if(this.$sdkConfig.platform == 'xcxBackend'){
        return false
      }else{
      let { commonCatIdProduct } = this.productInfo;
      return this.swiperGroup(commonCatIdProduct, true);
      }
    },
    // 生产商产品
    commonFactoryProduct() {
      if(this.$sdkConfig.platform == 'xcxBackend'){
        return false
      }else{
      let { commonFactoryProduct } = this.productInfo;
      return this.swiperGroup(commonFactoryProduct, true);
      }
    },
    // 推荐设计
    samples() {
      if(this.$sdkConfig.platform == 'xcxBackend'){
        return false
      }else{
      let { productSelect } = this.productInfo;
      return this.swiperGroup(productSelect, false);
      }
    },
  },
  methods: {
    swiperGroup(data, flag) {
      if(!data || !data.length) return [];
      var ret = [], group = 0, groupItem = [];
      let perGroup = 5;
      let maxLength = Math.ceil(data.length / 5);
      for (let i = 0; i < data.length; i++) {
        if (i == (group + 1) * perGroup) group++;
        if (i == group * perGroup) {
          groupItem = [];
          ret.push(groupItem);
        }
        if (i < (group + 1) * perGroup) {
          let _data = { ...data[i] };
          if (flag) {
            const showPrice = _data.price
              ? Math.min(
                  Number(_data.price) || Infinity,
                  Number(_data.promotionPrice) || Infinity
                )
              : 0;
            if (_data.showPrice == 1) {
              _data.__isPromotion =
                _data.promotionPrice && _data.promotionPrice <= _data.price;
              _data.__price = _data.__isPromotion
                ? _data.promotionPrice
                : _data.price;
            }
            _data.__priceAddShip = (
              (_data.ship_price * 100 + showPrice * 100) /
              100
            ).toFixed(2);
          }
          groupItem.push(_data);
        }
      }
      return ret;
    },
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
    // changeTab(data) {
    //   this.isTabClicked = true;
    //   let index = data.index;
    //   let $detailBox = this.$refs.detailBox;
    //   let nodes = $detailBox.children || $detailBox.childNodes;
    //   $detailBox.scrollTop = nodes[index].offsetTop;
    // },
    changeTab(data, index) {
      this.isTabClicked = true;
      this.activeTab = data.id;
      // let $detailBox = this.$refs.detailBox;
      // let nodes = $detailBox.children || $detailBox.childNodes;
      // $detailBox.scrollTop = nodes[index].offsetTop;
    },
    showFbAPackingImg(data, index) {
      this.activeFBATab = data.name;
      this.isShowFBAImg = true;
    },
    toHtml(data) {
      return data.trim().split("\n").join("<br>");
    },
  },
  mounted() {
    // this.open();
    // 初始默认选中标签
    this.activeTab = this.defaultProductTab=='size' ? '1' : '0'
  },
  filters: {
    htmlWrap(data) {
      return data.trim().split("\n").join("<br>");
    },
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
  // /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
  //   border-top: 0;
  // }
  // /deep/
  //   .el-tabs--top.el-tabs--card
  //   > .el-tabs__header
  //   .el-tabs__item:nth-child(2) {
  //   padding-left: 0;
  // }
  // /deep/
  //   .el-tabs--top.el-tabs--card
  //   > .el-tabs__header
  //   .el-tabs__item:last-child {
  //   padding-right: 0;
  // }
  // /deep/ .el-tabs__item {
  //   border-left: 0;
  //   color: rgba(0, 0, 0, 0.65);
  //   border-right: 0;
  //   padding: 0;
  //   display: flex;
  //   justify-content: center;
  //   label {
  //     display: block;
  //     width: 100%;
  //     height: 40px;
  //     background: #f0f5ff;
  //     margin-left: 10px;
  //     padding: 0 15px;
  //   }
  // }
  // /deep/ .el-tabs__item.is-active {
  //   border-top: 2px solid #0453F3;
  //   background: #fff;
  //   font-weight: 500;
  //   color: rgba(0, 0, 0, 0.85);
  //   padding: 0;
  //   display: flex;
  //   justify-content: center;
  //   label {
  //     display: block;
  //     width: 100%;
  //     height: 40px;
  //     background: transparent;
  //     padding: 0 15px;
  //     margin: 0;
  //   }
  // }
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
      // width: 635px;
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