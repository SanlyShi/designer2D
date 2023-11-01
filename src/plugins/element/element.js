import Vue from "vue";
import Element from "element-ui";
import "./element-variables.scss";
import Dialog from "./dialog/index.js";
import ColorPicker from "./color-picker/index";
import Slider from "./slider/index";
import Tooltip from "./tooltip/index";
import FlatColorPicker from "../flatColorPicker/index";
Vue.use(Element, { size: "small" });
Vue.use(Dialog);
Vue.use(ColorPicker);
Vue.use(Slider);
Vue.use(Tooltip);
Vue.use(FlatColorPicker);
