import {
    editTextSetTextareaStyle
} from "@/utils/designer.js";
export default {
    data() {
        return {
          textareaMouseDown: false
        }
    },
    methods: {
        m_editText_textDblClick(textGroup) {
            if(textGroup.isLock) return
            const text = textGroup.findOne('Text')
            let {layer, stage} = this.getCurStageLayer({ viewId: this.viewId });
            this.editTextPop = true
            textGroup.hide();
            this.destroyTransformer()
            this.curNode = textGroup
            this.$store.commit("layout/changeSelectType", 'text');
            layer.draw();

            // create textarea over canvas with absolute position
            // first we need to find position for textarea
            // how to find it?
            // at first lets find position of text node relative to the stage:
            

            // create textarea and style it
            // let div = document.createElement('div');
            var textarea = document.createElement('div');
            let contentEditableDiv = document.createElement('div');
            let span = document.createElement('span')
            contentEditableDiv.appendChild(span)
            textarea.appendChild(contentEditableDiv)
            // div.appendChild(textarea)
            textarea.setAttribute('id', 'editingText')
            document.body.appendChild(textarea);
            
            
            editTextSetTextareaStyle(textGroup, this.viewId)
            this.m_editText_selectText('editingText')
            textarea.focus();

            textarea.addEventListener('keydown', (e) => {
                setTimeout(() => {
                    // if((e.keyCode === 8 || e.keyCode === 46) && textarea.childNodes[0].childNodes[0].innerText === '') { //删除所有文字会把span也删了
                    //     textarea.childNodes[0].innerText = ""
                    //     span = document.createElement('span')
                    //     textarea.childNodes[0].appendChild(span)
                    //     span.style.display = "inline-block"
                    //     span.style.width = '100%'
                    //     span.style.height = `${textarea.clientHeight}px`
                    // }
                    // hide on enter
                    // but don't hide on shift + enter
                    // if (e.keyCode === 13 && !e.shiftKey) {
                    // text.text(span.innerText);
                    // this.m_editText_removeTextarea()
                    // }
                    // on esc do not set value back to node
                    if (e.keyCode === 27) {
                    this.m_editText_removeTextarea()
                    }
                });
            });

            textarea.addEventListener("keydown", (e) => {
                // let scale = text.getAbsoluteScale().x;
                setTimeout(() => {
                    text.text(span.innerText);
                    // this.m_editText_setTextareaWidth(text.width());
                    // textarea.style.width = 'auto';
                    // textarea.style.height =
                    //   textarea.scrollHeight + text.fontSize() + 'px';
                    // textarea.style.height = textGroup.height() * textGroupScale.x + "px";
                    // textarea.style.height = 'auto'
                });
            });
            textarea.addEventListener("mousedown", (e) => {
                this.textareaMouseDown = true
            });
            textarea.addEventListener("mouseup", (e) => {
              this.textareaMouseDown = false
            });
            setTimeout(() => {
                window.addEventListener('click', this.m_editText_handleOutsideClick);
            });
        },
        m_editText_handleOutsideClick(e) {
            let textarea = document.getElementById('editingText')
            if(e.target?.className?.indexOf("el-color-picker") > -1 ||
            e.target?.parentNode?.parentNode == textarea ||
            e.target?.parentNode == textarea ||
            this.textareaMouseDown) { //1、修改文字颜色不能退出编辑 2、div里面有div、span，点击div、span不能退出编辑 3、框选文字鼠标超出文字区域不能退出编辑
              this.textareaMouseDown = false
              return
            }
            if(this.curNode && this.curNode.type == 'text') {
              let textGroup = this.curNode
            //   let text = textGroup.findOne('Text')
            //   let contentEditableDiv = textarea.childNodes[0]
              if (textarea && (e.target !== textarea || e === 'stopEdit')) {
                // text.text(contentEditableDiv.innerText);
                this.textareaMouseDown = false
                this.m_editText_removeTextarea()
                textGroup.fire('click')
                return true
              }
            }
            return false
        },
        m_editText_removeTextarea() {
            this.confirmEditText()
        },
        m_editText_setTextareaWidth(newWidth) {
            let textarea = document.getElementById('editingText')
            if (!newWidth) {
              // set width for placeholder
              newWidth = text.placeholder.length * text.fontSize();
            }
            // some extra fixes on different browsers
            var isSafari = /^((?!chrome|android).)*safari/i.test(
              navigator.userAgent
            );
            var isFirefox =
              navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isSafari || isFirefox) {
              newWidth = Math.ceil(newWidth);
            }
      
            var isEdge =
              document.documentMode || /Edge/.test(navigator.userAgent);
            if (isEdge) {
              newWidth += 1;
            }
            textarea.style.width = newWidth + 'px';
        },
        m_editText_selectText(containerid) { //加高亮
            let span = document.getElementById(containerid).childNodes[0].childNodes[0]
            if (document.selection) { // IE
                var range = document.body.createTextRange();
                range.moveToElementText(span);
                range.select();
            } else if (window.getSelection) {
                var range = document.createRange();
                range.selectNode(span);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
            }
        },
        
    }
}