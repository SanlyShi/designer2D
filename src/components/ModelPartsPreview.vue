<template>
  <div ref="container"></div>
</template>
<script>
import { composeDetail3D } from "zw-3d/new3d/lib/zw3d";
export default {
  props: [
    'modelOptions',
    'modelId',
      'baseWidth'
  ],
  data() {
    return {
      drawApp: null,
      curModelId: null,
      partId: null
    }
  },
  methods: {
    setPart(item) {
      this.partId = item.part_id
    },
    getImg(faceListMap) {
      if (!this.modelId || !this.modelOptions) {
        return this.$emit('getImg', null)
      }
      if (this.modelId === this.curModelId) {
        this.update(faceListMap)
      }else {
        this.curModelId = this.modelId
        this.drawApp && this.drawApp.destroy()
        this.drawApp = new composeDetail3D({
          faceListMap,
          baseWidth: this.baseWidth,
          disableTransformAnimate: true,
          modelOptions: this.modelOptions,
          container: this.$refs.container,
          partPosition: this.getPartPos(),
          type: 2,
          partIds: this.$store.state.product.partCheckedList,
          callBack: (img) => {
            this.$emit('getImg', img.toDataURL())
          }
        });
      }
    },
    getPartPos() {
      let detail3d = this.modelOptions[0].detail3D
      if (!detail3d.parts) {
        return false
      }

      const matchPart = detail3d.parts.find(part => (part.part_id == this.partId) && part.params)

      if (!matchPart) {
        return false
      }
      return JSON.parse(matchPart.params)
    },
    update(faceListMap) {
      if (this.getPartPos()) {
        this.drawApp.setCameraPosition({...this.getPartPos(), needRender: false})
      }
      this.drawApp.updateFaceListMap(faceListMap, (img) => {
        this.$emit('getImg', img.toDataURL())
      })
    },
    updatePart(partId, childPartId, colorId) {
      this.drawApp.updatePart(partId, childPartId, colorId)
    }
  }
}
</script>