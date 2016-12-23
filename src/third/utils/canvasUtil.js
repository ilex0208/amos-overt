const colorUtil = require('./colorUtil');


/**
 * 创建放射状/环形的渐变 private
 *
 * @param {any} ctx 画布对象
 * @param {any} sc1 开始颜色
 * @param {any} sc2 结束颜色
 * @param {any} startX 起始位置x
 * @param {any} startY 起始位置y
 * @param {any} maxR 最大半径
 * @param {any} minR 最小半径
 * @param {any} maxScale 最大范围
 * @param {any} minScale 最小范围
 * @returns
 */
function createRadialGradient(ctx, sc1, sc2, startX, startY, maxR, minR, maxScale, minScale) {
  sc1 = colorUtil.isRgbColor(sc1) ? colorUtil.toHexColor(sc1) : sc1;
  sc2 = colorUtil.isRgbColor(sc2) ? colorUtil.toHexColor(sc2) : sc2;
  let x0 = startX + maxR * maxScale,
    y0 = startY + minR * minScale,
    r0 = Math.min(maxR, minR) / 24,
    x1 = startX + maxR / 2,
    y1 = startY + minR / 2,
    r1 = Math.max(maxR, minR) / 2;
  var grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  return grd.addColorStop(0, sc2),
    grd.addColorStop(1, sc1),
    grd;
}

module.exports = {
  createRadialGradient: createRadialGradient
};
