export default {
  install: function (Vue) {
    Vue.component("dynamic-source", {
      render(createElement) {
        const self = this;
        return createElement("script", {
          attrs: { type: "text/javascript", src: this.src },
          on: {
            load() {
              self.$emit("loaded");
            },
          },
        });
      },
      props: {
        src: { type: String, required: true },
      },
    });
  }
}