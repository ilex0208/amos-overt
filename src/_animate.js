//////////////////////////////
/**
 * 动画
 * @author ilex
 * @description 2016-11-01 11:56:12
 */
//////////////////////////////
const _n = require('./_node');
const Util = require('./_util');
const Node = _n.Node;
/**
 * 标志是否停止所有
 */
let isStopAll = false;

/**
 * 动画步骤
 *
 * @param {any} fn 执行动画的函数
 * @param {any} millisec 执行时间 毫秒
 * @returns 动画本身
 */
function Step(fn, millisec) {
  let interval, msgBus = null;
  return {
    stop: function() {
      return interval ? (window.clearInterval(interval), msgBus && msgBus.publish('stop'), this) : this;
    },
    start: function() {
      let _self = this;
      return interval = setInterval(function() {fn.call(_self);}, millisec),this;
    },
    onStop: function(msg) {
      return null == msgBus && (msgBus = new Util.MessageBus),
        msgBus.subscribe('stop', msg),
        this;
    }
  };
}

/**
 * gravity动画
 * (重力效果)
 *
 * @param {any} node
 * @param {any} option
 * @returns
 */
function gravity(node, option) {
  let _context = option.context;
  let gravity = option.gravity || 0.1;
  let t = null;
  let effect = {};

  function stop() {
    window.clearInterval(t);
    if (effect.onStop) {
      effect.onStop(node);
    }
    return effect;
  }

  function run() {
    let dx = option.dx || 0,
      dy = option.dy || 2;
    t = setInterval(function() {
      if (isStopAll) {
        effect.stop();
        return;
      }
      dy += gravity;
      if (node.y + node.height < _context.stage.canvas.height) {
        node.setLocation(node.x + dx, node.y + dy);
      } else {
        dy = 0;
        stop();
      }
    }, 20);
    return effect;
  }

  effect.run = run;
  effect.stop = stop;
  effect.onStop = function(f) {
    effect.onStop = f;
    return effect;
  };
  return effect;
}

/**
 * 分步骤执行动画
 *
 * @param {any} tarEle 动画元素,可以是node、scene
 * @param {object} animates 动画 如:{rotate: 2*Math.PI}/{scalaX: 2}/{percent: 1}
 *				/{height:150, y: 70}/{alpha: 0.2}/{x: 300, y: 400, width: 10, height: 10, rotate: 2*Math.PI} 等
 * @param {number} speed 速度
 * @param {boolean} isCycle 是否持续执行动画 true: 持续执行  false:不持续执行 (false时可以不写参数)
 * @param {boolean} isReverse 是否是否反向回滚动画 true: 反向执行  false:不反向 (其中为false的时候可以不写)
 * @author ilex
 * @description exp : stepByStep(scene, {translateX: location.x, translateY: location.y, scaleX: 4, scaleY: 4}, 600).start()
 */
function stepByStep(tarEle, animate, speed, isCycle, isReverse) {
  let millisec = 1000 / 24, $ani = {};
  for (let key in animate) {
    let val = animate[key],
      total = val - tarEle[key];
    $ani[key] = {
      oldValue: tarEle[key],
      targetValue: val,
      step: total / speed * millisec,
      isDone: function(property) {
        let result = this.step > 0 && tarEle[property] >= this.targetValue || this.step < 0 && tarEle[property] <= this.targetValue;
        return result;
      }
    };
  }
  let $step = new Step(function() {
    let flag = true;
    for (let akey in animate) {
      $ani[akey].isDone(akey) || (tarEle[akey] += $ani[akey].step, flag = false);
    }
    if (flag) {
      if (!isCycle) {
        return this.stop();
      }
      for (let reKey in animate) {
        if (isReverse) {
          let currentVal = $ani[reKey].targetValue;
          $ani[reKey].targetValue = $ani[reKey].oldValue,
              $ani[reKey].oldValue = currentVal,
              $ani[reKey].step = -$ani[reKey].step;
        } else {
          tarEle[reKey] = $ani[reKey].oldValue;
        }
      }
    }
    return this;
  },
    millisec);
  return $step;
}

/**
 * 跳跃动画
 * (效果)
 *
 * @param {any} dest 执行动画的目标
 * @returns
 */
function spring(dest) {
  null == dest && (dest = {});
  let $spring = dest.spring || 0.1,
    $friction = dest.friction || 0.8, // 摩擦力
    $dgrivity = dest.grivity || 0, // 引力
    windOrLength = (dest.wind || 0, dest.minLength || 0);
  return {
    items: [],
    timer: null,
    isPause: false,
    addNode: function(trNode, tr) {
      let animateNode = {
        node: trNode,
        target: tr,
        vx: 0,
        vy: 0
      };
      return this.items.push(animateNode), this;
    },
    play: function(speed) {
      this.stop(), speed = null == speed ? 1000 / 24 : speed;
      let _self = this;
      this.timer = setInterval(function() { _self.nextFrame(); }, speed);
    },
    stop: function() {
      null != this.timer && window.clearInterval(this.timer);
    },
    nextFrame: function() {
      for (let i = 0; i < this.items.length; i++) {
        let animateNode = this.items[i],
          $node = animateNode.node,
          $target = animateNode.target,
          $vx = animateNode.vx,
          $vy = animateNode.vy,
          distanceX = $target.x - $node.x,
          distanceY = $target.y - $node.y,
          angle = Math.atan2(distanceY, distanceX); // 反正切
        if (0 != windOrLength) {
          let _width = $target.x - Math.cos(angle) * windOrLength,
            _height = $target.y - Math.sin(angle) * windOrLength;
          $vx += (_width - $node.x) * $spring,
            $vy += (_height - $node.y) * $spring;
        } else {
          $vx += distanceX * $spring,
            $vy += distanceY * $spring;
        }
        $vx *= $friction,
          $vy *= $friction,
          $vy += $dgrivity,
          $node.x += $vx,
          $node.y += $vy,
          animateNode.vx = $vx,
          animateNode.vy = $vy;
      }
    }
  };
}

/**
 * 旋转动画
 *
 * @param {any} node
 * @param {any} option
 * @returns
 */
function rotate(node, option) {
  // let _context = option.context;
  let t = null;
  let effect = {};
  let v = option.v;

  function run() {
    t = setInterval(function() {
      if (isStopAll) {
        effect.stop();
        return;
      }
      node.rotate += v || 0.2;
      if (node.rotate > 2 * Math.PI) {
        node.rotate = 0;
      }
    }, 100);
    return effect;
  }

  function stop() {
    window.clearInterval(t);
    if (effect.onStop) {
      effect.onStop(node);
    }
    return effect;
  }

  effect.run = run;
  effect.stop = stop;
  effect.onStop = function(fn) {
    effect.onStop = fn;
    return effect;
  };
  return effect;
}

/**
 * 分裂成两瓣动画
 *
 * @param {any} node
 * @param {any} option
 * @returns
 */
function dividedTwoPiece(node, option) {
  let _context = option.context;
  // let style = node.style;
  let effect = {};

  function genNode(x, y, r, beginDegree, endDegree) {
    let newNode = new Node();
    newNode.setImage(node.image);
    newNode.setSize(node.width, node.height);
    newNode.setLocation(x, y);
    newNode.draw = function(ctx) {
      ctx.save();
      // ctx.arc(this.x + this.width / 2, this.y + this.height / 2, r, beginDegree, endDegree);
      ctx.arc(0, 0, r, beginDegree, endDegree);
      ctx.clip();
      ctx.beginPath();
      if (this.image != undefined && this.image != null) {
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
      } else {
        ctx.fillStyle = 'rgba(' + this.style.fillStyle + ',' + this.alpha + ')';
        ctx.rect(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
        ctx.fill();
      }
      ctx.closePath();
      ctx.restore();
    };
    return newNode;
  }

  function split(angle, ctx) {
    let beginDegree = angle;
    let endDegree = angle + Math.PI;
    let node1 = genNode(node.x, node.y, node.width, beginDegree, endDegree);
    let node2 = genNode(node.x - 2 + Math.random() * 4, node.y, node.width, beginDegree + Math.PI, beginDegree);
    // node.setVisible(false);
    node.visible = false;

    ctx.add(node1);
    ctx.add(node2);
    // box.updateView();

    gravity(node1, {
      context: ctx,
      dx: 0.3
    }).run().onStop(function(n) {
      ctx.remove(node1);
      ctx.remove(node2);
      effect.stop();
    });
    gravity(node2, {
      context: ctx,
      dx: -0.2
    }).run();
  }

  function run() {
    split(option.angle, _context);
    return effect;
  }

  function stop() {
    if (effect.onStop) {
      effect.onStop(node);
    }
    return effect;
  }

  effect.onStop = function(fn) {
    effect.onStop = fn;
    return effect;
  };
  effect.run = run;
  effect.stop = stop;
  return effect;
}

/**
 * 重复投掷动画
 *
 * @param {any} node
 * @param {any} option
 * @returns
 */
function repeatThrow(node, option) {
  let gravity = 0.8,
    ctx = option.context,
    t = null,
    effect = {};

  function initNode(node) {
    node.setVisible(true);
    node.rotate = Math.random();
    let $width = ctx.stage.canvas.width / 2;
    node.x = $width + Math.random() * ($width - 100) - Math.random() * ($width - 100);
    node.y = ctx.stage.canvas.height;
    node.vx = Math.random() * 5 - Math.random() * 5;
    node.vy = -25;
  }

  function run() {
    initNode(node);
    t = setInterval(function() {
      if (isStopAll) {
        effect.stop();
        return;
      }
      node.vy += gravity;
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > ctx.stage.canvas.width || node.y > ctx.stage.canvas.height) {
        if (effect.onStop) {
          effect.onStop(node);
        }
        initNode(node);
      }
    }, 50);
    return effect;
  }

  function stop() {
    window.clearInterval(t);
  }

  effect.onStop = function(fn) {
    effect.onStop = fn;
    return effect;
  };
  effect.run = run;
  effect.stop = stop;
  return effect;
}

/**
 * 停止所有
 */
function stopAll() {
  isStopAll = true;
}

/**
 * 开启所有
 */
function startAll() {
  isStopAll = false;
}

/**
 * 周期动画
 *
 * @param {any} node
 * @param {any} option
 * @returns
 */
function cycle(node, option) {
  let p1 = option.p1;
  let p2 = option.p2;
  // let box = option.context;

  let midX = p1.x + (p2.x - p1.x) / 2;
  let midY = p1.y + (p2.y - p1.y) / 2;
  let distance = Util.getDistance(p1, p2) / 2;

  let angle = Math.atan2(midY, midX);// 角度
  let speed = option.speed || 0.2;// 角度增加量
  let effect = {};
  let t = null;

  function run() {
    t = setInterval(function() {
      if (isStopAll) {
        effect.stop();
        return;
      }
      //let newx = p1.x + midX + Math.cos(angle) * distance;
      let newy = p1.y + midX + Math.sin(angle) * distance;
      node.setLocation(node.x, newy);
      // box.updateView();
      angle += speed;
    }, 100);
    return effect;
  }

  function stop() {
    window.clearInterval(t);
  }

  effect.run = run;
  effect.stop = stop;
  return effect;
}

/**
 * 移动
 *
 * @param {any} node
 * @param {any} option
 * @returns
 */
function move(node, option) {
  let pos = option.position;
  // let box = option.context;
  let easing = option.easing || 0.2;

  let effect = {};
  let t = null;

  function run() {
    t = setInterval(function() {
      if (isStopAll) {
        effect.stop();
        return;
      }
      let dx = pos.x - node.x;
      let dy = pos.y - node.y;
      let vx = dx * easing;
      let vy = dy * easing;

      node.x += vx;
      node.y += vy;
      // box.updateView();
      if (vx < 0.01 && vy < 0.1) {
        stop();
      }
    }, 100);
    return effect;
  }

  function stop() {
    window.clearInterval(t);
  }
  effect.onStop = function(f) {
    effect.onStop = f;
    return effect;
  };
  effect.run = run;
  effect.stop = stop;
  return effect;
}

/**
 * 目标自身缩放动画
 *
 * @param {any} node
 * @param {any} option
 * @returns
 */
function scale(node, option) {
  // let p = option.position;
  // let box = option.context;
  let scale = option.scale || 1;
  let quantity = 0.06; // 增加量
  let oldScaleX = node.scaleX;
  let oldScaleY = node.scaleY;

  let effect = {};
  let t = null;

  function run() {
    t = setInterval(function() {
      node.scaleX += quantity;
      node.scaleY += quantity;
      if (node.scaleX >= scale) {
        stop();
      }
      // box.updateView();
    }, 100);
    return effect;
  }

  function stop() {
    if (effect.onStop) {
      effect.onStop(node);
    }
    node.scaleX = oldScaleX;
    node.scaleY = oldScaleY;
    window.clearInterval(t);
  }
  effect.onStop = function(f) {
    effect.onStop = f;
    return effect;
  };
  effect.run = run;
  effect.stop = stop;
  return effect;
}

let Animate = {
    stepByStep: stepByStep,
    rotate: rotate,
    scale: scale,
    move: move,
    cycle: cycle,
    repeatThrow: repeatThrow,
    dividedTwoPiece: dividedTwoPiece,
    gravity: gravity,
    startAll: startAll,
    stopAll: stopAll
  },
  Effect = {
    spring: spring,
    gravity: gravity
  };

// 单独导出
module.exports = {
  Effect: Effect,
  Animate: Animate
};

