//////////////////////////////
/**
 * chart图表
 * @author ilex
 * @description 2016-11-02 11:56:12
 */
//////////////////////////////
const _n = require('./_node');

/**
 * Pie chart
 * 核心: context.arc(x,y,r,sAngle,eAngle,counterclockwise);
 *      x 	圆的中心的 x 坐标。
 *      y 	圆的中心的 y 坐标。
 *      r 	圆的半径。
 *      sAngle 	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
 *      eAngle 	结束角，以弧度计。
 *      counterclockwise 	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
 * @returns
 */
function PieChartNode() {
  let _pieChartNode = new _n.CircleNode;
  return _pieChartNode.radius = 150,
    _pieChartNode.colors = ['#3666B0', '#2CA8E0', '#77D1F6'],
    _pieChartNode.datas = [0.3, 0.3, 0.4],
    _pieChartNode.titles = ['A', 'B', 'C'],
    _pieChartNode.paint = function(ctx) {
      let $width = 2 * _pieChartNode.radius, $height = 2 * _pieChartNode.radius;
      _pieChartNode.width = $width, _pieChartNode.height = $height;
      let sAngle = 0;
      for (let i = 0; i < this.datas.length; i++) {
        let change = this.datas[i] * Math.PI * 2;
        let eAngle = sAngle + change;
        ctx.save(),
          ctx.beginPath(),
          ctx.fillStyle = _pieChartNode.colors[i],
          ctx.moveTo(0, 0),
          ctx.arc(0, 0, this.radius, sAngle, eAngle, false),
          ctx.fill(),
          ctx.closePath(),
          ctx.restore(),
          ctx.beginPath(),
          ctx.font = this.font;
        let text = this.titles[i] + ': ' + (100 * this.datas[i]).toFixed(2) + '%',
          textWidth = ctx.measureText(text).width, // 文本宽度
          _defaultWidth = (ctx.measureText('田').width, (sAngle + eAngle) / 2), // 默认“田”字宽度
          _x = this.radius * Math.cos(_defaultWidth),// 开始绘制文本的 x 坐标位置（相对于画布）。
          _y = this.radius * Math.sin(_defaultWidth);// 开始绘制文本的 y 坐标位置（相对于画布）。
        _defaultWidth > Math.PI / 2 && _defaultWidth <= Math.PI ? _x -= textWidth : _defaultWidth > Math.PI && _defaultWidth < 2 * Math.PI * 3 / 4 ? _x -= textWidth : _defaultWidth > 2 * Math.PI * .75,
          ctx.fillStyle = '#FFFFFF',
          ctx.fillText(text, _x, _y),
          ctx.moveTo(this.radius * Math.cos(_defaultWidth), this.radius * Math.sin(_defaultWidth)),
          _defaultWidth > Math.PI / 2 && _defaultWidth < 2 * Math.PI * 3 / 4 && (_x -= textWidth),
          _defaultWidth > Math.PI,
          ctx.fill(),
          ctx.stroke(),
          ctx.closePath(),
          sAngle += change;
      }
    },
    _pieChartNode;
}

/**
 * Bar chart
 * 核心: context.fillRect(x,y,width,height); 填充矩形
 *      x 	矩形左上角的 x 坐标
 *      y 	矩形左上角的 y 坐标
 *      width 	矩形的宽度，以像素计
 *      height 	矩形的高度，以像素计
 *
 * @returns
 */
function BarChartNode() {
  let _barChartNode = new _n.Node;
  return _barChartNode.showSelected = false,
    _barChartNode.width = 250,
    _barChartNode.height = 180,
    _barChartNode.colors = ['#3666B0', '#2CA8E0', '#77D1F6'],
    _barChartNode.datas = [0.3, 0.3, 0.4],
    _barChartNode.titles = ['A', 'B', 'C'],
    _barChartNode.paint = function(ctx) {
      let _span = 3,
        rectW = (this.width - _span) / this.datas.length;
      ctx.save(),
        ctx.beginPath(),
        ctx.fillStyle = '#FFFFFF',
        ctx.strokeStyle = '#FFFFFF',
        ctx.moveTo(- this.width / 2 - 1, -this.height / 2),
        ctx.lineTo(- this.width / 2 - 1, this.height / 2 + 3),
        ctx.lineTo(this.width / 2 + _span + 1, this.height / 2 + 3),
        ctx.stroke(),
        ctx.closePath(),
        ctx.restore();
      for (let i = 0; i < this.datas.length; i++) {
        ctx.save(),
          ctx.beginPath(),
          ctx.fillStyle = _barChartNode.colors[i];
        let rectH = this.datas[i],
          rectX = i * (rectW + _span) - this.width / 2,
          rectY = this.height - rectH - this.height / 2;
        ctx.fillRect(rectX, rectY, rectW, rectH);
        let text = '' + parseInt(this.datas[i]),
          textW = ctx.measureText(text).width,
          _dw = ctx.measureText('田').width;
        ctx.fillStyle = '#FFFFFF',
          ctx.fillText(text, rectX + (rectW - textW) / 2, rectY - _dw),
          ctx.fillText(this.titles[i], rectX + (rectW - textW) / 2, this.height / 2 + _dw),
          ctx.fill(),
          ctx.closePath(),
          ctx.restore();
      }
    },
    _barChartNode;
}

// 单独导出
module.exports = {
  BarChartNode: BarChartNode,
  PieChartNode: PieChartNode
};
