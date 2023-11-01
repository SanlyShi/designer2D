// ;(function() {
	const DRAW_IMAGE_EXTEND_EX = 3;

	class Point2D {
	    constructor(x, y, u, v) {
	        this.x = x;
	        this.y = y;
	        this.u = u;
	        this.v = v;
	    }
	    clone() {
	        return new Point2D(this.x, this.y, this.u, this.v);
	    }
	}

	class Vert2D {
	    constructor(p0, p1, p2) {
	        this.p0 = p0;
	        this.p1 = p1;
	        this.p2 = p2;
	    }
	    clone() {
	        return new Vert2D(this.p0, this.p1, this.p2);
	    }
	    drawMeshLineToContext(plist, ctx) {
	        var p0 = plist[this.p0], p1 = plist[this.p1], p2 = plist[this.p2];
	        ctx.moveTo(p0.x, p0.y);
	        ctx.lineTo(p1.x, p1.y);
	        ctx.lineTo(p2.x, p2.y);
	        ctx.lineTo(p0.x, p0.y);
	    }
	    drawImageToContext(plist, img, ctx, i) {
	        var p0 = plist[this.p0], p1 = plist[this.p1], p2 = plist[this.p2];
	        Vert2D.drawImageToContextWithPoints(img, ctx, p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p0.u, p0.v, p1.u, p1.v, p2.u, p2.v, i);
	    }

	    static extendVert(x0, y0, x1, y1, x2, y2) {
			if(navigator.userAgent.toLowerCase().match(/version\/([\d.]+).*safari/) == null) {
				var x = 2 * x0 - x1 - x2, y = 2 * y0 - y1 - y2;
				var d = Math.sqrt(DRAW_IMAGE_EXTEND_EX / (x * x + y * y));
				return [x0 + x * d, y0 + y * d];
			}else {
				return [x0, y0]
			}
	    }

	    static drawImageToContextWithPoints(img, ctx, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2, i) {
	        u0 *= img.width;
	        u1 *= img.width;
	        u2 *= img.width;
	        v0 *= img.height;
	        v1 *= img.height;
	        v2 *= img.height;

	        //fix gap in images
	        var s0 = Vert2D.extendVert(x0, y0, x1, y1, x2, y2);
	        var s1 = Vert2D.extendVert(x1, y1, x0, y0, x2, y2);
	        var s2 = Vert2D.extendVert(x2, y2, x1, y1, x0, y0);
	        //fix end

	        ctx.beginPath();
	        ctx.moveTo(s0[0], s0[1]);
	        ctx.lineTo(s1[0], s1[1]);
	        ctx.lineTo(s2[0], s2[1]);
	        ctx.closePath();

	        x1 -= x0;
	        y1 -= y0;
	        x2 -= x0;
	        y2 -= y0;

	        u1 -= u0;
	        v1 -= v0;
	        u2 -= u0;
	        v2 -= v0;

	        var det = 1 / (u1 * v2 - u2 * v1),
	            a = (v2 * x1 - v1 * x2) * det,
	            b = (v2 * y1 - v1 * y2) * det,
	            c = (u1 * x2 - u2 * x1) * det,
	            d = (u1 * y2 - u2 * y1) * det,
	            e = x0 - a * u0 - c * v0,
	            f = y0 - b * u0 - d * v0;

			ctx.save();
	        ctx.transform(a, b, c, d, e, f);
			ctx.clip();
	        ctx.drawImage(img, 0, 0);
	        ctx.restore();
	    }
	}

	class Mesh2D {
	    constructor() {
	        this.points = [];
	        this.verts = [];
	    }

	    clone() {
	        var n = new Mesh2D();
	        for (var i = 0; i < this.points.length; i++) {
	            n.points[i] = this.points[i].clone();
	        }
	        for (var i = 0; i < this.verts.length; i++) {
	            n.verts[i] = this.verts[i];//not clone
	        }
	        return n;
	    }

	    move(x, y) {
	        for (var i = 0; i < this.points.length; i++) {
	            this.points[i].x += x;
	            this.points[i].y += y;
	        }
	    }
	    changeByMatrix4(te) {
	        for (var i = 0; i < this.points.length; i++) {
	            this.points[i].changeByMatrix4(te);
	        }
	    }
	    drawMeshHelper(ctx, dots) {
	    	ctx.save();
	    	ctx.beginPath();
	        ctx.lineWidth = 0.5;
	        ctx.strokeStyle = "#0000ff";
	        ctx.setLineDash([15, 5]);
	        ctx.moveTo(dots[0].x, dots[0].y);
	        ctx.lineTo(dots[1].x, dots[1].y);
	        ctx.lineTo(dots[2].x, dots[2].y);
	        ctx.lineTo(dots[3].x, dots[3].y);
	        ctx.lineTo(dots[0].x, dots[0].y);
	        ctx.stroke();
	        ctx.restore();
	    }
	    drawMeshLine(ctx) {
	        ctx.save();
	        ctx.lineWidth = 0.5;
	        ctx.strokeStyle = "#0000ff";
	        for (var i = 0; i < this.verts.length; i++) {
	            this.verts[i].drawMeshLineToContext(this.points, ctx);
	        }
	        ctx.stroke();
	        ctx.restore();
	    }
	    drawImageToContext(img, ctx) {
	        for (var i = 0; i < this.verts.length; i++) {
	            this.verts[i].drawImageToContext(this.points, img, ctx, i);
	        }
	    }

	    static createMapMesh(width, height, divW, divH) {
	        var m = new Mesh2D();
	        var widthSingle = width / divW, heightSingle = height / divH;
	        var uSingle = 1 / divW, vSingel = 1 / divH;
	        for (var i = 0; i <= divH; i++) {
	            for (var j = 0; j <= divW; j++) {
	                m.points.push(new Point2D(j * widthSingle, i * heightSingle, j * uSingle, i * vSingel));
	            }
	        }
	        for (var i = 0; i < divH; i++) {
	            for (var j = 0; j < divW; j++) {
	                var startPoint = (divW + 1) * i + j;
	                m.verts.push(new Vert2D(startPoint + 1, startPoint, startPoint + divW + 1));
	                m.verts.push(new Vert2D(startPoint + divW + 1, startPoint + divW + 2, startPoint + 1));
	            }
	        }
	        return m;
	    }
	}
	// window.zw_Mesh2D = Mesh2D;
// })(window)
export { Mesh2D as zw_Mesh2D }