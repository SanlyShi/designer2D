import Loading from "./src/index";
export default {
  install(Vue) {
    Vue.directive("zwloading", Loading);
  },
};
