import { _saveQuickKey } from "@/apis/common";
import {defaultShortcuts} from '@/utils/shortcutData'
export default {
  namespaced: true,
  state: {
    isShowShortcut: false, //是否显示快捷键弹窗
    hasInputFous: false, //当前是否有聚焦的输入框，正在输入的时候不检测快捷键操作
    defaultShortcuts, //系统默认
    defaultShortcutsMap: {},
    customShortcutsMap: {},
    oldCustomShortcuts: [], //旧版自定义快捷键，用于导入
  },
  mutations: {
    toggleShortCut(state, args) {
      state.isShowShortcut = args;
    },
    updateOldCustomShortcuts(state, args) {
      state.oldCustomShortcuts = args;
    },
    updateDefaultshortcutsMap(state, args) {
      state.defaultShortcutsMap = Object.assign({}, args);
    },
    updateCustomShortcutsMap(state, args) {
      state.customShortcutsMap = Object.assign({}, args);
    },
    updateFocusStatus(state, args) {
      state.hasInputFous = args;
    },
  },
  actions: {
    async saveQuickKey({ commit }, args) {
      let ret = await _saveQuickKey({ "keys": args });
      commit('updateCustomShortcutsMap', args);
      return ret;
    },
  },
};
