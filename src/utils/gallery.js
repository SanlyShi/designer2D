import store from '@/store';
import { _changeImgStyle } from "@/apis/gallery.js";
import { Message } from 'element-ui';
import {SDKCONFIG} from '@/utils/sdkConfig';

// 风险词判断
export function genRiskInfo(data) {
  if(!SDKCONFIG.platformIsZWKJ){
    return { show: false, color: '', tips: ''}
  }
  let riskLevel = data.risk_word.length ? data.risk_word[0].level : 0; //5高风险等级,其它忽略
  let risk1 = data.risk_gallery.risk.map((a) => a.name); //人工审核
  let risk2 = data.risk_gallery.other.map((a) => a.name); //第三方审核
  let isShow = false,
    tips = "",
    color = "#FF3366";
  if (risk1.length || risk2.length) {
    isShow = true;
    // 风险词去重
    let names = [...risk1, ...risk2].reduce((prev, cur) => {
      if (!prev.includes(cur)) prev.push(cur);
      return prev;
    }, []);
    if (risk1.length) {
      // risk1和risk2合并，属于risk1的需要显示红色
      names = names.map((a) => {
        return risk1.includes(a)
          ? `<span style="color:red;">${a}</span>`
          : a;
      });
      names = names.join("、");
      if (riskLevel == 5) {
        tips = `1、图片文本含敏感信息；<br/>2、疑似风险类型：${names}`;
      } else {
        tips = `疑似风险类型：${names}`;
      }
    } else {
      names = names.join("、");
      if (riskLevel == 5) {
        tips = `1、图片文本含敏感信息；<br/>2、疑似风险类型：${names}`;
      } else {
        color = "#FAAF19";
        tips = `疑似风险类型：${names}`;
      }
    }
  } else {
    if (riskLevel == 5) {
      isShow = true;
      tips = `图片文本含敏感信息`;
    }
  }
  return {
    show: isShow,
    color,
    tips,
  };
}

// 当图片文字含有“高危风险词”或“人工审核结果为涉政、暴恐、涉黄、不良场景”, 不允许添加设计
export function isRisk(data) {
  if(!SDKCONFIG.platformIsZWKJ) return false
  const highRiskIds = [1, 3, 4, 6]; //1涉政, 3涉黄, 4暴恐, 6不良场景
  let isHighRisk = data?.risk_gallery?.risk.reduce((prev, cur) => {
    return prev || highRiskIds.includes(cur.id);
  }, false);
  return (
    (data.risk_word?.length && data.risk_word[0]?.level == 5) || isHighRisk
  );
}

// 图片滤镜
export function changeImageFilter(data) {
  return new Promise((resolve, reject) => {
    let { render_code, params, node } = data;
    if (render_code) {
      _changeImgStyle({
        code: render_code,
        params: params
      }).then(res => {
        if (res.code == 'success') {
          node.setAttrs({ filterType: render_code, rendercode: render_code, render_id: res.data.render_id });
          resolve(res);
          // store.commit('gallery/setFilterData', Object.assign(res.data, {rendercode: render_code}));
        }
      }).catch(err => {
        Message({
          message: err.msg,
          type: "error",
          duration: 3000
        });
      })
    } else {
      node.setAttrs({ filterType: '', rendercode: '', render_id: '' });
      resolve();
      // store.commit('gallery/setFilterData', Object.assign({render_id: '', url2: node.getAttrs().designImg2, rendercode: ''}));
    }
  })
}