<script>
import ModelPartsPreview from "@/components/ModelPartsPreview"

export default {
  components: {
    ModelPartsPreview,
  },
  computed: {
    m_mpp_curModelForPart() {
      let cid = this.curColorId
      if (!this.productData.show_3d_model) return
      const model = this.productData.show_3d_model[cid] || this.productData.show_3d_model['default']
      if (!model || !model.colors) return console.log('对应颜色未设置模型')
      let colorModel = model.colors.find(i => i.id == cid)
      if (!colorModel) return console.log('对应颜色未设置模型')
      return colorModel.detail[0].parts
    },
    m_mpp_curModelIdForPart() {
      return this.m_mpp_curModelForPart && this.m_mpp_curModelForPart[0].modelId
    },
    m_mpp_selectType(nv, ov) {
      return this.$store.layout.state.showType
    }
  },
  watch: {
    '$store.product.partDetail.part_id': () => {
      this.$refs.ModelPartsPreview.update(this.m_mpp_getFaceListMap())
    }
  },
  methods: {
    m_mpp_putPartImgToLayer(src) {
      this.productData.views.forEach(async view => {
        const curS = this.getCurStageLayer({ viewId: view.id})
        const mainImgLayer = curS.mainImgLayer
        await this.layerAddImg({src, viewId:view.id})
        mainImgLayer.findOne('Image').name('part')
        mainImgLayer.show()
        mainImgLayer.batchDraw()
      })
    },
    m_mpp_getFaceListMap() {
      let faceListMap = {}
      for (let item of this.viewImgObj) {
        faceListMap[item.id] = item.viewDesignCanvas
      }
      return faceListMap
    }
  }
}
</script>