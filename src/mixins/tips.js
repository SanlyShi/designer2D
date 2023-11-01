import { genLocalStorageKey } from "@/utils/utils"
export default {
  data() {
    return {
      m_tips_keys: ['clip'],
      m_tips_7day: ['clip'], //7天不提示的功能，默认提示1次不再提示
    }
  },
  methods: {
    m_tips_init() {
      const userCode = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      const localStorageKey = genLocalStorageKey('newTips');
      let data = localStorage.getItem(localStorageKey) ? JSON.parse(localStorage.getItem(localStorageKey)) : {};
      let showData = {};
      [].forEach.call(this.m_tips_keys, key => {
        if(!data[key]) data[key] = {};
        if(!data[key][userCode]){
          data[key][userCode] = this.m_tips_7day.includes(key) ? new Date().getTime() + 86400 * 7 * 1000 : -1;
          showData[key] = true;
        } else {
          const now = new Date().getTime();
          showData[key] = now > data[key][userCode] ? false : true;
        }
      });
      localStorage.setItem(localStorageKey, JSON.stringify(data));
      this.$store.commit('updateNewTips', showData)
    },
    m_tips_close(key){
      const userCode = this.$isLogin ? this.$OPTIONS.userInfo.code : "unlogin";
      const localStorageKey = genLocalStorageKey('newTips');
      let data = localStorage.getItem(localStorageKey) ? JSON.parse(localStorage.getItem(localStorageKey)) : {};
      if(data) {
        data[key][userCode] = -1;
        localStorage.setItem(localStorageKey, JSON.stringify(data))
        let tips = this.$store.state.newTips;
        tips[key] = false;
        this.$store.commit('updateNewTips', tips);
      }
    }
  }
};
