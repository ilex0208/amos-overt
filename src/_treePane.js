// @author ilex.h
const third = require('./_third');
const {
  html,
  UserAgent
} = third;

/**
 * 创建TreePane
 * 给parent添加treepane时,需要采用getTreeView()获取当前view
 */
let TreePane = function() {
  this._view = html.createView('hidden', true),
    this._view.tabIndex = -1;
  var treePaneIteraction;
  UserAgent.isTouchable && !UserAgent.isMSToucheable
  ?
  treePaneIteraction = TreePaneTouchInteraction
  :
  treePaneIteraction = TreePaneInteraction,
    treePaneIteraction && new treePaneIteraction(this);
  /**
   * 获取 view
   */
  this.getTreeView = function(){
    return this._view;
  };
};

let TreePaneInteraction = function(treePane) {
  this.treePane = treePane,
    this.view = treePane._view;
  var _self = this;
  this.view.addEventListener('mousedown',
      function(ev) {
        ev.button === 0 && _self.handleMouseDown(ev);
      }, !1),
    this.view.addEventListener('mousemove',
      function(ev) {
        _self.handleMouseMove(ev);
      }, !1);
  this.handleMouseDown = function(event) {
    // if (!this.treePane.isDividerDraggable()) {return;}
    // if (this.resizeDiv) {
    //   this.clear(event);
    // }
    // else if (event.target === this.dividerDiv || event.target === this.treePane._coverDiv) {
    //   this.resizeDiv = html.createDiv();
    //   var b = this.resizeDiv.style;
    //   b.left = this.dividerDiv.style.left,
    //       b.top = this.dividerDiv.style.top,
    //       b.width = this.dividerDiv.style.width,
    //       b.height = this.dividerDiv.style.height,
    //       b.opacity = this.treePane.getDividerOpacity(),
    //       b.background = this.treePane.getDividerBackground(),
    //       this.resizeDiv.lastPosition = this.treePane._orientation === 'horizontal' ? event.clientX : event.clientY,
    //       this.resizeDiv.maskDiv = html.createDiv(),
    //       b = this.resizeDiv.maskDiv.style,
    //       b.left = '0px',
    //       b.top = '0px',
    //       b.width = this.view.clientWidth + 'px',
    //       b.height = this.view.clientHeight + 'px',
    //       b.background = this.treePane.getMaskBackground(),
    //       this.view.appendChild(this.resizeDiv.maskDiv),
    //       this.view.appendChild(this.resizeDiv),
    //       html.handle_mousedown(this, event),
    //       event.preventDefault();
    // }
  },
    this.handleMouseMove = function(event) {
    //   if (!this.treePane.isDividerDraggable()) {
    //     return;
    //   }
    //   if (!this.resizeDiv && !html.target) {
    //     var b = this.treePane._orientation === 'horizontal' ? 'ew-resize' : 'ns-resize';
    //     this.view.style.cursor = event.target === this.dividerDiv || event.target === this.treePane._coverDiv ? b : 'default';
    //   } else{
    //     this.resizeDiv && html.target === this &&
    //     (this.treePane._orientation === 'horizontal' ?
    //     this.resizeDiv.style.left = this.dividerDiv.position + event.clientX - this.resizeDiv.lastPosition + 'px'
    //     :
    //     this.resizeDiv.style.top = this.dividerDiv.position + event.clientY - this.resizeDiv.lastPosition + 'px');
    //   }
    },
    this.handleMouseUp = function(a) {
    //   if (!this.treePane.isDividerDraggable()) {return;}
    //   a.button === 0 && this.clear(a);
    },
    this.clear = function(event) {
      if (this.resizeDiv) {
        var b = this.treePane._dividerWidth,
          c;
        if (this.treePane._orientation === 'horizontal') {
          var d = this.view.clientWidth;
          b > d && (b = d),
            c = this.dividerDiv.position + event.clientX - this.resizeDiv.lastPosition,
            this.treePane.setPosition(c / (d - b));
        } else {
          var e = this.view.clientHeight;
          b > e && (b = e),
            c = this.dividerDiv.position + event.clientY - this.resizeDiv.lastPosition,
            this.treePane.setPosition(c / (e - b));
        }
        this.view.removeChild(this.resizeDiv.maskDiv),
          this.view.removeChild(this.resizeDiv),
          delete this.resizeDiv;
      }
    };
};

let TreePaneTouchInteraction = function(pane) {
  this.treePane = pane,
    this.view = pane._view,
    this.dividerDiv = pane._dividerDiv,
    html.addEventListener('touchstart', 'handleTouchstart', this.view, this);

  this.handleTouchstart = function(a) {
    html.preventDefault(a);
    if (this.resizeDiv) {this.clear(a);}
    else if (a.target === this.dividerDiv || a.target === this.treePane._coverDiv) {
      this.resizeDiv = html.createDiv();
      var rdivSty = this.resizeDiv.style;
      rdivSty.left = this.dividerDiv.style.left,
          rdivSty.top = this.dividerDiv.style.top,
          rdivSty.width = this.dividerDiv.style.width,
          rdivSty.height = this.dividerDiv.style.height,
          rdivSty.opacity = this.treePane.getDividerOpacity(),
          rdivSty.background = this.treePane.getDividerBackground();
      var c = a.changedTouches[0];
      this.resizeDiv.lastPosition = this.treePane._orientation === 'horizontal' ? c.clientX : c.clientY,
          this.resizeDiv.maskDiv = html.createDiv();
      var rmdivSty = this.resizeDiv.maskDiv.style;
      rmdivSty.left = '0px',
          rmdivSty.top = '0px',
          rmdivSty.width = this.view.clientWidth + 'px',
          rmdivSty.height = this.view.clientHeight + 'px',
          rmdivSty.background = this.treePane.getMaskBackground(),
          this.view.appendChild(this.resizeDiv.maskDiv),
          this.view.appendChild(this.resizeDiv);
    }
    html.addEventListener('touchmove', 'handleTouchmove', this.view, this),
        html.addEventListener('touchend', 'handleTouchend', this.view, this);
  },
    this.handleTouchmove = function(ev) {
      html.preventDefault(ev);
      if (this.resizeDiv) {
        var b = ev.changedTouches[0];
        this.treePane._orientation === 'horizontal' ?
        this.resizeDiv.style.left = this.dividerDiv.position + b.clientX - this.resizeDiv.lastPosition + 'px'
        :
        this.resizeDiv.style.top = this.dividerDiv.position + b.clientY - this.resizeDiv.lastPosition + 'px';
      }
    },
    this.handleTouchend = function(a) {
      html.removeEventListener('touchmove', this.view, this),
        html.removeEventListener('touchend', this.view, this),
        this.clear(a);
    },
    this.clear = function(a) {
      var b = a.changedTouches[0];
      if (this.resizeDiv) {
        var c = this.treePane._dividerWidth;
        if (this.treePane._orientation === 'horizontal') {
          var d = this.view.clientWidth;
          c > d && (c = d);
          var pos = this.dividerDiv.position + b.clientX - this.resizeDiv.lastPosition;
          this.treePane.setPosition(pos / (d - c));
        } else {
          var f = this.view.clientHeight;
          c > f && (c = f);
          var pos2 = this.dividerDiv.position + b.clientY - this.resizeDiv.lastPosition;
          this.treePane.setPosition(pos2 / (f - c));
        }
        this.view.removeChild(this.resizeDiv.maskDiv),
          this.view.removeChild(this.resizeDiv),
          delete this.resizeDiv;
      }
    };
};

module.exports = TreePane;
