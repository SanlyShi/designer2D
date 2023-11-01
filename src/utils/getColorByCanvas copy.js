/**
 * 取色器
 */
class getColorByCanvas {
    constructor({canvas, imgs = '', originalRadius = 50, scale = 10, background = "#ffffff", stage, Konva, viewId, $store} = {}) {
        this.$store = $store
        this.canvas = canvas
        this.context = canvas.getContext("2d")
        this.stage = stage
        this.viewId = viewId
        this.Konva = Konva
        this.imgs = imgs
        this.img = null
        this.onloadImg = ''
        this.background = background == '' ? '#ffffff' : background
        // 图片被放大区域的中心点，也是放大镜的中心点
        this.centerPoint = {}
        // 图片被放大区域的半径
        this.originalRadius = originalRadius;
        // 图片被放大区域
        this.originalRectangle = {};
        // 放大倍数
        this.scale = scale;
        // 放大后区域
        this.scaleGlassRectangle
  
        this.centerPoint.x = 0;
        this.centerPoint.y = 0;
        this.isInit = true
        //放大镜网格宽、高
        this.gridStepX = 10
        this.gridStepY = 10

        // this.pickColorLayer = new Konva.Layer({
        //     x: 0,
        //     y: 0,
        //     name: "pickColorLayer"
        // });
        // this.stage.add(this.pickColorLayer)
        // this.context = this.pickColorLayer.getContext()

        // console.log("放大镜网格宽、高", this.stage.findOne('.pickColorLayer'), this.pickColorLayer.findOne('.aaaa'))
    }
    get bg() {
        return this.background
    }
    set bg(bg) {
        this.background = bg
    }
    get cPoint() {
        return this.centerPoint
    }
    set cPoint(p) {
        this.centerPoint = p
    }
    get getImgs() {
        return this.imgs
    }
    set setImgs(img) {
        this.imgs = img
    }
    get getIsInit() {
        return this.isInit
    }
    set setIsInit(data) {
        this.isInit = data
    }
    glassInit() {
        let _this = this
        this.img = new Image();
        this.img.setAttribute('crossOrigin', 'anonymous');
        this.drawBackGround()
        // this.stage.on('mousemove', function(e) {
        //     // _this.canvas.style.cursor = 'none'
        //     // _this.centerPoint = _this.windowToCanvas(e.evt.clientX, e.evt.clientY);
        //     _this.centerPoint = _this.windowToCanvas(e.evt.clientX, e.evt.clientY);
        //     _this.isInit = false
        //     _this.draw();
        // })
        this.canvas.onmousemove = function (e) {
            _this.canvas.style.cursor = 'none'
            _this.centerPoint = _this.windowToCanvas(e.clientX, e.clientY);
            _this.isInit = false
            _this.draw();
        }
        this.canvas.onmouseout = function (e) {
            document.body.style.cursor = 'not-allowed'
            // _this.drawBackGround()
        }
        this.canvas.onclick = function() {
          document.body.style.cursor = 'auto'
        }
        
    }
    drawBackGround() {
        let _this = this
        // this.context.fillStyle = this.background;
        // this.context.fillRect(0, 0, this.stage.width(), this.stage.height());
        return new Promise((rosolve, reject) => {
            if(this.imgs == '') {
                rosolve()
                return
            }
            if(this.isInit) {
                this.img.src = this.imgs
                this.img.onload=function(){
                    // _this.context.drawImage(_this.img, 0, 0, _this.stage.width(), _this.stage.height())
                    _this.context.drawImage(_this.img, 0, 0, _this.canvas.width, _this.canvas.height)
                    _this.onloadImg = _this.img
                    // let image = new _this.Konva.Image({
                    //     x: 0,
                    //     y: 0,
                    //     image: _this.img,
                    //     width: _this.stage.width(),
                    //     height: _this.stage.height()
                    // });
                    // _this.pickColorLayer.add(image)
                    rosolve()
                }
            }else {
                // this.context.drawImage(this.onloadImg, 0, 0, _this.stage.width(), _this.stage.height());
                this.context.drawImage(this.onloadImg, 0, 0, _this.canvas.width, _this.canvas.height);
                rosolve()
            }
        })
        
    }
    draw() {
        this.context.clearRect(0, 0, this.stage.width(), this.stage.height());
        // this.pickColorLayer.clearBeforeDraw(true)
        // this.pickColorLayer.clear()
        this.drawBackGround().then(() => {
            // setTimeout(() => {
                this.calOriginalRectangle(this.centerPoint);
                this.drawMagnifyingGlass();
            // },3000)
        })
    }
    windowToCanvas(x, y) {
        let bbox = this.canvas.getBoundingClientRect();
        // let bbox = this.stage.getClientRect()
        // let bbox = {
        //     x: document.getElementById(`container${this.viewId}`).offsetLeft + document.getElementById("stageContainer").offsetLeft + this.originalRadius,
        //     y: document.getElementById(`container${this.viewId}`).offsetTop + document.getElementById("stageContainer").offsetTop + this.originalRadius
        // }
        // let bbox = document.getElementById(`container${this.viewId}`).getBoundingClientRect();
        return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)}
        // return {x: Math.round(x - bbox.x), y: Math.round(y - bbox.y)}
    }
    calOriginalRectangle(point) {
        this.originalRectangle.x = point.x - this.originalRadius;
        this.originalRectangle.y = point.y - this.originalRadius;
        this.originalRectangle.width = this.originalRadius * 2;
        this.originalRectangle.height = this.originalRadius * 2;
    }
    getScrollPosition(el = window) {
        return {
            x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
            y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
        }
    }
    //放大镜
    drawMagnifyingGlass() {
        this.scaleGlassRectangle = {
            x: this.centerPoint.x - this.originalRectangle.width * this.scale / 2,
            y: this.centerPoint.y - this.originalRectangle.height * this.scale / 2,
            width: this.originalRectangle.width * this.scale,
            height: this.originalRectangle.height * this.scale
        }
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.centerPoint.x, this.centerPoint.y, this.originalRadius, 0, Math.PI * 2, false);
        this.context.clip();
        //设置图片为不平滑，可出现像素点
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.msImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        this.context.oImageSmoothingEnabled = false;
        // console.log(scrollXY.x.toString().split('.')[0])
        // let clientWidth = document.body.offsetWidth
        this.context.drawImage(this.onloadImg,
            this.originalRectangle.x, this.originalRectangle.y,
            this.originalRectangle.width, this.originalRectangle.height,
            // this.scaleGlassRectangle.x - (clientWidth % 2 == 0 ? this.gridStepX / 2 : 0), this.scaleGlassRectangle.y - this.gridStepY / 2,
            this.scaleGlassRectangle.x - this.gridStepX / 2, this.scaleGlassRectangle.y - this.gridStepY / 2,
            this.scaleGlassRectangle.width, this.scaleGlassRectangle.height
        )
        
        this.drawGrid(this.context, '#221963', this.gridStepX, this.gridStepY)
        this.context.restore();

        this.context.beginPath();
        let gradient = this.context.createRadialGradient(
        this.centerPoint.x, this.centerPoint.y, this.originalRadius - 5,
        this.centerPoint.x, this.centerPoint.y, this.originalRadius);

        gradient.addColorStop(0, 'rgba(0,0,0,0.2)');
        gradient.addColorStop(1.0, 'white');
        this.context.strokeStyle = gradient;
        this.context.lineWidth = 5;
        this.context.arc(this.centerPoint.x, this.centerPoint.y, this.originalRadius, 0, Math.PI * 2, false);
        this.context.stroke();

        this.context.beginPath();
        this.context.strokeStyle = 'silver';
        this.context.lineWidth = 1;
        this.context.arc(this.centerPoint.x, this.centerPoint.y, this.originalRadius + 3, 0, Math.PI * 2, false);
        this.context.stroke();
        // 实时取色
        let color = this.getPixelColor(this.scaleGlassRectangle.x + this.scaleGlassRectangle.width / 2, this.scaleGlassRectangle.y + this.scaleGlassRectangle.height / 2)
        // this.$store.commit("gallery/setpickDefineColor", color.hex);
        this.context.fillStyle = '#000'
        this.context.fillRect(this.centerPoint.x - 30, this.centerPoint.y + 10, 60, 16)
        this.context.fillStyle = '#fff'
        this.context.textAlign = "center";
        this.context.fillText(color.hex, this.centerPoint.x, this.centerPoint.y + 22)
    }
    //放大镜网格
    drawGrid(context, color, stepx, stepy) {
        context.lineWidth = 0.2;
        context.strokeStyle = color;
        for (var i = this.scaleGlassRectangle.x + stepx / 2; i < this.scaleGlassRectangle.x + this.scaleGlassRectangle.width; i += stepx) { //竖线
            context.beginPath();
            context.moveTo(i, this.scaleGlassRectangle.y);
            context.lineTo(i, this.scaleGlassRectangle.height + this.scaleGlassRectangle.y);
            context.closePath();
            context.stroke();
        }
        for (var j = this.scaleGlassRectangle.y + stepy / 2; j < this.scaleGlassRectangle.y + this.scaleGlassRectangle.height; j += stepy) { //横线
            context.beginPath();
            context.moveTo(this.scaleGlassRectangle.x, j);
            context.lineTo(this.scaleGlassRectangle.width + this.scaleGlassRectangle.x, j);
            context.closePath();
            context.stroke();
        }
        //画正中间取色矩形
        context.lineWidth = 0.6;
        context.strokeStyle = '#000000';
        context.beginPath();
        context.moveTo(this.scaleGlassRectangle.x + this.scaleGlassRectangle.width / 2 - stepx / 2, this.scaleGlassRectangle.y + this.scaleGlassRectangle.height / 2 - stepy / 2)
        context.lineTo(this.scaleGlassRectangle.x + this.scaleGlassRectangle.width / 2 + stepx / 2, this.scaleGlassRectangle.y + this.scaleGlassRectangle.height / 2 - stepy / 2)
        context.lineTo(this.scaleGlassRectangle.x + this.scaleGlassRectangle.width / 2 + stepx / 2, this.scaleGlassRectangle.y + this.scaleGlassRectangle.height / 2 + stepy / 2)
        context.lineTo(this.scaleGlassRectangle.x + this.scaleGlassRectangle.width / 2 - stepx / 2, this.scaleGlassRectangle.y + this.scaleGlassRectangle.height / 2 + stepy / 2)
        context.closePath();
        context.stroke()
        // context.restore();
    }    
    getPixelColor (x, y) {
        var imageData = this.context.getImageData(x, y, 1, 1);
        
        // 获取该点像素数据
        var pixel = imageData.data;
        var r = pixel[0];
        var g = pixel[1];
        var b = pixel[2];
        var a = pixel[3] / 255
        a = Math.round(a * 100) / 100;
        var rHex = r.toString(16);
        r < 16 && (rHex = "0" + rHex);
        var gHex = g.toString(16);
        g < 16 && (gHex = "0" + gHex);
        var bHex = b.toString(16);
        b < 16 && (bHex = "0" + bHex);
        var rgbaColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        var rgbColor = "rgb(" + r + "," + g + "," + b + ")";
        var hexColor = "#" + rHex + gHex + bHex;
        return {
            rgba : rgbaColor,
            rgb : rgbColor,
            hex : hexColor,
            r : r,
            g : g,
            b : b,
            a : a
        };
    }
  
  }

export default getColorByCanvas