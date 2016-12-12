//////////////////////////////
/**
 * 布局
 * @author ilex
 * @description 2016-11-09 11:56:12
 */
//////////////////////////////

const _l = require('./_link');
const _n = require('./_node');
const Util = require('./_util');
const Animate = require('./_animate');

const Link = _l.Link;
const Node = _n.Node;

/**
 * 获取中心位置
 *
 * @param {any} elementArray
 * @returns
 */
function getNodesCenter(elementArray) {
  let $x = 0, $y = 0;
  elementArray.forEach(function(val) {
    $x += val.cx,
      $y += val.cy;
  });
  let result = {
    x: $x / elementArray.length,
    y: $y / elementArray.length
  };
  return result;
}

/**
 * 环形layout
 *
 * @param {any} elementArray 元素集合
 * @param {any} animates 动画
 * @returns
 */
function circleLayoutNodes(elementArray, animates) {
  null == animates && (animates = {});
  let $cx = animates.cx,
    $cy = animates.cy,
    minR = animates.minRadius,
    dia = animates.nodeDiameter,
    _hScale = animates.hScale || 1,
    _vScale = animates.vScale || 1;
  animates.beginAngle || 0,
      animates.endAngle || 2 * Math.PI;
  if (null == $cx || null == $cy) {
    let centerPos = getNodesCenter(elementArray);
    $cx = centerPos.x,
      $cy = centerPos.y;
  }
  let totalDia = 0,
    // 圆周长集合
    circumferenceArray = [],
    // 直径集合
    diaArray = [];
  elementArray.forEach(function(item) {
    null == animates.nodeDiameter ? (item.diameter && (dia = item.diameter), dia = item.radius ? 2 * item.radius : Math.sqrt(2 * item.width * item.height), diaArray.push(dia)) : diaArray.push(dia),
      totalDia += dia;
  }),
  elementArray.forEach(function(value, index) {
    let singleDia = diaArray[index] / totalDia;
    circumferenceArray.push(Math.PI * singleDia);
  });
  let twoCircum = (elementArray.length, circumferenceArray[0] + circumferenceArray[1]),
    twoRadius = diaArray[0] / 2 + diaArray[1] / 2,
    tempR = twoRadius / 2 / Math.sin(twoCircum / 2);
  null != minR && minR > tempR && (tempR = minR);
  let _radius = tempR * _hScale,
    _radiusB = tempR * _vScale,
    singleAnimate = animates.animate;
  let angle = 0;
  if (singleAnimate) {
    let millsec = singleAnimate.time || 1000;
      // v = 0;
    elementArray.forEach(function(item, index) {
      angle += 0 == index ? circumferenceArray[index] : circumferenceArray[index - 1] + circumferenceArray[index];
      let tempX = $cx + Math.cos(angle) * _radius,
        tempY = $cy + Math.sin(angle) * _radiusB;
      Animate.stepByStep(item, {
        x: tempX - item.width / 2,
        y: tempY - item.height / 2
      },
        millsec).start();
    });
  } else {
    // let v = 0;
    elementArray.forEach(function(item, index) {
      angle += 0 == index ? circumferenceArray[index] : circumferenceArray[index - 1] + circumferenceArray[index];
      let tempCX = $cx + Math.cos(angle) * _radius,
        tempCY = $cy + Math.sin(angle) * _radiusB;
      item.cx = tempCX,
        item.cy = tempCY;
    });
  }
  return {
    cx: $cx,
    cy: $cy,
    radius: _radius,
    radiusA: _radius,
    radiusB: _radiusB
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
    let elementArray = container.childs;
    if (!(elementArray.length <= 0))
    {
      let bound = container.getBound(),
        ele = elementArray[0],
        colSize = (bound.width - ele.width) / column,
        rowSize = (bound.height - ele.height) / row,
        i = 0;
      for ( let j = 0; j < row; j++) {
        for (let k = 0; k < column; k++) {
          let ele = elementArray[i++],
            _x = bound.left + colSize / 2 + k * colSize,
            _y = bound.top + rowSize / 2 + j * rowSize;
          ele.setLocation(_x, _y);
          if (i >= elementArray.length) {
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
      let elementArray = container.childs;
      if (!(elementArray.length <= 0))
      {
        let bound = container.getBound(), _left = bound.left, _top = bound.top;
        for (let h = 0; h < elementArray.length; h++) {
          let ele = elementArray[h];
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
  return function(container, elementArray) {
    if (elementArray.length > 0) {
      let _x = 1e7,
        reverseX = -1e7,
        _y = 1e7,
        reverseY = -1e7,
        _width = reverseX - _x,
        _height = reverseY - _y;
      for (let i = 0; i < elementArray.length; i++) {
        let ele = elementArray[i];
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
 * @param {any} elementArray
 * @returns
 */
function getRootNodes(elementArray) {
  let results = [],
    links = elementArray.filter(function(ele) {
      return ele instanceof Link ? true : (results.push(ele), false);
      // return ele.elementType === 'link' ? true : (result.push(ele), false);
    });
  return elementArray = results.filter(function(result) {
    for (let i = 0; i < links.length; i++) {
      if (links[i].nodeZ === result) {
        return false;
      }
    }
    return true;
  }),
    elementArray = elementArray.filter(function(ele) {
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
  return function($stage) {
    function executeTree(scene, rootNode) {
      let deep = getTreeDeep(scene, rootNode),
        tempRns = getTreeNodes(scene, rootNode),
        nodeArr = tempRns['' + deep].nodes;
      for (let i = 0; i < nodeArr.length; i++) {
        let clNode = nodeArr[i],
          tempW = (i + 1) * (_width + 10),
          tempH = deep * _height;
        'down' == directionType || ('up' == directionType ? tempH = -tempH : 'left' == directionType ? (tempW = -deep * _height, tempH = (i + 1) * (_width + 10)) : 'right' == directionType && (tempW = deep * _height, tempH = (i + 1) * (_width + 10))),
          clNode.setLocation(tempW, tempH);
      }
      for (let j = deep - 1; j >= 0; j--) {
        // 当前层的node集合
        let currentLevelNodes = tempRns['' + j].nodes,
          tempChilds = tempRns['' + j].childs;
        for (let k = 0; k < currentLevelNodes.length; k++) {
          let nodeItem = currentLevelNodes[k],
            childItem = tempChilds[k];
          'down' == directionType ? nodeItem.y = j * _height : 'up' == directionType ? nodeItem.y = -j * _height : 'left' == directionType ? nodeItem.x = -j * _height : 'right' == directionType && (nodeItem.x = j * _height),
            childItem.length > 0 ?
            'down' == directionType || 'up' == directionType ?
            nodeItem.x = (childItem[0].x + childItem[childItem.length - 1].x) / 2 : ('left' == directionType || 'right' == directionType) &&
            (nodeItem.y = (childItem[0].y + childItem[childItem.length - 1].y) / 2) : k > 0 &&
            ('down' == directionType || 'up' == directionType ?
              nodeItem.x = currentLevelNodes[k - 1].x + currentLevelNodes[k - 1].width + _width : ('left' == directionType || 'right' == directionType) &&
              (nodeItem.y = currentLevelNodes[k - 1].y + currentLevelNodes[k - 1].height + _width)
            );
          if (k > 0) {
            if ('down' == directionType || 'up' == directionType) {
              if (nodeItem.x < currentLevelNodes[k - 1].x + currentLevelNodes[k - 1].width) {
                let totalW = currentLevelNodes[k - 1].x + currentLevelNodes[k - 1].width + _width,
                  tempX = Math.abs(totalW - nodeItem.x);
                for (let m = k; m < currentLevelNodes.length; m++) {
                  calcAndSetPosition($stage.childs, currentLevelNodes[m], tempX, 0);
                }
              }
            }
            else if (('left' == directionType || 'right' == directionType) && nodeItem.y < currentLevelNodes[k - 1].y + currentLevelNodes[k - 1].height) {
              let totalH = currentLevelNodes[k - 1].y + currentLevelNodes[k - 1].height + _width,
                tempY = Math.abs(totalH - nodeItem.y);
              for (let n = k; n < currentLevelNodes.length; n++) {
                calcAndSetPosition($stage.childs, currentLevelNodes[n], 0, tempY);
              }
            }
          }
        }
      }
    }
    let singleSize = null;
    null == _width && (singleSize = calcSize($stage.childs), _width = singleSize.width, ('left' == directionType || 'right' == directionType) && (_width = singleSize.width + 10)),
      null == _height && (null == singleSize && (singleSize = calcSize($stage.childs)), _height = 2 * singleSize.height),
      null == directionType && (directionType = 'down');
    let rns = getRootNodes($stage.childs);
    if (rns.length > 0) {
      executeTree($stage.childs, rns[0]);
      let bound = Util.getElementsBound($stage.childs),
        centerPos = $stage.getCenterLocation(),
        _x = centerPos.x - (bound.left + bound.right) / 2,
        _y = centerPos.y - (bound.top + bound.bottom) / 2;
      $stage.childs.forEach(function(item) {
        item instanceof Node && (item.x += _x, item.y += _y);
        // item.elementType === 'node' && (item.x += _x, item.y += _y);
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
 * @param {any} radius 半径
 * @param {any} begin
 * @param {any} end
 * @returns
 */
function getCyclePositions(x, y, counts, radius, begin, end) {
  let beginAngle = begin ? begin : 0,
    endAngle = end ? end : 2 * Math.PI,
    diff = endAngle - beginAngle,
    avg = diff / counts,
    results = [];
  beginAngle += avg / 2;
  for (let i = beginAngle; endAngle >= i; i += avg) {
    let _x = x + Math.cos(i) * radius,
      _y = y + Math.sin(i) * radius;
    results.push({
      x: _x,
      y: _y
    });
  }
  return results;
}

/**
 * 获取树位置
 *
 * @param {number} x
 * @param {number} y
 * @param {number} count
 * @param {number} horizontal
 * @param {number} vertical
 * @param {string} dir 方向 默认bottom
 * @returns
 */
function getTreePositions(x, y, count, horizontal, vertical, dir) {
  let direction = dir || 'bottom',
    result = [];

  if (direction == 'bottom') {
    // bottom类型的起始位置,bottom start
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
    for (let i = 0; i <= count; i++) {
      result.push({
        x: tstart + i * horizontal,
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


function springLayout($rootNode, $scene) {
  let additive = 0.01,
    multiplicative = 0.95,
    diff = -5,
    currentX = 0,
    currentY = 0,
    counts = 0,
    allEles = $scene.getElementsByClass(Node);
  /**
   * 动态调整位置
   *
   * @param {any} rn
   * @param {any} tarNode
   */
  function dynamicAdjustPos(rn, tarNode) {
    let distanceX = rn.x - tarNode.x,
      distanceY = rn.y - tarNode.y;
    currentX += distanceX * additive,
      currentY += distanceY * additive,
      currentX *= multiplicative,
      currentY *= multiplicative,
      currentY += diff,
      tarNode.x += currentX,
      tarNode.y += currentY;
  }

  function doSpring() {
    if (!(++counts > 150)) {
      for (let i = 0; i < allEles.length; i++) {
        allEles[i] != $rootNode && dynamicAdjustPos($rootNode, allEles[i], allEles);
      }
      setTimeout(doSpring, 1e3 / 24);
    }
  }

  doSpring();
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
