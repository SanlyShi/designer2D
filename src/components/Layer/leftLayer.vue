<template>
    <div class="layer-box scroll-bar p10" style="height:100%;overflow:auto;">
        <sl-vue-tree v-model="nodes" class="sl-vue-tree" ref="slVueTree" @nodeclick="handleNodeClick" @select="select" :allowToggleBranch="true"
            @drop="handleDrop">
            <template slot="title" slot-scope="{ node }">
                <span class="item-icon">
                    <i class="fa " v-if="node.isLeaf"></i>
                    <i class="fa iconfont iconskin" v-if="!node.isLeaf"></i>
                </span>
                <span class="imgUrlBgBox"
                    v-if="node.type == 'image' && node.data.getAttrs().name.indexOf('isBg') > -1"><i
                        class="iconfont iconbg bgicon"></i></span>
                <span class="imgUrlBox" v-if="node.isLeaf">
                    <img v-if="node.type == 'image'" :src="node.data.imageUrl" alt="" draggable="false">
                    <i class="iconfont" :class="'icon' + node.icon" v-else></i>
                </span>
                <label for="">{{ node.label }}</label>
                <el-popover popper-class="tips" placement="top-start" trigger="hover" v-if="node.data.isError">
                    <div class="popover-tips">
                        <div class="title">
                            <i class="iconfont iconinfo-circle-fill error-tips"
                                v-if="node.data.errors.type == 'error'"></i>
                            <i class="iconfont iconinfo-circle-fill warning-tips"
                                v-if="node.data.errors.type == 'warning'"></i>
                            <i class="iconfont iconinfo-circle-fill remind-tips"
                                v-if="node.data.errors.type == 'remind'"></i>
                            <div class="ml5">{{ node.data.errors.title }}</div>
                        </div>
                        <div class="detail" v-html="node.data.errors.detail"></div>
                    </div>
                    <i class="iconfont iconinfo-circle-fill error-tips" slot="reference"
                        v-if="node.data.errors.type == 'error'"></i>
                    <i class="iconfont iconinfo-circle-fill warning-tips" slot="reference"
                        v-if="node.data.errors.type == 'warning'"></i>
                    <i class="iconfont iconinfo-circle-fill remind-tips" slot="reference"
                        v-if="node.data.errors.type == 'remind'"></i>
                </el-popover>
                <span v-if="node.type == 'view' && node.bgcolor != ''" class="bg-color-rect"
                    :style="'background: ' + node.bgcolor"></span>
            </template>
            <template slot="toggle" slot-scope="{ node }">
                <span v-if="!node.isLeaf && node.label != '整体设计'">
                    <i v-if="node.isExpanded" class="fa el-icon-caret-bottom"></i>
                    <i v-if="!node.isExpanded" class="fa el-icon-caret-right"></i>
                </span>
                <span v-else>
                </span>
            </template>
            <template slot="sidebar" slot-scope="{ node }"
                v-if="node.type != 'view' && (!node.data.isSelected || selectNodes.length == 1)">
                <span class="visible-icon" @click="event => toggleLock(event, node)" v-if="node.isLeaf">
                    <i v-if="node.data.isLock == true" class="fa iconfont iconlock"></i>
                    <i v-if="node.data.isLock == false" class="fa iconfont iconunlock-fill"></i>
                </span>
                <span class="visible-icon" @click="event => toggleVisibility(event, node)" v-if="node.isLeaf">
                    <i v-if="node.data.isHidden == true" class="fa iconfont iconeye-close"></i>
                    <i v-if="node.data.isHidden == false" class="fa iconfont iconeye-open"></i>
                </span>
            </template>
        </sl-vue-tree>
    </div>
</template>
<script>
import SlVueTree from "../SlVuetree/slVueTree.vue";
import eventBus from "@/utils/eventBus.js";
import { stageObj } from "@/utils/designer";
export default {
    components: {
        SlVueTree
    },
    data() {
        return {
            props: {
                children: "childrens",
            },
            nodes: [],
            selectNodes: []
        };
    },
    computed: {
        designImgList() {
            let designImgList = this.$store.state.gallery.designImgList || [];
            for (let item of designImgList) {
                item.isExpanded = false
                item.isDraggable = false
                item.isSelectable = true
                this.$set(item, 'bgcolor', item.bgcolor)
                // item.bgcolor = new String(item.bgcolor)
                if (item.childrens && item.childrens.length > 0) {
                    item.isExpanded = true
                    for (let c of item.childrens) {
                        c.isLeaf = true
                        switch (c.type) {
                            case "image":
                                c.label = c.getAttrs().imageData.name;
                                c.icon = "picture";
                                c.imageUrl = c.getAttrs().flipImgUrl
                                c.isDraggable = (c.getAttrs().name.indexOf('isBg') > -1) ? false : true
                                break;
                            case "text":
                                c.icon = "text";
                                break;
                        }
                        if (c.isVagueData) {
                            c.isError = true;
                            if (c.isVagueData.text && c.transformData.text) {
                                let type = Math.max(c.isVagueData.type, c.transformData.type);
                                this.$set(c, "errors", {
                                    type: "remind",
                                    title: c.isVagueData.title + "，" + c.transformData.title,
                                    detail: `1. ${c.isVagueData.text} <br/>2. ${c.transformData.text}`,
                                });
                                this.typeSwitch({ item: c.errors, type: type });
                            } else if (c.isVagueData.text) {
                                this.$set(c, "errors", {
                                    type: "remind",
                                    title: c.isVagueData.title,
                                    detail: `1. ${c.isVagueData.text}`,
                                });
                                this.typeSwitch({ item: c.errors, type: c.isVagueData.type });
                            } else if (c.transformData.text) {
                                this.$set(c, "errors", {
                                    type: "remind",
                                    title: c.transformData.title,
                                    detail: `1. ${c.transformData.text}`,
                                });
                                this.typeSwitch({ item: c.errors, type: c.transformData.type });
                            } else {
                                c.isError = false;
                            }
                        }
                    }
                }
            }
            return designImgList;
        },
    },
    watch: {
        designImgList: {
            handler(value) {
                this.nodes = value
            },
            deep: false
        }
    },
    methods: {
        select(selectedNodes) {
            this.selectNodes = selectedNodes
            let nodes = selectedNodes.map(f => {
                return f.data
            })
            const layer = nodes.length && nodes[0].type != 'view' && nodes[0].getLayer();
            layer && eventBus.$emit("changeStage", { viewId: layer.attrs.viewId });
            if (nodes.length > 1 && nodes[0].type != 'view') {
                this.$store.commit('multiple/updateMultipleSelectNodes', nodes)
            }
            if (nodes.length == 1 && nodes[0].type != 'view' && this.$store.state.multiple.shiftKeyDown) {
                this.$store.commit('multiple/updateMultipleSelectNodes', nodes)
            }
            if (nodes.length == 1 && nodes[0].type != 'view') {
                layer.find('Transformer')?.destroy();
                layer.find('.anchorGroup')?.destroy();
                this.$store.commit('multiple/updateMultipleSelectNodes', nodes)
            }
            if (nodes.length == 0) {
                eventBus.$emit('setNullCurNode')
                // const currentStage = stageObj[`stage${this.$store.getters.view_id}`];
                // currentStage.fire('mousedown')
                // this.curNode = null
            }
        },
        typeSwitch({ item, type }) {
            switch (type) {
                case 1:
                    this.$set(item, "type", "remind");
                    break;
                case 2:
                    this.$set(item, "type", "warning");
                    break;
                case 3:
                    this.$set(item, "type", "error");
                    break;
            }
        },
        handleNodeClick(node) {
            if (!this.$store.state.multiple.shiftKeyDown) {
                if (node.type == "view") {
                    eventBus.$emit("changeStage", { viewId: node.id });
                } else {
                    let layer = node.data.getLayer();
                    eventBus.$emit("changeStage", { viewId: layer.attrs.viewId });
                    this.$store.commit("layout/changeSelectNode", node.data);
                    eventBus.$emit("changeSelectNode", { data: node.data });
                    switch (node.type) {
                        case "image":
                        case "bgimage":
                        case "bgcolor":
                            this.$store.commit("layout/changeSelectType", "image");
                            break;
                        case "text":
                            this.$store.commit("layout/changeSelectType", "text");
                            break;
                        case "group":
                            this.$store.commit("layout/changeSelectType", "group");
                            break;
                    }
                }
            }
        },
        toggleVisibility: function (event, node) {
            const slVueTree = this.$refs.slVueTree;
            event.stopPropagation();
            const isHidden = !node.data || node.data.isHidden !== false;
            slVueTree.updateNode(node.path, { data: { isHidden: !isHidden } });
            this.$set(node.data, "isHidden", !node.data.isHidden);
            eventBus.$emit("nodeToggleHidden", { data: node.data });
        },
        toggleLock: function (event, node) {
            const slVueTree = this.$refs.slVueTree;
            const isLock = !node.data || node.data.isLock !== false;
            slVueTree.updateNode(node.path, { data: { isLock: !isLock } });
            eventBus.$emit("nodeToggleLock", { data: node.data},true);
        },
        handleDrop(draggingNode, cursorPosition) {
            eventBus.$emit('swapNodeIndex', {
                viewId: cursorPosition.node.path[0] + 1,
                nodes: this.nodes[cursorPosition.node.path[0]]
            })
        },
    }
};
</script>
