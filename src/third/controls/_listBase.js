const List = require('./../core/_list');
const math = require('./../core/_math');
const html = require('./../core/_html');
const EventDispatcher = require('./_eventDispatcher');
const _third = require('./../core/_third')._third;
const _cons = require('./../constants');
const Bd = _cons.Bd;

const SelectionModel = require('./_model').SelectionModel;
const _render = require('./../core/_render');
const animate = require('./../core/_animgmt');
const Pool = require('./../core/_pool');
const UserAgent = require('./../core/_userAgent');
const createRadialGradient = require('./../utils/canvasUtil').createRadialGradient;
const thirdUtil = require('./../core/_thirdUtil');
const DataBox = require('./_db').DataBox;
const ColumnBox = require('./_db').ColumnBox;

let PropertyChangeDispatcher = function() {
  this._dispatcher = new EventDispatcher;
  this.addPropertyChangeListener = function(a, b, c) {
    this._dispatcher.add(a, b, c);
  },
    this.removePropertyChangeListener = function(a, b) {
      this._dispatcher.remove(a, b);
    },
    this.firePropertyChange = function(a, b, c) {
      if (b == c) {return ! 1;}
      var d = {
        property: a,
        oldValue: b,
        newValue: c,
        source: this
      };
      return this._dispatcher.fire(d),
      this.onPropertyChanged(d),
      !0;
    },
    this.onPropertyChanged = function(a) {};
};


const controls = {};
controls.ControlBase = function() {
  controls.ControlBase.superClass.constructor.apply(this, arguments),
    this._pools = new List;
},
  _third.ext('third.controls.ControlBase', PropertyChangeDispatcher, {
    addPool: function(a) {
      this._pools.contains(a) || this._pools.add(a);
    },
    removePool: function(a) {
      this._pools.remove(a);
    },
    adjustBounds: function(a) {
      var b = this._view.style;
      b.position = 'absolute',
      b.left = a.x + 'px',
      b.top = a.y + 'px',
      b.width = a.width + 'px',
      b.height = a.height + 'px',
      this.invalidate && this.invalidate();
    },
    getView: function() {
      return this._view;
    },
    invalidate: function(a) {
      this._invalidate || (this._invalidate = !0, math.callLater(this.validate, this, null, a));
    },
    validate: function() {
      if (!this._invalidate) {return;}
      this._invalidate = !1,
      this._view.offsetWidth === 0 && this._view.offsetHeight === 0 && this._reinvalidateCount !== null ? (this._reinvalidateCount === undefined && (this._reinvalidateCount = 100), this._reinvalidateCount > 0 ? this._reinvalidateCount--:this._reinvalidateCount = null, this.invalidate()) : this.validateImpl();
    },
    validateImpl: function() {}
  }),
  controls.ViewBase = function() {
    controls.ViewBase.superClass.constructor.apply(this, arguments),
    this._interactionDispatcher = new EventDispatcher,
    this._viewDispatcher = new EventDispatcher;
  },
    _third.ext('third.controls.ViewBase', controls.ControlBase, {
      __bool: ['focusOnClick'],
      _focusOnClick: Bd.FOCUS_ON_CLICK,
      getSelectionModel: function() {
        return this._selectionModel ? this._selectionModel: this._box.getSelectionModel();
      },
      isShareSelectionModel: function() {
        return this._selectionModel == null;
      },
      setShareSelectionModel: function(a) {
        var b = this._selectionModel == null;
        if (b === a) {return;}
        a ? (this._box.getSelectionModel().addSelectionChangeListener(this.handleSelectionChange, this), this._selectionModel.removeSelectionChangeListener(this.handleSelectionChange, this), this._selectionModel.dispose(), this._selectionModel = null) : (this._box.getSelectionModel().removeSelectionChangeListener(this.handleSelectionChange, this), this._selectionModel = new SelectionModel(this._box), this._selectionModel.addSelectionChangeListener(this.handleSelectionChange, this)),
      this.onShareSelectionModelChanged(),
      this.firePropertyChange('shareSelectionModel', b, a);
      },
      removeSelection: function() {
        if (this.getSelectionModel().size() === 0) {return null;}
        var a = this.getSelectionModel().toSelection();
        return a.forEach(function(a) {
          this._box.remove(a);
        },
      this),
      a;
      },
      selectAll: function() {
        var a = new List;
        return this._box.forEach(function(b) {
          this.isVisible(b) && a.add(b);
        },
      this),
      this.getSelectionModel().setSelection(a),
      a;
      },
      isSelected: function(a) {
        return this.getSelectionModel().contains(a);
      },
      isSelectable: function(a) {
        return this.getSelectionModel().isSelectable(a);
      },
      getLabel: function(a) {
        return a.getName();
      },
      getToolTip: function(a) {
        return a.getToolTip();
      },
      getIcon: function(a) {
        return a.getIcon();
      },
      getSelectColor: function(a) {
        return Bd.SELECT_COLOR;
      },
      addViewListener: function(a, b, c) {
        this._viewDispatcher.add(a, b, c);
      },
      removeViewListener: function(a, b) {
        this._viewDispatcher.remove(a, b);
      },
      fireViewEvent: function(a) {
        this._viewDispatcher.fire(a);
      },
      addInteractionListener: function(a, b, c) {
        this._interactionDispatcher.add(a, b, c);
      },
      removeInteractionListener: function(a, b) {
        this._interactionDispatcher.remove(a, b);
      },
      fireInteractionEvent: function(a) {
        this._interactionDispatcher.fire(a);
      },
      invalidate: function(a) {
        this._invalidate || (this._invalidate = !0, this.fireViewEvent({
          kind: 'invalidate'
        }), math.callLater(this.validate, this, null, a));
      },
      validate: function() {
        if (!this._invalidate) {return;}
        this._invalidate = !1,
      this._view.offsetWidth === 0 && this._view.offsetHeight === 0 && this._reinvalidateCount !== null ? (this._reinvalidateCount === undefined && (this._reinvalidateCount = 100), this._reinvalidateCount > 0 ? this._reinvalidateCount--:this._reinvalidateCount = null, this.invalidate()) : (this._isValidating = !0, this.fireViewEvent({
        kind: 'validateStart'
      }), this.validateImpl(), this.fireViewEvent({
        kind: 'validateEnd'
      }), delete this._isValidating);
      }
    }),
  controls.View = function() {
    controls.View.superClass.constructor.apply(this, arguments);
  },
  _third.ext('third.controls.View', controls.ViewBase, {
    _zoom: 1,
    _maxZoom: Bd.ZOOM_MAX,
    _minZoom: Bd.ZOOM_MIN,
    getRootDiv: function() {
      return this._rootDiv;
    },
    isValidEvent: function(a) {
      return html.isValidEvent(this._view, a);
    },
    getAlarmFillColor: function(a) {
      if (a.IElement) {
        var b = a.getAlarmState().getHighestNewAlarmSeverity();
        if (b) {return b.color;}
      }
      return null;
    },
    getInnerColor: function(a) {
      if (a.IElement) {
        var b = a.getAlarmState().getHighestNativeAlarmSeverity();
        return b ? b.color: a.getStyle('inner.color');
      }
      return null;
    },
    getOuterColor: function(a) {
      if (a.IElement) {
        var b = a.getAlarmState().getPropagateSeverity();
        return b ? b.color: a.getStyle('outer.color');
      }
      return null;
    },
    zoomOverview: function(a) {
      var b = Math.min(this._view.clientWidth / this._viewRect.width, this._view.clientHeight / this._viewRect.height);
      this.setZoom(b, a);
    },
    getLogicalPoint: function(a) {
      return html.getLogicalPoint(this._view, a, this.getZoom(), this._rootDiv);
    },
    centerByLogicalPoint: function(a, b, d) {
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
    panByOffset: function(a, b) {
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
    getMaxZoom: function() {
      return this._maxZoom;
    },
    setMaxZoom: function(a) {
      if (a < 0) {return;}
      var b = this._maxZoom;
      this._maxZoom = a,
      this.firePropertyChange('maxZoom', b, a),
      this.getZoom() > a && this.setZoom(a);
    },
    getMinZoom: function() {
      return this._minZoom;
    },
    setMinZoom: function(a) {
      if (a < 0) {return;}
      var b = this._minZoom;
      this._minZoom = a,
      this.firePropertyChange('minZoom', b, a),
      this.getZoom() < a && this.setZoom(a, !1);
    },
    getZoom: function() {
      return this._zoom;
    },
    onZoomChanged: function(a, b) {},
    zoomIn: function(a) {
      this.setZoom(this._zoom * Bd.ZOOM_INCREMENT, a);
    },
    zoomOut: function(a) {
      this.setZoom(this._zoom / Bd.ZOOM_INCREMENT, a);
    },
    zoomReset: function(a) {
      this.setZoom(1, a);
    },
    setZoom: function(a, b) {
      if (!_third.num(a) || a <= 0) {return;}
      a < this._minZoom && (a = this._minZoom),
      a > this._maxZoom && (a = this._maxZoom);
      if (a === this._zoom) {return;}
      b == null && (b = Bd.ZOOM_ANIMATE);
      if (b){ animate.AnimateManager.start(new animate.AnimateZoom(this, a));}
      else {
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
    setTouchZoom: function(a) {
      this.setZoom(a, !1);
    }
  }),

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
      this.setDataBox(a ? a: new DataBox);
      var b = this;
      b.handleChange && b._view.addEventListener('change',
    function(a) {
      b.handleChange(a);
    },
    !1);
      var d;
      UserAgent.isMSToucheable ? d = controls.ListBaseMSTouchInteraction: UserAgent.isTouchable ? d = controls.ListBaseTouchInteraction: d = controls.ListBaseInteraction,
    d && new d(this);
    },
  _third.ext('third.controls.ListBase', controls.View, {
    __bool: ['innerText'],
    _innerText: Bd.LISTBASE_INNER_TEXT,
    getDataDiv: function() {
      return this._dataDiv;
    },
    getStartRowIndex: function() {
      return this._startRowIndex;
    },
    getEndRowIndex: function() {
      return this._endRowIndex;
    },
    getRowDatas: function() {
      return this._rowDatas;
    },
    getRowIndexByData: function(a) {
      return this._dataRowMap[a.getId()];
    },
    getRowIndexById: function(a) {
      return this._dataRowMap[a];
    },
    getRowSize: function() {
      return this._rowDatas.size();
    },
    getDataBox: function() {
      return this._box;
    },
    setDataBox: function(a) {
      if (!a){ throw 'DataBox can not be null';}
      if (this._box === a) {return;}
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
    onPropertyChanged: function(a) {
      a.property === 'zoom' ? this.invalidate() : this.invalidateModel();
    },
    invalidateModel: function() {
      if (this._invalidateModel){ return;}
      this._invalidateModel = !0,
      this._invalidateDisplay = !0,
      this._invalidateDatas = null,
      this.invalidate();
    },
    invalidateDisplay: function() {
      if (this._invalidateDisplay){ return;}
      this._invalidateDisplay = !0,
      this._invalidateDatas = null,
      this.invalidate();
    },
    invalidateData: function(a) {
      if (this._invalidateDisplay){ return;}
      this._invalidateDatas || (this._invalidateDatas = {}),
      this._invalidateDatas[a.getId()] = a,
      this.invalidate();
    },
    validateImpl: function() {
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
        var l = this._renderMap[c];
        if (!l) {
          l = this.__divPool.get();
          var m = l.style;
          m.position = 'absolute',
          m.whiteSpace = 'nowrap',
          m.lineHeight = h,
          m.top = j * this._rowHeight + 'px',
          m.borderStyle = 'solid',
          m.borderWidth = '0px',
          m.borderBottomWidth = i,
          m.borderBottomColor = this._rowLineColor,
          m.opacity = k.getStyle ? k.getStyle('whole.alpha') : 1,
          this._dataDiv.appendChild(l),
          this._renderMap[c] = l;
          var n = this.isSelected(k);
          this.renderData(l, k, j, n),
          this.onDataRendered(l, k, j, n);
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
    adjustRowSize: function() {
      var a, b, c = this._rowHeight - this._rowLineWidth + 'px',
        d = Math.floor((this._view.scrollLeft + this._view.clientWidth) / this._zoom) + 'px';
      for (a in this._renderMap) {b = this._renderMap[a],
      b.style.height = c,
      b.style.width = d;}
    },
    onValidated: function() {},
    onDataRendered: function(a, b, c, d) {},
    _addCheckBox: function(a, b, c) {
      var d = this.__checkBoxPool.get();
      return d.keepDefault = !0,
      d.type = 'checkbox',
      d.style.margin = '0px 2px',
      d.style.verticalAlign = 'middle',
      d._checkData = b,
      d.checked = c,
      d.disabled = !1,
      a.appendChild(d),
      d;
    },
    _addIcon: function(a, b, c, e) {
      var f = _third.getImageAsset(c),
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
        i && (m.fillStyle = createRadialGradient(m, i, 'white', 1, l - 9, 8, 8, .75, .25), m.beginPath(), m.arc(5, l - 5, 4, 0, Math.PI * 2, !0), m.closePath(), m.fill());
      } else {j = this.__imagePool.get(),
      j.style.verticalAlign = 'middle',
      j.setAttribute('src', _third.getImageSrc(c));}
      j.style.margin = '0px 1px 0px 1px',
      j._selectData = e,
      a.appendChild(j);
    },
    isVisible: function(a) {
      return this._box.contains(a) ? this._visibleFunction ? this._visibleFunction(a) : !0 : !1;
    },
    handleDataBoxChange: function(a) {
      this.invalidateModel();
    },
    handlePropertyChange: function(a) {
      a.property === 'parent' ? this.invalidateModel() : this.invalidateData(a.source);
    },
    handleHierarchyChange: function(a) {
      this.invalidateModel();
    },
    handleSelectionChange: function(a) {
      a.datas.forEach(function(a) {
        this.invalidateData(a);
      },
      this),
      this.onSelectionChanged(a);
    },
    getRowIndexAt: function(a) {
      var b = this.getLogicalPoint(a);
      if (!b) {return - 1;}
      var c = parseInt(b.y / this._rowHeight);
      return c >= 0 && c < this._rowDatas.size() ? c: -1;
    },
    getDataAt: function(a) {
      var b = this.getRowIndexAt(a);
      return b >= 0 ? this._rowDatas.get(b) : null;
    },
    getCurrentSortFunction: function() {
      return this._sortFunction;
    },
    validateModel: function() {
      this._rowDatas.clear(),
      this._dataRowMap = {},
      this._buildChildren(this._box.getRoots()),
      this._rowDatas = this._rowDatas.toList(this.isVisible, this);
      var a = this.getCurrentSortFunction();
      a && this._rowDatas.sort(a);
      var b = this._rowDatas.size();
      for (var c = 0; c < b; c++) {this._dataRowMap[this._rowDatas.get(c).getId()] = c;}
    },
    _buildChildren: function(a) {
      a.forEach(function(a) {
        this._rowDatas.add(a),
        this._buildChildren(a.getChildren());
      },
      this);
    },
    _handlePressSelection: function(a, b) {
      var c = this.getSelectionModel();
      if (_third.isCtrlDown(b)) {c.contains(a) ? c.removeSelection(a) : c.appendSelection(a);}
      else if (b.shiftKey && c.getLastData()) {
        var e = c.getLastData(),
          f = this.getRowIndexByData(e),
          g = this.getRowIndexByData(a),
          h = new List;
        h.add(this.getRowDatas().get(f));
        while (f !== g) {f += g > f ? 1 : -1,
        h.add(this.getRowDatas().get(f));}
        c.setSelection(h);
      } else{(c.size() !== 1 || !c.contains(a)) && c.setSelection(a);}
      this.fireInteractionEvent({
        kind: b.detail === 2 ? 'doubleClick': 'click',
        data: a
      });
    },
    _handleClick: function(a) {
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
    handleChange: function(a) {
      if (this._isCanceling || this._isValidating){ return;}
      var b = a.target._checkData;
      if (b) {
        var c = this.isSelected(b),
          d = this.getSelectionModel();
        c ? d.removeSelection(b) : d.appendSelection(b);
      }
      a.target._editInfo && this.commitEditValue && this.commitEditValue(a.target._editInfo, a.target);
    },
    scrollToData: function(a) {
      var b = this.getRowIndexById(a.getId());
      if (b < 0){ return;}
      var c = b * this._rowHeight * this._zoom,
        d = c + this._rowHeight * this._zoom,
        e = this._view.scrollTop;
      this._view.scrollTop > c && (e = c),
      this._view.scrollTop + this._view.clientHeight < d && (e = d - this._view.clientHeight),
      this._view.scrollTop != e && (this._view.scrollTop = e, this.invalidate());
    },
    makeVisible: function(a) {
      if (!this.isVisible(a)){ return;}
      this.expand && this.expand(a),
      _third.callLater(this.scrollToData, this, [a], Bd.CALL_LATER_DELAY * 2);
    },
    onSelectionChanged: function(a) {
      this._makeVisibleOnSelected && (a.kind === 'append' || a.kind === 'set' || a.kind === 'all') && (this.expand && this.getSelectionModel().getSelection().forEach(function(a) {
        a.getParent() && this.expand(a.getParent());
      },
      this), _third.callLater(this.scrollToData, this, [this.getSelectionModel().getLastData()], Bd.CALL_LATER_DELAY * 2));
    },
    onShareSelectionModelChanged: function() {
      this.invalidateModel();
    }
  }),
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
    },
  _third.ext('third.controls.TableBase', controls.ListBase, {
    getColumnBox: function() {
      return this._columnBox;
    },
    handleColumnBoxChange: function(a) {
      this.invalidateDisplay();
    },
    handleColumnPropertyChange: function(a) {
      a.source !== this._sortColumn || a.property !== 'sortDirection' && a.property !== 'sortFunction' && a.property !== 'sortable' ? this.invalidateDisplay() : this.invalidateModel();
    },
    handleColumnHierarchyChange: function(a) {
      this.invalidateDisplay();
    },
    renderData: function(a, b, c, d) {
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
    adjustRowSize: function() {},
    onCellRendered: function(a) {},
    getCurrentSortFunction: function() {
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
    renderCell: function(a) {
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
    getValue: function(a, b) {
      return b.getValue(a, this);
    },
    setValue: function(a, b, c) {
      b.setValue(a, c, this);
    },
    getColumnAt: function(a) {
      var b = this.getLogicalPoint(a);
      if (!b) {return null;}
      var c = this._columnBox.getRoots();
      for (var d = 0,
        e = c.size(), f = 0; d < e; d++) {
        var g = c.get(d),
          h = g.getWidth();
        h < 0 && (h = 0);
        if (b.x > f && b.x < f + h){ return g;}
        f += h;
      }
      return null;
    },
    isCellEditable: function(a, b) {
      return this.isEditable() && b.isEditable();
    },
    commitEditValue: function(a, b) {
      if (this._isCanceling) {return;}
      var d;
      b.type === 'checkbox' ? d = b.checked: d = b.value;
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
    cancelEditing: function() {
      if (this._currentEditor) {
        this._isCanceling = !0;
        var a = this._currentEditor;
        delete this._currentEditor,
        this._rootDiv.removeChild(a),
        thirdUtil.setFocus(this._view),
        delete this._isCanceling;
      }
    },
    updateCurrentEditor: function(a) {
      var b = a.target;
      if (b === this._currentEditor || b.parentNode === this._currentEditor) {return;}
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
          },
          !1),
          this._currentEditor.addEventListener('blur',
          function(a) {
            var b = a.target._editInfo.view;
            if (b._isCanceling) {return;}
            b.commitEditValue(a.target._editInfo, a.target);
          },
          !1),
          this._currentEditor.keepDefault = !0,
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
    onColumnSorted: function(a) {},
    getCurrentEditor: function() {
      return this._currentEditor;
    }
  }),
    controls.List = function(a) {
      controls.List.superClass.constructor.apply(this, arguments);
    },
  _third.ext('third.controls.List', controls.ListBase, {
    __accessor: ['rowHeight', 'indent', 'rowLineWidth', 'rowLineColor', 'sortFunction', 'visibleFunction'],
    __bool: ['makeVisibleOnSelected', 'keyboardRemoveEnabled', 'keyboardSelectEnabled'],
    _checkMode: !1,
    _rowHeight: Bd.LIST_ROW_HEIGHT,
    _indent: Bd.LIST_INDENT,
    _rowLineWidth: Bd.LIST_ROW_LINE_WIDTH,
    _rowLineColor: Bd.LIST_ROW_LINE_COLOR,
    _makeVisibleOnSelected: Bd.LIST_MAKE_VISIBLE_ON_SELECTED,
    _keyboardRemoveEnabled: Bd.LIST_KEYBOARD_REMOVE_ENABLED,
    _keyboardSelectEnabled: Bd.LIST_KEYBOARD_SELECT_ENABLED,
    isCheckMode: function() {
      return this._checkMode;
    },
    setCheckMode: function(a) {
      delete this._focusedRow;
      var b = this._checkMode;
      this._checkMode = a,
      this.firePropertyChange('checkMode', b, a);
    },
    isCheckable: function(a) {
      return this._checkMode === !0;
    },
    renderData: function(a, b, c, e) {
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
      this.isCheckMode() ? a.style.backgroundColor = this._focusedRow === c ? this.getSelectColor(b) : '': a.style.backgroundColor = e ? this.getSelectColor(b) : '';
    },
    onLabelRendered: function(a, b, c, d, e) {}
  }),

    controls.Tree = function(a) {
      this._interactionDispatcher = new EventDispatcher,
    this._initTree(a),
    controls.Tree.superClass.constructor.apply(this, arguments);
    },
  _third.ext('third.controls.Tree', controls.ListBase, {
    __tree: 1,
    __accessor: ['rootData', 'sortFunction', 'visibleFunction', 'indent', 'rowHeight', 'rowLineWidth', 'rowLineColor', 'expandIcon', 'collapseIcon', 'uncheckableStyle'],
    __bool: ['rootVisible', 'makeVisibleOnSelected', 'keyboardRemoveEnabled', 'keyboardSelectEnabled'],
    _checkMode: !1,
    _indent: Bd.TREE_INDENT,
    _rowHeight: Bd.TREE_ROW_HEIGHT,
    _rowLineWidth: Bd.TREE_ROW_LINE_WIDTH,
    _rowLineColor: Bd.TREE_ROW_LINE_COLOR,
    _makeVisibleOnSelected: Bd.TREE_MAKE_VISIBLE_ON_SELECTED,
    _keyboardRemoveEnabled: Bd.TREE_KEYBOARD_REMOVE_ENABLED,
    _keyboardSelectEnabled: Bd.TREE_KEYBOARD_SELECT_ENABLED,
    _expandIcon: Bd.TREE_EXPAND_ICON,
    _collapseIcon: Bd.TREE_COLLAPSE_ICON,
    _uncheckableStyle: 'none',
    getCheckMode: function() {
      return this._checkMode;
    },
    setCheckMode: function(a) {
      delete this._focusedRow;
      var b = this._checkMode;
      this._checkMode = a,
      this.firePropertyChange('checkMode', b, a);
    },
    renderData: function(a, b, c, d) {
      this._renderTree(a, b, c, d);
    }
  });
module.exports = controls;
