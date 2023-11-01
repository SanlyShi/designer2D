import { Message } from 'element-ui';
export default {
  install(Vue) {
    Vue.directive('zwcopy', {
      bind: function (el, binding) {
        let input = null
        el.addEventListener('mousedown', function () {
          input = binding.value.isHtml ? document.createElement('textarea') : document.createElement('input')
          el.appendChild(input)
          input.style.position = 'fixed'
          input.style.left = '-1000px'
          if(binding.value.isHtml){
            input.value = (el.bindingVal || binding.value.value).replace(/\<br\>/g, '\n');      
          } else {
            input.value = el.bindingVal || binding.value.value
          }
          input.focus()
          input.select()
          document.execCommand("copy")
          Message.success(binding.value.toast)
        })
        el.addEventListener('mouseup', function () {
          input.remove()
        })
      },
      // 防止更新后复制的信息错误
      update: function(el, binding){
        el.bindingVal = binding.value.value;
      }
    })
  }

}