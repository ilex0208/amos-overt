const _link = require('./_link');
const _node = require('./_node');
const Util = require('./_util');
const Animate = require('./_animate');

const Link = _link.Link;
const Node = _node.Node;

function getNodesCenter(a) {
  let b = 0,c = 0;
  a.forEach(function(a) {
    b += a.cx,
      c += a.cy;
  });
  let d = {
    x: b / a.length,
    y: c / a.length
  };
  return d;
}

/**
 * 环形layout
 *
 * @param {any} eles 元素集合
 * @param {any} animates 动画
 * @returns
 */
function circleLayoutNodes(eles, animates) {
  null == animates && (animates = {});
  let $cx = animates.cx,
    $cy = animates.cy,
    minR = animates.minRadius,
    h = animates.nodeDiameter,
    i = animates.hScale || 1,
    j = animates.vScale || 1;
  animates.beginAngle || 0,
      animates.endAngle || 2 * Math.PI;
  if (null == $cx || null == $cy) {
    let k = getNodesCenter(eles);
    $cx = k.x,
      $cy = k.y;
  }
  let l = 0,
    m = [],
    n = [];
  eles.forEach(function(a) {
    null == animates.nodeDiameter ? (a.diameter && (h = a.diameter), h = a.radius ? 2 * a.radius : Math.sqrt(2 * a.width * a.height), n.push(h)) : n.push(h),
      l += h;
  }),
    eles.forEach(function(a, b) {
      let c = n[b] / l;
      m.push(Math.PI * c);
    });
  let o = (eles.length, m[0] + m[1]),
    p = n[0] / 2 + n[1] / 2,
    q = p / 2 / Math.sin(o / 2);
  null != minR && minR > q && (q = minR);
  let r = q * i,
    s = q * j,
    t = animates.animate;
  let angle = 0;
  if (t) {
    let millsec = t.time || 1000;
      // v = 0;
    eles.forEach(function(b, c) {
      angle += 0 == c ? m[c] : m[c - 1] + m[c];
      let d = $cx + Math.cos(angle) * r,
        g = $cy + Math.sin(angle) * s;
      Animate.stepByStep(b, {
        x: d - b.width / 2,
        y: g - b.height / 2
      },
        millsec).start();
    });
  } else {
    // let v = 0;
    eles.forEach(function(a, b) {
      angle += 0 == b ? m[b] : m[b - 1] + m[b];
      let c = $cx + Math.cos(angle) * r,
        d = $cy + Math.sin(angle) * s;
      a.cx = c,
        a.cy = d;
    });
  }
  return {
    cx: $cx,
    cy: $cy,
    radius: r,
    radiusA: r,
    radiusB: s
  };
}

/**
 * 网格布局
 * 
 * @param {Number} row 行
 * @param {Number} column 列
 * @returns
 */
function GridLayout(row, column) {
  return function(container) {
    let eles = container.childs;
    if (!(eles.length <= 0))
    {
      let bound = container.getBound(),
        ele = eles[0],
        colSize = (bound.width - ele.width) / column,
        rowSize = (bound.height - ele.height) / row,
        i = 0;
      for ( let j = 0; j < row; j++) {
        for (let k = 0; k < column; k++) {
          let ele = eles[i++],
            _x = bound.left + colSize / 2 + k * colSize,
            _y = bound.top + rowSize / 2 + j * rowSize;
          ele.setLocation(_x, _y);
          if (i >= eles.length) {
            return;
          }
        }
      }
    }
  };
}

/**
 * 流式布局
 * 
 * @param {any} horizontal 水平间隔
 * @param {any} vertical 垂直间隔
 * @returns
 */
function FlowLayout(horizontal, vertical) {
  return null == horizontal && (horizontal = 0),
    null == vertical && (vertical = 0),
    function(container) {
      let eles = container.childs;
      if (!(eles.length <= 0))
      {
        let bound = container.getBound(), _left = bound.left, _top = bound.top;
        for (let h = 0; h < eles.length; h++) {
          let ele = eles[h];
          _left + ele.width >= bound.right && (_left = bound.left, _top += vertical + ele.height),
            ele.setLocation(_left, _top),
            _left += horizontal + ele.width;
        }
      }
    };
}

/**
 * 自动布局
 * 
 * @returns
 */
function AutoBoundLayout() {
  return function(container, eles) {
    if (eles.length > 0) {
      let _x = 1e7,
        reverseX = -1e7,
        _y = 1e7,
        reverseY = -1e7,
        _width = reverseX - _x,
        _height = reverseY - _y;
      for (let i = 0; i < eles.length; i++) {
        let ele = eles[i];
        ele.x <= _x && (_x = ele.x),
          ele.x >= reverseX && (reverseX = ele.x),
          ele.y <= _y && (_y = ele.y),
          ele.y >= reverseY && (reverseY = ele.y),
          _width = reverseX - _x + ele.width,
          _height = reverseY - _y + ele.height;
      }
      container.x = _x,
        container.y = _y,
        container.width = _width,
        container.height = _height;
    }
  };
}

/**
 * 获取根节点
 * 
 * @param {any} eles
 * @returns
 */
function getRootNodes(eles) {
  let results = [],
    links = eles.filter(function(ele) {
      return ele instanceof Link ? true : (results.push(ele), false);
      // return ele.elementType === 'link' ? true : (result.push(ele), false);
    });
  return eles = results.filter(function(result) {
    for (let i = 0; i < links.length; i++) {
      if (links[i].nodeZ === result) {
        return false;
      }
    }
    return true;
  }),
    eles = eles.filter(function(ele) {
      for (let j = 0; j < links.length; j++) {
        if (links[j].nodeA === ele) {
          return true;
        }
      }
      return false;
    });
}

/**
 * 计算单个元素的长和宽
 *
 * @param {any} eleArr
 * @returns
 */
function calcSize(eleArr) {
  let totalW = 0,
    totalH = 0;
  return eleArr.forEach(function(ele) {
    totalW += ele.width,
      totalH += ele.height;
  }),
    {
      width: totalW / eleArr.length,
      height: totalH / eleArr.length
    };
}

/**
 * 计算和设节点位置
 *
 * @param {any} scene
 * @param {any} rootNode
 * @param {any} _x
 * @param {any} _y
 */
function calcAndSetPosition(scene, rootNode, _x, _y) {
  rootNode.x += _x,
    rootNode.y += _y;
  let allChilds = getNodeChilds(scene, rootNode);
  for (let i = 0; i < allChilds.length; i++){
    calcAndSetPosition(scene, allChilds[i], _x, _y);
  }
}

/**
 * 获取tree node 集合
 *
 * @param {any} scene
 * @param {any} rootNode
 * @returns
 */
function getTreeNodes(scene, rootNode) {
  function calcNodes(node, index) {
    let allChilds = getNodeChilds(scene, node);
    null == result[index] && (result[index] = {},result[index].nodes = [], result[index].childs = []),
      result[index].nodes.push(node),
      result[index].childs.push(allChilds);
    for (let i = 0; i < allChilds.length; i++){
      calcNodes(allChilds[i], index + 1),allChilds[i].parent = node;
    }
  }
  let result = [];
  return calcNodes(rootNode, 0),
    result;
}

/**
 * 设置Tree布局
 *
 * @param {String} directionType 方向类型
 * @param {Number} _width 宽
 * @param {Number} _height 高
 * @returns
 */
function TreeLayout(directionType, _width, _height) {
  return function(e) {
    function executeTree(scene, rootNode) {
      let h = getTreeDeep(scene, rootNode),
        k = getTreeNodes(scene, rootNode),
        l = k['' + h].nodes;
      for (let m = 0; m < l.length; m++) {
        let n = l[m],
          o = (m + 1) * (_width + 10),
          p = h * _height;
        'down' == directionType || ('up' == directionType ? p = -p : 'left' == directionType ? (o = -h * _height, p = (m + 1) * (_width + 10)) : 'right' == directionType && (o = h * _height, p = (m + 1) * (_width + 10))),
          n.setLocation(o, p);
      }
      for (let q = h - 1; q >= 0; q--) {
        let r = k['' + q].nodes,
          s = k['' + q].childs;
        for (let m = 0; m < r.length; m++) {
          let t = r[m],
            u = s[m];
          if ('down' == directionType ?
            t.y = q * _height : 'up' == directionType ?
            t.y = -q * _height : 'left' == directionType ?
            t.x = -q * _height : 'right' == directionType && (t.x = q * _height),
            u.length > 0 ?
            'down' == directionType || 'up' == directionType ?
            t.x = (u[0].x + u[u.length - 1].x) / 2 : ('left' == directionType || 'right' == directionType) &&
            (t.y = (u[0].y + u[u.length - 1].y) / 2) : m > 0 &&
            ('down' == directionType || 'up' == directionType ?
              t.x = r[m - 1].x + r[m - 1].width + _width : ('left' == directionType || 'right' == directionType) &&
              (t.y = r[m - 1].y + r[m - 1].height + _width)
            ),
            m > 0) {
            if ('down' == directionType || 'up' == directionType) {
              if (t.x < r[m - 1].x + r[m - 1].width) {
                let v = r[m - 1].x + r[m - 1].width + _width,
                  w = Math.abs(v - t.x);
                for (let x = m; x < r.length; x++) {
                  calcAndSetPosition(e.childs, r[x], w, 0);
                }
              }
            } else if (('left' == directionType || 'right' == directionType) && t.y < r[m - 1].y + r[m - 1].height) {
              let y = r[m - 1].y + r[m - 1].height + _width,
                z = Math.abs(y - t.y);
              for (let x = m; x < r.length; x++) {
                calcAndSetPosition(e.childs, r[x], 0, z);
              }
            }
          }
        }
      }
    }
    let singleSize = null;
    null == _width && (singleSize = calcSize(e.childs), _width = singleSize.width, ('left' == directionType || 'right' == directionType) && (_width = singleSize.width + 10)),
      null == _height && (null == singleSize && (singleSize = calcSize(e.childs)), _height = 2 * singleSize.height),
      null == directionType && (directionType = 'down');
    let k = getRootNodes(e.childs);
    if (k.length > 0) {
      executeTree(e.childs, k[0]);
      let l = Util.getElementsBound(e.childs),
        m = e.getCenterLocation(),
        n = m.x - (l.left + l.right) / 2,
        o = m.y - (l.top + l.bottom) / 2;
      e.childs.forEach(function(b) {
        b instanceof Node && (b.x += n, b.y += o);
        // b.elementType === 'node' && (b.x += n, b.y += o);
      });
    }
  };
}

/**
 * 圆布局
 *
 * @param {any} diameter 直径
 * @returns
 */
function CircleLayout(diameter) {
  return function($scene) {
    function calcLocation(_scene, rootNode, dia) {
      let allChilds = getNodeChilds(_scene, rootNode);
      if (0 != allChilds.length) {
        null == dia && (dia = diameter);
        let girth = 2 * Math.PI / allChilds.length;
        allChilds.forEach(function(child, index) {
          let _x = rootNode.x + dia * Math.cos(girth * index),
            _y = rootNode.y + dia * Math.sin(girth * index);
          child.setLocation(_x, _y);
          let halfDia = dia / 2;
          calcLocation(_scene, child, halfDia);
        });
      }
    }
    let nodes = getRootNodes($scene.childs);
    if (nodes.length > 0) {
      calcLocation($scene.childs, nodes[0]);
      let bound = Util.getElementsBound($scene.childs),
        center = $scene.getCenterLocation(),
        resX = center.x - (bound.left + bound.right) / 2,
        resY = center.y - (bound.top + bound.bottom) / 2;
      $scene.childs.forEach(function(child) {
        child instanceof Node && (child.x += resX, child.y += resY);
        // child.elementType === 'node' && (child.x += resX, child.y += resY);
      });
    }
  };
}

/**
 * 获取Grid 位置
 *
 * @param {any} x
 * @param {any} y
 * @param {any} rows
 * @param {any} cols
 * @param {any} horizontal
 * @param {any} vertical
 * @returns
 */
function getGridPositions(x, y, rows, cols, horizontal, vertical) {
  let positions =[];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      positions.push({
        x: x + j * horizontal,
        y: y + i * vertical
      });
    }
  }
  return positions;
}

/**
 * 获取圆型位置
 * 
 * @param {any} x
 * @param {any} y
 * @param {any} counts
 * @param {any} radius
 * @param {any} begin
 * @param {any} end
 * @returns
 */
function getCyclePositions(x, y, counts, radius, begin, end) {
  let beginAngle = begin ? begin : 0,
    endAngle = end ? end : 2 * Math.PI,
    diff = endAngle - beginAngle,
    j = diff / counts,
    k = [];
  beginAngle += j / 2;
  for (let l = beginAngle; endAngle >= l; l += j) {
    let m = x + Math.cos(l) * radius,
      n = y + Math.sin(l) * radius;
    k.push({
      x: m,
      y: n
    });
  }
  return k;
}

/**
 * 获取树位置
 *
 * @param {any} x
 * @param {any} y
 * @param {any} count
 * @param {any} horizontal
 * @param {any} vertical
 * @param {any} dir
 * @returns
 */
function getTreePositions(x, y, count, horizontal, vertical, dir) {
  let direction = dir || 'bottom',
    result = [];

  if (direction == 'bottom') {
    let bstart = x - (count / 2) * horizontal + horizontal / 2;
    for (let b = 0; b <= count; b++) {
      result.push({
        x: bstart + b * horizontal,
        y: y + vertical
      });
    }
  }
  else if (direction == 'top') {
    let tstart = x - (count / 2) * horizontal + horizontal / 2;
    for (let t = 0; t <= count; t++) {
      result.push({
        x: tstart + t * horizontal,
        y: y - vertical
      });
    }
  }
  else if (direction == 'right') {
    let rstart = y - (count / 2) * horizontal + horizontal / 2;
    for (let r = 0; r <= count; r++) {
      result.push({
        x: x + vertical,
        y: rstart + r * horizontal
      });
    }
  }
  else if (direction == 'left') {
    let lstart = y - (count / 2) * horizontal + horizontal / 2;
    for (let l = 0; l <= count; l++) {
      result.push({
        x: x - vertical,
        y: lstart + l * horizontal
      });
    }
  }
  return result;
}

/**
 * 调整位置
 *
 * @param {any} ele 元素
 * @param {any} allChilds 子节点
 * @returns
 */
function adjustPosition(ele, allChilds) {
  if (ele.layout) {
    let _layout = ele.layout,
      _type = _layout.type,
      pos = null;
    if ('circle' == _type) {
      let _radius = _layout.radius || Math.max(ele.width, ele.height);
      pos = getCyclePositions(ele.cx, ele.cy, allChilds.length, _radius, ele.layout.beginAngle, ele.layout.endAngle);
    } else if ('tree' == _type) {
      let horizontal = _layout.width || 50,
        vertical = _layout.height || 50,
        direction = _layout.direction;
      pos = getTreePositions(ele.cx, ele.cy, allChilds.length, horizontal, vertical, direction);
    } else {
      if ('grid' != _type) {
        return;
      }
      pos = getGridPositions(ele.x, ele.y, _layout.rows, _layout.cols, _layout.horizontal || 0, _layout.vertical || 0);
    }
    for (let i = 0; i < allChilds.length; i++) {
      allChilds[i].setCenterLocation(pos[i].x, pos[i].y);
    }
  }
}

/**
 * 获取node节点的子节点
 *
 * @param {any} scene
 * @param {any} rootNode
 * @returns
 */
function getNodeChilds(scene, rootNode) {
  let results = [];
  for (let i = 0; i < scene.length; i++) {
    scene[i] instanceof Link && scene[i].nodeA === rootNode && results.push(scene[i].nodeZ);
    // scene[i].elementType === 'link' && scene[i].nodeA === rootNode && results.push(scene[i].nodeZ);
  }
  return results;
}

/**
 * 设置layout
 *
 * @param {any} scene 场景
 * @param {any} targetEle 目标node
 * @param {any} isAutoLayout 是否自动布局
 * @returns
 */
function layoutNode(scene, targetEle, isAutoLayout) {
  let allChild = getNodeChilds(scene.childs, targetEle);
  if (0 === allChild.length) {
    return null;
  }
  adjustPosition(targetEle, allChild);
  if (true === isAutoLayout){
    for (let i = 0; i < allChild.length; i++) {
      layoutNode(scene, allChild[i], isAutoLayout);
    }
  }
  return null;
}


function springLayout(b, c) {
  function d(a, b) {
    let c = a.x - b.x,
      d = a.y - b.y;
    i += c * f,
      j += d * f,
      i *= g,
      j *= g,
      j += h,
      b.x += i,
      b.y += j;
  }
  function e() {
    if (!(++k > 150)) {
      for (let a = 0; a < l.length; a++) {l[a] != b && d(b, l[a], l);}
      setTimeout(e, 1e3 / 24);
    }
  }
  let f = .01,
    g = .95,
    h = -5,
    i = 0,
    j = 0,
    k = 0,
    l = c.getElementsByClass(Node);
  e();
}

/**
 * 获取树的深度
 *
 * @param {any} $scene 场景
 * @param {any} $rootNode 根结点
 * @returns
 */
function getTreeDeep($scene, $rootNode) {
  function calcDeep(_scene, _rootNode, _deep) {
    let allchilds = getNodeChilds(_scene, _rootNode);
    _deep > deep && (deep = _deep);
    for (let i = 0; i < allchilds.length; i++) {
      calcDeep(_scene, allchilds[i], _deep + 1);
    }
  }
  let deep = 0;
  return calcDeep($scene, $rootNode, 0),
    deep;
}

// 整体 layout
module.exports = {
  layoutNode: layoutNode,
  getNodeChilds: getNodeChilds,
  adjustPosition: adjustPosition,
  springLayout: springLayout,
  getTreeDeep: getTreeDeep,
  getRootNodes: getRootNodes,
  GridLayout: GridLayout,
  FlowLayout: FlowLayout,
  AutoBoundLayout: AutoBoundLayout,
  CircleLayout: CircleLayout,
  TreeLayout: TreeLayout,
  getNodesCenter: getNodesCenter,
  circleLayoutNodes: circleLayoutNodes
};
