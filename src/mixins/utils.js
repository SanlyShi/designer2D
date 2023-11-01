export default {
  data() {
    return {};
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    // 深克隆
    deepClone(data) {
      var type = this.getType(data);
      var obj;
      if (type === "array") {
        obj = [];
      } else if (type === "object") {
        obj = {};
      } else {
        //不再具有下一层次
        return data;
      }
      if (type === "array") {
        for (var i = 0, len = data.length; i < len; i++) {
          obj.push(this.deepClone(data[i]));
        }
      } else if (type === "object") {
        for (var key in data) {
          obj[key] = this.deepClone(data[key]);
        }
      }
      return obj;
    },
    // 判断对象类型
    getType(obj) {
      if (obj === null) return "null";
      if (obj === undefined) return "undefined";
      return Object.prototype.toString
        .call(obj)
        .slice(8, -1)
        .toLowerCase();
    },
    _channelInputLimit(e) {
      let key = e.key;
      // 不允许输入'e'和'.'
      if (key === "e" || key === ".") {
        e.returnValue = false;
        return false;
      }
      return true;
    },
    //保留两位小数
    _two_decimal(e, data, key) {
      e.target.value = e.target.value.replace(/[^\d.]/g, "");
      e.target.value = e.target.value.replace(/^\./g, "");
      e.target.value = e.target.value.replace(/\.{2,}/g, ".");
      e.target.value = e.target.value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      e.target.value = e.target.value.replace(/([0-9]+\.[0-9]{2})[0-9]*/, "$1");
      if (data && key) {
        data[key] = e.target.value;
      }
    },
  },
};
