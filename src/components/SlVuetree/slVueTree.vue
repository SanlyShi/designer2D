<template>
  <div class="sl-vue-tree" :class="{ 'sl-vue-tree-root': isRoot }" @mousemove="onMousemoveHandler"
    @mouseleave="onMouseleaveHandler" @dragend="onDragendHandler(null, $event)">
    <div ref="nodes" class="sl-vue-tree-nodes-list">
      <div class="sl-vue-tree-node" v-for="(node, nodeInd) in nodes"
        :class="{ 'sl-vue-tree-selected': node.isSelected }" :key="nodeInd">
        <div class="sl-vue-tree-cursor sl-vue-tree-cursor_before" @dragover.prevent :style="{
          'visibility': cursorPosition &&
            cursorPosition.node.pathStr === node.pathStr &&
            cursorPosition.placement === 'before' ?
            'visible' :
            'hidden',
          '--depth': depth
        }">
        </div>
        <div class="sl-vue-tree-node-item" @mousedown="onNodeMousedownHandler($event, node)"
          @mouseover="setCurHoverNode(node, $event)" @mouseup="onNodeMouseupHandler($event, node)"
          @contextmenu="emitNodeContextmenu(node, $event)" @click="emitNodeClick(node, $event)"
          @dragover="onExternalDragoverHandler(node, $event)" @drop="onExternalDropHandler(node, $event)"
          :path="node.pathStr" :class="{
            'sl-vue-tree-cursor-hover':
              cursorPosition &&
              cursorPosition.node.pathStr === node.pathStr,
            'sl-vue-tree-cursor-inside':
              cursorPosition &&
              cursorPosition.placement === 'inside' &&
              cursorPosition.node.pathStr === node.pathStr,
            'sl-vue-tree-node-is-leaf': node.isLeaf,
            'sl-vue-tree-node-is-folder': !node.isLeaf,
            'apearOperate': curhoverNode == node.pathStr
          }">
          <div class="sl-vue-tree-gap" v-for="(gapInd, index) in gaps" :key="index"></div>
          <div class="sl-vue-tree-branch" v-if="level && showBranches">
            <slot name="branch" :node="node">
              <span v-if="!node.isLastChild">
                {{ String.fromCharCode(0x251C) }}{{ String.fromCharCode(0x2500) }}&nbsp;
              </span>
              <span v-if="node.isLastChild">
                {{ String.fromCharCode(0x2514) }}{{ String.fromCharCode(0x2500) }}&nbsp;
              </span>
            </slot>
          </div>
          <div class="sl-vue-tree-title">
            <span class="sl-vue-tree-toggle" v-if="!node.isLeaf" @click="onToggleHandler($event, node)">
              <slot name="toggle" :node="node">
                <span>
                  {{ !node.isLeaf ? (node.isExpanded ? '-' : '+') : '' }}
                </span>
              </slot>
            </span>
            <slot name="title" :node="node">{{ node.label }}</slot>
            <slot name="empty-node" :node="node" v-if="!node.isLeaf && node.childrens.length == 0 && node.isExpanded">
            </slot>
          </div>
          <div class="sl-vue-tree-sidebar">
            <slot name="sidebar" :node="node"></slot>
          </div>
        </div>
        <sl-vue-tree v-if="node.childrens && node.childrens.length && node.isExpanded" :value="node.childrens"
          :level="node.level" :parentInd="nodeInd" :allowMultiselect="allowMultiselect"
          :allowToggleBranch="allowToggleBranch" :edgeSize="edgeSize" :showBranches="showBranches" @dragover.prevent>
          <template slot="title" slot-scope="{ node }">
            <slot name="title" :node="node">{{ node.label }}</slot>
          </template>
          <template slot="toggle" slot-scope="{ node }">
            <slot name="toggle" :node="node">
              <span>
                {{ !node.isLeaf ? (node.isExpanded ? '-' : '+') : '' }}
              </span>
            </slot>
          </template>
          <template slot="sidebar" slot-scope="{ node }">
            <slot name="sidebar" :node="node"></slot>
          </template>
          <template slot="empty-node" slot-scope="{ node }">
            <slot name="empty-node" :node="node" v-if="!node.isLeaf && node.childrens.length == 0 && node.isExpanded">
            </slot>
          </template>
        </sl-vue-tree>
        <div class="sl-vue-tree-cursor sl-vue-tree-cursor_after" @dragover.prevent :style="{
          'visibility': cursorPosition &&
            cursorPosition.node.pathStr === node.pathStr &&
            cursorPosition.placement === 'after' ?
            'visible' :
            'hidden',
          '--depth': depth
        }">
        </div>
      </div>
      <div v-show="isDragging" v-if="isRoot" ref="dragInfo" class="sl-vue-tree-drag-info">
        <slot name="draginfo">
          <span v-if="!curDragDom">已选择: {{ selectionSize }}项</span>
          <div v-else v-html="curDragDom"></div>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'sl-vue-tree',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    edgeSize: {
      type: Number,
      default: 3
    },
    showBranches: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 0
    },
    parentInd: {
      type: Number
    },
    allowMultiselect: {
      type: Boolean,
      default: true
    },
    allowToggleBranch: {
      type: Boolean,
      default: true
    },
    multiselectKey: {
      type: [String, Array],
      default: function () {
        return ['ctrlKey', 'metaKey']
      },
      validator: function (value) {
        let allowedKeys = ['ctrlKey', 'metaKey', 'altKey'];
        let multiselectKeys = Array.isArray(value) ? value : [value];
        multiselectKeys = multiselectKeys.filter(keyName => allowedKeys.indexOf(keyName) !== -1);
        return !!multiselectKeys.length;
      }
    },
    scrollAreaHeight: {
      type: Number,
      default: 70
    },
    maxScrollSpeed: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      curhoverNode: '',
      rootCursorPosition: null,
      scrollIntervalId: 0,
      scrollSpeed: 0,
      lastSelectedNode: null,
      mouseIsDown: false,
      isDragging: false,
      lastMousePos: { x: 0, y: 0 },
      preventDrag: false,
      currentValue: this.value,
    };
  },
  mounted() {
    if (this.isRoot) {
      document.addEventListener('mouseup', this.onDocumentMouseupHandler);
    }
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.onDocumentMouseupHandler);
  },
  watch: {
    value: function (newValue) {
      this.currentValue = newValue;
    }
  },
  computed: {
    cursorPosition() {
      if (this.isRoot) return this.rootCursorPosition;
      return this.getParent().cursorPosition;
    },
    depth() {
      return this.gaps.length
    },
    nodes() {
      if (this.isRoot) {
        const nodeModels = this.copy(this.currentValue);
        return this.getNodes(nodeModels);
      }
      return this.getParent().nodes[this.parentInd].childrens;
    },
    gaps() {
      const gaps = [];
      let i = this.level - 1;
      if (!this.showBranches) i++;
      while (i-- > 0) gaps.push(i);
      return gaps;
    },
    isRoot() {
      return !this.level
    },
    curDragDom() {
      if (this.getSelected().length == 1 && this.getSelected() && this.getSelected()[0] && this.getSelected()[0].path && this.getNodeEl(this.getSelected()[0].path)) {
        return this.getNodeEl(this.getSelected()[0].path).outerHTML
      } else {
        return ''
      }
    },
    selectionSize() {
      return this.getSelected().length;
    },
    dragSize() {
      return this.getDraggable().length;
    },
  },
  methods: {
    setCurHoverNode(node, e) {
      this.curhoverNode = node.pathStr
    },
    setCursorPosition(pos) {
      if (this.isRoot) {
        this.rootCursorPosition = pos;
        return;
      }
      this.getParent().setCursorPosition(pos);
    },
    getNodes(nodeModels, parentPath = [], isVisible = true) {
      return nodeModels.map((nodeModel, ind) => {
        const nodePath = parentPath.concat(ind);
        return this.getNode(nodePath, nodeModel, nodeModels, isVisible);
      })
    },
    getNode(
      path,
      nodeModel = null,
      siblings = null,
      isVisible = null
    ) {
      const ind = path.slice(-1)[0];
      siblings = siblings || this.getNodeSiblings(this.currentValue, path);
      nodeModel = nodeModel || (siblings && siblings[ind]) || null;
      if (isVisible == null) {
        isVisible = this.isVisible(path);
      }
      if (!nodeModel) return null;
      const isExpanded = nodeModel.isExpanded == void 0 ? true : !!nodeModel.isExpanded;
      const isDraggable = nodeModel.isDraggable == void 0 ? true : !!nodeModel.isDraggable;
      const isSelectable = nodeModel.isSelectable == void 0 ? true : !!nodeModel.isSelectable;

      const node = {
        label: nodeModel.label,
        isLeaf: !!nodeModel.isLeaf,
        childrens: nodeModel.childrens ? this.getNodes(nodeModel.childrens, path, isExpanded) : [],
        isSelected: nodeModel.isSelected,
        isExpanded,
        isVisible,
        isDraggable,
        isSelectable,
        data: nodeModel,
        path: path,
        id: nodeModel.id,
        pathStr: JSON.stringify(path),
        level: path.length,
        ind,
        bgcolor: nodeModel.bgcolor,
        icon: nodeModel.icon,
        isFirstChild: ind == 0,
        isLastChild: ind === siblings.length - 1,
        type: nodeModel.type,
        isLock: nodeModel.isLock,
        isHidden: nodeModel.isHidden,
      };
      return node;
    },
    isVisible(path) {
      if (path.length < 2) return true;
      let nodeModels = this.currentValue;
      for (let i = 0; i < path.length - 1; i++) {
        let ind = path[i];
        let nodeModel = nodeModels[ind];
        let isExpanded = nodeModel.isExpanded == void 0 ? true : !!nodeModel.isExpanded;
        if (!isExpanded) return false;
        nodeModels = nodeModel.childrens;
      }
      return true;
    },
    emitInput(newValue) {
      this.currentValue = newValue;
      this.getRoot().$emit('input', newValue);
    },
    emitSelect(selectedNodes, event) {
      this.getRoot().$emit('select', selectedNodes, event);
    },
    emitBeforeDrop(draggingNodes, position, cancel) {
      this.getRoot().$emit('beforedrop', draggingNodes, position, cancel);
    },
    emitDrop(draggingNodes, position, event) {
      this.getRoot().$emit('drop', draggingNodes, position, event);
    },
    emitToggle(toggledNode, event) {
      this.getRoot().$emit('toggle', toggledNode, event);
    },
    emitNodeClick(node, event) {
      if (node.isSelected) {
        this.getRoot().$emit('nodeclick', node, event);
      }
    },
    emitNodeContextmenu(node, event) {
      this.getRoot().$emit('nodecontextmenu', node, event);
    },
    onExternalDragoverHandler(node, event) {
      event.preventDefault();
      const root = this.getRoot();
      const cursorPosition = root.getCursorPositionFromCoords(event.clientX, event.clientY);
      root.setCursorPosition(cursorPosition);
      root.$emit('externaldragover', cursorPosition, event);
    },
    onExternalDropHandler(node, event) {
      const root = this.getRoot();
      const cursorPosition = root.getCursorPositionFromCoords(event.clientX, event.clientY);
      root.$emit('externaldrop', cursorPosition, event);
      this.setCursorPosition(null);
    },
    select(path, addToSelection = false, event = null) {
      const multiselectKeys = Array.isArray(this.multiselectKey) ?
        this.multiselectKey :
        [this.multiselectKey];
      const multiselectKeyIsPressed = event && !!multiselectKeys.find(key => event[key]);
      addToSelection = (multiselectKeyIsPressed || addToSelection) && this.allowMultiselect;
      const selectedNode = this.getNode(path);
      if (!selectedNode) return null;
      const newNodes = this.copy(this.currentValue);
      const shiftSelectionMode = this.allowMultiselect && event && event.shiftKey && this.lastSelectedNode;
      let canMultipleSelect = true;
      if (selectedNode.type == 'view'
        || selectedNode.data.getAttrs().name.indexOf('isBg') > -1
        || selectedNode.isLock
        || selectedNode.isHidden
        || selectedNode.data.getParent().hasName('repeatImgGroup')
      ) {
        canMultipleSelect = false
      }
      if (!canMultipleSelect && shiftSelectionMode) {
        this.getText(selectedNode) && this.$message.warning(this.getText(selectedNode))
        return null
      }
      let text1 = ''
      let curHasCantSelect = false
      curHasCantSelect = this.getSelected().find(x => {
        let bool = x.type == 'view'
          || x.data.getAttrs().name.indexOf('isBg') > -1
          || x.isLock
          || x.isHidden
          || x.data.getParent().hasName('repeatImgGroup')
        text1 = this.getText(x)
        return bool
      }
      )
      if (shiftSelectionMode && curHasCantSelect) {
        text1 && this.$message.warning(text1)
        return null
      }
      const selectedNodes = [];
      this.traverse((node, nodeModel) => {
        if (shiftSelectionMode) {
          if ((node.pathStr === selectedNode.pathStr || node.pathStr === this.lastSelectedNode.pathStr)
            && this.getSelected().length > 0 && (selectedNode.path[0] == this.getSelected()[0].path[0])
          ) {
            if (node.isSelectable) {
              if (node.pathStr === selectedNode.pathStr) {
                nodeModel.isSelected = !selectedNode.isSelected
              }
            } else {
              nodeModel.isSelected = false
            }
          }
        } else if (node.pathStr === selectedNode.pathStr) {
          nodeModel.isSelected = node.isSelectable;
        } else if (!addToSelection) {
          if (nodeModel.isSelected) nodeModel.isSelected = false;
        }
        if (nodeModel.isSelected) selectedNodes.push(node);
      }, newNodes);
      this.lastSelectedNode = selectedNode;
      this.emitInput(newNodes);
      this.emitSelect(selectedNodes, event);
      return selectedNode;
    },
    onMousemoveHandler(event) {
      if (!this.isRoot) {
        this.getRoot().onMousemoveHandler(event);
        return;
      }
      if (this.preventDrag) return;
      const initialDraggingState = this.isDragging;
      const isDragging =
        this.isDragging || (
          this.mouseIsDown &&
          (this.lastMousePos.x !== event.clientX || this.lastMousePos.y !== event.clientY)
        );
      const isDragStarted = initialDraggingState === false && isDragging === true;
      this.lastMousePos = {
        x: event.clientX,
        y: event.clientY
      };
      if (!isDragging) return;
      const $root = this.getRoot().$el;
      const rootRect = $root.getBoundingClientRect();
      const $dragInfo = this.$refs.dragInfo;
      const dragInfoTop = (event.clientY - rootRect.top + $root.scrollTop - ($dragInfo.style.marginBottom | 0) + 20);
      const dragInfoLeft = (event.clientX - rootRect.left - 50);
      $dragInfo.style.top = dragInfoTop + 'px';
      $dragInfo.style.left = dragInfoLeft + 'px';
      const cursorPosition = this.getCursorPositionFromCoords(event.clientX, event.clientY);
      const destNode = cursorPosition.node;
      const placement = cursorPosition.placement;
      if (isDragStarted && !destNode.isSelected) {
        this.select(destNode.path, false, event);
      }
      const draggableNodes = this.getDraggable();
      if (!draggableNodes.length) {
        this.preventDrag = true;
        return;
      }
      this.isDragging = isDragging;
      this.setCursorPosition({ node: destNode, placement });
      const scrollBottomLine = rootRect.bottom - this.scrollAreaHeight;
      const scrollDownSpeed = (event.clientY - scrollBottomLine) / (rootRect.bottom - scrollBottomLine);
      const scrollTopLine = rootRect.top + this.scrollAreaHeight;
      const scrollTopSpeed = (scrollTopLine - event.clientY) / (scrollTopLine - rootRect.top);
      if (scrollDownSpeed > 0) {
        this.startScroll(scrollDownSpeed);
      } else if (scrollTopSpeed > 0) {
        this.startScroll(-scrollTopSpeed)
      } else {
        this.stopScroll();
      }
    },
    getCursorPositionFromCoords(x, y) {
      const $target = document.elementFromPoint(x, y);
      const $nodeItem = $target.getAttribute('path') ? $target : this.getClosetElementWithPath($target);
      let destNode;
      let placement;
      if ($nodeItem) {
        if (!$nodeItem) return;
        destNode = this.getNode(JSON.parse($nodeItem.getAttribute('path')));
        const nodeHeight = $nodeItem.offsetHeight;
        const edgeSize = this.edgeSize;
        const offsetY = y - $nodeItem.getBoundingClientRect().top;
        if (destNode.isLeaf) {
          placement = offsetY >= nodeHeight / 2 ? 'after' : 'before';
        } else {
          if (offsetY <= edgeSize) {
            placement = 'before';
          } else if (offsetY >= nodeHeight - edgeSize) {
            placement = 'after';
          } else {
            placement = 'inside';
          }
        }
      } else {
        const $root = this.getRoot().$el;
        const rootRect = $root.getBoundingClientRect();
        if (y > rootRect.top + (rootRect.height / 2)) {
          placement = 'after';
          destNode = this.getLastNode();
        } else {
          placement = 'before';
          destNode = this.getFirstNode();
        }
      }
      return { node: destNode, placement };
    },
    getClosetElementWithPath($el) {
      if (!$el) return null;
      if ($el.getAttribute('path')) return $el;
      return this.getClosetElementWithPath($el.parentElement);
    },
    onMouseleaveHandler(event) {
      if (!this.isRoot || !this.isDragging) return;
      const $root = this.getRoot().$el;
      const rootRect = $root.getBoundingClientRect();
      if (event.clientY >= rootRect.bottom) {
        this.setCursorPosition({ node: this.nodes.slice(-1)[0], placement: 'after' });
      } else if (event.clientY < rootRect.top) {
        this.setCursorPosition({ node: this.getFirstNode(), placement: 'before' });
      }
    },
    getNodeEl(path) {
      return this.getRoot().$el.querySelector(`[path="${JSON.stringify(path)}"]`);
    },
    getLastNode() {
      let lastNode = null;
      this.traverse((node) => {
        lastNode = node;
      });
      return lastNode;
    },
    getFirstNode() {
      return this.getNode([0]);
    },
    getNextNode(path, filter = null) {
      let resultNode = null;
      this.traverse((node) => {
        if (this.comparePaths(node.path, path) < 1) return;
        if (!filter || filter(node)) {
          resultNode = node;
          return false;
        }
      });
      return resultNode;
    },
    getPrevNode(path, filter) {
      let prevNodes = [];
      this.traverse((node) => {
        if (this.comparePaths(node.path, path) >= 0) {
          return false;
        }
        prevNodes.push(node);
      });
      let i = prevNodes.length;
      while (i--) {
        const node = prevNodes[i];
        if (!filter || filter(node)) return node;
      }
      return null;
    },
    comparePaths(path1, path2) {
      for (let i = 0; i < path1.length; i++) {
        if (path2[i] == void 0) return 1;
        if (path1[i] > path2[i]) return 1;
        if (path1[i] < path2[i]) return -1;
      }
      return path2[path1.length] == void 0 ? 0 : -1;
    },
    onNodeMousedownHandler(event, node) {
      if (event.button !== 0) return;
      if (!this.isRoot) {
        this.getRoot().onNodeMousedownHandler(event, node);
        return;
      }
      this.mouseIsDown = true;
    },
    startScroll(speed) {
      const $root = this.getRoot().$el;
      if (this.scrollSpeed === speed) {
        return;
      } else if (this.scrollIntervalId) {
        this.stopScroll();
      }
      this.scrollSpeed = speed;
      this.scrollIntervalId = setInterval(() => {
        $root.scrollTop += this.maxScrollSpeed * speed;
      }, 20);
    },
    stopScroll() {
      clearInterval(this.scrollIntervalId);
      this.scrollIntervalId = 0;
      this.scrollSpeed = 0;
    },
    onDocumentMouseupHandler(event) {
      if (this.isDragging) this.onNodeMouseupHandler(event);
    },
    onNodeMouseupHandler(event, targetNode = null) {
      if (event.button !== 0) return;
      if (!this.isRoot) {
        this.getRoot().onNodeMouseupHandler(event, targetNode);
        return;
      }
      this.mouseIsDown = false;
      if (!this.isDragging && targetNode && !this.preventDrag) {
        this.select(targetNode.path, false, event);
      }
      this.preventDrag = false;
      if (!this.cursorPosition) {
        this.stopDrag();
        return;
      }
      if (this.cursorPosition.placement == 'inside') {
        this.stopDrag();
        return;
      }
      const draggingNodes = this.getDraggable();
      let boolOfSamePath = draggingNodes.every(node => {
        return node.path[0] == this.cursorPosition.node.path[0]
      })
      if (!boolOfSamePath) {
        this.stopDrag();
        return;
      }
      if (((this.cursorPosition.node.data.attrs && this.cursorPosition.node.data.getAttrs().name.indexOf('isBg') > -1) || (this.cursorPosition.node.type == 'view') && this.cursorPosition.placement == 'after')) {
        this.stopDrag();
        return;
      }
      for (let draggingNode of draggingNodes) {
        if (draggingNode.pathStr == this.cursorPosition.node.pathStr) {
          this.stopDrag();
          return;
        }
        if (this.checkNodeIsParent(draggingNode, this.cursorPosition.node)) {
          this.stopDrag();
          return;
        }
      }
      const newNodes = this.copy(this.currentValue);
      newNodes.forEach(o => {
        o.childrens && o.childrens.length > 0 && o.childrens.forEach(i => {
          i._markToDelete = undefined
        })
      })
      const nodeModelsSubjectToInsert = [];
      for (let draggingNode of draggingNodes) {
        const sourceSiblings = this.getNodeSiblings(newNodes, draggingNode.path);
        const draggingNodeModel = sourceSiblings[draggingNode.ind];
        nodeModelsSubjectToInsert.push(draggingNodeModel);
      }
      let cancelled = false;
      this.emitBeforeDrop(draggingNodes, this.cursorPosition, () => cancelled = true);
      if (cancelled) {
        this.stopDrag();
        return;
      }
      const nodeModelsToInsert = [];
      for (let draggingNodeModel of nodeModelsSubjectToInsert) {
        nodeModelsToInsert.push(this.copy(draggingNodeModel));
        draggingNodeModel['_markToDelete'] = true;
      }
      let deleteOnceList = []
      this.insertModels(this.cursorPosition, nodeModelsToInsert, newNodes);
      this.traverseModels((nodeModel, siblings, ind) => {
        if (!nodeModel._markToDelete) return;
        if (deleteOnceList.includes(nodeModel._id)) return;
        deleteOnceList.push(nodeModel._id)
        siblings.splice(ind, 1);
      }, newNodes);
      this.lastSelectedNode = null;
      this.emitInput(newNodes);
      this.emitDrop(draggingNodes, this.cursorPosition, event);
      this.stopDrag();
    },
    onToggleHandler(event, node) {
      if (!this.allowToggleBranch) return;
      this.updateNode(node.path, { isExpanded: !node.isExpanded });
      this.emitToggle(node, event);
      event.stopPropagation();
    },
    stopDrag() {
      this.isDragging = false;
      this.mouseIsDown = false;
      this.setCursorPosition(null);
      this.stopScroll();
    },
    getParent() {
      return this.$parent;
    },
    getRoot() {
      if (this.isRoot) return this;
      return this.getParent().getRoot();
    },
    getNodeSiblings(nodes, path) {
      if (path.length === 1) return nodes;
      return this.getNodeSiblings(nodes[path[0]].childrens, path.slice(1));
    },
    updateNode(path, patch) {
      if (!this.isRoot) {
        this.getParent().updateNode(path, patch);
        return;
      }
      const pathStr = JSON.stringify(path);
      const newNodes = this.copy(this.currentValue);
      this.traverse((node, nodeModel) => {
        if (node.pathStr !== pathStr) return;
        Object.assign(nodeModel, patch);
      }, newNodes);
      this.emitInput(newNodes);
    },
    getSelected() {
      const selectedNodes = [];
      this.traverse((node) => {
        if (node.isSelected) selectedNodes.push(node);
      });
      return selectedNodes;
    },
    getDraggable() {
      const selectedNodes = [];
      this.traverse((node) => {
        if (node.isSelected && node.isDraggable) selectedNodes.push(node);
      });
      return selectedNodes;
    },
    traverse(
      cb,
      nodeModels = null,
      parentPath = []
    ) {
      if (!nodeModels) nodeModels = this.currentValue;
      let shouldStop = false;
      const nodes = [];
      for (let nodeInd = 0; nodeInd < nodeModels.length; nodeInd++) {
        const nodeModel = nodeModels[nodeInd];
        const itemPath = parentPath.concat(nodeInd);
        const node = this.getNode(itemPath, nodeModel, nodeModels);
        shouldStop = cb(node, nodeModel, nodeModels) === false;
        nodes.push(node);
        if (shouldStop) break;
        if (nodeModel.childrens) {
          shouldStop = this.traverse(cb, nodeModel.childrens, itemPath) === false;
          if (shouldStop) break;
        }
      }
      return !shouldStop ? nodes : false;
    },
    traverseModels(cb, nodeModels) {
      let i = nodeModels.length;
      while (i--) {
        const nodeModel = nodeModels[i];
        if (nodeModel.childrens) this.traverseModels(cb, nodeModel.childrens);
        cb(nodeModel, nodeModels, i);
      }
      return nodeModels;
    },
    remove(paths) {
      const pathsStr = paths.map(path => JSON.stringify(path));
      const newNodes = this.copy(this.currentValue);
      this.traverse((node, nodeModel, siblings) => {
        for (const pathStr of pathsStr) {
          if (node.pathStr === pathStr) nodeModel._markToDelete = true;
        }
      }, newNodes);
      this.traverseModels((nodeModel, siblings, ind) => {
        if (!nodeModel._markToDelete) return;
        siblings.splice(ind, 1);
      }, newNodes);
      this.emitInput(newNodes);
    },
    insertModels(cursorPosition, nodeModels, newNodes) {
      const destNode = cursorPosition.node;
      const destSiblings = this.getNodeSiblings(newNodes, destNode.path);
      const destNodeModel = destSiblings[destNode.ind];
      if (cursorPosition.placement === 'inside') {
        destNodeModel.childrens = destNodeModel.childrens || [];
        destNodeModel.childrens.unshift(...nodeModels);
      } else {
        const insertInd = cursorPosition.placement === 'before' ?
          destNode.ind :
          destNode.ind + 1;
        destSiblings.splice(insertInd, 0, ...nodeModels);
      }
    },
    insert(cursorPosition, nodeModel) {
      const nodeModels = Array.isArray(nodeModel) ? nodeModel : [nodeModel];
      const newNodes = this.copy(this.currentValue);
      this.insertModels(cursorPosition, nodeModels, newNodes);
      this.emitInput(newNodes);
    },
    checkNodeIsParent(sourceNode, destNode) {
      const destPath = destNode.path;
      return JSON.stringify(destPath.slice(0, sourceNode.path.length)) == sourceNode.pathStr;
    },
    copy(entity) {
      if (entity instanceof Array) {
        return entity.map(e => {
          let newObj = {};
          newObj.__proto__ = e.__proto__
          Object.keys(e).forEach(x => {
            newObj[x] = e[x]
          })
          return newObj
        })
      } else {
        let newObj = {};
        newObj.__proto__ = entity.__proto__
        Object.keys(entity).forEach(x => {
          newObj[x] = entity[x]
        })
        return newObj
      }
    },
    getText(node) {
      let text = ''
      if (node.type == 'view') {
        text = "多选不能包含面";
        return ''
      }
      if (node.type != 'view' && node.data.getParent()?.hasName("repeatImgGroup")) {
        text = "多选不能包含平铺的图";
      }
      if (node.type != 'view' && node.data.getAttrs().name.indexOf("isBg") > -1) {
        text = "多选不能包含背景图";
      }
      if (node.isLock) {
        text = "多选不能包含锁定的图";
      }
      if (node.isHidden) {
        text = "多选不能包含隐藏的图";
      }
      return text
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./css/sl-vue-tree-dark.css";

.imgUrlBox {
  height: 20px;
  line-height: 20px;
  display: inline-flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;

  img {
    max-width: 15px;
    max-height: 15px;
    margin: -2px 2px 0 0;
  }
}

.imgUrlBgBox {
  height: 20px;
  line-height: 20px;
  display: inline-flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;

  .iconbg {
    font-size: 15px !important;
  }

  img {
    max-width: 15px;
    max-height: 15px;
    margin: -2px 2px 0 0;
  }
}

.bg-color-rect {
  width: 20px;
  display: inline-block;
  position: absolute;
  height: 20px;
  right: 20px;
  top: 10px;
}

.iconfont {
  font-size: 15px !important;
}

.apearOperate {
  .visible-icon {
    visibility: visible !important;
  }
}
</style>
