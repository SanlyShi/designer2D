<template>
  <div class="gallery-detail-box" ref="gallerydetail">
    <div v-if="!showFilters" class="inner-content scroll-bar">
      <div class="ajustment-pannel" v-if="imageAjustmentItem">
        <div class="ajustment-pannel-title">
          <div class="ajustment-pannel-title--left">
            <span :class="['iconfont f14',imageAjustmentItem.icon]"></span>
            <span class="title">{{imageAjustmentItem.label}}</span>
            <span class="iconfont iconcaveat-circle f14"></span>
          </div>
          <div class="ajustment-pannel-title--right">
            <el-button @click="ajustmentCancel">取消</el-button>
            <el-button type="primary" @click="ajustmentConfirm">确定</el-button>
          </div>
        </div>
        <div class="ajustment-pannel-cont scroll-bar">
          <div v-if="imageAjustmentItem.value=='1'" class="path-box">
            <div
              class="path-item"
              :class="{'active': path.id==selectedPath}"
              v-for="path in pathList"
              :key="path.id"
              @click="changeClipPath(path)"
            >
              <template v-if="path.val">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enable-background="new 0 0 512 512" fill="#0453F3">
                  <path :d="path.val" />
                </svg>-->
                <img :src="path.val" />
              </template>
              <template v-else>无</template>
            </div>
          </div>
          <!-- <div v-if="imageAjustmentItem.value=='4'" class="render-box">
            <div class="rendItem" v-for="(item,index) of renderList" :key="index">
              <div
                :class="['rendItem-img',curiImageFilter.code==item.code?'active':'']"
                @click="changeImageFilter(item)"
              >
                <img :src="item.img" alt />
              </div>
              <div class="rendItem-name">{{item.name}}</div>
            </div>
          </div> -->
          <div v-if="imageAjustmentItem.value=='3'" class="color-ajustment-box">
            <div
              class="color-ajustment-item"
              v-for="(item,index) of colorAjustmentOption"
              :key="index"
            >
              <div class="item-desc">
                <span class="f14 label">{{item.label}}</span>
                <el-input
                  style="width:48px"
                  type="number"
                  v-model.number="colorAjustmentInputObj[item.key]"
                  @input="handleInput($event,item.key)"
                  @change="handleChange($event,item.key)"
                  @focus="handleFocus"
                  @blur="handleBlur"
                ></el-input>
                <!-- <span class="f14">{{colorAjustmentObj[item.key]}}</span> -->
              </div>
              <el-slider
                type="double"
                class="item-slide"
                :min="-100"
                :max="100"
                v-model="colorAjustmentObj[item.key]"
              ></el-slider>
            </div>
          </div>
        </div>
      </div>
      <div class="img-info" v-if="showType=='image'">
        <div class="img-info--left pl20">
          <span class="iconfont iconpicture"></span>
          <div class="f14 ml10 imgName">
            {{curGalleryData.data.name}}
            <span
              v-show="curGalleryData.data.name"
            >{{curGalleryData.data.imageUrl|getExt}}</span>
          </div>
          <div
            class="f14 ml10 imgSize"
          >尺寸：{{curGalleryData.data.width}}X{{curGalleryData.data.height}}</div>
        </div>
        <div class="img-info--right pr20 flex flex-col-ct">
          <el-checkbox v-model="isImgReplace">
            <span class="f12">替换图片</span>
          </el-checkbox>
          <el-popover
            placement="bottom"
            trigger="hover"
            :visible-arrow="false"
            popper-class="zw-rest-prop img-replace-tip"
            :open-delay="0"
            :close-delay="0"
            v-model="isShowReplaceTips"
          >
            <div class="tips-cont">
              <div class="flex tit">
                <i class="iconfont iconinfo-circle-fill blue mr3"></i>
                <b>说明</b>
              </div>
              <div class="pt5 pb10">
                <p>1、勾选并选中图片时，添加图片将替换该图；</p>
                <p>2、取消勾选，添加图片时将新增图片。</p>
              </div>
            </div>
            <div slot="reference">
              <i class="iconfont iconinfo-circle img-replace-tip-icon" v-if="!isImgReplace"></i>
              <i class="iconfont iconinfo-circle-fill img-replace-tip-icon blue" v-else></i>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="img-replace-tip-mask" v-show="isShowReplaceTipsMask" @click="hideImgReplaceTip"></div>
      <div class="img-info" v-if="showType=='group'">
        <div class="img-info--left pl20">
          <span class="iconfont icongroup"></span>
          <span class="f14 ml10">组合</span>
          <span class="f14 ml10">尺寸：500x500</span>
        </div>
        <div class="img-info--right pr20 flex flex-col-ct">
          <span>解除编组</span>
          <span class="iconfont iconarrow-right-bold"></span>
        </div>
      </div>


      <!--新布局start-->
      <div class="operation-content">
        <div class="operation-item">
          <div class="operation-item-title">
            旋转
          </div>
          <div class="operation-item-content">
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'水平翻转'+ shortcutsTip('element5')"
              placement="top"
            >
              <span
                :class="['iconfont iconsymmetry-level symmetry cp',optLock?'zw-disabled':'']"
                @click="mirrorFlip('leftRightMirror')"
              ></span>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'垂直翻转'+ shortcutsTip('element6')"
              placement="top"
            >
              <span
                :class="['iconfont iconsymmetry-vertical symmetry cp',optLock?'zw-disabled':'']"
                @click="mirrorFlip('upDownMirror')"
              ></span>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'逆时针旋转45度' + shortcutsTip('element23')"
              placement="top"
            >
              <span
                :class="['iconfont iconrotate-left symmetry cp',optLock?'zw-disabled':'']"
                @click="rotate45('left')"
              ></span>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'顺时针旋转45度' + shortcutsTip('element22')"
              placement="top"
            >
              <span
                :class="['iconfont iconrotate-right symmetry cp',optLock?'zw-disabled':'']"
                @click="rotate45('right')"
              ></span>
            </el-tooltip>
            <zw-slide-input
              popWidth="226px"
              offset="bottom-right"
              showValueType="num"
              label="旋转"
              style="width:83px"
              :class="[optLock?'zw-disabled':'']"
              :step="1"
              unit="°"
              :max="180"
              :min="-180"
              :defaultValue.sync="curGalleryDataRealTime.nodeRotation"
              @update:defaultValue="rotationChangeEnd"
              @activeChange="rotationChange"
            />
          </div>
        </div>
        <div class="operation-item">
          <div class="operation-item-title">
            适应
          </div>
          <div class="operation-item-content">
            <div
              :class="['imgway-col']"
              v-for="(item,index) in imgWayOptions"
              :key="index"
            >
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                :content="item.tip+shortcutsTip(item.shortType)"
                placement="top"
                slot="reference"
              >
                <span
                  :class="['cp mb2 ','imgway-item','iconfont',item.icon,optLock?'zw-disabled':'']"
                  @click="imgMaximization(item)"
                ></span>
              </el-tooltip>

              <!-- <span class="f10 imgway-name">{{item.label}}</span> -->
            </div>
          </div>
        </div>
        <div class="operation-item">
          <div class="operation-item-title">
            平铺
          </div>
          <div class="operation-item-content">
            <div
              :class="['cp tileway-item',item.disabled||optLock?'zw-disabled':'']"
              :key="index"
              v-for="(item,index) in tilewayOptions"
            >
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                :content="item.label + '：'+shortcutsTip('gallery5')"
                placement="top"
              >
                <span
                  :key="index"
                  :class="['icon','mb2  f20','iconfont',item.icon,item.value==repeatType?'active':'',]"
                  @click="repeatChange(item)"
                ></span>
              </el-tooltip>
              <!-- <span :class="['f12 tc',]">{{item.label}}</span> -->
            </div>
            <div class="tileway-pop" v-if="showTitleWayPop" ref="tilewayPop" @click.stop>
              <ZwSlidepop2
                showValueType="input"
                :value="tilewayAlign"
                labelfirst="横向间距"
                labelSecond="纵向间距"
                :slideLock.sync="slideLock"
                @change="tileTypeActiveChange"
                :max="180"
                :min="0"
                :step="1"
              ></ZwSlidepop2>
            </div>
          </div>
        </div>
        <div class="operation-item">
          <div class="operation-item-title">
            设置
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="图片设置选择"
              placement="top"
            >
            <i class="iconfont iconsetting ml5" style="opacity: 0.45" @click="setImgFull()"></i>
            </el-tooltip>
          </div>
          <div class="operation-item-content" style="padding: 0 26px">
            <el-tooltip
              :enterable="false"
              effect="dark"
              :content="'设为背景'+ shortcutsTip('gallery7')"
              placement="top"
            >
              <el-checkbox
                v-model="form.setBg"
                @change="setBgImgClick()"
                :disabled="optLock"
                ref="setBgEl"
              >
                <span class="f12 mr17">设为背景</span>
              </el-checkbox>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              effect="dark"
              :content="'应用所有面'+ shortcutsTip('gallery6')"
              placement="top"
            >
              <el-checkbox
                v-model="form.useallview"
                :disabled="optLock"
                @change="handleUseAllChange('useallview')"
                ref="applyAllEl"
              >
                <span class="f12">应用所有面</span>
              </el-checkbox>
            </el-tooltip>
          </div>
        </div>
        <div class="operation-item2">
          <div class="item" :class="[optLock?'zw-disabled':'', filterType ? 'checked' : '']" @click="showOperationDetail()">
            <i class="iconfont iconfilter"></i>
            <span class="ml5">滤镜</span>
          </div>
        </div>
      </div>
      <div class="item-box--suspend">
        <div class="optBox-bg" ref="optBox" :style="optBoxStyle">
          <div class="flex opt-box">
            <el-popover placement="bottom" width="86" trigger="click" popper-class="zw-slide-prop">
              <ZwSlidepop
                :value.sync="curViewSize"
                @change="changeViewSize"
                title="图层缩放"
                preLabel="放大"
                nextLabel="缩小"
                @handlePreNext="scalePreNext"
                :max="100"
                :min="0"
                unit="%"
                :step="1"
                :showSlide="false"
                :showStops="false"
              ></ZwSlidepop>
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                :content="'放大'+shortcutsTip('base13')+','+'缩小'+shortcutsTip('base14')"
                placement="top"
                slot="reference"
              >
                <span :class="['iconfont','iconzoom','opt-item cp',optLock?'zw-disabled':'']"></span>
              </el-tooltip>
            </el-popover>
            <el-popover
              placement="bottom"
              title="移动图层"
              width="86"
              trigger="click"
              popper-class="zw-slide-prop"
              :disabled="groupIndexDisable"
              @show="addRemoveNode = false"
            >
              <ZwSlidepop
                :value.sync="curViewIndex"
                @change="changeViewIndex"
                title="图层顺序"
                preLabel="上移"
                nextLabel="下移"
                @activeChange="viewIndexActiveChange"
                @handlePreNext="handlePreNext"
                :max="viewIndexMax"
                :min="viewIndexMin"
                :step="1"
                :prenextDisabled="true"
                :showStops="true"
                :showSlide="true"
              ></ZwSlidepop>
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                content="图层顺序"
                placement="top"
                slot="reference"
              >
                <span
                  :class="['iconfont','iconview-layers','opt-item cp',(optLock||groupIndexDisable||!viewIndexMax)?'zw-disabled':'']"
                ></span>
              </el-tooltip>
            </el-popover>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'创建副本'+shortcutsTip('base16')"
              placement="top"
            >
              <span
                :class="['iconfont','iconfile-add','opt-item cp',(optLock||form.setBg)?'zw-disabled':'']"
                @click="copyNode($event)"
              ></span>
            </el-tooltip>

            <el-popover
              ref="copyToView"
              popper-class="zw-slide-prop"
              placement="bottom"
              title="标题"
              width="120"
              trigger="click"
            >
              <div class="view-list-container">
                <div
                  @click="copyToView(item)"
                  class="f14 view-item"
                  v-for="(item,index) in viewIdList"
                  :key="index"
                >{{item.name}}</div>
              </div>
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                content="复制至其他印刷面"
                placement="top"
                slot="reference"
              >
                <span
                  :class="['iconfont','iconfile-add-to','opt-item cp',form.setBg||optLock || viewIdList.length <= 1?'zw-disabled':'']"
                ></span>
              </el-tooltip>
            </el-popover>
            <el-tooltip
              :enterable="false"
              :class="['item', optLock ? 'active' : '']"
              effect="dark"
              :content="'锁定解锁/'+shortcutsTip('element17')"
              placement="top"
            >
              <span
                :class="['iconfont',optLock?'iconlock':'iconunlock','opt-item cp',]"
                @click="handleoptLock"
              ></span>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'删除'+shortcutsTip('base26')"
              placement="top"
            >
              <span
                :class="['iconfont','icondelete','opt-item cp', optLock ? 'zw-disabled' : '']"
                @click="handleoptDelete"
              ></span>
            </el-tooltip>
          </div>
        </div>
      </div>
      <!--新布局end-->


      <!-- <el-row v-if="!imageAjustmentItem">
        <el-col class="item-box item-box--left col12" :span="12">
          <div class="flex align-box">
            <ul class="box">
              <li v-for="(item,index) in alignboxOptions" :key="index">
                <el-tooltip
                  :enterable="false"
                  ref="tooltip"
                  class="item"
                  effect="dark"
                  :content="item.label+shortcutsTip(item.shortType)"
                  placement="top"
                >
                  <span
                    @click="changeAlignType(item, 1)"
                    :class="['iconfont',item.icon,'align-tool-item',item.value==form.alignType?'active':'',optLock?'zw-disabled':'']"
                  ></span>
                </el-tooltip>
              </li>
            </ul>

            <div class="align-select-tool">
              <div class="mb10 flex flex-col-center f12">
                <span class="label mr5">分布：</span>
                <el-tooltip
                  :enterable="false"
                  class="item"
                  effect="dark"
                  :content="item.label"
                  placement="top"
                  v-for="(item,index) in alignboxOptions2"
                  :key="index"
                >
                  <span
                    @click="changeAlignType(item, 2)"
                    :class="['align-type','cp','iconfont',item.icon,index==0?'mr12':'',form.distribution==item.value?'active':'',optLock?'zw-disabled':'']"
                  ></span>
                </el-tooltip>
              </div>
              <div class="mb4 label">对齐选区：</div>
              <el-select
                v-model="form.alignType2"
                placeholder="请选择"
                style="width:130px"
                :disabled="optLock"
              >
                <el-option label="对齐画布" value="1"></el-option>
                <el-option label="选中对象" value="2"></el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col class="item-box item-box--right col12" :span="12">
          <div class="change-box">
            <div class="label mb6">变换：</div>
            <div class="flex mb8">
              <zw-unit-input
                :step="1"
                unit="X"
                :defaultValue.sync="curGalleryDataRealTime.topLeftX"
                style="width:83px"
                :class="['mr17',optLock?'zw-disabled':'']"
                @changeValue="changeOffsetX"
              ></zw-unit-input>

              <zw-unit-input
                :step="1"
                unit="Y"
                :defaultValue.sync="curGalleryDataRealTime.topLeftY"
                style="width:83px"
                :class="['mr17',optLock?'zw-disabled':'']"
                @changeValue="changeOffsetY"
              ></zw-unit-input>

              <zw-slide-input
                popWidth="226px"
                offset="bottom-right"
                showValueType="num"
                label="旋转"
                style="width:83px"
                :class="[optLock?'zw-disabled':'']"
                :step="1"
                unit="°"
                :max="180"
                :min="-180"
                :defaultValue.sync="curGalleryDataRealTime.nodeRotation"
                @update:defaultValue="rotationChangeEnd"
                @activeChange="rotationChange"
              />
            </div>

            <div class="flex flex-col-ct">
              <zw-unit-input
                :step="1"
                unit="W"
                :min="20"
                :class="[optLock?'zw-disabled':'']"
                :defaultValue.sync="curGalleryDataRealTime.scaleWidth"
                style="width:83px"
                @changeValue="changeWidth"
              ></zw-unit-input>
              <span
                :class="['iconfont',iconlock?'iconlock-fill':'iconunlock-fill']"
                style="font-size:8px;padding:0 3px;"
                @click="widthHeightKeepRatio"
              ></span>

              <zw-unit-input
                :step="1"
                unit="H"
                :min="20"
                :defaultValue.sync="curGalleryDataRealTime.scaleHeight"
                style="width:83px"
                :class="[optLock?'zw-disabled':'']"
                class="mr17"
                @changeValue="changeHeight"
              >></zw-unit-input>
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                :content="'水平翻转'+ shortcutsTip('element5')"
                placement="top"
              >
                <span
                  :class="['iconfont iconsymmetry-level mr7 symmetry cp',optLock?'zw-disabled':'']"
                  @click="mirrorFlip('leftRightMirror')"
                ></span>
              </el-tooltip>
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                :content="'垂直翻转'+ shortcutsTip('element6')"
                placement="top"
              >
                <span
                  :class="['iconfont iconsymmetry-vertical symmetry cp',optLock?'zw-disabled':'']"
                  @click="mirrorFlip('upDownMirror')"
                ></span>
              </el-tooltip>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="!imageAjustmentItem">
        <el-col class="item-box item-box--left col12 lastH" :span="12"  style="padding-bottom:0;">
          <div class="flex flex-col-ct mb15 hide-llp">
            <span class="label">不透明度：</span>

            <zw-slide-input
              offset="bottom-left"
              showValueType="num"
              label
              popWidth="170px"
              :class="['mr10','zw-disabled']"
              style="width:70px"
              :step="1"
              :max="100"
              :min="0"
              :defaultValue.sync="curGalleryData.data.opacity"
              @update:defaultValue="opacityChange"
              :vertical="false"
              unit="%"
            ></zw-slide-input>

            <el-select style="width:88px" v-model="form.indexType" :disabled="optLock">
              <el-option
                v-for="(item,index) of indexTypeOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="flex mb15 imgway-box">
            <span class="label mr5">图案适应：</span>
            <el-tooltip
                :enterable='false'
              class="item"
              effect="dark"
              :content="item.label"
              placement="top"
              slot="reference"
              v-for="(item,index) in imgWayOptions"
              :key="index"
            >
              <span
                :class="['mr10 cp','imgway-item','iconfont',item.icon,item.value==imgMaximizationType?'active':'',optLock?'zw-disabled':'']"
                @click="imgMaximization(item)"
              ></span>
            </el-tooltip>

            <div
              :class="['imgway-col',index!==imgWayOptions.length-1?'mr15':'']"
              v-for="(item,index) in imgWayOptions"
              :key="index"
            >
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                :content="item.tip+shortcutsTip(item.shortType)"
                placement="top"
                slot="reference"
              >
                <span
                  :class="['cp mb2 ','imgway-item','iconfont',item.icon,item.value==imgMaximizationType?'active':'',optLock?'zw-disabled':'']"
                  @click="imgMaximization(item)"
                ></span>
              </el-tooltip>

              <span class="f10 imgway-name">{{item.label}}</span>
            </div>
          </div>
          <div class="flex mb15 imgset-box">
            <span class="label mr5">图片设置：</span>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'设为背景'+ shortcutsTip('gallery7')"
              placement="top"
            >
              <el-checkbox
                v-model="form.setBg"
                @change="setBgImgClick()"
                :disabled="optLock"
                ref="setBgEl"
              >
                <span class="f12 mr17">设为背景</span>
              </el-checkbox>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'应用所有面'+ shortcutsTip('gallery6')"
              placement="top"
            >
              <el-checkbox
                v-model="form.useallview"
                :disabled="optLock"
                @change="handleUseAllChange('useallview')"
                ref="applyAllEl"
              >
                <span class="f12">应用所有面</span>
              </el-checkbox>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="图片设置选择"
              placement="top"
            >
            <i class="iconfont iconsetting ml10" @click="setImgFull()"></i>
            </el-tooltip>
          </div>
        </el-col>
        <el-col class="item-box item-box--right col12 lastH" :span="12">
          <div class="label mb6 hide-llp">图案选项：</div>
          <div class="flex flex-row-between mb15 decorate-box hide-llp">
            <div
              :class="['decorate-item cp',item.showMore?'icon-caret-more':'','zw-disabled' ]"
              v-for="(item,index) in decorateOptions"
              :key="index"
              @click="imageAjustment(item)"
            >
              <span :class="['mb3 ','iconfont',item.icon]"></span>
              <span>{{item.label}}</span>
            </div>
          </div>
          <div class="label mb6">图案平铺：</div>
          <div class="flex flex-row-between tileway-box">
            <div
              :class="['cp tileway-item',item.disabled||optLock?'zw-disabled':'']"
              :key="index"
              v-for="(item,index) in tilewayOptions"
            >
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                :content="'图案平铺：'+shortcutsTip('gallery5')"
                placement="top"
              >
                <span
                  :key="index"
                  :class="['icon','mb2  f20','iconfont',item.icon,item.value==repeatType?'active':'',]"
                  @click="repeatChange(item)"
                ></span>
              </el-tooltip>
              <span :class="['f12 tc',]">{{item.label}}</span>
            </div>

            <div class="tileway-pop" v-if="showTitleWayPop" ref="tilewayPop" @click.stop>
              <ZwSlidepop2
                showValueType="input"
                :value="tilewayAlign"
                labelfirst="横向间距"
                labelSecond="众向间距"
                :slideLock.sync="slideLock"
                @change="tileTypeActiveChange"
                :max="180"
                :min="0"
                :step="1"
              ></ZwSlidepop2>
            </div>
          </div>
          
        </el-col>
      </el-row>
      <div class="item-box" :class="{'item-box--suspend': !isEffectFixed && !isEffectMini}" style="padding:0 20px;" v-if="!imageAjustmentItem">
        <div class="optBox-bg" ref="optBox" :style="optBoxStyle">
          <div class="flex opt-box">
            <el-popover placement="bottom" width="86" trigger="click" popper-class="zw-slide-prop">
              <ZwSlidepop
                :value.sync="curViewSize"
                @change="changeViewSize"
                title="图层缩放"
                preLabel="放大"
                nextLabel="缩小"
                @handlePreNext="scalePreNext"
                :max="100"
                :min="0"
                unit="%"
                :step="1"
                :showSlide="false"
                :showStops="false"
              ></ZwSlidepop>
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                :content="'放大'+shortcutsTip('base13')+','+'缩小'+shortcutsTip('base14')"
                placement="top"
                slot="reference"
              >
                <span :class="['iconfont','iconzoom','opt-item cp',optLock?'zw-disabled':'']"></span>
              </el-tooltip>
            </el-popover>
            <el-popover
              placement="bottom"
              title="移动图层"
              width="86"
              trigger="click"
              popper-class="zw-slide-prop"
              :disabled="groupIndexDisable"
              @show="addRemoveNode = false"
            >
              <ZwSlidepop
                :value.sync="curViewIndex"
                @change="changeViewIndex"
                title="图层顺序"
                preLabel="上移"
                nextLabel="下移"
                @activeChange="viewIndexActiveChange"
                @handlePreNext="handlePreNext"
                :max="viewIndexMax"
                :min="viewIndexMin"
                :step="1"
                :prenextDisabled="true"
                :showStops="true"
                :showSlide="true"
              ></ZwSlidepop>
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                content="图层顺序"
                placement="top"
                slot="reference"
              >
                <span
                  :class="['iconfont','iconview-layers','opt-item cp',(optLock||groupIndexDisable||!viewIndexMax)?'zw-disabled':'']"
                ></span>
              </el-tooltip>
            </el-popover>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'创建副本'+shortcutsTip('base16')"
              placement="top"
            >
              <span
                :class="['iconfont','iconfile-add','opt-item cp',(optLock||form.setBg)?'zw-disabled':'']"
                @click="copyNode($event)"
              ></span>
            </el-tooltip>

            <el-popover
              ref="copyToView"
              popper-class="zw-slide-prop"
              placement="bottom"
              title="标题"
              width="120"
              trigger="click"
            >
              <div class="view-list-container">
                <div
                  @click="copyToView(item)"
                  class="f14 view-item"
                  v-for="(item,index) in viewIdList"
                  :key="index"
                >{{item.name}}</div>
              </div>
              <el-tooltip
                :enterable="false"
                class="item"
                effect="dark"
                content="复制至其他印刷面"
                placement="top"
                slot="reference"
              >
                <span
                  :class="['iconfont','iconfile-add-to','opt-item cp',form.setBg||optLock || viewIdList.length <= 1?'zw-disabled':'']"
                ></span>
              </el-tooltip>
            </el-popover>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'锁定解锁/'+shortcutsTip('element17')"
              placement="top"
            >
              <span
                :class="['iconfont',optLock?'iconlock':'iconunlock','opt-item cp',]"
                @click="handleoptLock"
              ></span>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              :content="'删除'+shortcutsTip('base26')"
              placement="top"
            >
              <span
                :class="['iconfont','icondelete','opt-item cp', optLock ? 'zw-disabled' : '']"
                @click="handleoptDelete"
              ></span>
            </el-tooltip>
          </div>
        </div>
      </div> -->
    </div>
    <keep-alive>
      <zw-filter v-if="showFilters" @closeFilter="closeFilter()"></zw-filter>
    </keep-alive>
    <el-dialog
      :visible.sync="isShowImgFullSet"
      custom-class="zw-message-pop"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      width="480px"
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-warning primary-icon"></i> 图片设置选择
      </div>
      <div class="dialog-content">
        <div class="switch-con">
          <span>自动应用于所有面：</span>
          <el-switch
            v-model="isApply">
          </el-switch>
        </div>
        <div class="tip">
          针对全副多面产品：
          <br />开启状态，添加首张图片将默认设为背景并应用于所有面；
          <br />关闭状态，添加图片时仅用于当前面，且不设为背景。
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowImgFullSet=false">取消</el-button>
        <el-button type="primary" @click="confirmImgFullSet()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus.js";
import ZwSelect from "@/components/common/ZwSelect";
import ZwInput from "@/components/common/ZwInput";
import ZwUnitInput from "@/components/common/ZwUnitInput";
import ZwSlideInput from "@/components/common/ZwSlideInput";
import ZwSlidepop from "@/components/common/ZwSlidepop";
import ZwSlidepop2 from "@/components/common/ZwSlidepop2";
import ZwColorPicker from "@/components/common/ZwColorPicker";
import ZwFilter from './ZwFilter.vue';
import { _getRender, _changeImgStyle } from "@/apis/gallery.js";
import { alignmentCanvas } from "@/utils/designer.js";
import Color from "@/utils/color";
import {checkPlatform, genLocalStorageKey} from '@/utils/utils';
export default {
  name: "GalleryDetail",
  props: {},
  components: {
    ZwSelect,
    ZwInput,
    ZwUnitInput,
    ZwSlideInput,
    ZwSlidepop,
    ZwSlidepop2,
    ZwColorPicker,
    ZwFilter,
  },
  data() {
    return {
      showFilters: false,
      filterType: '',
      //图案平铺横纵间距
      tilewayAlign: [0, 0],
      showTitleWayPop: false,
      curViewIndex: 0,
      curViewSize: 0,
      viewIndexMax: 0,
      viewIndexMin: 0,
      addRemoveNode: false,
      slideLock: true,
      optBoxStyle: {},
      scrollBox: null,
      // optLock: false,
      iconlock: true,
      form: {
        // alignType: "",
        // alignType2: "1",
        // width: "",
        // height: "",
        // offsetX: "",
        // offsetY: "",
        angle: 0,
        opacity: 0,
        indexType: "1",
        imgWay: "",
        background_color: null,
        setBg: false,
        useallview: false,
        // useall: false,
        distribution: "",
      },
      imageAjustmentItem: null,
      // renderList: [],
      //裁剪路径列表
      pathList: [
        {
          id: 1,
          val: "",
        },
        {
          id: 2,
          val: require("@/assets/img/gallery/path1.svg"),
        },
        {
          id: 3,
          val: require("@/assets/img/gallery/path2.svg"),
        },
        {
          id: 4,
          val: require("@/assets/img/gallery/path3.svg"),
        },
        {
          id: 5,
          val: require("@/assets/img/gallery/path4.svg"),
        },
        {
          id: 6,
          val: require("@/assets/img/gallery/bao.png"),
        },
      ],
      // pathList: [
      //   {
      //     id: 1,
      //     val: "",
      //   },
      //   {
      //     id: 2,
      //     val:
      //       "M256 136l120-87.8-16.1 147.8 136.1 60-136.1 60 16.1 147.8-120-87.8-120 87.8 16.1-147.8-136.1-60 136.1-60-16.1-147.8z",
      //   },
      //   {
      //     id: 3,
      //     val: "M16 20.8v288.9l240 181.5 240-181.5v-288.9h-480z",
      //   },
      //   {
      //     id: 4,
      //     val:
      //       "M294.9 16.4l15.7 42.2c-171.4 70.3-294 242.3-289.1 437.4l14.7-1c9.1-.6 18.1-1.2 27.1-1.9l14.7-1c-4.3-170.1 102.5-320 252-381.3l15.7 42.2c34.7-40.5 83.1-76.6 144.8-99.8-58.1-26.2-124.9-39.6-195.6-36.8z",
      //   },
      // ],
      //选中的裁剪路径
      selectedPath: 1,
      // curiImageFilter: {
      //   code: "",
      //   imgUrl: "",
      // },
      // lastImgeFilter: null,
      colorAjustmentObj: {
        definition: 0,
        saturation: 0,
        brightness: 0,
        contrast: 0,
        colorTemp: 0,
        hue: 0,
      },
      colorAjustmentObjCopy: {},
      colorAjustmentInputObj: {
        definition: 0,
        saturation: 0,
        brightness: 0,
        contrast: 0,
        colorTemp: 0,
        hue: 0,
      },
      lastcolorAjustmentObj: null,
      colorAjustmentOption: [
        {
          label: "清晰度",
          key: "definition",
          min: -100,
          max: 100,
        },
        {
          label: "饱和度",
          key: "saturation",
          min: -100,
          max: 100,
        },
        {
          label: "亮度",
          key: "brightness",
          min: -100,
          max: 100,
        },
        {
          label: "对比度",
          key: "contrast",
          min: -100,
          max: 100,
        },
        {
          label: "色温",
          key: "colorTemp",
          min: -100,
          max: 100,
        },
        {
          label: "色调",
          key: "hue",
          min: 0,
          max: 360,
          unit: "°",
        },
      ],
      indexTypeOption: [
        {
          label: "正常",
          value: "1",
        },
        // {
        //   label: "正片叠底",
        //   value: "2"
        // },
        // {
        //   label: "线性减淡",
        //   value: "3"
        // },
        // {
        //   label: "线性加深",
        //   value: "4"
        // }
      ],
      imgWayOptions: [
        {
          label: "最大化",
          value: "imgFull",
          icon: "iconcolumn-max",
          tip: "最大化设计",
          shortType: "element20",
        },
        {
          label: "铺满",
          value: "imgAdaptFull",
          icon: "iconcolumn-paved",
          tip: "铺满设计区域",
          shortType: "element21",
        },
        {
          label: "适高",
          value: "heightMaximization",
          icon: "iconcolumn-height",
          tip: "高度最大化",
          shortType: "element19",
        },
        {
          label: "适宽",
          value: "widthMaximization",
          icon: "iconcolumn-width",
          tip: "宽度最大化",
          shortType: "element18",
        },
        {
          label: "还原",
          value: "restore",
          icon: "iconcolumn-reduction",
          tip: "还原",
          shortType: "",
        },
      ],
      decorateOptions: [
        {
          label: "裁剪",
          value: "1",
          icon: "iconcrop",
          showMore: false,
          disabled: false,
        },
        {
          label: "抠图",
          value: "2",
          icon: "iconcutout",
          showMore: false,
          disabled: true,
        },
        {
          label: "清晰",
          value: "3",
          icon: "iconbright",
          showMore: true,
          disabled: true,
        },
        {
          label: "滤镜",
          value: "4",
          icon: "iconfilter",
          showMore: true,
          disabled: true,
        },
      ],
      tilewayOptions: [
        {
          label: "无",
          value: "",
          icon: "iconnum-c1",
          showPop: false,
          offset: 0,
          disabled: false,
        },
        {
          label: "基础",
          value: "basicsTile",
          icon: "iconnum-c2",
          showPop: true,
          offset: 160,
          disabled: false,
        },
        {
          label: "镜像",
          value: "Mirror",
          icon: "iconnum-c3",
          showPop: true,
          offset: 120,
          disabled: false,
        },
        {
          label: "横向",
          value: "XSpacedTile",
          icon: "iconnum-c4",
          showPop: true,
          offset: 80,
          disabled: false,
        },
        {
          label: "纵向",
          value: "YSpacedTile",
          icon: "iconnum-c5",
          showPop: true,
          offset: 40,
          disabled: false,
        },
        // {
        //   label: "随机",
        //   value: "6",
        //   icon: "iconnum-c6",
        //   showPop: true,
        //   offset: 0,
        //   disabled: true,
        // },
      ],
      alignboxOptions: [
        {
          label: "左上角对齐",
          value: "topleft",
          icon: "icondistributed-left-top",
          shortType: "",
          placement: "top",
        },
        {
          label: "上对齐",
          value: "topcenter",
          icon: "icondistributed-top",
          shortType: "base9",
          placement: "top",
        },
        {
          label: "右上角对齐",
          value: "topright",
          icon: "icondistributed-right-top",
          shortType: "",
          placement: "top",
        },
        {
          label: "左对齐",
          value: "centerleft",
          icon: "icondistributed-left",
          shortType: "base11",
          placement: "left",
        },
        {
          label: "居中对齐",
          value: "centercenter",
          icon: "icondistributed-center",
          shortType: "",
          placement: "top",
        },
        {
          label: "右对齐",
          value: "centerright",
          icon: "icondistributed-right",
          shortType: "base12",
          placement: "right",
        },
        {
          label: "左下角对齐",
          value: "bottomleft",
          icon: "icondistributed-left-bottom",
          shortType: "",
          placement: "bottom",
        },
        {
          label: "下对齐",
          value: "bottomcenter",
          icon: "icondistributed-bottom",
          shortType: "base10",
          placement: "bottom",
        },
        {
          label: "右下角对齐",
          value: "bottomright",
          icon: "icondistributed-right-bottom",
          shortType: "",
          placement: "bottom",
        },
      ],
      alignboxOptions2: [
        {
          label: "水平",
          value: "horizontalcenter",
          icon: "icondistribute-plumb",
        },
        {
          label: "垂直",
          value: "verticalcenter",
          icon: "icondistribute-level",
        },
      ],
      optboxOptions: [
        {
          label: "缩放",
          value: "1",
          icon: "iconzoom",
        },
        {
          label: "图层顺序",
          value: "2",
          icon: "iconview-layers",
          showPop: true,
        },
        {
          label: "复制",
          value: "3",
          icon: "iconfile-add",
          showPop: false,
        },
        {
          label: "复制至其他印刷面",
          value: "4",
          icon: "iconfile-add-to",
          showPop: false,
        },
        {
          label: "锁定",
          value: "5",
          icon: "iconlock",
          showPop: false,
        },
        {
          label: "删除",
          value: "6",
          icon: "icondelete",
          showPop: false,
        },
      ],
      repeatType: "",
      confirmCheck: {
        useallview: false,
        useall: false,
      },
      layer: null,
      node: null,
      groupNode: null,
      groupIndexDisable: false, //背景图层级不可用
      isApply: true,
      isShowImgFullSet: false,
      isShowReplaceTips: false,
      isShowReplaceTipsMask: false,
    };
  },
  filters: {
    getExt(value) {
      if (value) {
        let index = value.lastIndexOf(".");
        let ext = value.substr(index);
        return ext;
      } else {
        return ".jpg";
      }
    },
  },
  computed: {
    view_id: function () {
      return this.$store.getters.view_id;
    },
    viewIdList: function () {
      let allViewsCfg = JSON.parse(
        JSON.stringify(this.$store.getters.allViewsCfg)
      );
      allViewsCfg.splice(
        allViewsCfg.findIndex((item) => {
          return item.id == this.view_id;
        }),
        1
      );
      allViewsCfg.unshift({ id: -1, name: "所有面" });
      return allViewsCfg;
    },
    optLock: function () {
      return this.node ? this.node.isLock : false;
    },
    galleryData: function () {
      return this.$store.getters.galleryData;
    },
    showType() {
      return this.$store.state.layout.showType;
    },
    curGalleryDataRealTime() {
      return this.$store.state.gallery.curGalleryDataRealTime;
    },
    curGalleryData() {
      // this.addRemoveNode = false;
      let curGalleryData = this.$store.state.gallery.curGalleryData;

      if (curGalleryData.node) {
        this.node = curGalleryData.node;
        this.filterType = curGalleryData.node.getAttrs().filterType;
        // let code = curGalleryData.node.getAttrs().filterType;
        // let flipImgUrl = curGalleryData.node.getAttrs().flipImgUrl;
        // if (!this.lastImgeFilter) {
        //   this.lastImgeFilter = {
        //     id: curGalleryData.node._id,
        //     code: code,
        //     imgUrl: flipImgUrl,
        //   };
        // } else if (this.lastImgeFilter.id !== curGalleryData.node._id) {
        //   this.lastImgeFilter = {
        //     id: curGalleryData.node._id,
        //     code: code,
        //     imgUrl: flipImgUrl,
        //   };
        // }
        // this.curiImageFilter.code = code;
        // this.curiImageFilter.imgUrl = flipImgUrl;
      }
      if (
        curGalleryData.node &&
        !curGalleryData.node.hasName("isBg") &&
        !curGalleryData.node.hasName("bgRect")
      ) {
        this.groupIndexDisable = false;
        this.layer = this.node.getLayer();
        if (this.layer) {
          this.groupNode = this.layer.findOne(
            `.repeatImgGroup${curGalleryData.node._id}`
          )
            ? this.layer.findOne(`.repeatImgGroup${this.node._id}`)
            : curGalleryData.node;
          let designList = this.layer.find(".design").filter((item) => {
            return !item.hasName("bgRect") && !item.hasName("isBg");
          });
          this.viewIndexMax = designList.length - 1;
          this.repeatType = this.node.getAttrs().tileType;
          this.tilewayAlign = [
            this.node.getAttrs().spacingH,
            this.node.getAttrs().spacingV,
          ];

          // console.log('888888', this.groupNode.getZIndex(), this.viewIndexMax)
        }
      } else {
        // console.log('2222')
        // this.addRemoveNode = false
        this.groupIndexDisable = true;
      }

      return curGalleryData;
    },
    pickDefineColor() {
      // console.log("++++++++", this.$store.state.gallery.pickDefineColor);
      return this.$store.state.gallery.pickDefineColor;
    },
    customShortcutsMap() {
      return this.$store.state.shortcut.customShortcutsMap;
    },
    isImgReplace: {
      get(){
        return this.$store.state.gallery.isImgReplace;
      },
      set(val){
        this.$store.commit("gallery/changeImgReplaceStatus", val);
      }
    }
  },
  watch: {
    isShowReplaceTips(nv){
      if(!nv){
        this.isShowReplaceTipsMask = false;
      }
    },
    isShowReplaceTipsMask(nv){
      if(!nv){
        this.addReplaceTipToStorage();
      }
    },
    view_id: function (val) {
      // console.log(val);
      // if (this.galleryData[val]) {
      //   this.form = this.galleryData[val];
      // } else {
      //   this.form = this.defaultForm;
      // }
    },
    "curGalleryData.node._id": {
      handler(nv) {
        this.addRemoveNode = true;
        this.showFilters = false
        if (nv && !this.groupIndexDisable && this.groupNode) {
          // console.log('curGalleryData.node._id', nv)
          let curViewIndex = this.groupNode.getZIndex();
          if (this.layer.findOne(".isBg")) curViewIndex -= 1;
          if (this.layer.findOne(".bgRect")) {
            curViewIndex -= 1;
            this.form.background_color = this.layer.findOne(
              ".bgRect"
            ).attrs.fill;
          } else {
            this.form.background_color = "";
          }
          this.curViewIndex = curViewIndex;
        }
      },
      immediate: true,
    },
    viewIndexMax(nv, ov) {
      // console.log('watch')
      this.addRemoveNode = true;
      let curViewIndex = this.groupNode.getZIndex();
      if (this.layer.findOne(".isBg")) curViewIndex -= 1;
      if (this.layer.findOne(".bgRect")) curViewIndex -= 1;
      this.curViewIndex = curViewIndex;
    },
    colorAjustmentObj: {
      handler(nv) {
        this.colorAjustmentInputObj = Object.assign({}, nv);

        eventBus.$emit("changeColorAjustment", nv);
        // console.log(nv, "watch colorAjustmentObj");
      },
      deep: true,
    },

    // 'form.setBg': {
    //   handler(nv, ov) {
    //     if(nv != ov) {
    //       console.log('uuuuu22222',nv, ov, this.form.setBg)
    //       eventBus.$emit('setBgImgClick', {data: nv})
    //     }
    //   }
    // }
    iconlock(nv) {
      this.$store.commit("layout/changeImgKeepRatioLock", nv);
    },
  },
  directives: {
    resize: {
      // 指令的定义
      bind: function (el, bind) {
      },
      update: function (el) {
      },
    },
  },
  created() {
    // this.getRender();
  },

  mounted() {
    eventBus.$on("closeFilter", (data) => {
      this.closeFilter();
    });
    // this.scrollBoxListener();
    // window.addEventListener("resize", this.handlescroll);
    eventBus.$on("changeSelectNode", (data) => {
      // console.log('ssss', !data.data)
      // if(!data.data) {
      //   this.form.setBg = false;
      //   this.form.useallview = false
      // }else {
      if (data.data.hasName("isBg")) {
        this.form.setBg = true;
      } else {
        this.form.setBg = false;
      }
      if (data.data.hasName("bgApplyAllView")) {
        this.form.useallview = true;
        this.confirmCheck.useallview = true;
      } else {
        this.form.useallview = false;
        this.confirmCheck.useallview = false;
      }
      // }
    });
    // eventBus.$on("changeSelectView", data => {
    //   if (data.data.findOne(".bgRect")) {
    //     this.form.background_color = data.data
    //       .findOne(".bgRect")
    //       .getAttrs().fill;
    //   } else {
    //     this.form.background_color = null;
    //   }
    //   if (data.data.findOne(".bgColorApplyAllView")) {
    //     this.form.useall = true;
    //   } else {
    //     this.form.useall = false;
    //   }
    // });
    eventBus.$on("changeImgZIndex", (position) => {
      // this.nodeSortFlag = true;
      this.addRemoveNode = true;
      let flag = false;
      switch (position) {
        case "top": //顶层
          if (this.curViewIndex < this.viewIndexMax) {
            this.groupNode.moveToTop();
            this.groupNode.moveDown(); //有一个print_area_border_outer矩形在最上层
            this.curViewIndex = this.viewIndexMax;
            flag = true;
          }
          break;
        case "bottom": //底层
          if (this.curViewIndex > this.viewIndexMin) {
            if (this.layer.findOne(".bgRect")) {
              this.groupNode.zIndex(this.layer.findOne(".bgRect").zIndex() + 1);
            }
            if (this.layer.findOne(".isBg")) {
              this.groupNode.zIndex(this.layer.findOne(".isBg").zIndex());
            }
            if (
              !this.layer.findOne(".bgRect") &&
              !this.layer.findOne(".isBg")
            ) {
              this.groupNode.moveToBottom();
            }
            this.curViewIndex = this.viewIndexMin;
            flag = true;
          }
          break;
        case "prev": //上移一层
          if (this.curViewIndex < this.viewIndexMax) {
            this.groupNode.moveUp();
            this.curViewIndex = this.curViewIndex + 1;
            flag = true;
          }
          break;
        case "next": //下移一层
          if (this.curViewIndex > this.viewIndexMin) {
            this.groupNode.moveDown();
            this.curViewIndex = this.curViewIndex - 1;
            flag = true;
          }
          break;
      }
      if (flag) {
        this.curGalleryData.node.getLayer().batchDraw();
        eventBus.$emit("cloneStage");
        eventBus.$emit("addHistory", "图层排序", {
          nodeId: this.curGalleryData.node.getAttrs().historyId,
        });
        this.changeViewIndex();
        setTimeout(() => {
          this.addRemoveNode = false;
        }, 500);
      }
    });
    eventBus.$on("setBgImgClickEnd", () => {
      this.curViewIndex = this.viewIndexMin;
    });
    // 图片设为背景图(右键功能)
    eventBus.$on("applyBg", () => {
      if (!this.form.setBg) {
        this.form.setBg = true;
        this.confirmCheck["useallview"] = true;
        eventBus.$emit("setBgImgClick", { data: true });
      }
    });
    // 图片设为背景图应用所有面(右键功能)
    eventBus.$on("applyBgAllView", () => {
      if (!this.form.useallview) {
        this.$confirm("此操作将应用所有面, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.form.useallview = true;
            eventBus.$emit("setBgImgClick", {
              data: this.form.useallview,
              type: "all",
            });
            this.form.setBg = true;
          })
          .catch(() => {});
        // this.$confirm("此操作将应用所有面, 是否继续?", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning"
        // })
        //   .then(() => {
        //     // 需要先设为背景才能应用所有面
        //     if (!this.groupNode.hasName("isBg")) {
        //       eventBus.$emit("setBgImgClick", {
        //         data: true
        //       });
        //     }
        //     this.form["useallview"] = true;
        //     this.confirmCheck["useallview"] = !this.confirmCheck["useallview"];
        //     eventBus.$emit("setBgImgClick", {
        //       data: true,
        //       type: "all"
        //     });
        //   })
        //   .catch(() => {});
      }
    });
    eventBus.$on("changeImgScale", (type) => {
      this.scalePreNext(type);
    });
    eventBus.$on("imgAlign", (position) => {
      this.changeAlignType({ value: position }, 1);
    });
    //设为背景调整图层层级
    eventBus.$on("bgImgSetLevel", () => {
      this.repeatType = "";
      this.changeViewIndex();
    });
    eventBus.$on('showReplaceImgTip', ()=>{
      this.showImgReplaceTip();
    })
    eventBus.$on("toggleImgFilter", () => {
      this.showFilters = !this.showFilters;
    });
    let _this = this;
    document.addEventListener("mouseup", (e) => {
      let pop = this.$refs.tilewayPop;
      if (pop) {
        if (!pop.contains(e.target)) {
          this.showTitleWayPop = false;
        }
      }
    });
  },
  beforeDestroy() {
    // window.removeEventListener("resize", this.handlescroll);
  },
  methods: {
    showOperationDetail() {
      this.showFilters = true
    },
    closeFilter() {
      this.showFilters = false
    },
    // 替换图片提示
    showImgReplaceTip(){
      const localStorageKey = genLocalStorageKey('noImgReplaceTipLists');
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let noTipsLists = JSON.parse(localStorage.getItem(localStorageKey));
      if (
        noTipsLists &&
        noTipsLists.length &&
        noTipsLists.some((a) => a == customerId)
      ) return;
      this.isShowReplaceTips = true;
      this.isShowReplaceTipsMask = true;
    },
    hideImgReplaceTip(){
      this.isShowReplaceTips = false;
      this.isShowReplaceTipsMask = false;
    },
    addReplaceTipToStorage(){
      const localStorageKey = genLocalStorageKey('noImgReplaceTipLists');
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let noTipsLists = JSON.parse(localStorage.getItem(localStorageKey));
      if(!noTipsLists) noTipsLists = [];
      if (!noTipsLists.some((a) => a == customerId)){
        noTipsLists.push(customerId);
      }
      localStorage.setItem(localStorageKey, JSON.stringify(noTipsLists));
    },
    setImgFull() {
      const localStorageKey = genLocalStorageKey('imgFullSet');
      this.isShowImgFullSet = true;
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let imgFullSet = [];
      this.isApply = true;
      if (localStorage.getItem(localStorageKey)) {
        imgFullSet = JSON.parse(localStorage.getItem(localStorageKey));
        this.isApply =
          imgFullSet[
            imgFullSet.findIndex((item) => {
              return item.customerId == customerId;
            })
          ].isApply;
      }
    },
    confirmImgFullSet() {
      const localStorageKey = genLocalStorageKey('imgFullSet');
      this.isShowImgFullSet = false;
      let customerId = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      let imgFullSet = [];
      if (localStorage.getItem(localStorageKey)) {
        imgFullSet = JSON.parse(localStorage.getItem(localStorageKey));
        imgFullSet.splice(
          imgFullSet.findIndex((item) => {
            return item.customerId == customerId;
          }),
          1
        );
      }
      imgFullSet.push({
        customerId,
        isApply: this.isApply,
      });
      localStorage.setItem(localStorageKey, JSON.stringify(imgFullSet));
    },
    //快捷键操作提示
    shortcutsTip(id) {
      let ret = "";
      if (id && this.customShortcutsMap[id]) {
        let complexKey = this.customShortcutsMap[id].complexKey;
        if (complexKey && complexKey.length) {
          if (checkPlatform() != "windows") {
            complexKey = complexKey.map((a) => {
              let _a = a.toLowerCase();
              if (_a == "ctrl") return "⌘";
              else if (_a == "shift") return "⇧";
              else if (_a == "alt") return "⌥";
              else if(_a == 'win') return '^';
            });
          }
          ret += complexKey.join(" + ");
          ret += " + ";
        }
        ret += this.customShortcutsMap[id].keys.name;
      }
      return ret ? `(${ret})` : ret;
    },
    handleMouseLeave() {
      const tooltip = this.$refs.tooltip;
      tooltip.handleClosePopper();
    },
    scrollBoxListener() {
      let _this = this;
      this.scrollBox = this.$refs["gallerydetail"];
      this.scrollBox.onscroll = () => {
        _this.handlescroll();
      };
    },
    handlescroll() {
      let w = document.documentElement.clientWidth || document.body.clientWidth; //兼容IE8
      if (w > 1450 || w < 1110) {
        this.optBoxStyle = {};
      } else {
        let scrollBox = this.scrollBox;
        let scrollBoxH = scrollBox.offsetHeight;
        let scrollTop = scrollBox.scrollTop;
        if (scrollBoxH + scrollTop < 522) {
          // console.log(scrollBoxH + scrollTop, "11111111");
          this.optBoxStyle = {
            position: "fixed",
            width: "275px",
            top: scrollBoxH + "px",
            right: 0,
            background: "#fff",
            "border-top": "1px solid #f0f5ff",
            "border-bottom": "1px solid #f0f5ff",
            padding: "15px 20px 10px 20px",
            "z-index": 1,
          };
        } else {
          this.optBoxStyle = {};
        }
      }
    },
    formateColor(color) {
      if (!color) {
        return null;
      } else {
        const formateColor = new Color({
          enableAlpha: false,
          format: "hex",
        });
        formateColor.fromString(color);
        return {
          value: formateColor.value,
          alpha: formateColor._alpha / 100,
          color: color,
        };
      }
    },
    handleFocus(e) {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    handleInput(val, key) {
      if (val < -100) {
        this.colorAjustmentInputObj[key] = -100;
      } else if (val > 100) {
        this.colorAjustmentInputObj[key] = 100;
      }
    },
    handleChange(val, key) {
      let valNum = Number(val);
      if (typeof valNum === "number" && !isNaN(valNum)) {
        this.colorAjustmentObj[key] = valNum;
      } else {
        this.colorAjustmentInputObj[key] = this.colorAjustmentObj[key];
      }
    },
    //图案选项：裁剪 抠图 清晰 滤镜
    // getRender() {
    //   _getRender().then((res) => {
    //     console.log(res);
    //     this.renderList = res.data;
    //   });
    // },
    imageAjustment(item) {
      this.imageAjustmentItem = item;
      switch (item.value) {
        case "1":
          this.selectedPath = this.pathList[1].id;
          eventBus.$emit("imgClipStart", this.pathList[1]);
          break;
        case "2":
          break;
        case "3":
          this.colorAjustmentObjCopy = Object.assign(
            {},
            this.colorAjustmentObj
          );
          break;
        case "4":
          break;
      }
    },

    // //修改图片滤镜
    // changeImageFilter(item) {
    //   this.curiImageFilter.code = item.code;
    //   let params = {
    //     code: item.code,
    //     params: {
    //       gallery_id: this.curGalleryData.data.code,
    //       xFlip: false,
    //       yFlip: false,
    //     },
    //   };
    //   _changeImgStyle(params)
    //     .then((res) => {
    //       if (res.code == "success") {
    //         this.curiImageFilter.imgUrl = res.data.url;

    //         eventBus.$emit("changeImgFilter", this.curiImageFilter);
    //       }
    //     })
    //     .catch((err) => {
    //       // eventBus.$emit("changeImgFilter", {
    //       //   imgUrl:
    //       //     "https://nimg5.hicustom.com/static/renderGallery/42c4c227da5f44ba7afb600fddf22c00-500-png-202103-ea680f893bb9c6302a502f279179e55f.png",
    //       //   code: "my_scream"
    //       // });
    //       this.$message.error(err.msg);
    //     });
    // },
    //图片渲染风格确定
    ajustmentConfirm() {
      switch (this.imageAjustmentItem.value) {
        case "1":
          eventBus.$emit("imgClipSave");
          this.imageAjustmentItem = null;
          break;
        case "2":
          break;
        case "3":
          this.imageAjustmentItem = null;
          break;
        case "4":
          // this.lastImgeFilter = {
          //   ...this.lastImgeFilter,
          //   ...this.curiImageFilter,
          // };
          this.imageAjustmentItem = null;
          break;
        default:
          break;
      }
    },
    //图片渲染风格取消
    ajustmentCancel() {
      switch (this.imageAjustmentItem.value) {
        case "1":
          eventBus.$emit("imgClipCancel");
          this.imageAjustmentItem = null;
          break;
        case "2":
          break;
        case "3":
          this.imageAjustmentItem = null;
          this.colorAjustmentObj = this.colorAjustmentObjCopy;
          break;
        case "4":
          // eventBus.$emit("changeImgFilter", this.lastImgeFilter);
          this.imageAjustmentItem = null;
          break;
        default:
          break;
      }
    },
    // 改变裁剪路径
    changeClipPath(path) {
      this.selectedPath = path.id;
      eventBus.$emit("imgClipStart", path);
    },
    tileTypeActiveChange(value) {
      this.tilewayAlign = value;
      eventBus.$emit("repeatSpacing", value);
    },
    //切换图层
    changeViewIndex(val) {
      let layer = this.groupNode.getLayer();
      if (!layer) return;
      let designImgList = [];
      for (let item of this.$store.state.gallery.designImgList) {
        designImgList.push(item);
      }
      for (let item of designImgList) {
        if (layer.getAttrs().viewId == item.id) {
          item.childrens = [];
          for (let design of layer.find(".design").reverse()) {
            if (!design.hasName("bgRect")) {
              item.childrens.push(design);
            }
          }
          break;
        }
      }

      this.$store.commit("gallery/getDesignImgList", {
        data: designImgList,
      });
      eventBus.$emit("changeViewIndex");
    },
    handlePreNext(val) {
      this.$nextTick(() => {
        this.changeViewIndex();
      });
    },
    viewIndexActiveChange(data) {
      if (this.addRemoveNode) return;
      // if (this.nodeSortFlag) return;
      // if (!this.addRemoveNode) {
      if (data.type == "up") {
        this.groupNode.moveUp();
        this.curViewIndex = data.val;
      } else {
        this.groupNode.moveDown();
        this.curViewIndex = data.val;
      }
      this.groupNode.getLayer().batchDraw();
      eventBus.$emit("addHistory", "图层排序", {
        nodeId: this.groupNode.getAttrs().historyId,
      });
      // }
      // this.addRemoveNode = false;
      // this.nodeSortFlag = false;
    },
    //缩放图层
    changeViewSize(val) {},
    scalePreNext(val) {
      switch (val) {
        case 1:
          this.node.scaleX(
            this.node.scaleX() > 0
              ? this.node.scaleX() + 0.1
              : this.node.scaleX() - 0.1
          );
          this.node.scaleY(
            this.node.scaleY() > 0
              ? this.node.scaleY() + 0.1
              : this.node.scaleY() - 0.1
          );
          break;
        case -1:
          this.node.scaleX(
            this.node.scaleX() > 0
              ? this.node.scaleX() - 0.1
              : this.node.scaleX() + 0.1
          );
          this.node.scaleY(
            this.node.scaleY() > 0
              ? this.node.scaleY() - 0.1
              : this.node.scaleY() + 0.1
          );
          break;
      }
      this.node.fire("click");
      this.node.getLayer().batchDraw();
      eventBus.$emit("cloneStage");
    },
    //锁定
    handleoptLock() {
      // this.optLock = !this.optLock;
      // this.node.isLock = this.optLock
      this.$set(this.node, "isLock", !this.optLock);
      eventBus.$emit("nodeToggleLock", { data: this.node });
    },
    //删除
    handleoptDelete() {
      eventBus.$emit("nodeToggleDelete");
    },
    copyToView(item) {
      if (item.id == -1) {
        for (let view of this.viewIdList) {
          if (view.id != -1) {
            eventBus.$emit("copyToView", { data: view, type: 'all' });
          }
        }
      } else {
        eventBus.$emit("copyToView", { data: item });
      }
      this.$refs.copyToView.doClose();
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },

    rotationChange(val) {
      eventBus.$emit("rotationChange", { data: val });
    },
    rotationChangeEnd(val) {
      eventBus.$emit("rotationChangeEnd", { data: val });
    },
    opacityChange(val) {
      eventBus.$emit("opacityChange", { data: val / 100 });
    },
    changeAlignType(data, type) {
      var historyName = "";
      switch (type) {
        case 1:
          this.form.alignType = data.value;
          historyName = "对齐图层";
          break;
        case 2:
          this.form.distribution = data.value;
          historyName =
            data.value == "horizontalcenter" ? "水平分布" : "垂直分布";
          break;
      }
      alignmentCanvas({ node: this.node, data });
      this.node.fire("click");
      eventBus.$emit("cloneStage");
      eventBus.$emit("addHistory", historyName, {
        nodeId: this.node.getAttrs().historyId,
      });
    },
    widthHeightKeepRatio() {
      this.iconlock = !this.iconlock;
      this.layer.find("Transformer").setAttrs({
        keepRatio: this.iconlock,
      });
    },
    changeWidth(data) {
      this.changeWidthHeight({
        data: data,
        iconlock: this.iconlock,
        type: "width",
      });
    },
    changeHeight(data) {
      this.changeWidthHeight({
        data: data,
        iconlock: this.iconlock,
        type: "height",
      });
    },
    changeWidthHeight({ data, iconlock, type }) {
      let node = this.curGalleryData.node;
      let scale = node.scale();
      // let imageData = node.getAttrs().imageData;
      // let imgRatio = imageData.size.width / imageData.size.height;
      let imgRatio =
        (node.width() * Math.abs(node.scaleX())) /
        (node.height() * Math.abs(node.scaleY()));
      if (type == "width") {
        node.scaleX(data / node.width());
        // node.width(data / Math.abs(scale.x));
        // node.offsetX(node.width() * Math.abs(node.scaleX()) / 2)
        if (iconlock) {
          node.scaleY(
            (node.width() * Math.abs(node.scaleX())) / imgRatio / node.height()
          );
          // node.height(node.width() / imgRatio);
          // node.offsetY(node.height() * Math.abs(node.scaleY()) / 2)
        }
      } else {
        node.scaleY(data / node.height());
        // node.height(data / Math.abs(scale.y));
        // node.offsetY(node.height() * Math.abs(node.scaleY()) / 2)
        if (iconlock) {
          node.scaleX(
            (node.height() * Math.abs(node.scaleY()) * imgRatio) / node.width()
          );
          // node.width(node.height() * imgRatio);
          // node.offsetX(node.width() * Math.abs(node.scaleX()) / 2)
        }
      }
      node.fire("click");
      if (iconlock) {
        // let curGalleryData = this.curGalleryData;
        this.curGalleryData.data.scaleWidth =
          node.width() * Math.abs(node.scaleX());
        this.curGalleryData.data.scaleHeight =
          node.height() * Math.abs(node.scaleY());
        this.$store.commit("gallery/changeCurGalleryData", this.curGalleryData);
      }
      eventBus.$emit("widthHeightChange", { data, iconlock, type });
    },
    changeOffsetX(data) {
      eventBus.$emit("OffsetXYChange", { data: data, type: "x" });
    },
    changeOffsetY(data) {
      eventBus.$emit("OffsetXYChange", { data: data, type: "y" });
    },
    handleUseAllChange(key) {
      this.form[key] = this.confirmCheck[key];
      // this.$confirm("此操作将应用所有面, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(() => {
      this.form[key] = !this.form[key];
      this.confirmCheck[key] = !this.confirmCheck[key];
      if (key == "useallview") {
        //图片
        eventBus.$emit("setBgImgClick", {
          data: this.form.useallview,
          type: "all",
        });
        this.form.setBg = true;
      } else {
        //颜色
        eventBus.$emit("setBgColorClick", {
          data: this.form.useall,
          type: "all",
          color: this.form.background_color,
        });
      }
      // })
      // .catch(() => {});
    },
    repeatChange(item) {
      //平铺
      if (this.repeatType != item.value) {
        this.showTitleWayPop = true;
        eventBus.$emit("repeatChange", { data: item });
      } else {
        this.showTitleWayPop = !this.showTitleWayPop;
      }
      if (item.value == "") {
        this.showTitleWayPop = false;
      }
      this.repeatType = item.value;
    },
    imgMaximization(item) {
      eventBus.$emit("imgMaximizationChange", { data: item });
    },
    mirrorFlip(type) {
      eventBus.$emit("mirrorFlip", { data: type });
    },
    rotate45(type) {
      let rotation = this.node.rotation()
      switch(type) {
        case 'left':
          rotation -= 45
          if(rotation < -180) {
            rotation = 180 + (rotation + 180)
          }
          break;
        case 'right':
          rotation += 45
          if(rotation > 180) {
            rotation = -180 + (rotation - 180)
          }
          break;
      }
      eventBus.$emit("rotationChange", { data: rotation });
      eventBus.$emit("rotationChangeEnd", { data: rotation });
    },
    setBgImgClick(type) {
      // if(type != 'all' && !this.form.setBg) {
      //   this.form.useallview = false
      // }
      // eventBus.$emit('setBgImgClick', {data: type == 'all' ? this.form.useallview : this.form.setBg, type: type})
      this.confirmCheck["useallview"] = false;
      if (!this.form.setBg) {
        this.form.useallview = false;
      }

      eventBus.$emit("setBgImgClick", { data: this.form.setBg, type: type });
    },
    // setBgColorConfirm(val) {
    //   if (val) {
    //     eventBus.$emit("addHistory", "设置背景色");
    //   }
    // },
    // setBgColorClick(type) {
    //   this.confirmCheck["useall"] = false;
    //   if (this.form.background_color == null) {
    //     this.form.useall = false;
    //   }

    //   eventBus.$emit("setBgColorClick", {
    //     data: this.form.background_color != null,
    //     type: type,
    //     color: this.form.background_color
    //   });
    // },
    // activeSetBgColorClick(value) {
    //   this.confirmCheck["useall"] = false;
    //   if (this.form.background_color == null) {
    //     this.form.useall = false;
    //   }
    //   eventBus.$emit("setBgColorClick", {
    //     data: value != null,
    //     type: "",
    //     color: value
    //   });
    // },
    copyNode(e) {
      eventBus.$emit("copyToView", {
        data: { id: this.node.getLayer().getAttrs().viewId },
      });
      // document.execCommand("copy");
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
  },
};
</script>


<style lang="scss" scoped>
.gallery-detail-box {
  // position: relative;
  // overflow: hidden;
  // height: 100%;
  // width: 100%;
  &>.inner-content{
    // width: 100%;
    // height: 100%;
    // overflow-x: hidden;
    // overflow-y: auto;
    padding-bottom: 40px;
  }
  /deep/.el-checkbox__label {
    padding-left: 8px !important;
  }
  .ajustment-pannel {
    position: absolute;
    left: 0;
    top: 0;
    background: #fff;
    width: 100%;
    height: 100%;
    z-index: 999;
    display: flex;
    flex-direction: column;
    .ajustment-pannel-title {
      flex: none;
      height: 50px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f0f5ff;
      .ajustment-pannel-title--left {
        display: flex;
        align-items: center;
        .title {
          margin: 0 6px;
          font-size: 14px;
          font-weight: 500;
          color: #000000;
        }
      }
    }
    .ajustment-pannel-cont {
      padding: 20px 26px;
      overflow-y: auto;
      .render-box {
        display: flex;
        flex-wrap: wrap;
        .rendItem {
          margin-right: 20px;
          margin-bottom: 20px;

          &:nth-child(5n) {
            margin-right: 0;
          }
          .rendItem-img {
            width: 80px;
            height: 80px;
            border-radius: 5px;
            border: 1px solid #f0f5ff;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            &.active {
              border: 2px solid #0453F3;
            }

            img {
              border-radius: 5px;
              max-width: 100%;
              max-height: 100%;
            }
          }
          .rendItem-name {
            text-align: center;
            margin-top: 10px;
            font-size: 14px;
            color: #37474f;
            line-height: 22px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 80px;
            &:hover {
              color: #0453F3;
            }
          }
        }
      }
      .color-ajustment-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .color-ajustment-item {
          width: 233px;
          height: 70px;
          padding: 10px;
          /deep/ .el-input__inner {
            height: 24px !important;
          }
          .item-desc {
            width: 100%;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .label {
              color: #37474f;
            }
          }
          .item-slide {
            width: 100%;
          }
        }
      }
      .path-box {
        display: flex;
        flex-wrap: wrap;
        .path-item {
          width: 80px;
          height: 80px;
          background: #f0f5ff;
          border-radius: 5px;
          margin-right: 20px;
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          border: 2px solid transparent;
          padding: 20px;
          &:nth-child(2n) {
            margin-right: 0;
          }
          // @media screen and (max-width: 1450px) {
          //   &:nth-child(2n) {
          //     margin-right: 0;
          //   }
          // }
          // @media screen and (min-width: 1450px) and (max-width: 9999px) {
          //   &:nth-child(5n) {
          //     margin-right: 0;
          //   }
          // }
          &.active {
            @include border(2px, solid, "font_color2");
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .icon-box32 {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }
  .icon-caret-more {
    position: relative;
    &:after {
      position: absolute;
      font-family: "iconfont" !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      right: 0;
      bottom: 0;
      content: "\e729";
    }
  }
  .label {
    font-size: 12px;
    line-height: 20px;
    font-weight: 400;
    @include font_color("font_color9");
  }
  .img-info {
    display: flex;

    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f0f5ff;

    .img-info--left {
      align-items: center;
      height: 50px;
      display: flex;
      flex-wrap: wrap;
      .imgName {
        min-width: 80px;
        // max-width: 200px;
         max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .imgSize {
        display: none;
      }
      // @media screen and (max-width: 1450px) {
      //   .imgSize {
      //     display: none;
      //   }
      //   .imgName {
      //     max-width: 120px;
      //   }
      // }
    }
    .img-info--right {
      color: #0453F3;
      .img-replace-tip-icon{
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        vertical-align: -2px;
        margin-left: 1px;
        &.blue{
          color: #0453F3;
        }
      }
    }
  }
  .operation-content {
    padding: 15px 20px;
    .operation-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // margin-bottom: 12px;
      .operation-item-title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 50px;
        color: #000;
      }
      .operation-item-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        height: 40px;
        background: rgba(0, 0, 0, 0.03);
        border-radius: 5px;
        position: relative;
        padding: 0 4px;
        
        .tileway-item {
          display: flex;
          flex-direction: column;
          .icon {
            height: 32px;
            width: 32px;
            // border: 1px solid rgba(0, 0, 0, 0.15);
            background: #FFFFFF;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            &.active {
              background: #E1EDFF;
              color: #0453F3;
            }
            &:hover {
              // border: 1px solid rgba(0, 0, 0, 0.45);
            }
          }
        }
        .item {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          &:hover {
            background: #E6E6E6;
          }
          &.active {
            // color: #0453F3;
            background: #F0F5FF;
          }
        }
        .tileway-pop {
          width: 100%;
          position: absolute;
          bottom: -92px;
          left: 0;
          z-index:99;
          background: #ffffff;
          box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
            0px 6px 16px 0px rgba(0, 0, 0, 0.08),
            0px 3px 6px -4px rgba(0, 0, 0, 0.12);
          border-radius: 5px;
        }
      }
    }
    .operation-item2 {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 40px;
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.03);
        border-radius: 5px;
        flex: 1;
        height: 100%;
        cursor: pointer;
        outline: none;
        &.checked {
          background: #F0F5FF;
          color: #0453F3;
        }
      }
    }
    &>div {
      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
  .item-box--suspend{
    width: 100%;
    // position: absolute;
    bottom: 0;
    z-index:10;
    padding: 0 20px;
    .opt-box {
      height: 40px;
      border-radius: 5px;
      width: 100%;
      align-items: center;
      justify-content: space-around;
      background: rgba(0, 0, 0, 0.03);
      .opt-item {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        &.active {
          background: #F0F5FF;
          color: #0453F3;
        }
        &:hover {
          background: #E6E6E6;
        }
      }
    }
  }
  // .item-box {
  //   &.item-box--suspend{
  //     width: 100%;
  //     position: absolute;
  //     bottom: 0;
  //     padding: 0 20px;
  //     z-index:10;
  //   }
  //   &.item-box--left {
  //     border-bottom: 1px solid #f0f5ff;
  //     border-right: 1px solid #f0f5ff;
  //     padding: 15px 15px 15px 20px;
  //   }
  //   &.item-box--right {
  //     border-bottom: 1px solid #f0f5ff;
  //     padding: 15px 20px 15px 20px;
  //   }
  //   .change-box {
  //     .el-input {
  //       width: 70px;
  //     }
  //     // .el-select {
  //     //   width: 70px;
  //     // }
  //     .symmetry {
  //       width: 38px;
  //       height: 32px;
  //       background: #ffffff;
  //       border-radius: 5px;
  //       border: 1px solid rgba(0, 0, 0, 0.15);
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //     }
  //   }
  //   .imgway-box {
  //     display: flex;
  //     align-items: center;
  //     // .imgway-item {
  //     //   width: 32px;
  //     //   height: 32px;
  //     //   display: flex;
  //     //   align-items: center;
  //     //   justify-content: center;
  //     //   border-radius: 5px;
  //     //   border: 1px solid rgba(0, 0, 0, 0.15);
  //     //   &:hover {
  //     //     border: 2px solid rgb(2, 167, 240);
  //     //   }
  //     // }
  //     .imgway-col {
  //       display: flex;
  //       flex-direction: column;
  //       align-items: center;
  //       .imgway-item {
  //         width: 38px;
  //         height: 32px;
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //         border-radius: 5px;
  //         border: 1px solid rgba(0, 0, 0, 0.15);
  //         &:hover {
  //           color: #fff;
  //           background: #0453F3;
  //           // border: 2px solid rgb(2, 167, 240);
  //         }
  //       }
  //       .imgway-name {
  //         color: rgba(0, 0, 0, 0.45);
  //       }
  //     }
  //   }
  //   .imgset-box{
  //     align-items: center;
  //   }

  //   .bg-box {
  //     align-items: center;
  //   }
  //   .opt-box {
  //     height: 36px;
  //     border-radius: 5px;
  //     width: 100%;
  //     @include background_color("background_color9");
  //     align-items: center;
  //     justify-content: space-around;
  //     .opt-item {
  //       width: 16px;
  //       height: 16px;
  //       &.active {
  //         color: #0453F3;
  //       }
  //       &:hover {
  //         color: #0453F3;
  //       }
  //     }
  //   }
  //   .decorate-box {
  //     .decorate-item {
  //       width: 50px;
  //       height: 50px;
  //       display: flex;
  //       flex-direction: column;
  //       align-items: center;
  //       justify-content: center;
  //       border-radius: 5px;
  //       @include background_color("background_color9");
  //       position: relative;
  //     }
  //   }
  //   .tileway-box {
  //     position: relative;
  //     .tileway-item {
  //       display: flex;
  //       flex-direction: column;
  //       .icon {
  //         height: 32px;
  //         width: 32px;
  //         border: 1px solid rgba(0, 0, 0, 0.15);
  //         border-radius: 5px;
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //         &.active {
  //           border: 2px solid rgb(2, 167, 240);
  //         }
  //         &:hover {
  //           border: 1px solid rgba(0, 0, 0, 0.45);
  //         }
  //       }
  //     }
  //     .tileway-pop {
  //       width: 100%;
  //       position: absolute;
  //       bottom: -92px;
  //       left: 0;
  //       z-index:99;
  //       background: #ffffff;
  //       box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
  //         0px 6px 16px 0px rgba(0, 0, 0, 0.08),
  //         0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  //       border-radius: 5px;
  //     }
  //   }
  // }
  // .align-box {
  //   ul.box {
  //     list-style: none;
  //     width: 145px;
  //     height: 98px;
  //     li {
  //       float: left;
  //       &:nth-child(1) {
  //         span {
  //           border-top-left-radius: 5px;
  //         }
  //       }
  //       &:nth-child(3) {
  //         span {
  //           border-top-right-radius: 5px;
  //         }
  //       }
  //       &:nth-child(7) {
  //         span {
  //           border-bottom-left-radius: 5px;
  //         }
  //       }
  //       &:nth-child(9) {
  //         span {
  //           border-bottom-right-radius: 5px;
  //         }
  //       }
  //       span {
  //         display: flex;
  //         align-items: center;
  //         justify-content: center;
  //         width: 44px;
  //         height: 34px;

  //         border: 1px solid rgba(0, 0, 0, 0.15);
  //         margin-left: -1px;
  //         margin-top: -1px;
  //         &:not(.zw-disabled) {
  //           cursor: pointer;
  //           &:hover {
  //             position: relative;
  //             border: 2px solid rgb(2, 167, 240);
  //             // border-color: rgba(9, 109, 217, 0.2);
  //             color: rgb(2, 167, 240);
  //             z-index: 100;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   .box:after {
  //     content: "";
  //     height: 0;
  //     visibility: hidden;
  //     clear: both;
  //     display: block;
  //   }

  //   .align-type {
  //     display: flex;
  //     width: 38px;
  //     height: 32px;
  //     align-items: center;
  //     justify-content: center;
  //     // background: #eef2f8;
  //     &:not(.zw-disabled) {
  //       &:hover {
  //         border: 2px solid rgb(2, 167, 240);
  //       }
  //     }

  //     border-radius: 4px;
  //     border: 1px solid #e0e5ea;
  //   }
  // }
}
.view-list-container {
  box-shadow: 0px 5px 12px 4px rgba(0, 0, 0, 0.09),
    0px 3px 6px 0px rgba(0, 0, 0, 0.12), 0px 1px 2px -2px rgba(0, 0, 0, 0.16);
  border-radius: 5px;
  padding: 10px 0;
  .view-item {
    text-align: center;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    &.active {
      // color: #1f96f8;
    }
    &:hover {
      background: #f0f5ff;
    }
  }
}
/deep/ .zw-message-pop {
  .dialog-content {
    padding-left: 26px;
    .switch-con {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      margin-bottom: 10px;
    }
    .tip {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 20px;
    }
  }
}
.img-replace-tip .tips-cont{
  .tit{
    display: flex;
    align-items: center;
    padding: 0 15px;
    line-height: 37px;
    border-bottom: 1px solid #f0f5ff;
  }
  .blue{
    color: rgb(2, 167, 240);
  }
  p{
    line-height: 22px;
    padding: 0 15px;
  }
}
.img-replace-tip-mask{
  position: fixed;
  top:0;
  left:0;
  bottom:0;
  right: 0;
  background: rgba(0,0,0,0.5);
  z-index:2000;
}
</style>
<style>
.zw-rest-prop.el-popover.img-replace-tip{
  white-space: nowrap;
  position: fixed !important;
  right: 5px !important;
  top: 95px !important;
  width: 320px !important;
  z-index:20001 !important;
}
</style>