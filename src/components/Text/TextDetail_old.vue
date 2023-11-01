<template>
  <div class="text-detail-box" ref="TextScrollBox">
    <div class="inner-content scroll-bar">
      <div class="img-info">
        <div class="img-info--left pl20">
          <span class="iconfont icontext"></span>
          <span class="f14 ml10 textName">文字图层.txt</span>
        </div>
        <div class="img-info--right pr20 flex flex-col-ct">
          <span @click="editText()">编辑文本</span>
          <span class="iconfont iconarrow-right-bold"></span>
        </div>
      </div>
      <!--新布局start-->
      <div class="operation-content">
        <div class="operation-item">
          <div class="operation-item-content">
            <zw-color-picker
              :showCustom="true"
              :class="['text-color', 'ml3', 'mr3', optLock?'zw-disabled':'']"
              v-model="form.fontStyle.textColor"
              @activeChange="activeTextColorChange"
              @change="textColorConfirm"
              @cancel="textColorChange"
            ></zw-color-picker>

            <el-select
              :style="{'width':'135px','font-family':form.fontStyle.fontFamily}"
              filterable
              :disabled="optLock"
              v-model="form.fontStyle.fontFamily"
            >
              <el-option
                :style="{'font-family':item.value}"
                :value="item.value"
                v-for="item of textFamilyOptions"
                :key="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
            <el-select
              :disabled="optLock"
              style="width:83px"
              filterable
              v-model="form.fontStyle.fontSize"
              @change="textSizeChange"
            >
              <el-option
                :value="item.value"
                v-for="item of textSizeOptions"
                :key="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="operation-item">
          <div class="operation-item-content">
            <template v-for="(item) in textStyleOptions">
              <template v-for="(selectItem) in item.selectList">
                <el-tooltip
                  :enterable="false"
                  class="item"
                  effect="dark"
                  :content="selectItem.tips+shortcutsTip(selectItem.shortType)"
                  placement="top"
                  :key="selectItem.value"
                >
                  <span
                    @click="CheckTextStyleItem(selectItem,item)"
                    :class="['selectItem', '', selectItem.checked?'active':'',selectItem.disabled?'zw-disabled':'']"
                  >
                    <span :class="[selectItem.icon,'icon',item.selectAlign?'rotate90':'']"></span>
                  </span>
                </el-tooltip>
              </template>
            </template>
          </div>
        </div>
        <div class="operation-item">
          <div class="operation-item-title">
            描边
          </div>
          <div class="operation-item-content" style="justify-content: flex-start">
            <zw-color-picker
              :showCustom="true"
              class="text-color"
              style="margin-right: 10px"
              v-model="form.fontStyle.stroke"
              :class="[optLock?'zw-disabled':'']"
              @activeChange="activeStrokeColorChange"
              @change="fillStrokeColorChangeConfirm"
              @cancel="fillStrokeColorChange"
            ></zw-color-picker>

            <zw-slide-input
              @click="popClose"
              ref="zwSlideInput-4"
              offset="bottom"
              offsetPx="-99px"
              showValueType="input"
              label="描边："
              popWidth="233px"
              :class="['mr10',optLock?'zw-disabled':'']"
              style="width:50px"
              :step="1"
              :max="20"
              :min="0"
              :defaultValue.sync="form.fontStyle.fontStrokeWidth"
              :vertical="false"
            ></zw-slide-input>
          </div>
        </div>
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
      <!-- <el-row>
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
                style="width:132px"
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
                :min="0"
                unit="Y"
                :defaultValue.sync="curGalleryDataRealTime.topLeftY"
                style="width:83px"
                :class="['mr17',optLock?'zw-disabled':'']"
                @changeValue="changeOffsetY"
              ></zw-unit-input>

              <zw-slide-input
                @click="popClose"
                ref="zwSlideInput-1"
                popWidth="226px"
                offset="bottom-right"
                showValueType="num"
                label="旋转"
                style="width:83px"
                :step="1"
                unit="°"
                :class="[optLock?'zw-disabled':'']"
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
                @click="iconlock=!iconlock"
              ></span>

              <zw-unit-input
                :step="1"
                unit="H"
                :min="20"
                :defaultValue.sync="curGalleryDataRealTime.scaleHeight"
                style="width:83px"
                :class="['mr17',optLock?'zw-disabled':'']"
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
                :content="'垂直翻转'+shortcutsTip('element6')"
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
      <el-row>
        <el-col class="item-box item-box--left col12 lastH" style="height:288px;padding-bottom:0" :span="12">
          <div class="flex flex-col-ct mb15 hide-llp">
            <span class="label">不透明度：</span>

            <zw-slide-input
              @click="popClose"
              ref="zwSlideInput-2"
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
            <span class="label mb18 mr5">文字适应：</span>
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
        </el-col>
        <el-col class="item-box item-box--right col12 lastH" style="height:288px;padding-bottom:0;" :span="12">
          <div class="label">文字选项：</div>
          <div class="flex flex-row-between mb8 textAttr-box">
            <zw-color-picker
              :showCustom="true"
              :class="['text-color', 'ml3', 'mr3', optLock?'zw-disabled':'']"
              v-model="form.fontStyle.textColor"
              @activeChange="activeTextColorChange"
              @change="textColorConfirm"
              @cancel="textColorChange"
            ></zw-color-picker>

            <el-select
              :style="{'width':'135px','font-family':form.fontStyle.fontFamily}"
              filterable
              :disabled="optLock"
              v-model="form.fontStyle.fontFamily"
            >
              <el-option
                :style="{'font-family':item.value}"
                :value="item.value"
                v-for="item of textFamilyOptions"
                :key="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
            <el-select
              :disabled="optLock"
              style="width:83px"
              filterable
              v-model="form.fontStyle.fontSize"
              @change="textSizeChange"
            >
              <el-option
                :value="item.value"
                v-for="item of textSizeOptions"
                :key="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </div>
          <div class="flex mb15 textStyle-box">
            <div
              :class="['flex','textStyle-item',item.hasCheck?'hasCheck':'',item.visible?'active':'',item.disabled||optLock?'zw-disabled':'']"
              style="margin-right: 10px"
              v-for="item in textStyleOptions"
              :key="item.value"
              @click="handlefontStyle(item)"
            >
              <el-popover
                v-if="item.showMore"
                :disabled="item.disabled||optLock"
                placement="bottom"
                title
                :width="item.popWidth"
                trigger="click"
                popper-class="zw-slide-prop"
                @hide="item.visible=false"
              >
                <div v-if="item.value=='1'||item.value=='2'" :class="['textStyle-selector']">
                  <template v-for="(selectItem,selectIndex) in item.selectList">
                    <el-tooltip
                      :enterable="false"
                      class="item"
                      effect="dark"
                      :content="selectItem.tips+shortcutsTip(selectItem.shortType)"
                      placement="top"
                      :key="selectItem.value"
                    >
                      <span
                        @click="CheckTextStyleItem(selectItem,item)"
                        :class="['selectItem',selectItem.checked?'active':'',selectItem.disabled?'zw-disabled':'']"
                      >
                        <span :class="[selectItem.icon,'icon',item.selectAlign?'rotate90':'']"></span>
                      </span>
                    </el-tooltip>
                    <span
                      :key="'line'+selectItem.value"
                      v-if="selectIndex!==item.lastIndex"
                      class="line"
                    ></span>
                  </template>
                </div>
                <div v-if="item.value=='4'||item.value=='5'||item.value=='6'">
                  <zw-slide
                    offset="bottom"
                    showValueType="input"
                    :label="item.label"
                    :step="item.step"
                    :max="item.max"
                    :min="item.min"
                    @activeChange="handleStyleChange($event,item)"
                    :defaultValue.sync="item.slideValue"
                    :vertical="false"
                  ></zw-slide>
                </div>
                <span
                  @click="item.visible=!item.visible"
                  slot="reference"
                  :class="['icon-box32 mb2',item.showMore?'icon-caret-more':'', 'iconfont',item.icon,'textAlign-icon',]"
                ></span>
              </el-popover>
              <span
                v-else
                @click="CheckTextStyleItem(null,item)"
                :class="['icon-box32 mb2',item.showMore?'icon-caret-more':'', 'iconfont',item.icon,'textAlign-icon']"
              ></span>
              <span class="f10 textStyle-item-label">{{item.label}}</span>
            </div>
          </div>
          <div class="flex flex-col-ct fontfill-box mb15 hide-llp">
            <span class="label">填充颜色：</span>
            <div class="flex flex-row-between flex-1 zw-disabled">
              <div class="flex fillcolor-box">
                <zw-color-picker
                  :showCustom="true"
                  :class="['text-color',optLock?'zw-disabled':'']"
                  v-model="form.fontStyle.fillColor"
                  @activeChange="activeFillColorChange"
                  @change="fillColorChangeConfirm"
                  @cancel="fillColorChange"
                ></zw-color-picker>

                <div>{{form.fontStyle.fillColor|formateColorText}}</div>
              </div>
            </div>
          </div>
          <div class="flex fontStyle-box mb15">
            <span class="label">文字描边：</span>
            <div class="flex flex-1">
              <zw-color-picker
                :showCustom="true"
                class="text-color"
                style="margin-right: 10px"
                v-model="form.fontStyle.stroke"
                :class="[optLock?'zw-disabled':'']"
                @activeChange="activeStrokeColorChange"
                @change="fillStrokeColorChangeConfirm"
                @cancel="fillStrokeColorChange"
              ></zw-color-picker>

              <zw-slide-input
                @click="popClose"
                ref="zwSlideInput-4"
                offset="bottom"
                offsetPx="-99px"
                showValueType="input"
                label="描边："
                popWidth="233px"
                :class="['mr10',optLock?'zw-disabled':'']"
                style="width:50px"
                :step="1"
                :max="20"
                :min="0"
                :defaultValue.sync="form.fontStyle.fontStrokeWidth"
                :vertical="false"
              ></zw-slide-input>
              <el-select
                style="width:83px;display: none"
                filterable
                v-model="form.fontStyle.border_style"
                :disabled="true"
              >
                <el-option
                  :value="item.value"
                  v-for="item of borderStyleOption"
                  :key="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="flex flex-col-ct pl60 fontShap-box hide-llp">
            <el-checkbox v-model="form.fontStyle.checkshape" :disabled="true">
              <span class="f12">字型</span>
            </el-checkbox>
            <div style="flex:1" class="mr10 ml10">
              <el-slider
                :disabled="!form.fontStyle.checkshape"
                tooltip-class="font-slide"
                v-model="form.fontStyle.shapeNum"
                :min="0"
                :max="20"
                :step="1"
                input-size="mini"
              ></el-slider>
            </div>

            <el-input
              :disabled="!form.fontStyle.checkshape"
              class="ml5 shapeNumInput"
              type="number"
              style="width:40px;height: 22px;"
              v-model.number="form.fontStyle.shapeNum"
              @input="handleInput($event)"
              @focus="handleFocus"
              @blur="handleBlur"
            ></el-input>
          </div>
        </el-col>
      </el-row>
      <div class="item-box" :class="{'item-box--suspend': !isEffectFixed && !isEffectMini}" style="padding:0 20px;">
        <div class="optBox-bg" ref="optBox" :style="optBoxStyle">
          <div class="flex opt-box">
            <el-popover
              placement="bottom"
              title="缩放图层"
              width="86"
              trigger="click"
              popper-class="zw-slide-prop"
            >
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
                @handlePreNext="handlePreNext"
                @activeChange="viewIndexActiveChange"
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
                  :class="['iconfont','iconview-layers','opt-item cp',optLock || !viewIndexMax?'zw-disabled':'']"
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
                :class="['iconfont','iconfile-add','opt-item cp',optLock?'zw-disabled':'']"
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
                  :class="['iconfont','iconfile-add-to','opt-item cp',optLock || viewIdList.length <= 1?'zw-disabled':'']"
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
  </div>
</template>

<script>
import eventBus from "@/utils/eventBus.js";
import CProgress from "@/components/common/Slideprogress";
import ZwSelect from "@/components/common/ZwSelect";
import ZwSlideInput from "@/components/common/ZwSlideInput";
import ZwUnitInput from "@/components/common/ZwUnitInput";
import ZwSlidepop from "@/components/common/ZwSlidepop";
import ZwSlide from "@/components/common/ZwSlide";
import ZwColorPicker from "@/components/common/ZwColorPicker";
import Color from "@/utils/color";
import { _getFontFamily } from "@/apis/text.js";
import { alignmentCanvas } from "@/utils/designer.js";
import {checkPlatform} from '@/utils/utils';
export default {
  name: "TextDetail",
  props: {},
  components: {
    CProgress,
    ZwSelect,
    ZwSlideInput,
    ZwUnitInput,
    ZwSlidepop,
    ZwColorPicker,
    ZwSlide,
  },
  data() {
    const defaultForm = {};
    return {
      firstAddText: true,
      curViewIndex: 0,
      curViewSize: 0,
      viewIndexMax: 0,
      viewIndexMin: 0,
      // optLock: false,
      defaultForm: defaultForm,
      addRemoveNode: false,
      iconlock: true,
      styleIndex: 0,
      // confirmCheck: {
      //   useall: false,
      // },
      optBoxStyle: {},
      scrollBox: null,
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],
      form: {
        alignType: "",
        alignType2: "1",
        width: "",
        height: "",
        offsetX: "",
        offsetY: "",
        angle: 0,
        opcity: 0,
        indexType: "1",
        imgWay: "",
        background_color: "",
        setBg: false,
        useallview: false,
        // useall: false,
        content: "",
        fontStyle: {
          fill: "",
          fillColor: "#FFFFFF",
          fillOpcity: 0,
          stroke: "",
          fontsize: 24,
          border_style: "dash",
          fontStrokeWidth: 0,
          checkshape: false,
          shapeNum: 0,
          fontFamily: "Academic M54",
          textColor: "",
        },
        fontWeight: "",
        textAnchor: "",
        x: "0",
        y: "0",
      },
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
      textSizeOptions: [
        {
          label: "12",
          value: 12,
        },
        {
          label: "14",
          value: 14,
        },
        {
          label: "16",
          value: 16,
        },
        {
          label: "18",
          value: 18,
        },
        {
          label: "20",
          value: 20,
        },
        {
          label: "22",
          value: 22,
        },
        {
          label: "24",
          value: 24,
        },
        {
          label: "26",
          value: 26,
        },
        {
          label: "28",
          value: 28,
        },
        {
          label: "36",
          value: 36,
        },
        {
          label: "48",
          value: 48,
        },
        {
          label: "56",
          value: 56,
        },
        {
          label: "72",
          value: 72,
        },
        {
          label: "86",
          value: 86,
        },
        {
          label: "100",
          value: 100,
        },
      ],
      textBorderSizeOptions: [
        {
          label: "12",
          value: "12px",
        },
        {
          label: "16",
          value: "16px",
        },
        {
          label: "18",
          value: "18px",
        },
        {
          label: "20",
          value: "20px",
        },
      ],
      // textFamilyOptions: [],
      textStyleOptions: [
        {
          label: "样式",
          value: "1",
          icon: "iconfont-size",
          showMore: true,
          visible: false, //点击按钮
          hasCheck: false, //有选中的选项
          disabled: false,
          popWidth: 233,
          lastIndex: 3,
          selectList: [
            {
              tips: "加粗",
              checked: false,
              value: "bold",
              icon: "iconfont iconfont-size1",
              shortType: "text1",
              disabled: false,
            },
            {
              tips: "斜体",
              checked: false,
              value: "italic",
              icon: "iconfont iconfont-slanted",
              shortType: "text2",
              disabled: false,
            },
            // {
            //   tips: "下划线",
            //   checked: false,
            //   value: "underline",
            //   icon: "iconfont iconfont-underscore",
            //   shortType: "text3",
            //   disabled: true,
            // },
            // {
            //   tips: "删除线",
            //   checked: false,
            //   value: "line-through",
            //   icon: "iconfont iconfont-strikethrough",
            //   shortType: "text4",
            //   disabled: true,
            // },
          ],
        },
        {
          label: "对齐",
          value: "2",
          icon: "iconalign-left",
          showMore: true,
          visible: false,
          hasCheck: false, //有选中的选项
          disabled: false,
          popWidth: 233,
          selectAlign: false,
          lastIndex: 3,
          selectList: [
            {
              tips: "左对齐",
              tips2: "上对齐",
              checked: false,
              value: "left",
              icon: "iconfont iconalign-left1",
              shortType: "text5",
            },
            {
              tips: "居中对齐",
              tips2: "垂直居中",
              checked: false,
              value: "center",
              icon: "iconfont iconalign-center",
              shortType: "text6",
            },
            {
              tips: "右对齐",
              tips2: "下对齐",
              checked: false,
              value: "right",
              icon: "iconfont iconalign-right",
              shortType: "text7",
            },
            {
              tips: "两端对齐",
              tips2: "两端对齐",
              checked: false,
              value: "justify",
              icon: "iconfont iconalign-both",
              shortType: "text8",
            },
          ],
        },
        // {
        //   label: "方向",
        //   value: "3",
        //   icon: "iconfont-vertical",
        //   showMore: false,
        //   hasCheck: false, //有选中的选项
        //   visible: false,
        //   popWidth: 233,
        //   disabled: true,
        // },
        // {
        //   label: "间距",
        //   value: "4",
        //   icon: "iconfont-column-width",
        //   showMore: true,
        //   visible: false,
        //   hasCheck: false, //有选中的选项
        //   popWidth: 233,
        //   slideValue: 20,
        //   label: "间距",
        //   step: 1,
        //   min: 0,
        //   max: 50,
        //   disabled: true,
        // },
        // {
        //   label: "行高",
        //   value: "5",
        //   icon: "iconfont-column-height",
        //   showMore: true,
        //   visible: false,
        //   hasCheck: false, //有选中的选项
        //   popWidth: 233,
        //   slideValue: 1,
        //   step: 0.1,
        //   label: "行高",
        //   min: 1,
        //   max: 3,
        //   disabled: true,
        // },
        // {
        //   label: "弯曲",
        //   value: "6",
        //   icon: "iconfont-column-skip",
        //   showMore: true,
        //   visible: false,
        //   hasCheck: false, //有选中的选项
        //   popWidth: 233,
        //   slideValue: 0,
        //   label: "弯曲",
        //   step: 1,
        //   min: -180,
        //   max: 180,
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
        },
        {
          label: "复制",
          value: "3",
          icon: "iconfile-add",
        },
        {
          label: "复制至其他印刷面",
          value: "4",
          icon: "iconfile-add-to",
        },
        {
          label: "锁定",
          value: "5",
          icon: "iconlock",
        },
        {
          label: "删除",
          value: "6",
          icon: "icondelete",
        },
      ],
      borderStyleOption: [
        {
          label: "无",
          value: "",
        },
        {
          label: "——",
          value: "solid",
        },
        {
          label: "-----",
          value: "dash",
        },
        {
          label: "......",
          value: "dotted",
        },
      ],
      layer: null,
      node: null,
      groupNode: null,
      groupIndexDisable: false, //背景图层级不可用
      isNodeChange: false,
    };
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
    curGalleryDataRealTime() {
      return this.$store.state.gallery.curGalleryDataRealTime;
    },
    curGalleryData() {
      // this.addRemoveNode = false;
      let curGalleryData = this.$store.state.gallery.curGalleryData;
      this.isNodeChange = false;
      if (
        curGalleryData.node &&
        curGalleryData.node.hasName("designText") &&
        !curGalleryData.node.hasName("isBg") &&
        !curGalleryData.node.hasName("bgRect")
      ) {
        this.groupIndexDisable = false;
        this.node = curGalleryData.node;
        this.layer = this.node.getLayer();
        // this.setTextMess();
        if (this.layer) {
          this.groupNode = curGalleryData.node;
          let designList = this.layer.find(".design").filter((item) => {
            return !item.hasName("bgRect") && !item.hasName("isBg");
          });
          this.viewIndexMax = designList.length - 1;
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
    customShortcutsMap() {
      return this.$store.state.shortcut.customShortcutsMap;
    },
    textFamilyOptions() {
      return this.$store.state.layout.textFamilyOptions || [];
    },
  },
  filters: {
    formateColorText(val) {
      if (!val) return "";
      const color = new Color({
        enableAlpha: false,
        format: "hex",
      });

      color.fromString(val);

      if (color.value == "#FF0000") {
        return val;
      } else {
        return color.value;
      }
    },
  },
  watch: {
    // view_id: function(val) {
    //   if (this.galleryData[val]) {
    //     this.form = this.galleryData[val];
    //   } else {
    //     this.form = this.defaultForm;
    //   }
    // },
    "curGalleryData.node._id": {
      handler: function (nv, ov) {
        this.addRemoveNode = true;
        if (nv && !this.groupIndexDisable && this.groupNode) {
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
          if (this.firstAddText) {
            this.form.fontStyle.fontStrokeWidth = 0;
            this.isNodeChange = false;
          } else {
            this.isNodeChange = true;
          }

          this.setTextMess();
          setTimeout(() => {
            this.firstAddText = false;
          }, 0);
        }
      },
      immediate: true,
    },
    "form.fontStyle.fontSize": {
      handler(nv) {
        if (nv < 48) {
          this.textStyleOptions[3].max = 50;
          this.textStyleOptions[3].min = -nv;
        } else {
          this.textStyleOptions[3].max = nv;
          this.textStyleOptions[3].min = -nv;
        }
      },
    },
    viewIndexMax(nv, ov) {
      this.addRemoveNode = true;
      let curViewIndex = this.groupNode.getZIndex();
      if (this.layer.findOne(".isBg")) curViewIndex -= 1;
      if (this.layer.findOne(".bgRect")) curViewIndex -= 1;
      this.curViewIndex = curViewIndex;
    },
    "form.fontStyle.stroke": {
      handler(nv) {
        let text = this.node.findOne("Text");
        let layer = this.node.getLayer();
        let stage = this.node.getStage();
        text.stroke(nv);
        layer.batchDraw();
        if (!this.isNodeChange) {
          eventBus.$emit("cloneStage");
        }
      },
    },
    "form.fontStyle.fontStrokeWidth": {
      handler(nv) {
        if (!this.node) return;
        let text = this.node.findOne("Text");
        let layer = this.node.getLayer();
        let stage = this.node.getStage();
        // let fontRatio =
        //   1 /
        //   (100 /
        //     ((text.fontSize() * layer.scaleX()) / (stage.width() / 547.2)));
        // text.stroke(this.form.fontStyle.stroke);
        // text.strokeWidth(
        //   (fontRatio * nv * (stage.width() / 547.2)) / layer.scaleX()
        // );
        let fontRatio = 1 / (100 / text.fontSize());
        text.stroke(this.form.fontStyle.stroke);
        text.strokeWidth(fontRatio * nv);
        // this.$set(this.node, 'strokeWidth', text.strokeWidth())
        this.$set(this.node, "strokeValue", nv);
        layer.batchDraw();
        if (!this.isNodeChange) {
          eventBus.$emit("cloneStage");
          if (!this.firstAddText) {
            eventBus.$emit("addHistory", "文字描边", {
              nodeId: this.node.getAttrs().historyId,
            });
          }
        }
      },
      deep: true,
      immediate: true,
    },
    "form.fontStyle.border_style": {
      handler(nv) {
        let rect = this.node.findOne("Rect");
        let layer = this.node.getLayer();
        let stage = this.node.getStage();
        rect.stroke("black");
        if (nv == "") {
          rect.strokeWidth(0);
        } else {
          rect.strokeWidth(1);
          if (nv == "dash") {
            rect.dash([6, 2]);
          } else if (nv == "dotted") {
            rect.dash([2, 2]);
          } else {
            rect.dash([0, 0]);
          }
        }
        layer.batchDraw();
        if (!this.isNodeChange) {
          eventBus.$emit("cloneStage");
        }
      },
    },
    "form.fontStyle.shapeNum": {
      handler(nv) {
        let text = this.node.findOne("Text");
        let rect = this.node.findOne("Rect");
        let layer = this.node.getLayer();
        let stage = this.node.getStage();
        if (text.getAttrs().isVertical) {
          text.width(text.width() - text.padding() * 2 + nv * 2);
        }
        text.padding(nv);
        // this.node.width(text.width() * text.scaleX());
        // this.node.height(text.height() * text.scaleY());
        // this.node.width(300);
        // this.node.height(50);
        // this.node.offsetX(this.node.width() / 2);
        // this.node.offsetY(this.node.height() / 2);
        rect.width(this.node.width());
        rect.height(this.node.height());
        this.node.fire("click");
        layer.batchDraw();
        if (!this.isNodeChange) {
          eventBus.$emit("cloneStage");
        }
      },
    },
    "form.fontStyle.fontFamily": {
      handler(nv) {
        let text = this.node.findOne("Text");
        let rect = this.node.findOne("Rect");
        let layer = this.node.getLayer();
        text.fontFamily(nv);
        this.node.width(text.width() * text.scaleX());
        this.node.height(text.height() * text.scaleY());
        this.node.offsetX(this.node.width() / 2);
        this.node.offsetY(this.node.height() / 2);
        rect.width(this.node.width());
        rect.height(this.node.height());
        this.node.fire("click");
        layer.batchDraw();
        if (!this.isNodeChange) {
          eventBus.$emit("cloneStage");
          if (!this.firstAddText) {
            eventBus.$emit("addHistory", "文字工具", {
              nodeId: this.node.getAttrs().historyId,
            });
          }
        }
      },
    },
    iconlock(nv) {
      this.$store.commit("layout/changeTextKeepRatioLock", nv);
    },
  },
  created() {
    // this.getFontFamily();
  },

  mounted() {
    // this.scrollBoxListener();
    // window.addEventListener("resize", this.handlescroll);
    // console.log('mounted')
    eventBus.$on("addText", () => {
      //  console.log('addText')
      this.firstAddText = true;
    });
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
      } else {
        this.form.useallview = false;
      }
      // }
    });
    // eventBus.$on("changeSelectView", (data) => {
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
    eventBus.$on("changeTextZIndex", (position) => {
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
    eventBus.$on("changeTextScale", (type) => {
      this.scalePreNext(type);
    });
    eventBus.$on("textAlign", (position) => {
      this.changeAlignType({ value: position }, 1);
    });
    eventBus.$on("textMirrorFlip", (type) => {
      // console.log("文字翻转。。。。。。。。");
      this.mirrorFlip(type);
    });
  },
  beforeDestroy() {
    // window.removeEventListener("resize", this.handlescroll);
  },
  methods: {
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
      // this.$refs.tooltip.forEach(item => {
      //   item.handleClosePopper();
      // });
      // this.$refs.tooltip && this.$refs.tooltip.handleClosePopper();
    },
    scrollBoxListener() {
      let _this = this;
      this.scrollBox = this.$refs["TextScrollBox"];
      this.scrollBox.onscroll = () => {
        _this.handlescroll();
      };
    },
    handlescroll() {
      // console.log("handlescroll");
      let w = document.documentElement.clientWidth || document.body.clientWidth; //兼容IE8
      if (w > 1450) {
        this.optBoxStyle = {};
      } else {
        let scrollBox = this.scrollBox;
        let scrollBoxH = scrollBox.offsetHeight;
        let scrollTop = scrollBox.scrollTop;
        if (scrollBoxH + scrollTop < 500) {
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
            "z-index": 999,
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
    editText() {
      eventBus.$emit("editText");
    },
    setTextMess() {
      if (!this.node.findOne("Text")) return;
      let text = this.node.findOne("Text");
      let stage = this.node.getStage();
      let layer = this.node.getLayer();
      this.form.fontStyle.textColor = text.fill();
      this.form.fontStyle.fontFamily = text.fontFamily();

      // this.form.fontStyle.fontSize = this.node.canvasFontSize ? this.node.canvasFontSize : text.fontSize() / (stage.width() / 547.2)
      this.form.fontStyle.textColor = text.attrs.fill;
      if (this.firstAddText) {
        this.activeTextColorChange(text.attrs.fill);
      }

      // this.form.fontStyle.fontSize = Math.ceil(
      //   (text.fontSize() * layer.scaleX()) / (stage.width() / 547.2)
      // );

      this.form.fontStyle.fontSize = text.fontSize();

      this.form.fontStyle.fontStrokeWidth = this.node.strokeValue;
      this.form.fontStyle.stroke = text.stroke() ? text.stroke() : "";
      let fontStyle = text.fontStyle();
      let textDecoration = text.textDecoration();
      let align = text.align();
      for (let op of this.textStyleOptions[0].selectList) {
        //样式
        op.checked = false;
        for (let item of fontStyle.split(" ")) {
          if (op.value == item) {
            op.checked = true;
          }
        }
        for (let item of textDecoration.split(" ")) {
          if (op.value == item) {
            op.checked = true;
          }
        }
      }
      for (let op of this.textStyleOptions[1].selectList) {
        //对齐
        op.checked = false;
        for (let item of align.split(" ")) {
          if (op.value == item) {
            op.checked = true;
          }
        }
      }
    },
    handleInput(val) {
      if (!val) {
        this.form.fontStyle.shapeNum = 0;
      } else {
        if (val < 0) {
          this.form.fontStyle.shapeNum = 0;
        } else if (val > 20) {
          this.form.fontStyle.shapeNum = 20;
        }
      }
    },
    //接口获取字体数据（旧）//新设计器本地写死
    getFontFamily() {
      _getFontFamily().then((res) => {
        let data = Object.values(res.data);
        let fontFaceStr = "";
        let fontFamilyList = [];

        data.forEach((el, i) => {
          let obj = {
            hasNormalFontType: "",
            hasBoldFontType: "",
            hasItalicFontType: "",
            hasBoldAndItalicFontType: "",
          };
          let fontFamilieId = el.id;
          // let { id, fonts, lang, name, weight } = el;
          obj.id = fontFamilieId;
          obj.label = el.name;
          el.fonts.forEach((font) => {
            let { id, name, style, ttf, weight, woff } = font;
            let fontName =
              name + "_" + fontFamilieId + "_" + id + "_" + font.name;
            if (style == "normal" && weight == "normal") {
              obj.hasNormalFontType = fontName;
            } else if (style == "normal" && weight == "bold") {
              obj.hasBoldFontType = fontName;
            } else if (style == "italic" && weight == "normal") {
              obj.hasItalicFontType = fontName;
            } else if (style == "italic" && weight == "bold") {
              obj.hasBoldAndItalicFontType = fontName;
            }
            obj.value = fontName;

            let src = "";
            if (ttf && woff) {
              src =
                'url("' +
                woff +
                '") format("woff"),' +
                'url("' +
                ttf +
                '") format("truetype")';
            } else if (ttf && !woff) {
              src = 'url("' + ttf + '") format("truetype")';
            } else if (!ttf && woff) {
              src = 'url("' + woff + '") format("woff")';
            }

            fontFaceStr +=
              "@font-face {" +
              'font-family: "' +
              fontName +
              '";' +
              "src:" +
              src +
              ";" +
              "font-weight:" +
              weight +
              ";" +
              "font-style:" +
              style +
              ";" +
              "}\n";
          });
          fontFamilyList.push(obj);
        });

        let nod = document.createElement("style");
        nod.innerHTML = fontFaceStr;
        document.getElementsByTagName("head")[0].appendChild(nod);
        this.textFamilyOptions = fontFamilyList;
      });
    },
    popClose() {
      for (const key in this.$refs) {
        if (key.indexOf("zwSlideInput-") !== -1) {
          this.$refs[key].doClose();
        }
      }
    },
    // 文字 行高 字间距 弯曲度
    handleStyleChange(e, item) {
      if (this.node) {
        let text = this.node.findOne("Text");
        let layer = this.node.getLayer();
        // text.width(text.width())
        switch (item.value) {
          case "4":
            let textArr = text.text().split("\n");
            textArr.sort((a, b) => {
              return a.length - b.length < 0;
            });
            if (e >= 0) {
              // text.letterSpacing((text.width() - Math.abs(textArr[0].length - 1 * e)) / textArr[0].length)
              text.letterSpacing(e);
            } else {
              let step =
                (text.width() + textArr[0].length - 1 * e) /
                textArr[0].length /
                this.textStyleOptions[3].min;
              text.letterSpacing(e * Math.abs(step));
            }
            this.node.setAttrs({ letterSpacing: text.letterSpacing() });
            break;
          case "5":
            text.lineHeight(e);
            break;
        }
        this.node.width(text.width() * text.scaleX());
        this.node.height(text.height() * text.scaleY());
        this.node.offsetX(text.width() / 2);
        this.node.offsetY(text.height() / 2);
        this.node.findOne("Rect").width(text.width());
        this.node.findOne("Rect").height(text.height());
        this.node.fire("click");
        layer.batchDraw();
        if (!this.firstAddText) {
          eventBus.$emit("addHistory", "文字工具", {
            nodeId: this.node.getAttrs().historyId,
          });
        }
      }
    },
    //文字描边颜色
    activeStrokeColorChange(val) {
      let text = this.node.findOne("Text");
      let layer = this.node.getLayer();
      let stage = this.node.getStage();
      text.stroke(val);
      layer.batchDraw();
      eventBus.$emit("cloneStage");
    },
    fillStrokeColorChange() {
      let text = this.node.findOne("Text");
      let layer = this.node.getLayer();
      let stage = this.node.getStage();
      text.stroke(this.form.fontStyle.stroke);
      layer.batchDraw();
      eventBus.$emit("cloneStage");
    },
    fillStrokeColorChangeConfirm(val) {
      eventBus.$emit("addHistory", "文字描边", {
        nodeId: this.node.getAttrs().historyId,
      });
    },
    //文字填充颜色
    activeFillColorChange(val) {
      let rect = this.node.find("Rect");
      rect.fill(val);
      this.node.getLayer().batchDraw();
    },
    fillColorChange() {
      let rect = this.node.find("Rect");
      rect.fill(this.form.fontStyle.fillColor);
      this.node.getLayer().batchDraw();
    },
    fillColorChangeConfirm(val) {
      eventBus.$emit("addHistory", "填充颜色", {
        nodeId: this.node.getAttrs().historyId,
      });
    },
    //文字颜色
    activeTextColorChange(val) {
      let text = this.node.find("Text");
      text.fill(val);
      this.node.getLayer().batchDraw();
      eventBus.$emit("cloneStage");
    },
    textColorConfirm(val) {
      eventBus.$emit("addHistory", "文字工具", {
        nodeId: this.node.getAttrs().historyId,
      });
    },
    //文字颜色 取消重置
    textColorChange() {
      let text = this.node.find("Text");
      text.fill(this.form.fontStyle.textColor);
      this.node.getLayer().batchDraw();
      eventBus.$emit("cloneStage");
    },
    textSizeChange(val) {
      let stage = this.node.getStage();
      let layer = this.node.getLayer();
      let text = this.node.findOne("Text");
      // text.fontSize((val * (stage.width() / 547.2)) / layer.scaleX());
      // let fontRatio =
      //   1 /
      //   (100 / ((text.fontSize() * layer.scaleX()) / (stage.width() / 547.2)));
      // text.strokeWidth(
      //   (fontRatio * this.node.strokeValue * (stage.width() / 547.2)) /
      //     layer.scaleX()
      // );
      text.fontSize(val);
      let fontRatio = 1 / (100 / text.fontSize());
      text.strokeWidth(fontRatio * this.node.strokeValue);
      this.node.width(text.width());
      this.node.height(text.height());
      this.node.offsetX(text.width() / 2);
      this.node.offsetY(text.height() / 2);
      this.node.findOne("Rect").width(text.width());
      this.node.findOne("Rect").height(text.height());
      this.node.fire("click");
      layer.batchDraw();
      eventBus.$emit("cloneStage");
      eventBus.$emit("addHistory", "文字工具", {
        nodeId: this.node.getAttrs().historyId,
      });
    },
    //文字样式选择
    CheckTextStyleItem(selectItem, item) {
      let text = this.node.findOne("Text");
      let layer = this.node.getLayer();
      switch (item.value) {
        case "1":
          selectItem.checked = !selectItem.checked;
          let hasCheck = false;
          let checkedArr = [];
          item.selectList.forEach((e) => {
            if (e.checked) {
              checkedArr.push(e.value);
              hasCheck = true;
            }
          });
          item.hasCheck = hasCheck;
          switch (selectItem.value) {
            case "bold":
              if (checkedArr.indexOf("italic") != -1) {
                if (selectItem.checked) {
                  text.fontStyle("bold italic");
                } else {
                  text.fontStyle("italic");
                }
              } else {
                if (selectItem.checked) {
                  text.fontStyle("bold");
                } else {
                  text.fontStyle("");
                }
              }
              break;
            case "italic":
              if (checkedArr.indexOf("bold") != -1) {
                if (selectItem.checked) {
                  text.fontStyle("bold italic");
                } else {
                  text.fontStyle("bold");
                }
              } else {
                if (selectItem.checked) {
                  text.fontStyle("italic");
                } else {
                  text.fontStyle("");
                }
              }
              break;
            case "underline":
              if (checkedArr.indexOf("line-through") != -1) {
                if (selectItem.checked) {
                  text.textDecoration("underline line-through");
                } else {
                  text.textDecoration("line-through");
                }
              } else {
                if (selectItem.checked) {
                  text.textDecoration("underline");
                } else {
                  text.textDecoration("");
                }
              }
              break;
            case "line-through":
              if (checkedArr.indexOf("underline") != -1) {
                if (selectItem.checked) {
                  text.textDecoration("underline line-through");
                } else {
                  text.textDecoration("underline");
                }
              } else {
                if (selectItem.checked) {
                  text.textDecoration("line-through");
                } else {
                  text.textDecoration("");
                }
              }
              break;
          }
          eventBus.$emit("addHistory", "文字工具", {
            nodeId: this.node.getAttrs().historyId,
          });
          break;
        case "2":
          item.selectList.forEach((e) => {
            e.checked = false;
          });
          selectItem.checked = !selectItem.checked;
          item.hasCheck = true;
          switch (selectItem.value) {
            case "left":
              text.align("left");
              break;
            case "center":
              text.align("center");
              break;
            case "right":
              text.align("right");
              break;
            case "justify":
              text.align("justify");
              break;
          }
          eventBus.$emit("addHistory", "文字对齐", {
            nodeId: this.node.getAttrs().historyId,
          });
          break;
        case "3":
          item.hasCheck = !item.hasCheck;
          this.textStyleOptions[1].selectAlign = item.hasCheck;
          text.setAttrs({ isVertical: item.hasCheck });
          let textArr = text.text().split("\n");
          textArr.sort((a, b) => {
            return a.length - b.length < 0;
          });
          // let textWidth =
          //   (text.width() +
          //     textArr[0].length -
          //     1 * text.letterSpacing() -
          //     text.padding() * 2) /
          //   textArr[0].length;
          let textWidth = text.fontSize();
          if (item.hasCheck) {
            text.width(textWidth + text.padding() * 2);
            text.letterSpacing(100);
          } else {
            text.width("auto");
            text.letterSpacing(this.node.getAttrs().letterSpacing);
          }
          // text.height(100)
          // text.height(this.node.height() * this.node.scaleY() * text.text().length)
          this.node.width(text.width());
          this.node.height(text.height());
          this.node.offsetX(text.width() / 2);
          this.node.offsetY(text.height() / 2);
          this.node.findOne("Rect").width(text.width());
          this.node.findOne("Rect").height(text.height());
          this.node.fire("click");
          this.node.getLayer().batchDraw();
          break;
        case "4":
          break;
        case "5":
          break;
        case "6":
          break;
      }
      layer.batchDraw();
      eventBus.$emit("cloneStage");
    },
    //切换图层
    changeViewIndex(val) {
      let layer = this.node.getLayer();
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
    imgMaximization(item) {
      eventBus.$emit("textMaximizationChange", { data: item });
    },
    mirrorFlip(type) {
      if (type == "leftRightMirror") {
        this.node.to({
          scaleX: -this.node.scaleX(),
          duration: 0,
          onFinish: () => {
            eventBus.$emit("addHistory", "图层变换", {
              nodeId: this.node.getAttrs().historyId,
            });
          },
        });
      } else {
        this.node.to({
          scaleY: -this.node.scaleY(),
          duration: 0,
          onFinish: () => {
            eventBus.$emit("addHistory", "图层变换", {
              nodeId: this.node.getAttrs().historyId,
            });
          },
        });
      }
      setTimeout(() => {
        eventBus.$emit("cloneStage");
      }, 200);
      // eventBus.$emit("mirrorFlip", { data: type });
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
    // changeImagWay(item) {
    //   this.form.imgWay = item.value;
    // },
    rotationChange(val) {
      eventBus.$emit("rotationChange", { data: val });
    },
    rotationChangeEnd(val) {
      eventBus.$emit("rotationChangeEnd", { data: val });
    },
    opacityChange(val) {
      eventBus.$emit("opacityChange", { data: val / 100 });
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
    handleTextOpt() {},
    //修改文字样式 样式 对齐 间距 行高 弯曲
    handlefontStyle(item) {
      this.styleIndex = item.value;
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
    //     color: this.form.background_color,
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
    //     color: value,
    //   });
    // },

    // handleUseAllChange(key) {
    //   this.form[key] = this.confirmCheck[key];
    //   this.$confirm("此操作将应用所有面, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.form[key] = !this.form[key];
    //       this.confirmCheck[key] = !this.confirmCheck[key];
    //       if (key == "useallview") {
    //         //图片
    //         eventBus.$emit("setBgImgClick", {
    //           data: this.form.useallview,
    //           type: "all",
    //         });
    //       } else {
    //         //颜色
    //         eventBus.$emit("setBgColorClick", {
    //           data: this.form.useall,
    //           type: "all",
    //           color: this.form.background_color,
    //         });
    //       }
    //     })
    //     .catch(() => {});
    // },
    onPercentChange(val) {
      this.form.fontStyle.shapeNum = Math.floor(val / 5);
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
      eventBus.$emit("cloneStage");
      this.node.fire("click");
      eventBus.$emit("addHistory", historyName, {
        nodeId: this.node.getAttrs().historyId,
      });
    },
    handleFocus(e) {
      this.$store.commit("shortcut/updateFocusStatus", true);
    },
    handleBlur() {
      this.$store.commit("shortcut/updateFocusStatus", false);
    },
    copyNode(e) {
      // this.fireKeyEvent(input元素, 'keydown', 13);
      // e.dataTransfer.setData('text / html','Hello，world！')
      // window.clipboardData.setData('text / html','Hello，world！')
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
.text-detail-box {
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
  /deep/ .el-slider__button {
    width: 12px;
    height: 12px;
  }
  .icon-box32 {
    width: 38px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    &:hover {
      border: 1px solid rgba(0, 0, 0, 0.45);
    }
    &::before {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
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
    height: 50px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f0f5ff;
    .img-info--right {
      color: #1f96f8;
    }
    .img-info--left {
      // @media screen and (max-width: 1450px) {
      .textSize {
        display: none;
      }
      .textName {
        max-width: 120px;
      }
      // }
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
        .item {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          outline: none;
          &:hover {
            background: #E6E6E6;
          }
          &.active {
            background: #E1EDFF;
            color: #0453F3;
          }
        }
        .selectItem {
          // display: flex;
          // justify-content: center;
          // align-items: center;
          // width: 24px;
          // height: 24px;
          // border-radius: 5px;
          // cursor: pointer;
          // &.active {
          //   background: #E6E6E6;
          //   // color: #0453F3;
          // }
          .icon {
            font-size: 12px;
            line-height: 16px;
            text-align: center;
            width: 16px;
            height: 16px;
            &.rotate90 {
              transform: rotate(90deg);
              -ms-transform: rotate(90deg); /* Internet Explorer */
              -moz-transform: rotate(90deg); /* Firefox */
              -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
              -o-transform: rotate(90deg); /* Opera */
            }
          }
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
  //     .el-select {
  //       width: 70px;
  //     }
  //     .symmetry {
  //       width: 38px;
  //       height: 32px;
  //       background: #ffffff;
  //       border-radius: 5px;
  //       border: 1px solid rgba(0, 0, 0, 0.15);
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       &:hover {
  //         border: 2px solid rgb(2, 167, 240);
  //         color: rgb(2, 167, 240);
  //       }
  //     }
  //   }
  //   .imgway-box {
  //     display: flex;
  //     align-items: center;
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
  //   .textStyle-box {
  //     .textStyle-item {
  //       position: relative;

  //       flex-direction: column;
  //       // justify-content: center;
  //       align-items: center;
  //       &:not(.zw-disabled) {
  //         cursor: pointer;
  //         &.active {
  //           .textAlign-icon {
  //             border: 2px solid rgb(2, 167, 240);
  //             &::before {
  //               background: #f0f5ff;
  //             }
  //             color: #0453F3;
  //             border-radius: 5px;
  //           }
  //         }
  //         &.hasCheck {
  //           .textAlign-icon {
  //             &::before {
  //               background: #f0f5ff;
  //             }
  //             color: #0453F3;
  //             border-radius: 5px;
  //           }
  //         }
  //       }

  //       .textStyle-item-label {
  //         color: rgba(0, 0, 0, 0.45);
  //       }
  //     }
  //   }
  //   .fontfill-box {
  //     .fillcolor-box {
  //       align-items: center;
  //       width: 89px;
  //       height: 32px;
  //       background: #ffffff;
  //       border-radius: 4px;
  //       border: 1px solid rgba(0, 0, 0, 0.15);
  //       /deep/ .el-color-picker__trigger {
  //         border: none;
  //       }
  //     }
  //   }
  // }
  .align-box {
    ul.box {
      list-style: none;
      width: 145px;
      height: 98px;
      li {
        float: left;
        &:nth-child(1) {
          span {
            border-top-left-radius: 5px;
          }
        }
        &:nth-child(3) {
          span {
            border-top-right-radius: 5px;
          }
        }
        &:nth-child(7) {
          span {
            border-bottom-left-radius: 5px;
          }
        }
        &:nth-child(9) {
          span {
            border-bottom-right-radius: 5px;
          }
        }
        span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 34px;
          cursor: pointer;
          border: 1px solid rgba(0, 0, 0, 0.15);
          margin-left: -1px;
          margin-top: -1px;
          &:hover {
            position: relative;
            border: 2px solid rgb(2, 167, 240);
            // border-color: rgba(9, 109, 217, 0.2);
            color: rgb(2, 167, 240);
            z-index: 100;
          }
        }
      }
    }

    .box:after {
      content: "";
      height: 0;
      visibility: hidden;
      clear: both;
      display: block;
    }

    .align-type {
      display: flex;
      width: 38px;
      height: 32px;
      align-items: center;
      justify-content: center;
      // background: #eef2f8;
      border-radius: 4px;
      border: 1px solid #e0e5ea;
      &:not(.zw-disabled) {
        &:hover {
          border: 2px solid rgb(2, 167, 240);
        }
      }
    }
  }
  .fontShap-box {
    /deep/ .el-input {
      .el-input__inner {
        height: 20px;
        line-height: 20px;
      }
    }
  }
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
</style>