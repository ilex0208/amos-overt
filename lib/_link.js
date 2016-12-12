'use-strict';
//////////////////////////////
/**
 * @author ilex
 * @description Link 2016-11-15 10:20:12
 */
//////////////////////////////
const _e = require('./_baseElement');
const Util = require('./_util');
const Tobj = require('./_tobj');

const InteractiveElement = _e.InteractiveElement;
/**
 * 获取两个节点之间的links集合
 * exp: getLinksArray(node_a, node_b) 表示： 获取
 * @param {any} node_a
 * @param {any} node_b
 * @returns array
 */
function getLinksArray(node_a, node_b) {
  let resultArray = [];
  if (null == node_a || null == node_b) {
    return resultArray;
  }
  if (node_a && node_b) {
    let a_outlinks = node_a.outLinks;
    let b_inlinks = node_b.inLinks;
    // 循环遍历 node_a 中 outLinks 存储的每一项link
    if(a_outlinks && b_inlinks){
      for (let i = 0; i < a_outlinks.length; i++) {
        let link1 = a_outlinks[i];
        for (let j = 0; j < b_inlinks.length; j++) {
          let link2 = b_inlinks[j];
          if(link1 === link2){
            resultArray.push(link2);
          }
        }
      }
    }
  }
  return resultArray;
}

/**
 * 获取两个节点的所有链路
 * (表示: node_a到node_b的链路以及node_b到node_a的链路)
 * @param {any} node_a
 * @param {any} node_b
 * @returns array
 */
function getAllLinks(node_a, node_b) {
  let a_bLinks = getLinksArray(node_a, node_b),
    b_aLinks = getLinksArray(node_b, node_a),
    allLinks = a_bLinks.concat(b_aLinks);
  return allLinks;
}

/**
 * 通过链路获取当前链路两节点之间的其它链路
 * @param {any} link
 * @returns
 */
function getOtherLinksByLink(link) {
  let allLinks = getAllLinks(link.nodeA, link.nodeZ);
  return allLinks = allLinks.filter(function(item) {
    return link !== item;
  });
}

/**
 * 获取两节点之间链路总数
 *
 * @param {any} node_a
 * @param {any} node_b
 * @returns
 */
function getLinksSize(node_a, node_b) {
  return getAllLinks(node_a, node_b).length;
}

/**
 * 创建链路
 *
 * @param {any} nodeA 节点A
 * @param {any} nodeZ 节点B
 * @param {any} text link名称
 */
function Link(nodeA, nodeZ, text) {
  /**
   * 获取相交点
   * @param {any} nodeZ
   * @param {any} nodeA
   * @returns {x:number,y:number}
   */
  function getInterSection(nodeZ, nodeA) {
    let dline = Util.lineF(nodeZ.cx, nodeZ.cy, nodeA.cx, nodeA.cy),
      zbound = nodeZ.getBound(),
      _intersection = Util.intersectionLineBound(dline, zbound);// 获取相交点
    return _intersection;
  }

  this.initialize = function(_nodeA, _nodeZ, linkText) {
    Link.prototype.initialize.apply(this, arguments),
      this.elementType = 'link',
      this.zIndex = Tobj.zIndex_Link;
    if (0 != arguments.length) {
      this.text = linkText,
        this.nodeA = _nodeA,
        this.nodeZ = _nodeZ,
        this.nodeA && null == this.nodeA.outLinks && (this.nodeA.outLinks = []),
        this.nodeA && null == this.nodeA.inLinks && (this.nodeA.inLinks = []),
        this.nodeZ && null == this.nodeZ.inLinks && (this.nodeZ.inLinks = []),
        this.nodeZ && null == this.nodeZ.outLinks && (this.nodeZ.outLinks = []),
        null != this.nodeA && this.nodeA.outLinks.push(this),
        null != this.nodeZ && this.nodeZ.inLinks.push(this),
        this.caculateIndex(),
        this.font = '12px Consolas',
        this.fontColor = '255,255,255',
        this.lineWidth = 2,
        this.lineJoin = 'miter',
        this.transformAble = !1,
        this.bundleOffset = 20,
        this.bundleGap = 12,
        this.textOffsetX = 0,
        this.textOffsetY = 0,
        this.arrowsRadius = null,
        this.arrowsOffset = 0,
        this.dashedPattern = null,
        this.path = [];
      let linkProperties = 'text,font,fontColor,lineWidth,lineJoin'.split(',');
      this.serializedProperties = this.serializedProperties.concat(linkProperties);
    }
  },
  this.caculateIndex = function() {
    let size = getLinksSize(this.nodeA, this.nodeZ);
    // 以下代码等价写法:  size > 0 && (this.nodeIndex = size - 1);
    if(size > 0){
      this.nodeIndex = size - 1;
    }
  },
  this.initialize(nodeA, nodeZ, text),
  /**
   * 移除
   */
  this.removeHandler = function() {
    let _self = this;
    this.nodeA && this.nodeA.outLinks && (this.nodeA.outLinks = this.nodeA.outLinks.filter(function(ols) {
      return ols !== _self;
    })),
    this.nodeZ && this.nodeZ.inLinks && (this.nodeZ.inLinks = this.nodeZ.inLinks.filter(function(ils) {
      return ils !== _self;
    }));
    let otherLinks = getOtherLinksByLink(this);
    otherLinks.forEach(function(value, index) {
      value.nodeIndex = index;
    });
  },
  this.getStartPosition = function() {
    let pos = {
      x: this.nodeA.cx,
      y: this.nodeA.cy
    };
    return pos;
  },
  this.getEndPosition = function() {
    let endPos;
    return null != this.arrowsRadius && (endPos = getInterSection(this.nodeZ, this.nodeA)),
      null == endPos && (endPos = {
        x: this.nodeZ.cx,
        y: this.nodeZ.cy
      }),
      endPos;
  },
  this.getPath = function() {
    let $path = [],
      startPos = this.getStartPosition(),
      endPos = this.getEndPosition();
    if (this.nodeA === this.nodeZ) {
      return [startPos, endPos];
    }
    let size = getLinksSize(this.nodeA, this.nodeZ);
    if (1 == size) {
      return [startPos, endPos];
    }
    // atan2(x,y)表示: 坐标与X轴之间的角度的弧度
    let radian = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x),
      g = {
        x: startPos.x + this.bundleOffset * Math.cos(radian),
        y: startPos.y + this.bundleOffset * Math.sin(radian)
      },
      h = {
        x: endPos.x + this.bundleOffset * Math.cos(radian - Math.PI),
        y: endPos.y + this.bundleOffset * Math.sin(radian - Math.PI)
      },
      i = radian - Math.PI / 2,
      j = radian - Math.PI / 2,
      k = size * this.bundleGap / 2 - this.bundleGap / 2,
      l = this.bundleGap * this.nodeIndex,
      m = {
        x: g.x + l * Math.cos(i),
        y: g.y + l * Math.sin(i)
      },
      n = {
        x: h.x + l * Math.cos(j),
        y: h.y + l * Math.sin(j)
      };
    return m = {
      x: m.x + k * Math.cos(i - Math.PI),
      y: m.y + k * Math.sin(i - Math.PI)
    },
      n = {
        x: n.x + k * Math.cos(j - Math.PI),
        y: n.y + k * Math.sin(j - Math.PI)
      },
      $path.push({
        x: startPos.x,
        y: startPos.y
      }),
      $path.push({
        x: m.x,
        y: m.y
      }),
      $path.push({
        x: n.x,
        y: n.y
      }),
      $path.push({
        x: endPos.x,
        y: endPos.y
      }),
      $path;
  },
  /**
   * 绘制路线
   * @param {any} ctx context
   * @param {array} paths 路线集合
   */
  this.paintPath = function(ctx, paths) {
    // 执行paintLoop,同时返回undefined
    if (this.nodeA === this.nodeZ) {
      return void this.paintLoop(ctx);
    }
    ctx.beginPath();
    ctx.moveTo(paths[0].x, paths[0].y);
    for (let i = 1; i < paths.length; i++) {
      null == this.dashedPattern ? ctx.lineTo(paths[i].x, paths[i].y) : ctx.AmostDashedLineTo(paths[i - 1].x, paths[i - 1].y, paths[i].x, paths[i].y, this.dashedPattern);
    }
    ctx.stroke();
    ctx.closePath();
    if (null != this.arrowsRadius) {
      let path_last_2 = paths[paths.length - 2],
        path_last = paths[paths.length - 1];
      this.paintArrow(ctx, path_last_2, path_last);
    }
  },
  this.paintLoop = function(ctx) {
    // 计算半径
    let radius = this.bundleGap * (this.nodeIndex + 1) / 2;
    ctx.beginPath();
    ctx.arc(this.nodeA.x, this.nodeA.y, radius, Math.PI / 2, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  },

  /**
   * 绘制箭头
   * @param {any} ctx context
   * @param {any} path_2 倒数第2个link
   * @param {any} lastPath 最后一个link
   */
  this.paintArrow = function(ctx, path_2, lastPath) {
    let arrowOff = this.arrowsOffset,
      ar_2 = this.arrowsRadius / 2,
      $path_2 = path_2,
      $lastPath = lastPath,
      // 计算出两条线之间的弧度
      radian = Math.atan2($lastPath.y - $path_2.y, $lastPath.x - $path_2.x),
      distance = Util.getDistance($path_2, $lastPath) - this.arrowsRadius,
      arrow_k = $path_2.x + (distance + arrowOff) * Math.cos(radian),
      arrow_l = $path_2.y + (distance + arrowOff) * Math.sin(radian),
      arrowX = $lastPath.x + arrowOff * Math.cos(radian),
      arrowY = $lastPath.y + arrowOff * Math.sin(radian);
    radian -= Math.PI / 2;
    // 开始画箭头时,先移动到位置
    let movePos = {
        x: arrow_k + ar_2 * Math.cos(radian),
        y: arrow_l + ar_2 * Math.sin(radian)
      },
      arrowLineto = {
        x: arrow_k + ar_2 * Math.cos(radian - Math.PI),
        y: arrow_l + ar_2 * Math.sin(radian - Math.PI)
      };//
    ctx.beginPath(),
      ctx.fillStyle = 'rgba(' + this.strokeColor + ',' + this.alpha + ')',
      ctx.moveTo(movePos.x, movePos.y),
      ctx.lineTo(arrowX, arrowY),
      ctx.lineTo(arrowLineto.x, arrowLineto.y),
      ctx.stroke(),
      ctx.closePath();
  },
  this.paint = function(ctx) {
    if (null != this.nodeA && null != !this.nodeZ) {
      let paths = this.getPath(this.nodeIndex);
      this.path = paths,
        ctx.strokeStyle = 'rgba(' + this.strokeColor + ',' + this.alpha + ')',
        ctx.lineWidth = this.lineWidth,
        this.paintPath(ctx, paths),
        paths && paths.length > 0 && this.paintText(ctx, paths);
    }
  };
  let _PI = -(Math.PI / 2 + Math.PI / 4);
  this.paintText = function(ctx, _path) {
    let path_0 = _path[0],
      path_last = _path[_path.length - 1];
    if(_path.length == 4){
      path_0 = _path[1], path_last = _path[2];
    }
    if (this.text && this.text.length > 0) {
      let _width = (path_last.x + path_0.x) / 2 + this.textOffsetX,
        _heigth = (path_last.y + path_0.y) / 2 + this.textOffsetY;
      ctx.save(),
        ctx.beginPath(),
        ctx.font = this.font;
      let textW = ctx.measureText(this.text).width,
        defaultW = ctx.measureText('田').width;
      ctx.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')';
      if (this.nodeA === this.nodeZ) {
        let gap = this.bundleGap * (this.nodeIndex + 1) / 2,
          azX = this.nodeA.x + gap * Math.cos(_PI),
          azY = this.nodeA.y + gap * Math.sin(_PI);
        ctx.fillText(this.text, azX, azY);
      } else {
        ctx.fillText(this.text, _width - textW / 2, _heigth - defaultW / 2);
      }
      ctx.stroke(),
        ctx.closePath(),
        ctx.restore();
    }
  },
  this.paintSelected = function(ctx) {
    ctx.shadowBlur = 10,
      ctx.shadowColor = 'rgba(0,0,0,1)',
      ctx.shadowOffsetX = 0,
      ctx.shadowOffsetY = 0;
  },
  this.isInBound = function(_x, _y) {
    if (this.nodeA === this.nodeZ) {
      let gap = this.bundleGap * (this.nodeIndex + 1) / 2,
        distance = Util.getDistance( this.nodeA, {x: _x, y: _y} ) - gap;
      return Math.abs(distance) <= 3;
    }
    let falg = false;
    for (let i = 1; i < this.path.length; i++) {
      let prevPath = this.path[i - 1], nextPath = this.path[i];
      if (1 == Util.isPointInLine( {x: _x,y: _y}, prevPath, nextPath)) {
        falg = true;
        break;
      }
    }
    return falg;
  };
}

/**
 * 创建折叠Link
 *
 * @param {any} nodeA 节点A
 * @param {any} nodeZ 节点B
 * @param {any} text link名称
 */
function FoldLink(nodeA, nodeZ, text) {
  this.initialize = function() {
    FoldLink.prototype.initialize.apply(this, arguments),
      this.direction = 'horizontal';
  },
  this.initialize(nodeA, nodeZ, text),
  this.getStartPosition = function() {
    let startPos = {
      x: this.nodeA.cx,
      y: this.nodeA.cy
    };
    return 'horizontal' == this.direction ? this.nodeZ.cx > startPos.x ? startPos.x += this.nodeA.width / 2 : startPos.x -= this.nodeA.width / 2 : this.nodeZ.cy > startPos.y ? startPos.y += this.nodeA.height / 2 : startPos.y -= this.nodeA.height / 2,
      startPos;
  },
  this.getEndPosition = function() {
    let startPos = {
      x: this.nodeZ.cx,
      y: this.nodeZ.cy
    };
    return 'horizontal' == this.direction ? this.nodeA.cy < startPos.y ? startPos.y -= this.nodeZ.height / 2 : startPos.y += this.nodeZ.height / 2 : startPos.x = this.nodeA.cx < startPos.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width,
      startPos;
  },
  this.getPath = function(nodeIndex) {
    let paths = [],
      sp = this.getStartPosition(),
      ep = this.getEndPosition();
    if (this.nodeA === this.nodeZ) {
      return [sp, ep];
    }
    let $x, $y, size = getLinksSize(this.nodeA, this.nodeZ),
      span = (size - 1) * this.bundleGap,
      gap = this.bundleGap * nodeIndex - span / 2;
    return 'horizontal' == this.direction ? ($x = ep.x + gap, $y = sp.y - gap, paths.push({
      x: sp.x,
      y: $y
    }), paths.push({
      x: $x,
      y: $y
    }), paths.push({
      x: $x,
      y: ep.y
    })) : ($x = sp.x + gap, $y = ep.y - gap, paths.push({
      x: $x,
      y: sp.y
    }), paths.push({
      x: $x,
      y: $y
    }), paths.push({
      x: ep.x,
      y: $y
    })),
      paths;
  },
  this.paintText = function(ctx, _paths) {
    if (this.text && this.text.length > 0) {
      let $path = _paths[1],
        _x = $path.x + this.textOffsetX,
        _y = $path.y + this.textOffsetY;
      ctx.save(),
        ctx.beginPath(),
        ctx.font = this.font;
      let textW = ctx.measureText(this.text).width,
        defaultW = ctx.measureText('田').width;
      ctx.fillStyle = 'rgba(' + this.fontColor + ', ' + this.alpha + ')',
        ctx.fillText(this.text, _x - textW / 2, _y - defaultW / 2),
        ctx.stroke(),
        ctx.closePath(),
        ctx.restore();
    }
  };
}

/**
 * 创建可弯曲的Link
 *
 * @param {any} nodeA 节点A
 * @param {any} nodeZ 节点B
 * @param {any} text link名称
 */
function FlexionalLink(nodeA, nodeZ, text) {
  this.initialize = function() {
    FlexionalLink.prototype.initialize.apply(this, arguments),
      this.direction = 'vertical',
      this.offsetGap = 44;
  },
  this.initialize(nodeA, nodeZ, text),
  this.getStartPosition = function() {
    let sp = {
      x: this.nodeA.cx,
      y: this.nodeA.cy
    };
    return 'horizontal' == this.direction ? sp.x = this.nodeZ.cx < sp.x ? this.nodeA.x : this.nodeA.x + this.nodeA.width : sp.y = this.nodeZ.cy < sp.y ? this.nodeA.y : this.nodeA.y + this.nodeA.height,
      sp;
  },
  this.getEndPosition = function() {
    let ep = {
      x: this.nodeZ.cx,
      y: this.nodeZ.cy
    };
    return 'horizontal' == this.direction ? ep.x = this.nodeA.cx < ep.x ? this.nodeZ.x : this.nodeZ.x + this.nodeZ.width : ep.y = this.nodeA.cy < ep.y ? this.nodeZ.y : this.nodeZ.y + this.nodeZ.height,
      ep;
  },
  this.getPath = function(nodeIndex) {
    let $startPos = this.getStartPosition(),
      $endPos = this.getEndPosition();
    if (this.nodeA === this.nodeZ) {
      return [$startPos, $endPos];
    }
    let paths = [],
      size = getLinksSize(this.nodeA, this.nodeZ),
      span = (size - 1) * this.bundleGap,
      gap = this.bundleGap * nodeIndex - span / 2,
      offGap = this.offsetGap;
    return 'horizontal' == this.direction ? (this.nodeA.cx > this.nodeZ.cx && (offGap = -offGap), paths.push({
      x: $startPos.x,
      y: $startPos.y + gap
    }), paths.push({
      x: $startPos.x + offGap,
      y: $startPos.y + gap
    }), paths.push({
      x: $endPos.x - offGap,
      y: $endPos.y + gap
    }), paths.push({
      x: $endPos.x,
      y: $endPos.y + gap
    })) : (this.nodeA.cy > this.nodeZ.cy && (offGap = -offGap), paths.push({
      x: $startPos.x + gap,
      y: $startPos.y
    }), paths.push({
      x: $startPos.x + gap,
      y: $startPos.y + offGap
    }), paths.push({
      x: $endPos.x + gap,
      y: $endPos.y - offGap
    }), paths.push({
      x: $endPos.x + gap,
      y: $endPos.y
    })),
      paths;
  };
}

/**
 * 曲线状物
 *
 * @param {any} nodeA 节点A
 * @param {any} nodeZ 节点B
 * @param {any} text link名称
 */
function CurveLink(nodeA, nodeZ, text) {
  this.initialize = function() {
    CurveLink.prototype.initialize.apply(this, arguments);
  },
  this.initialize(nodeA, nodeZ, text),
  this.paintPath = function(ctx, paths) {
    if (this.nodeA === this.nodeZ) {
      return void this.paintLoop(ctx);
    }
    ctx.beginPath(),
      ctx.moveTo(paths[0].x, paths[0].y);
    for (let i = 1; i < paths.length; i++) {
      let prevLink = paths[i - 1],
        nextLink = paths[i],
        distanceX = (prevLink.x + nextLink.x) / 2,
        distanceY = (prevLink.y + nextLink.y) / 2;
      distanceY += (nextLink.y - prevLink.y) / 2,
        ctx.strokeStyle = 'rgba(' + this.strokeColor + ',' + this.alpha + ')',
        ctx.lineWidth = this.lineWidth,
        ctx.moveTo(prevLink.x, prevLink.cy),
        ctx.quadraticCurveTo(distanceX, distanceY, nextLink.x, nextLink.y),
        ctx.stroke();
    }
    ctx.stroke();
    ctx.closePath();
    if (null != this.arrowsRadius) {
      let path_last_2 = paths[paths.length - 2],
        path_last = paths[paths.length - 1];
      this.paintArrow(ctx, path_last_2, path_last);
    }
  };
}

Link.prototype = new InteractiveElement,
  FoldLink.prototype = new Link,
  FlexionalLink.prototype = new Link,
  CurveLink.prototype = new Link;

// 单独导出
module.exports = {
  Link: Link,
  FoldLink: FoldLink,
  FlexionalLink: FlexionalLink,
  CurveLink: CurveLink
};
