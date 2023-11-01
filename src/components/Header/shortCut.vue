<template>
  <div>
    <el-dialog
      width="1000px"
      top="5vh"
      custom-class="shortcut-pop"
      :visible="true"
      :modal-append-to-body="true"
      :destroy-on-close="true"
      :lock-scroll="true"
      @close="close"
    >
      <template slot="title">
        <div class="pop-tit">快捷键说明</div>
      </template>
      <div class="pop-cont">
        <div class="zw-tab shortcut">
          <ul>
            <li
              v-for="(item,index) in tabs"
              :key="item.name"
              :class="{'active': activeTab==item.id}"
              @click="changeTab(item,index)"
            >{{item.name}}</li>
          </ul>
        </div>
        <div class="shortcut-box scroll-bar" ref="scrollBox">
          <div class="panel-box" v-for="panel in shortcuts" :key="panel.title">
            <div class="panel-tit mb10">{{panel.title}}</div>
            <!-- 标签下有分组的情况(元素编辑) -->
            <template v-if="panel.hasGroup">
              <div
                class="panel-box sublevel"
                v-for="sPanel in panel.data"
                :key="panel.title+sPanel.title"
              >
                <div class="panel-tit">{{sPanel.title}}</div>
                <div class="panel-cont">
                  <div
                    class="panel-item"
                    v-for="item in sPanel.data"
                    :key="item.name"
                    :class="{'disabled': item.disabled}"
                  >
                    <div>
                      <div class="name">{{item.name}}</div>
                      <div class="keycode">
                        <template v-if="isEditing && !item.readonly">
                          <div class="input-box">
                            <input
                              placeholder="请按键盘进行设置"
                              :value="shortcutsMap[item.id].inputval"
                              @focus="activeInputItem($event, item.id)"
                              @blur="deactiveInputItem($event, item.id)"
                            />
                            <i
                              class="iconfont iconclose-fill icon clear"
                              v-if="shortcutsMap[item.id].inputval != ''"
                              @click="clearInput(item.id)"
                            ></i>
                            <i
                              class="iconfont iconrevoke-fill icon restore"
                              v-if="shortcutsMap[item.id].inputval == ''"
                              @click="restoreInput(item.id)"
                            ></i>
                          </div>
                          <template v-if="item.name=='移动面板'">
                            <span class="combine">+</span>
                            <span class="key">鼠标</span>
                          </template>
                        </template>
                        <template v-else>
                          <template v-if="!item.hasMultiple">
                            <template v-if="item.name=='移动面板'">
                              <span class="key">{{shortcutsMap[sItem.id].keys.name}}</span>
                              <span class="combine">+</span>
                              <span class="key">鼠标</span>
                            </template>
                            <template v-else>
                              <span
                                v-for="key in shortcutsMap[item.id].complexKey"
                                :key="item.name+key"
                              >
                                <span class="key">{{key | system}}</span>
                                <span class="combine">+</span>
                              </span>
                              <span class="key">{{shortcutsMap[item.id].keys.name || '未设置'}}</span>
                            </template>
                          </template>
                          <template v-else>
                            <span
                              v-for="key in shortcutsMap[item.items[0].id].complexKey"
                              :key="item.name+key"
                            >
                              <span class="key">{{key | system}}</span>
                              <span class="combine">+</span>
                            </span>
                            <template>
                              <span v-if="item.name=='透明度'" class="key">0~9</span>
                              <span v-else-if="item.name=='切换印刷区域'" class="key">1/2/...</span>
                              <span v-else-if="item.name=='复制到...'" class="key">0/1/...</span>
                              <span
                                v-else
                                v-for="sItem in item.items"
                                :key="sItem.id"
                                class="key"
                              >{{shortcutsMap[sItem.id].keys.name}}</span>
                            </template>
                          </template>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 标签下没有分组的情况 -->
            <template v-else>
              <div class="panel-cont">
                <div
                  class="panel-item"
                  v-for="item in panel.data"
                  :key="item.name"
                  :class="{'disabled': item.disabled}"
                >
                  <div>
                    <div class="name">{{item.name}}</div>
                    <div class="keycode">
                      <template v-if="isEditing && !item.readonly">
                        <div class="input-box">
                          <input
                            placeholder="请按键盘进行设置"
                            :value="shortcutsMap[item.id].inputval"
                            @focus="activeInputItem($event, item.id)"
                            @blur="deactiveInputItem($event, item.id)"
                          />
                          <i
                            class="iconfont iconclose-fill icon clear"
                            v-if="shortcutsMap[item.id].inputval != ''"
                            @click="clearInput(item.id)"
                          ></i>
                          <i
                            class="iconfont iconrevoke-fill icon restore"
                            v-if="shortcutsMap[item.id].inputval == ''"
                            @click="restoreInput(item.id)"
                          ></i>
                        </div>
                        <template v-if="item.name=='移动面板'">
                          <span class="combine">+</span>
                          <span class="key">鼠标</span>
                        </template>
                      </template>
                      <template v-else>
                        <span v-if="!item.hasMultiple">
                          <template v-if="item.name=='移动面板'">
                            <span class="key">{{shortcutsMap[item.id].keys.name}}</span>
                            <span class="combine">+</span>
                            <span class="key">鼠标</span>
                          </template>
                          <template v-else>
                            <span
                              v-for="key in shortcutsMap[item.id].complexKey"
                              :key="item.name+key"
                            >
                              <span class="key">{{key | system}}</span>
                              <span class="combine">+</span>
                            </span>
                            <span class="key">{{shortcutsMap[item.id].keys.name || '未设置'}}</span>
                          </template>
                        </span>
                        <template v-else>
                          <span
                            v-for="key in shortcutsMap[item.items[0].id].complexKey"
                            :key="item.name+key"
                          >
                            <span class="key">{{key | system}}</span>
                            <span class="combine">+</span>
                          </span>
                          <template>
                            <template v-if="item.name=='移动面板'">
                              <span class="key">{{shortcutsMap[sItem.id].keys.name}}</span>
                              <span class="combine">+</span>
                              <span class="key">鼠标</span>
                            </template>
                            <span v-else-if="item.name=='透明度'" class="key">0~9</span>
                            <span v-else-if="item.name=='切换印刷区域'" class="key">1/2/...</span>
                            <span v-else-if="item.name=='复制到...'" class="key">0/1/...</span>
                            <span
                              v-else
                              v-for="sItem in item.items"
                              :key="sItem.id"
                              class="key"
                            >{{shortcutsMap[sItem.id].keys.name}}</span>
                          </template>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <template slot="footer" v-if="$sdkConfig.platformIsZWKJ">
        <div class="pop-bottom">
          <div>
            <a class="mr10" @click="importOldVersion">导入旧版快捷键</a>
            <a @click="restoreDefault">恢复为默认</a>
          </div>
          <div>
            <a class="blue" @click="customEdit" v-if="!isEditing">自定义快捷键</a>
            <template v-else>
              <a class="mr10" @click="cancel">取消</a>
              <a class="blue" @click="save">保存</a>
            </template>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 导入冲突提示弹窗 -->
    <el-dialog
      :visible.sync="isShowConflict"
      custom-class="zw-message-pop conflict-pop"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      :width="conflictData.length ? '480px' : '380px'"
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-success success-icon"></i> 导入成功！
      </div>
      <div class="dialog-content">
        <template v-if="conflictData.length">
          <div class="mb10">
            以下快捷键冲突，
            <span class="blue">请选择快捷键冲突的处理方式：</span>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="温馨提示：点击“覆盖”，对应快捷键将为空；点击“不覆盖”，对应快捷键将为不变。"
              placement="bottom"
            >
              <i class="blue el-icon-info"></i>
            </el-tooltip>
          </div>
          <table>
            <thead>
              <tr>
                <th>旧版</th>
                <th>新版</th>
                <th>快捷键</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in conflictData" :key="index">
                <td>{{item.old.name}}</td>
                <td>{{item.new.name}}</td>
                <td>{{inputValueMerge(item.new)}}</td>
              </tr>
            </tbody>
          </table>
          <div class="tips mt10">说明：移动方向快捷键暂不支持导入；“平铺”功能将合并为一个快捷键</div>
        </template>
        <div
          v-else
          class="tips"
          style="font-size: 14px;line-height:22px;"
        >说明：移动方向快捷键暂不支持导入；“平铺”功能将合并为一个快捷键</div>
      </div>
      <div slot="footer" class="dialog-footer" v-if="conflictData.length">
        <el-button @click="conflictResolve(0)">不覆盖</el-button>
        <el-button type="primary" @click="conflictResolve(1)">覆盖</el-button>
      </div>
    </el-dialog>
    <!-- 恢复默认提示弹窗 -->
    <el-dialog
      :visible.sync="isShowRestoreTip"
      custom-class="zw-message-pop"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      width="480px"
    >
      <div slot="title" class="dialog-title">
        <i class="el-icon-success warning-icon"></i> 提示
      </div>
      <div class="dialog-content pl25">该操作将所有快捷键恢复为默认值，是否继续？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowRestoreTip=false">取消</el-button>
        <el-button type="primary" @click="restoreDefaultConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { throttle, debounce, isEmpty,checkPlatform } from "@/utils/utils";
import eventBus from "@/utils/eventBus.js";
import {restoreMap, keycodeNameMap} from '@/utils/shortcutData'
export default {
  data() {
    return {
      activeTab: "0", //当前选中标签,
      posMap: {}, //记录tabs滚动对应的位置区间范围
      shortcuts: [],
      shortcutsMap: {},
      isEditing: false,
      editingId: null,
      lastData: {}, //记录上一次可设置的值，用于输入还原
      conflictData: [], //存放导入旧版时冲突键
      isLogin: this.$isLogin,
      isShowConflict: false,
      isShowRestoreTip: false,
      sysPlatform:checkPlatform(),
    };
  },
  computed: {
    defaultShortcuts() {
      return this.$store.state.shortcut.defaultShortcuts || [];
    },
    defaultShortcutsMap() {
      return this.$store.state.shortcut.defaultShortcutsMap;
    },
    customShortcutsMap() {
      return this.$store.state.shortcut.customShortcutsMap;
    },
    tabs() {
      return this.defaultShortcuts.map((item, index) => ({
        id: String(index),
        name: item.title,
      }));
    },
    // restoreMap() {
    //   return this.$store.state.shortcut.restoreMap;
    // },
    oldCustomShortcutMap() {
      let ret = {};
      this.$store.state.shortcut.oldCustomShortcuts.map((a) => {
        if (restoreMap[a.type]) {
          ret[a.type] = a;
        }
      });
      return ret;
    },
  },
  filters: {
    system: function (value) {
      let _val = value.toLowerCase();
      if (_val == "ctrl") {
        return window.sysPlatform == "windows" ? "Ctrl" : "⌘";
      } else if (_val == "shift") {
        return window.sysPlatform == "windows" ? "Shift" : "⇧";
      } else if (_val == "alt") {
        return window.sysPlatform == "windows" ? "Alt" : "⌥";
      } else if(_val == 'win'){
        return window.sysPlatform == 'windows' ? 'Win' : '^';
      } else{
        return value;
      }
    },
  },
  watch: {
    isEditing(nv, ov) {
      this.$store.commit("shortcut/updateFocusStatus", nv);
      if (nv) {
        window.addEventListener("keydown", this.editingHandler);
      } else {
        window.removeEventListener("keydown", this.editingHandler);
      }
    },
    
  },
  methods: {
    changeTab(item, index) {
      this.isTabClicked = true;
      this.activeTab = item.id;
      let $box = this.$refs.scrollBox;
      let nodes = $box.children || $box.childNodes;
      $box.scrollTop = nodes[index].offsetTop;
    },
    scrollfun() {
      let $box = this.$refs.scrollBox;
      let scrollTop = $box.scrollTop;
      let index = Object.values(this.posMap).findIndex((item) => {
        return scrollTop >= item[0] && scrollTop < item[1];
      });
      if (!this.isTabClicked) {
        this.activeTab = this.tabs[index].id;
      }
      this.isTabClicked = false;
    },
    initScrollPosMap() {
      let self = this;
      this.$nextTick(() => {
        let $box = this.$refs.scrollBox;
        let nodes = $box.children || $box.childNodes;
        let topArr = Array.from(nodes).map((a) => a.offsetTop);
        topArr.forEach((item, index) => {
          let start = index == 0 ? 0 : item;
          let end = index >= topArr.length - 1 ? 9999999999 : topArr[index + 1];
          this.posMap[index] = [start, end];
        });
        $box.addEventListener("scroll", debounce(self.scrollfun, 50));
      });
    },
    close() {
      this.$emit("close", false);
    },
    // 取消
    cancel() {
      if (this.isEditing) {
        this.isEditing = false;
        this.editingId = null;
        this.shortcutsMap = Object.assign(
          {},
          JSON.parse(JSON.stringify(this.customShortcutsMap))
        );
      } else {
        this.$emit("close", false);
      }
    },
    // 保存
    save(flag, checkLogin = true) {
      if (!this.isLogin && checkLogin) {
        eventBus.$emit("showLoginPop");
        this.editingId = null;
      } else {
        this.$store
          .dispatch("shortcut/saveQuickKey", this.shortcutsMap)
          .then((ret) => {
            switch (flag) {
              case "restore":
                this.$message({
                  message: "恢复成功",
                  type: "success",
                });
                break;
                this.isEditing = false;
                this.editingId = null;
              case "import":
                break;
              case "conflict":
                this.$message({
                  message: "覆盖成功",
                  type: "success",
                });
                break;
              default:
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                this.close();
            }
          });
      }
    },
    customEdit() {
      this.isEditing = true;
      this.initShortcutMap();
    },
    initShortcutMap() {
      this.shortcutsMap = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.customShortcutsMap))
      );
      for (let id in this.shortcutsMap) {
        let inputval = this.inputValueMerge(this.shortcutsMap[id]);
        this.$set(this.shortcutsMap[id], "inputval", inputval);
      }
      this.lastData = JSON.parse(JSON.stringify(this.shortcutsMap));
    },
    restoreDefault() {
      this.isShowRestoreTip = true;
    },
    restoreDefaultConfirm() {
      this.isShowRestoreTip = false;
      this.shortcutsMap = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.defaultShortcutsMap))
      );
      for (let id in this.shortcutsMap) {
        let inputval = this.inputValueMerge(this.shortcutsMap[id]);
        this.$set(this.shortcutsMap[id], "inputval", inputval);
      }
      this.save("restore");
    },
    importOldVersion() {
      if (!this.isLogin) {
        eventBus.$emit("showLoginPop");
        this.editingId = null;
      } else {
        this.checkConflict();
        if (this.conflictData.length) {
          this.isShowConflict = true;
          // console.log("冲突项==>", this.conflictData);
        } else {
          // console.log("没有冲突");
          this.isShowConflict = true;
          this.save("import");
        }
      }
    },
    checkConflict() {
      this.conflictData = [];
      for (let oid in this.oldCustomShortcutMap) {
        let oldItem = this.oldCustomShortcutMap[oid];
        let oCtrl = false,
          oShift = false,
          oAlt = false,
          oWin = false; // 旧版的window键不作为组合键，所以不判断
        let oKeycode = oldItem.keys.key;
        let oldKeyName = oldItem.keys.name.toLowerCase();
        if (oldKeyName.indexOf("ctrl") > -1) oCtrl = true;
        if (oldKeyName.indexOf("shift") > -1) oShift = true;
        if (oldKeyName.indexOf("alt") > -1) oAlt = true;
        let mapId = restoreMap[oid];
        // 查找是否有重复的键
        let conflictItem = Object.values(this.customShortcutsMap).find((a) => {
          // 排除不检测冲突的项(移动面板)
          if (a.skipCheck) return false;
          let nCtrl = a.complexKey.includes("Ctrl"),
            nShift = a.complexKey.includes("Shift"),
            nAlt = a.complexKey.includes("Alt"),
            nWin = a.complexKey.includes('Win');
          let isSameKeyCode =
            a.keys.key instanceof Array
              ? a.keys.key.includes(String(oKeycode)) || a.keys.key.includes(oKeycode)
              : a.keys.key == oKeycode;
          return (
            nCtrl == oCtrl &&
            nShift == oShift &&
            nAlt == oAlt &&
            nWin == oWin && 
            isSameKeyCode &&
            a.id != mapId
          );
        });
        if (conflictItem) {
          this.conflictData.push({
            old: oldItem,
            new: conflictItem,
          });
        } else {
          // 没有冲突的项直接导入
          this.replaceShortcutFromOld(oldItem, mapId);
        }
      }
    },
    // 将旧的快捷键替换到新的
    replaceShortcutFromOld(oldItem, mapId) {
      let complexKey = [];
      let keyCode = Number(oldItem.keys.key);
      let keyName = oldItem.keys.name;
      if (keyName.toLowerCase().indexOf("ctrl") > -1) complexKey.push("Ctrl");
      if (keyName.toLowerCase().indexOf("shift") > -1) complexKey.push("Shift");
      if (keyName.toLowerCase().indexOf("alt") > -1) complexKey.push("Alt");
      if(keycodeNameMap[keyCode]){
        keyName = keycodeNameMap[keyCode];
      } else {
        keyName = keyName.replace(/\s+/g, "");
        keyName = keyName.replace(/Ctrl\+/g, "");
        keyName = keyName.replace(/Shift\+/g, "");
        keyName = keyName.replace(/Alt\+/g, "");
        // 旧版windows不作为组合键使用，不需要替换Win
        keyName = this.firstLetterUpper(keyName);
      }
      this.shortcutsMap[mapId].complexKey = complexKey;
      this.shortcutsMap[mapId].keys = Object.assign(
        {},
        {
          key: oldItem.keys.key,
          name: keyName,
        }
      );
      this.$set(this.shortcutsMap[mapId], "inputval", oldItem.keys.name);
    },
    conflictResolve(flag) {
      this.isShowConflict = false;
      if (flag == 1) {
        //覆盖
        for (let i in this.conflictData) {
          let oldItem = this.conflictData[i].old;
          let newItem = this.conflictData[i].new;
          let mapId = restoreMap[oldItem.type];
          this.replaceShortcutFromOld(oldItem, mapId);
          this.clearInput(newItem.id);
        }
        this.save("conflict");
      }
    },
    // 自定义输入事件
    editingHandler(e) {
      let [keyCode, ctrlKey, shiftKey, altKey, winKey, key] = [
        e.keyCode || e.which || e.charCode,
        this.sysPlatform=='windows' ? e.ctrlKey : e.metaKey,
        e.shiftKey,
        e.altKey,
        this.sysPlatform=='windows' ? e.metaKey : e.ctrlKey,
        this.firstLetterUpper(e.key),
      ];
      if (this.isEditing && this.editingId) {
        let complexKey = [];
        if (ctrlKey) {
          complexKey.push("Ctrl");
        }
        if (shiftKey) {
          complexKey.push("Shift");
        }
        if (altKey) {
          complexKey.push("Alt");
        }
        if(winKey){
          complexKey.push("Win");
        }
        // ctrl, shift, alt(windows的ctrl==17对应mac的command==91)
        if(keyCode==16 || keyCode==18 || keyCode==17 || keyCode==91){
          key = '';
        }
        // 由于windows和mac的键值对应的名称有差异，如果有在键值和键名映射表中，则显示对应的键名，以保持一致性
        if(keycodeNameMap[keyCode]){
          key = keycodeNameMap[keyCode];
        }
        if (key) {
          let hasRepeat = this.checkItemRepeat(this.editingId, {
            complexKey,
            keys: {
              name: key,
              key: keyCode,
            },
          });
          if (!hasRepeat) {
            this.shortcutsMap[this.editingId].complexKey = complexKey;
            this.shortcutsMap[this.editingId].keys = Object.assign(
              {},
              {
                name: key,
                key: keyCode,
              }
            );
            let inputval = this.inputValueMerge(
              this.shortcutsMap[this.editingId]
            );
            this.$set(this.shortcutsMap[this.editingId], "inputval", inputval);
            this.$set(
              this.lastData,
              this.editingId,
              JSON.parse(JSON.stringify(this.shortcutsMap[this.editingId]))
            );
          } else {
            this.restoreInput(this.editingId);
          }
        }
      }
      if (this.editingId) e.preventDefault();
      return false;
    },
    // 重复键判断
    checkItemRepeat(id, { complexKey, keys }) {
      let repeat = false;
      let curCtrl = complexKey.includes("Ctrl"),
        curShift = complexKey.includes("Shift"),
        curAlt = complexKey.includes("Alt"),
        curWin = complexKey.includes('Win');
      for (let i in this.shortcutsMap) {
        if (i != id) {
          let scItem = this.shortcutsMap[i];
          if (!scItem.skipCheck) {
            let _complexkey = scItem.complexKey;
            let _keys = scItem.keys;
            let isCtrl = _complexkey.includes("Ctrl"),
              isShift = _complexkey.includes("Shift"),
              isAlt = _complexkey.includes("Alt"),
              isWin = _complexkey.includes('Win');
            let isSameKeyCode =
              _keys.key instanceof Array
                ? _keys.key.includes(String(keys.key)) || _keys.key.includes(keys.key)
                : _keys.key == keys.key;
            if (
              curCtrl == isCtrl &&
              curShift == isShift &&
              curAlt == isAlt &&
              curWin == isWin &&
              isSameKeyCode
            ) {
              repeat = true;
              this.$message.error(
                `快捷键与“${scItem.name}（${this.inputValueMerge(
                  scItem
                )}）”存在冲突，请重新设置`
              );
              this.clearInput(id);
              break;
            }
          }
        }
      }
      return repeat;
    },
    // 首字母大写
    firstLetterUpper(name) {
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : "";
    },
    inputValueMerge(data) {
      let ret = "";
      if (data.complexKey && data.complexKey.length) {
        ret += data.complexKey.join(" + ");
        ret += " + ";
      }
      if(this.sysPlatform != 'windows'){
        ret = ret.replace(/Ctrl/g, '⌘');
        ret = ret.replace(/Shift/g, '⇧');
        ret = ret.replace(/Alt/g, '⌥');
        ret = ret.replace(/Win/,'^');
      }
      ret += data.keys.name;
      return ret;
    },
    clearInput(id) {
      this.shortcutsMap[id].complexKey = [];
      this.shortcutsMap[id].keys = Object.assign(
        {},
        {
          name: "",
          key: "",
        }
      );
      this.$set(this.shortcutsMap[id], "inputval", "");
    },
    restoreInput(id) {
      // 还原到上次设置的值
      let lastItem = this.lastData[id];
      this.shortcutsMap[id].complexKey = lastItem.complexKey;
      this.shortcutsMap[id].keys = Object.assign({}, lastItem.keys);
      this.$set(this.shortcutsMap[id], "inputval", lastItem.inputval);
    },
    activeInputItem(e, id) {
      this.editingId = id;
      this.clearInput(id);
    },
    deactiveInputItem(e, id) {
      this.editingId = null;
    },
  },
  mounted() {
    this.shortcuts = JSON.parse(JSON.stringify(this.defaultShortcuts));
    console.log('tttt => ', this.shortcuts);
    this.initShortcutMap();
    this.initScrollPosMap();
    // console.log(
    //   "qqqqqqqqqqq ====> ",
    //    restoreMap,
    //   this.oldCustomShortcutMap
    // );
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.editingHandler);
    this.$store.commit("shortcut/updateFocusStatus", false);
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
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
}
/deep/ .el-dialog__body {
  font-size: 14px;
  padding: 20px 30px;
}
.shortcut-pop {
  .pop-tit {
    font-size: 16px;
  }
}
.zw-tab {
  position: relative;
  .opt-btns {
    position: absolute;
    right: 0;
    top: 10px;
  }
}
.zw-tab.shortcut {
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  margin-bottom: 20px;
  ul {
    border-right: none;
  }
  li {
    &:hover,
    &.active {
      &:last-child {
        border-right: 1px solid rgba(0, 0, 0, 0.15) !important;
      }
    }
  }
}
.shortcut-box {
  max-height: calc(90vh - 220px);
  overflow: auto;
  color: #37474f;
  position: relative;
}
.panel-box {
  width: 100%;
  padding-bottom: 20px;
  position: relative;
}
.panel-tit {
  width: 100%;
  height: 32px;
  line-height: 32px;
  background: #f0f5ff;
  padding: 0 15px;
  font-weight: bold;
  color: #37474f;
  &.gray {
    background: rgba(0, 0, 0, 0.02);
  }
}
.panel-cont {
  width: 100%;
  column-count: 3;
  column-gap: 20px;
  column-rule: 1px solid rgba(0, 0, 0, 0.06);
  -webkit-column-count: 3;
  -webkit-column-gap: 20px;
  -moz-column-count: 3;
  -moz-column-gap: 20px;

  .panel-item {
    break-inside: avoid;
    width: 100%;
    font-size: 13px;
    cursor: pointer;
    &.disabled {
      color: #aaa;
    }
    &.warning {
      color: orangered;
    }
    > div {
      height: 32px;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:hover {
        background: rgba(0, 0, 0, 0.04);
        color: #0453F3;
      }
    }
    .keycode {
      font-family: sans-serif;
      span.key {
        display: inline-block;
        padding: 5px 4px;
        background: #f0f5ff;
        border-radius: 3px;
      }
      span.combine {
        padding: 0 3px;
      }
    }
    .input-box {
      display: inline-block;
      position: relative;
      input {
        width: 140px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        border: 1px solid #efefef;
        border-radius: 5px;
        outline: 0;
        padding-right: 16px;
        text-align: center;
        caret-color: transparent;
        &:focus {
          border-color: #0453F3;
          color: #0453F3;
          &::-webkit-input-placeholder{
            color: #0453F3;
          }
        }
      }
      i {
        display: inline-block;
        line-height: 24px;
        padding: 0 2px;
        position: absolute;
        right: 0;
        top: 0;
        color: rgba(0, 0, 0, 0.15);
      }
    }
    input:focus + i {
      color: #0453F3;
    }
  }
}
.panel-box.sublevel {
  padding-bottom: 0;
  .panel-tit {
    background: rgba(0, 0, 0, 0.02);
    margin-top: 10px;
  }
  .panel-cont {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding-bottom: 10px;
  }
}
.pop-bottom {
  display: flex;
  justify-content: space-between;
  a {
    display: inline-block;
    // width: 65px;
    padding: 0 18px;
    line-height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    &.blue {
      border-color: #0453F3;
      background: #0453F3;
      color: #fff;
    }
  }
}
.conflict-pop {
  .dialog-content {
    padding: 0 25px;
  }
  th,
  td {
    border-left: 0;
    border-right: 0;
    font-size: 14px;
  }
}
</style>