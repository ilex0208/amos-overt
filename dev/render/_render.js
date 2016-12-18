'use strict';

var defaultOpt = {
  bgOptions: {
    backgroundColor: '#ffffff', //说明: 支持fillstyle所有原生写法, 例: rgba(255,255,255,1),默认#ffffff
    backgroundImage: null, //说明: 背景网格线, 默认为null
    backgourndImageOpacity: 0.3, //说明: 背景网格线透明度, 配置了backgroundImage此字段才有效, 默认0.3
    //备注: backgroundColor灰,白,0.5美观;backgroundColor黑色,蓝色,0.2美观
    tooltipBackgroundColor: 'rgba(0, 0, 0, 0.7)', //说明: 悬停提示的背景色样式,默认rgba(0, 0, 0, 0.7)
    tooltipColor: 'rgb(255, 255, 255)' //说明: 悬停提示的文字样式,默认rgb(255, 255, 255)
  }
};

/**
 * 渲染
 *  使用方式：
 *  var render = new Render(context, canvasW, canvasH, bgOptions);
 *  render.itemLoaded( _aot.option.bgOptions,function(){
 *		render.draw();
 *	});
 * @param {any} context
 * @param {any} canvasW
 * @param {any} canvasH
 * @param {any} bgOptions
 */
function Render(context, canvasW, canvasH, bgOptions) {
  var self = this;
  var _opts = bgOptions || defaultOpt.bgOptions;
  this.draw = function(callback) {
    _clearCanvas(); //清除图像
    _drawGlobal(_opts); //绘制背景
  };

  /**
   *	初始加载图片(私有方法)
   */
  this.itemLoaded = function(bgOptions, callback) {
    if (bgOptions.backgroundImage) {
      try {
        //appState = STATE_IMAGE_LOAD;
        self.bgImg = new Image();
        self.bgImg.addEventListener('load', function() {
          //初始背景图片渐变
          self.bgPattern = context.createPattern(self.bgImg, 'repeat');
          callback();
        }, false);
        self.bgImg.src = bgOptions.backgroundImage;
      } catch (e) {
        callback();
        throw new Error('ctopo backgroundImage load error');
      } finally {
        console.log('finally execute');
      }
    } else {
      callback();
    }
  };

  /**
   *私有方法
   */
  function _clearCanvas() {
    context.clearRect(0, 0, canvasW, canvasH);
  }

  /**
   *私有方法
   */
  function _drawGlobal(bgOptions) {
    context.fillStyle = bgOptions.backgroundColor;
    context.fillRect(0, 0, canvasW, canvasH);
    //绘制背景网格
    if (self.bgPattern) {
      context.fillStyle = self.bgPattern;
      context.globalAlpha = bgOptions.backgourndImageOpacity;
      context.fillRect(0, 0, canvasW, canvasH);
      context.globalAlpha = 1;
    }
  }
}
module.exports = {
  Render: Render
};
//# sourceMappingURL=_render.js.map