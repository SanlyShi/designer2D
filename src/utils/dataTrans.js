export function transModelData(data) {
  let model = {};
  data?.map((d) => {
    let sigleObj = {};
    d.model_data.uv_list.forEach(u=>{
      u['faceList'] = u.face_list
    })
    sigleObj = Object.assign(
      {},
      {
        detail3d: Object.assign(
          {},
          {
            model_id: d.model_id,
            parts: d.model_parts,
          }
        ),
        modelData: Object.assign(
          {},
          {
            baseFiles: d.model_data.base_files,
            enable_hdr: d.model_data.enable_hdr,
            position: d.model_data.position,
            renderParams: d.model_data.render_params,
            uvList: d.model_data.uv_list,
          }
        ),
        colorsData: {},
      }
    );
    d.colors_data.map((c) => {
      let obj = Object.assign(
        {},
        {
          id: c.id,
          data: Object.assign(
            {},
            {
              designColorCode: c.design_color_code,
              designColorType: c.design_color_type,
              designColorUrl: c.design_color_url,
              textureMap: c.texture_map,
            }
          ),
        }
      );
      sigleObj["colorsData"][c.id] = obj;
    });
    if(d.color_id){
      model[d.color_id] = sigleObj;
    }else{
      model['default'] = sigleObj;
    }
  });
  return model;
}
export function transPartSpuData(data) {
  let spuData = {};
  spuData["spu_details"] = data.spu_parts;
  spuData["pack_list"] = data.brand_pack_list?.map((b) => {
    let obj = Object.assign(
      {},
      {
        id: b.attr_id,
        img: b.img_url,
        is_default: b.is_default,
        name: b.name,
        price: b.price,
      }
    );
    return obj;
  });
  spuData["custom_logo_list"] = data.custom_logo_list?.map((b) => {
    let obj = Object.assign(
      {},
      {
        id: b.attr_id,
        code: b.code,
        image_url: b.image_url,
        name: b.name,
        price: b.price,
      }
    );
    return obj;
  });
  return Object.assign(spuData, {show_custom_logo_icon: data.show_custom_logo_icon});
}

export function transActiveColorSize(data){
  let czObj = {};
  data.forEach(item => {
    czObj[item.color] = item.sizes;
  });
  return czObj;
}

export function transViews(data){
  return data.map(a =>{
    a.print_area = a.print_area || {};
    a.pointout_print_areas = a.pointout_print_areas || {};
    return a;
  })
}

export function transView(viewData){
  if(viewData.printArea && !viewData.print_area){
    viewData.print_area = viewData.printArea;
    viewData.print_area.view_width = viewData.printArea.viewWidth;
  }
  if(viewData.pointoutPrintAreas && !viewData.pointout_print_areas){
    viewData.pointout_print_areas = viewData.pointoutPrintAreas;
  }
  if(viewData.printAreaImage && !viewData.print_area_image){
    viewData.print_area_image = viewData.printAreaImage
  }
  return viewData;
}

export function convert3dData(modelOptions) {
  return modelOptions.map(modelOption => {
    if (!modelOption.detail_3d) {
      return modelOption
    }
    return {
      ...modelOption,
      detail3D: {
        ...modelOption.detail_3d,
        baseFiles: modelOption.detail_3d.zipfiles,
        renderParams: modelOption.detail_3d.render_params,
        uvList: modelOption.detail_3d.uv_list.map(uv => ({
          ...uv,
          customBase: {
            designColorCode: uv.design_color_custom_base.design_color_code,
            designColorType: uv.design_color_custom_base.design_color_type,
            designColorUrl: uv.design_color_custom_base.design_color_url,
          },
          faceList: uv.face_list
        })),
        textureMap: modelOption.detail_3d.texture_map
      },
      distortParams: modelOption.distort_params
    }
  })
}
export function transformPicOrTemplateListData(picListData) {
  return {
    data:{
      data:picListData.data.list?picListData.data.list.map(picItem=>{
        return {
          ...picItem
        }
      }):[],
      last_page:Math.trunc(picListData.data.total/30),
      per_page:30,
      total:picListData.data.total
    }
  }
}
export function transformTemplateData(data) {
  return {
    cfg:data[0].cfg,
    views:data[0].views?data[0].views.map(v=>{
      return {...v}
    }):[]
  }
}