const List = require('./../core/_list');
const math = require('./../core/_math');
const html = require('./../core/_html');
const EventDispatcher = require('./_eventDispatcher');
const _third = require('./../core/_third');
const _cons = require('./../constants');
const Bd = _cons.Bd;

const SelectionModel = require('./_model');
const _render = require('./../core/_render');
const animate = require('./../core/_animgmt');
const Pool = require('./../core/_pool');
const UserAgent = require('./../core/_userAgent');
const createRadialGradient = require('./../utils/canvasUtil').createRadialGradient;
const thirdUtil = require('./../core/_thirdUtil');
const DataBox = require('./_db');
const ColumnBox = require('./_ColumnBox');

const PropertyChangeDispatcher = require('./_PropertyChangeDispatcher');

const invokeExtends = require('./../core/_ext');

const controls = {};

controls.ControlBase = function() {
  controls.ControlBase.superClass.constructor.apply(this, arguments),
    this._pools = new List;
  // ext
  this.addPool = function(a) {
    this._pools.contains(a) || this._pools.add(a);
  },
    this.removePool = function(a) {
      this._pools.remove(a);
    },
    this.adjustBounds = function(a) {
      var b = this._view.style;
      b.position = 'absolute',
        b.left = a.x + 'px',
        b.top = a.y + 'px',
        b.width = a.width + 'px',
        b.height = a.height + 'px',
        this.invalidate && this.invalidate();
    },
    this.getView = function() {
      return this._view;
    },
    this.invalidate = function(a) {
      this._invalidate || (this._invalidate = true, _third.callLater(this.validate, this, null, a));
    },
    this.validate = function() {
      if (!this._invalidate) {
        return;
      }
      this._invalidate = !1,
        this._view.offsetWidth === 0 && this._view.offsetHeight === 0 && this._reinvalidateCount !== null ? (this._reinvalidateCount === undefined && (this._reinvalidateCount = 100), this._reinvalidateCount > 0 ? this._reinvalidateCount-- : this._reinvalidateCount = null, this.invalidate()) : this.validateImpl();
    },
    this.validateImpl = function() {};
};

invokeExtends('third.controls.ControlBase', PropertyChangeDispatcher, controls.ControlBase);
//controls.ControlBase.prototype = new PropertyChangeDispatcher;
controls.ControlBase.prototype.getClassName = function() {
  return 'third.controls.ControlBase';
};

controls.ViewBase = function() {
  controls.ViewBase.superClass.constructor.apply(this, arguments),
    this._interactionDispatcher = new EventDispatcher,
    this._viewDispatcher = new EventDispatcher;

  // ext

  this.__bool = ['focusOnClick'],
    this._focusOnClick = Bd.FOCUS_ON_CLICK,
    this.getSelectionModel = function() {
      return this._selectionModel ? this._selectionModel : this._box.getSelectionModel();
    },
    this.isShareSelectionModel = function() {
      return this._selectionModel == null;
    },
    this.setShareSelectionModel = function(a) {
      var b = this._selectionModel == null;
      if (b === a) {
        return;
      }
      a ? (this._box.getSelectionModel().addSelectionChangeListener(this.handleSelectionChange, this), this._selectionModel.removeSelectionChangeListener(this.handleSelectionChange, this), this._selectionModel.dispose(), this._selectionModel = null) : (this._box.getSelectionModel().removeSelectionChangeListener(this.handleSelectionChange, this), this._selectionModel = new SelectionModel(this._box), this._selectionModel.addSelectionChangeListener(this.handleSelectionChange, this)),
        this.onShareSelectionModelChanged(),
        this.firePropertyChange('shareSelectionModel', b, a);
    },
    this.removeSelection = function() {
      if (this.getSelectionModel().size() === 0) {
        return null;
      }
      var a = this.getSelectionModel().toSelection();
      return a.forEach(function(a) {
        this._box.remove(a);
      },
          this),
        a;
    },
    this.selectAll = function() {
      var a = new List;
      return this._box.forEach(function(b) {
        this.isVisible(b) && a.add(b);
      },
          this),
        this.getSelectionModel().setSelection(a),
        a;
    },
    this.isSelected = function(a) {
      return this.getSelectionModel().contains(a);
    },
    this.isSelectable = function(a) {
      return this.getSelectionModel().isSelectable(a);
    },
    this.getLabel = function(a) {
      return a.getName();
    },
    this.getToolTip = function(a) {
      return a.getToolTip();
    },
    this.getIcon = function(a) {
      return a.getIcon();
    },
    this.getSelectColor = function(a) {
      return Bd.SELECT_COLOR;
    },
    this.addViewListener = function(a, b, c) {
      this._viewDispatcher.add(a, b, c);
    },
    this.removeViewListener = function(a, b) {
      this._viewDispatcher.remove(a, b);
    },
    this.fireViewEvent = function(a) {
      this._viewDispatcher.fire(a);
    },
    this.addInteractionListener = function(a, b, c) {
      this._interactionDispatcher.add(a, b, c);
    },
    this.removeInteractionListener = function(a, b) {
      this._interactionDispatcher.remove(a, b);
    },
    this.fireInteractionEvent = function(a) {
      this._interactionDispatcher.fire(a);
    },
    this.invalidate = function(delay) {
      this._invalidate || (this._invalidate = true, this.fireViewEvent({
        kind: 'invalidate'
      }), _third.callLater(this.validate, this, null, delay));
    },
    this.validate = function() {
      if (!this._invalidate) {
        return;
      }
      this._invalidate = !1,
        this._view.offsetWidth === 0 && this._view.offsetHeight === 0 && this._reinvalidateCount !== null ? (this._reinvalidateCount === undefined && (this._reinvalidateCount = 100), this._reinvalidateCount > 0 ? this._reinvalidateCount-- : this._reinvalidateCount = null, this.invalidate()) : (this._isValidating = true, this.fireViewEvent({
          kind: 'validateStart'
        }), this.validateImpl(), this.fireViewEvent({
          kind: 'validateEnd'
        }), delete this._isValidating);
    };
};
invokeExtends('third.controls.ViewBase', controls.ControlBase, controls.ViewBase);
//controls.ViewBase.prototype = new controls.ControlBase;
controls.ViewBase.prototype.getClassName = function() {
  return 'third.controls.ViewBase';
};


controls.View = function() {
  controls.View.superClass.constructor.apply(this, arguments);

  //ext
  this._zoom = 1,
    this._maxZoom = Bd.ZOOM_MAX,
    this._minZoom = Bd.ZOOM_MIN,
    this.getRootDiv = function() {
      return this._rootDiv;
    },
    this.isValidEvent = function(a) {
      return html.isValidEvent(this._view, a);
    },
    this.getAlarmFillColor = function(a) {
      if (a.IElement) {
        var b = a.getAlarmState().getHighestNewAlarmSeverity();
        if (b) {
          return b.color;
        }
      }
      return null;
    },
    this.getInnerColor = function(a) {
      if (a.IElement) {
        var b = a.getAlarmState().getHighestNativeAlarmSeverity();
        return b ? b.color : a.getStyle('inner.color');
      }
      return null;
    },
    this.getOuterColor = function(a) {
      if (a.IElement) {
        var b = a.getAlarmState().getPropagateSeverity();
        return b ? b.color : a.getStyle('outer.color');
      }
      return null;
    },
    this.zoomOverview = function(a) {
      var b = Math.min(this._view.clientWidth / this._viewRect.width, this._view.clientHeight / this._viewRect.height);
      this.setZoom(b, a);
    },
    this.getLogicalPoint = function(a) {
      return html.getLogicalPoint(this._view, a, this.getZoom(), this._rootDiv);
    },
    this.centerByLogicalPoint = function(a, b, d) {
      d && animate.AnimateManager.endAnimate();
      var e = this._view.scrollWidth - this._view.clientWidth,
        f = this._view.scrollHeight - this._view.clientHeight,
        g = (a - this._view.clientWidth / this._zoom / 2) * this._zoom,
        h = (b - this._view.clientHeight / this._zoom / 2) * this._zoom;
      g < 0 && (g = 0),
        h < 0 && (h = 0),
        g > e && (g = e),
        h > f && (h = f),
        d ? animate.AnimateManager.start(new animate.AnimateScrollPosition(this._view, g, h)) : (this._view.scrollLeft = g, this._view.scrollTop = h);
    },
    this.panByOffset = function(a, b) {
      a *= this.getZoom(),
        b *= this.getZoom();
      var c = this._view.scrollLeft + a,
        d = this._view.scrollTop + b,
        e = this._view.scrollWidth - this._view.clientWidth,
        f = this._view.scrollHeight - this._view.clientHeight;
      c < 0 && (c = 0),
        c > e && (c = e),
        d < 0 && (d = 0),
        d > f && (d = f);
      var g = {
        x: (c - this._view.scrollLeft) / this.getZoom(),
        y: (d - this._view.scrollTop) / this.getZoom()
      };
      return this._view.scrollLeft = c,
        this._view.scrollTop = d,
        g;
    },
    this.getMaxZoom = function() {
      return this._maxZoom;
    },
    this.setMaxZoom = function(a) {
      if (a < 0) {
        return;
      }
      var b = this._maxZoom;
      this._maxZoom = a,
        this.firePropertyChange('maxZoom', b, a),
        this.getZoom() > a && this.setZoom(a);
    },
    this.getMinZoom = function() {
      return this._minZoom;
    },
    this.setMinZoom = function(a) {
      if (a < 0) {
        return;
      }
      var b = this._minZoom;
      this._minZoom = a,
        this.firePropertyChange('minZoom', b, a),
        this.getZoom() < a && this.setZoom(a, !1);
    },
    this.getZoom = function() {
      return this._zoom;
    },
    this.onZoomChanged = function(a, b) {},
    this.zoomIn = function(a) {
      this.setZoom(this._zoom * Bd.ZOOM_INCREMENT, a);
    },
    this.zoomOut = function(a) {
      this.setZoom(this._zoom / Bd.ZOOM_INCREMENT, a);
    },
    this.zoomReset = function(a) {
      this.setZoom(1, a);
    },
    this.setZoom = function(a, b) {
      if (!_third.num(a) || a <= 0) {
        return;
      }
      a < this._minZoom && (a = this._minZoom),
        a > this._maxZoom && (a = this._maxZoom);
      if (a === this._zoom) {
        return;
      }
      b == null && (b = Bd.ZOOM_ANIMATE);
      if (b) {
        animate.AnimateManager.start(new animate.AnimateZoom(this, a));
      } else {
        var e = (this._view.scrollLeft + this._view.clientWidth / 2) / this._zoom,
          f = (this._view.scrollTop + this._view.clientHeight / 2) / this._zoom,
          g = this._zoom;
        this._zoom = a,
          html.setZoom(this._rootDiv, a),
          this.firePropertyChange('zoom', g, a),
          this.onZoomChanged(g, a),
          this.centerByLogicalPoint(e, f, !1);
      }
    },
    this.setTouchZoom = function(a) {
      this.setZoom(a, !1);
    };
};

invokeExtends('third.controls.View', controls.ViewBase, controls.View);
//controls.View.prototype = new controls.ViewBase;
controls.View.prototype.getClassName = function() {
  return 'third.controls.View';
};

controls.ListBase = function(a) {
  controls.ListBase.superClass.constructor.apply(this, arguments),
    this._invalidate = !1,
    this._invalidateModel = !1,
    this._invalidateDisplay = !1,
    this._invalidateDatas = null,
    this._rowDatas = new List,
    this._startRowIndex = 0,
    this._endRowIndex = 0,
    this._renderMap = {},
    this._dataRowMap = {},
    this.__divPool = new Pool('div', 20),
    this.__imagePool = new Pool('img', 20),
    this.__canvasPool = new Pool('canvas', 20),
    this.__spanPool = new Pool('span', 20),
    this.__textPool = new Pool('span', 20),
    this.__checkBoxPool = new Pool('input', 20),
    this._pools.add(this.__divPool),
    this._pools.add(this.__imagePool),
    this._pools.add(this.__canvasPool),
    this._pools.add(this.__spanPool),
    this._pools.add(this.__textPool),
    this._pools.add(this.__checkBoxPool),
    this._view = html.createView('auto'),
    this._rootDiv = html.createDiv(),
    this._dataDiv = html.createDiv(),
    this._dataDiv.style.width = '1px',
    this._view.appendChild(this._rootDiv),
    this._rootDiv.appendChild(this._dataDiv),
    this.setDataBox(a ? a : new DataBox);
  var _self = this;
  _self.handleChange && _self._view.addEventListener('change', function(a) {
    _self.handleChange(a);
  }, !1);
  var d;
  UserAgent.isMSToucheable ? d = controls.ListBaseMSTouchInteraction : UserAgent.isTouchable ? d = controls.ListBaseTouchInteraction : d = controls.ListBaseInteraction,
    d && new d(this);


  // ext

  this.__bool = ['innerText'],
    this._innerText = Bd.LISTBASE_INNER_TEXT,
    this.getDataDiv = function() {
      return this._dataDiv;
    },
    this.getStartRowIndex = function() {
      return this._startRowIndex;
    },
    this.getEndRowIndex = function() {
      return this._endRowIndex;
    },
    this.getRowDatas = function() {
      return this._rowDatas;
    },
    this.getRowIndexByData = function(a) {
      return this._dataRowMap[a.getId()];
    },
    this.getRowIndexById = function(a) {
      return this._dataRowMap[a];
    },
    this.getRowSize = function() {
      return this._rowDatas.size();
    },
    this.getDataBox = function() {
      return this._box;
    },
    this.setDataBox = function(a) {
      if (!a) {
        throw 'DataBox can not be null';
      }
      if (this._box === a) {
        return;
      }
      var b = this._box;
      b && (b.removeDataBoxChangeListener(this.handleDataBoxChange, this), b.removeDataPropertyChangeListener(this.handlePropertyChange, this), b.removeHierarchyChangeListener(this.handleHierarchyChange, this), this._selectionModel || b.getSelectionModel().removeSelectionChangeListener(this.handleSelectionChange, this)),
        this._box = a,
        this._box.addDataBoxChangeListener(this.handleDataBoxChange, this),
        this._box.addDataPropertyChangeListener(this.handlePropertyChange, this),
        this._box.addHierarchyChangeListener(this.handleHierarchyChange, this),
        this._selectionModel ? this._selectionModel._setDataBox(a) : this._box.getSelectionModel().addSelectionChangeListener(this.handleSelectionChange, this),
        this.invalidateModel(),
        this.firePropertyChange('dataBox', b, this._box);
    },
    this.onPropertyChanged = function(a) {
      a.property === 'zoom' ? this.invalidate() : this.invalidateModel();
    },
    this.invalidateModel = function() {
      if (this._invalidateModel) {
        return;
      }
      this._invalidateModel = true,
        this._invalidateDisplay = true,
        this._invalidateDatas = null,
        this.invalidate();
    },
    this.invalidateDisplay = function() {
      if (this._invalidateDisplay) {
        return;
      }
      this._invalidateDisplay = true,
        this._invalidateDatas = null,
        this.invalidate();
    },
    this.invalidateData = function(a) {
      if (this._invalidateDisplay) {
        return;
      }
      this._invalidateDatas || (this._invalidateDatas = {}),
        this._invalidateDatas[a.getId()] = a,
        this.invalidate();
    },
    this.validateImpl = function() {
      var a = this._view.scrollLeft,
        b = this._view.scrollTop;
      this._invalidateModel && (this._invalidateModel = !1, this.validateModel()),
        this._invalidateDisplay && (this._invalidateDisplay = !1, this._renderMap = {},
          html.release(this._dataDiv), this._dataDiv.style.height = this.getRowSize() * this._rowHeight + 'px');
      var c;
      if (this._invalidateDatas) {
        for (c in this._invalidateDatas) {
          var e = this._renderMap[c];
          e && (html.release(e), this._dataDiv.removeChild(e), delete this._renderMap[c]);
        }
        this._invalidateDatas = null;
      }
      var f = this._view.scrollTop / this._zoom,
        g = this._view.clientHeight / this._zoom;
      this._startRowIndex = Math.floor(f / this._rowHeight) - 2,
        this._endRowIndex = Math.ceil((f + g) / this._rowHeight) + 2,
        this._startRowIndex < 0 && (this._startRowIndex = 0),
        this._endRowIndex > this._rowDatas.size() && (this._endRowIndex = this._rowDatas.size());
      var h = this._rowHeight - this._rowLineWidth - 2 + 'px',
        i = this._rowLineWidth + 'px';
      for (var j = this._startRowIndex; j < this._endRowIndex; j++) {
        var k = this._rowDatas.get(j);
        c = k.getId();
        var _div = this._renderMap[c];
        if (!_div) {
          _div = this.__divPool.get();
          var sty = _div.style;
          sty.position = 'absolute',
            sty.whiteSpace = 'nowrap',
            sty.lineHeight = h,
            sty.top = j * this._rowHeight + 'px',
            sty.borderStyle = 'solid',
            sty.borderWidth = '0px',
            sty.borderBottomWidth = i,
            sty.borderBottomColor = this._rowLineColor,
            sty.opacity = k.getStyle ? k.getStyle('whole.alpha') : 1,
            this._dataDiv.appendChild(_div),
            this._renderMap[c] = _div;
          var n = this.isSelected(k);
          this.renderData(_div, k, j, n),
            this.onDataRendered(_div, k, j, n);
        }
      }
      _third.keys(this._renderMap).forEach(function(a) {
        var b = this.getRowIndexById(a);
        if (b < this._startRowIndex || b >= this._endRowIndex) {
          var c = this._renderMap[a];
          html.release(c),
            this._dataDiv.removeChild(c),
            delete this._renderMap[a];
        }
      },
          this),
        this._pools.forEach(function(a) {
          a.clear();
        }),
        this._view.scrollLeft !== a && (this._view.scrollLeft = a),
        this._view.scrollTop !== b && (this._view.scrollTop = b),
        this.adjustRowSize(),
        this.onValidated();
    },
    this.adjustRowSize = function() {
      var a, b, c = this._rowHeight - this._rowLineWidth + 'px',
        d = Math.floor((this._view.scrollLeft + this._view.clientWidth) / this._zoom) + 'px';
      for (a in this._renderMap) {
        b = this._renderMap[a],
          b.style.height = c,
          b.style.width = d;
      }
    },
    this.onValidated = function() {},
    this.onDataRendered = function(a, b, c, d) {},
    this._addCheckBox = function(a, b, c) {
      var d = this.__checkBoxPool.get();
      return d.keepDefault = true,
        d.type = 'checkbox',
        d.style.margin = '0px 2px',
        d.style.verticalAlign = 'middle',
        d._checkData = b,
        d.checked = c,
        d.disabled = !1,
        a.appendChild(d),
        d;
    },
    this._addIcon = function(_dom, b, regSrc, selData) {
      var f = _third.getImageAsset(regSrc),
        g = this.getInnerColor(b),
        h = this.getOuterColor(b),
        i = this.getAlarmFillColor(b),
        j;
      if (f && f.getImage()) {
        var k = f.getWidth(),
          l = f.getHeight();
        j = this.__canvasPool.get(),
          j.style.verticalAlign = 'middle',
          j.setAttribute('width', k),
          j.setAttribute('height', l);
        var m = j.getContext('2d');
        m.clearRect(0, 0, k, l),
          m.drawImage(f.getImage(g), 0, 0, k, l),
          h && (m.lineWidth = 2, m.strokeStyle = h, m.beginPath(), m.rect(0, 0, k, l), m.closePath(), m.stroke()),
          i && (m.fillStyle = createRadialGradient(m, i, 'white', 1, l - 9, 8, 8, .75, .25), m.beginPath(), m.arc(5, l - 5, 4, 0, Math.PI * 2, true), m.closePath(), m.fill());
      } else {
        j = this.__imagePool.get(),
          j.style.verticalAlign = 'middle',
          j.setAttribute('src', _third.getImageSrc(regSrc));
      }
      j.style.margin = '0px 1px 0px 1px',
        j._selectData = selData,
        _dom.appendChild(j);
    },
    this.isVisible = function(a) {
      return this._box.contains(a) ? this._visibleFunction ? this._visibleFunction(a) : true : !1;
    },
    this.handleDataBoxChange = function(a) {
      this.invalidateModel();
    },
    this.handlePropertyChange = function(a) {
      a.property === 'parent' ? this.invalidateModel() : this.invalidateData(a.source);
    },
    this.handleHierarchyChange = function(a) {
      this.invalidateModel();
    },
    this.handleSelectionChange = function(a) {
      a.datas.forEach(function(a) {
        this.invalidateData(a);
      },
          this),
        this.onSelectionChanged(a);
    },
    this.getRowIndexAt = function(a) {
      var b = this.getLogicalPoint(a);
      if (!b) {
        return -1;
      }
      var c = parseInt(b.y / this._rowHeight);
      return c >= 0 && c < this._rowDatas.size() ? c : -1;
    },
    this.getDataAt = function(a) {
      var b = this.getRowIndexAt(a);
      return b >= 0 ? this._rowDatas.get(b) : null;
    },
    this.getCurrentSortFunction = function() {
      return this._sortFunction;
    },
    this.validateModel = function() {
      this._rowDatas.clear(),
        this._dataRowMap = {},
        this._buildChildren(this._box.getRoots()),
        this._rowDatas = this._rowDatas.toList(this.isVisible, this);
      var a = this.getCurrentSortFunction();
      a && this._rowDatas.sort(a);
      var b = this._rowDatas.size();
      for (var c = 0; c < b; c++) {
        this._dataRowMap[this._rowDatas.get(c).getId()] = c;
      }
    },
    this._buildChildren = function(a) {
      a.forEach(function(a) {
        this._rowDatas.add(a),
            this._buildChildren(a.getChildren());
      },
        this);
    },
    this._handlePressSelection = function(a, b) {
      var c = this.getSelectionModel();
      if (_third.isCtrlDown(b)) {
        c.contains(a) ? c.removeSelection(a) : c.appendSelection(a);
      } else if (b.shiftKey && c.getLastData()) {
        var e = c.getLastData(),
          f = this.getRowIndexByData(e),
          g = this.getRowIndexByData(a),
          h = new List;
        h.add(this.getRowDatas().get(f));
        while (f !== g) {
          f += g > f ? 1 : -1,
            h.add(this.getRowDatas().get(f));
        }
        c.setSelection(h);
      } else {
        (c.size() !== 1 || !c.contains(a)) && c.setSelection(a);
      }
      this.fireInteractionEvent({
        kind: b.detail === 2 ? 'doubleClick' : 'click',
        data: a
      });
    },
    this._handleClick = function(a) {
      this.isFocusOnClick() && thirdUtil.setFocus(this._view);
      var b = this.getDataAt(a);
      if (b) {
        if (this.isCheckMode() && !a.target._checkData) {
          var d = this.getRowIndexByData(b);
          if (this._focusedRow !== d) {
            var e = this._rowDatas.get(this._focusedRow);
            this._focusedRow = d,
              e && this.invalidateData(e),
              this.invalidateData(b);
          }
        }
        this.isCheckMode() || this._handlePressSelection(b, a);
      }
      this._currentEditor && this.commitEditValue(this._currentEditor._editInfo, this._currentEditor),
        this.updateCurrentEditor && this.updateCurrentEditor(a);
    },
    this.handleChange = function(a) {
      if (this._isCanceling || this._isValidating) {
        return;
      }
      var b = a.target._checkData;
      if (b) {
        var c = this.isSelected(b),
          d = this.getSelectionModel();
        c ? d.removeSelection(b) : d.appendSelection(b);
      }
      a.target._editInfo && this.commitEditValue && this.commitEditValue(a.target._editInfo, a.target);
    },
    this.scrollToData = function(a) {
      var b = this.getRowIndexById(a.getId());
      if (b < 0) {
        return;
      }
      var c = b * this._rowHeight * this._zoom,
        d = c + this._rowHeight * this._zoom,
        e = this._view.scrollTop;
      this._view.scrollTop > c && (e = c),
        this._view.scrollTop + this._view.clientHeight < d && (e = d - this._view.clientHeight),
        this._view.scrollTop != e && (this._view.scrollTop = e, this.invalidate());
    },
    this.makeVisible = function(a) {
      if (!this.isVisible(a)) {
        return;
      }
      this.expand && this.expand(a),
        _third.callLater(this.scrollToData, this, [a], Bd.CALL_LATER_DELAY * 2);
    },
    this.onSelectionChanged = function(a) {
      this._makeVisibleOnSelected && (a.kind === 'append' || a.kind === 'set' || a.kind === 'all') && (this.expand && this.getSelectionModel().getSelection().forEach(function(a) {
        a.getParent() && this.expand(a.getParent());
      },
        this), _third.callLater(this.scrollToData, this, [this.getSelectionModel().getLastData()], Bd.CALL_LATER_DELAY * 2));
    },
    this.onShareSelectionModelChanged = function() {
      this.invalidateModel();
    };
};

invokeExtends('third.controls.ListBase', controls.View, controls.ListBase);
//controls.ListBase.prototype = new controls.View;
controls.ListBase.prototype.getClassName = function() {
  return 'third.controls.ListBase';
};


controls.TableBase = function(a) {
  this._columnBox = new ColumnBox,
    this._columnBox.addDataBoxChangeListener(this.handleColumnBoxChange, this),
    this._columnBox.addDataPropertyChangeListener(this.handleColumnPropertyChange, this),
    this._columnBox.addHierarchyChangeListener(this.handleColumnHierarchyChange, this),
    controls.TableBase.superClass.constructor.apply(this, arguments),
    this._cellPool = new Pool('div', 20),
    this._stringPool = new Pool('span', 20),
    this._booleanPool = new Pool('input', 20),
    this._colorPool = new Pool('div', 20),
    this._pools.add(this._cellPool),
    this._pools.add(this._stringPool),
    this._pools.add(this._booleanPool),
    this._pools.add(this._colorPool);

  // ext
  this.getColumnBox = function() {
    return this._columnBox;
  },
    this.handleColumnBoxChange = function(a) {
      this.invalidateDisplay();
    },
    this.handleColumnPropertyChange = function(a) {
      a.source !== this._sortColumn || a.property !== 'sortDirection' && a.property !== 'sortFunction' && a.property !== 'sortable' ? this.invalidateDisplay() : this.invalidateModel();
    },
    this.handleColumnHierarchyChange = function(a) {
      this.invalidateDisplay();
    },
    this.renderData = function(a, b, c, d) {
      var e = this._columnBox.getRoots(),
        f = e.size(),
        g = 0,
        h = this._rowHeight - this._rowLineWidth + 'px',
        i;
      for (var j = 0; j < f; j++) {
        var k = e.get(j),
          l = k.getWidth();
        l < 0 && (l = 0);
        var m = Math.min(this._columnLineWidth, l);
        if (k.isVisible()) {
          var n = this._cellPool.get();
          i = n.style,
            i.position = 'absolute',
            i.whiteSpace = 'nowrap',
            i.verticalAlign = 'middle',
            i.textAlign = k.getHorizontalAlign(),
            i.overflow = 'hidden',
            i.textOverflow = 'ellipsis',
            i.left = g + 'px',
            i.width = l - m + 'px',
            i.height = h,
            i.borderStyle = 'solid',
            i.borderWidth = '0px',
            i.borderRightWidth = m + 'px',
            i.borderRightColor = this._columnLineColor,
            j === 0 ? (i.borderLeftWidth = m + 'px', i.borderLeftColor = this._columnLineColor) : i.borderLeftWidth = '0px',
            a.appendChild(n);
          var o = {
            data: b,
            value: this.getValue(b, k),
            div: n,
            view: this,
            column: k,
            rowIndex: c,
            selected: d
          };
          this.renderCell(o),
            this.onCellRendered(o),
            g += l;
        }
      }
      i = a.style,
        i.width = g + 'px',
        i.height = h,
        i.backgroundColor = this.isCheckMode() && this._focusedRow === c || !this.isCheckMode() && d ? this.getSelectColor(b) : '';
    },
    this.adjustRowSize = function() {},
    this.onCellRendered = function(a) {},
    this.getCurrentSortFunction = function() {
      var a = this._sortColumn;
      if (a) {
        var b = a.getSortFunction();
        if (b) {
          var c = this,
            d = 'asc' === a.getSortDirection() ? 1 : -1;
          return function(e, f) {
            var g = c.getValue(e, a),
              h = c.getValue(f, a);
            return b.call(c, g, h, e, f) * d;
          };
        }
      }
      return this._sortFunction;
    },
    this.renderCell = function(a) {
      var b = a.column;
      if (b.renderCell) {
        b.renderCell(a);
        return;
      }
      var c = a.value,
        d = b.getEnumInfo();
      d && !Array.isArray(d) && (c = d.map[c]),
        a.view.isCellEditable(a.data, b) && (a.enumInfo = d, a.div._editInfo = a),
        _render.render(b.getValueType(), c, a.div, a.view, b.isInnerText());
    },
    this.getValue = function(a, b) {
      return b.getValue(a, this);
    },
    this.setValue = function(a, b, c) {
      b.setValue(a, c, this);
    },
    this.getColumnAt = function(a) {
      var b = this.getLogicalPoint(a);
      if (!b) {
        return null;
      }
      var c = this._columnBox.getRoots();
      for (var d = 0,
        e = c.size(), f = 0; d < e; d++) {
        var g = c.get(d),
          h = g.getWidth();
        h < 0 && (h = 0);
        if (b.x > f && b.x < f + h) {
          return g;
        }
        f += h;
      }
      return null;
    },
    this.isCellEditable = function(a, b) {
      return this.isEditable() && b.isEditable();
    },
    this.commitEditValue = function(a, b) {
      if (this._isCanceling) {
        return;
      }
      var d;
      b.type === 'checkbox' ? d = b.checked : d = b.value;
      var e = a.column,
        f = e.getValueType();
      f === 'int' && typeof d == 'string' ? d = parseInt(d) : f === 'number' && typeof d == 'string' && (d = parseFloat(d)),
        this.setValue(a.data, e, d);
      if (this._currentEditor) {
        var g = this._currentEditor;
        delete this._currentEditor,
          this._rootDiv.removeChild(g),
          thirdUtil.setFocus(this._view);
      }
      delete this._isCommitting;
    },
    this.cancelEditing = function() {
      if (this._currentEditor) {
        this._isCanceling = true;
        var a = this._currentEditor;
        delete this._currentEditor,
          this._rootDiv.removeChild(a),
          thirdUtil.setFocus(this._view),
          delete this._isCanceling;
      }
    },
    this.updateCurrentEditor = function(a) {
      var b = a.target;
      if (b === this._currentEditor || b.parentNode === this._currentEditor) {
        return;
      }
      var d;
      while (b && b !== this._view && !d) {
        d = b._editInfo;
        b = b.parentNode;
      }
      if (d && b === d.div) {
        d.enumInfo ? this._currentEditor = html.createSelect(d.enumInfo, d.value) : (this._currentEditor = document.createElement('input'), d.value != null && (this._currentEditor.value = d.value));
        if (this._currentEditor) {
          this._currentEditor.addEventListener('keydown',
              function(a) {
                var b = a.target._editInfo.view;
                a.keyCode === 13 ? b.commitEditValue(a.target._editInfo, a.target) : a.keyCode === 27 && b.cancelEditing();
              }, !1),
            this._currentEditor.addEventListener('blur',
              function(a) {
                var b = a.target._editInfo.view;
                if (b._isCanceling) {
                  return;
                }
                b.commitEditValue(a.target._editInfo, a.target);
              }, !1),
            this._currentEditor.keepDefault = true,
            this._currentEditor._editInfo = d;
          var e = this._currentEditor.style;
          e.position = 'absolute',
            e.margin = '0px',
            e.border = '0px',
            e.padding = '0px',
            e.left = d.div.style.left,
            e.top = d.div.parentNode.style.top,
            e.width = d.div.style.width,
            e.height = d.div.style.height,
            this._rootDiv.appendChild(this._currentEditor),
            thirdUtil.setFocus(this._currentEditor);
        }
      }
    },
    this.onColumnSorted = function(a) {},
    this.getCurrentEditor = function() {
      return this._currentEditor;
    };
};

invokeExtends('third.controls.TableBase', controls.ListBase, controls.TableBase);
//controls.TableBase.prototype = new controls.ListBase;
controls.TableBase.prototype.getClassName = function() {
  return 'third.controls.TableBase';
};


controls.List = function(a) {
  controls.List.superClass.constructor.apply(this, arguments);

  // ext

  this.__accessor = ['rowHeight', 'indent', 'rowLineWidth', 'rowLineColor', 'sortFunction', 'visibleFunction'],
    this.__bool = ['makeVisibleOnSelected', 'keyboardRemoveEnabled', 'keyboardSelectEnabled'],
    this._checkMode = !1,
    this._rowHeight = Bd.LIST_ROW_HEIGHT,
    this._indent = Bd.LIST_INDENT,
    this._rowLineWidth = Bd.LIST_ROW_LINE_WIDTH,
    this._rowLineColor = Bd.LIST_ROW_LINE_COLOR,
    this._makeVisibleOnSelected = Bd.LIST_MAKE_VISIBLE_ON_SELECTED,
    this._keyboardRemoveEnabled = Bd.LIST_KEYBOARD_REMOVE_ENABLED,
    this._keyboardSelectEnabled = Bd.LIST_KEYBOARD_SELECT_ENABLED,
    this.isCheckMode = function() {
      return this._checkMode;
    },
    this.setCheckMode = function(a) {
      delete this._focusedRow;
      var b = this._checkMode;
      this._checkMode = a,
        this.firePropertyChange('checkMode', b, a);
    },
    this.isCheckable = function(a) {
      return this._checkMode === true;
    },
    this.renderData = function(a, b, c, e) {
      var f;
      this._indent > 0 && (f = this.__spanPool.get(), f.style.width = this._indent + 'px', f.style.display = 'inline-block', a.appendChild(f));
      var g = this.isCheckable(b);
      g && this._addCheckBox(a, b, e);
      var h = this.getIcon(b);
      h && this._addIcon(a, b, h);
      var i = this.getLabel(b);
      if (i) {
        f = this.__textPool.get();
        var j = f.style;
        j.whiteSpace = 'nowrap',
          j.verticalAlign = 'middle',
          j.padding = '1px 2px 1px 2px',
          j.display = 'inline-block',
          _third.setText(f, i, this._innerText),
          this.onLabelRendered(f, b, i, c, e),
          a.appendChild(f);
      }
      this.isCheckMode() ? a.style.backgroundColor = this._focusedRow === c ? this.getSelectColor(b) : '' : a.style.backgroundColor = e ? this.getSelectColor(b) : '';
    },
    this.onLabelRendered = function(a, b, c, d, e) {};
};


invokeExtends('third.controls.List', controls.ListBase, controls.List);
//controls.List.prototype = new controls.ListBase;
controls.List.prototype.getClassName = function() {
  return 'third.controls.List';
};


controls.Tree = function(a) {
  this._interactionDispatcher = new EventDispatcher;
  this._initTree(a);
  controls.Tree.superClass.constructor.apply(this, arguments);
  // ext
  this.__tree = 1,
    this.__accessor = ['rootData', 'sortFunction', 'visibleFunction', 'indent', 'rowHeight', 'rowLineWidth', 'rowLineColor', 'expandIcon', 'collapseIcon', 'uncheckableStyle'],
    this.__bool = ['rootVisible', 'makeVisibleOnSelected', 'keyboardRemoveEnabled', 'keyboardSelectEnabled'],
    this._checkMode = !1,
    this._indent = Bd.TREE_INDENT,
    this._rowHeight = Bd.TREE_ROW_HEIGHT,
    this._rowLineWidth = Bd.TREE_ROW_LINE_WIDTH,
    this._rowLineColor = Bd.TREE_ROW_LINE_COLOR,
    this._makeVisibleOnSelected = Bd.TREE_MAKE_VISIBLE_ON_SELECTED,
    this._keyboardRemoveEnabled = Bd.TREE_KEYBOARD_REMOVE_ENABLED,
    this._keyboardSelectEnabled = Bd.TREE_KEYBOARD_SELECT_ENABLED,
    this._expandIcon = Bd.TREE_EXPAND_ICON,
    this._collapseIcon = Bd.TREE_COLLAPSE_ICON,
    this._uncheckableStyle = 'none',
    this.getCheckMode = function() {
      return this._checkMode;
    },
    this.setCheckMode = function(a) {
      delete this._focusedRow;
      var b = this._checkMode;
      this._checkMode = a,
        this.firePropertyChange('checkMode', b, a);
    },
    this.renderData = function(a, b, c, d) {
      this._renderTree(a, b, c, d);
    };
};

invokeExtends('third.controls.Tree', controls.ListBase, controls.Tree);
//controls.Tree.prototype = new controls.ListBase;
controls.Tree.prototype.getClassName = function() {
  return 'third.controls.Tree';
};

module.exports = controls;
