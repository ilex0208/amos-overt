
const _tool = require('./../common/_tool');
const List = require('./../core/_list');

/**
 * 私有tree
 */
let __tree = function(a, b) {
  a._rootVisible = true,
    a._initTree = function() {
      this._rootData = null,
      this._expandMap = {},
      this._levelMap = {};
    },
    a.validateModel = function() {
      this._rowDatas.clear(),
      this._levelMap = {},
      this._dataRowMap = {},
      this._currentLevel = 0,
      this._rootData ? this._rootVisible ? this.isVisible(this._rootData) && this._buildData(this._rootData) : this._buildChildren(this._rootData) : this._buildChildren(),
      delete this._currentLevel;
    },
    a._buildData = function(_element) {
      this._dataRowMap[_element.getId()] = this._rowDatas.size(),
      this._rowDatas.add(_element),
      this._levelMap[_element.getId()] = this._currentLevel,
      this.isExpanded(_element) && (this._currentLevel++, this._buildChildren(_element), this._currentLevel--);
    },
    a._buildChildren = function(_element) {
      var temp = _element ? _element.getChildren() : this._box.getRoots(),
        csf = this.getCurrentSortFunction();
      csf && this.isChildrenSortable(_element) ? temp.toList(this.isVisible, this).sort(csf).forEach(function(item) {
        this._buildData(item);
      },
      this) : temp.forEach(function(_element) {
        this.isVisible(_element) && this._buildData(_element);
      },
      this);
    },
    a.getLevel = function(a) {
      return this._levelMap[a.getId()];
    },
    a.getToggleImage = function(a) {
      return a.getChildrenSize() > 0 ? this.isExpanded(a) ? this._expandIcon: this._collapseIcon: null;
    },
    a.isCheckable = function(a) {
      return this.isCheckMode();
    },
    a.isCheckMode = function() {
      // return extend.__tree._checkMap[this._checkMode] === 1;
      return __tree._checkMap[this._checkMode] === 1;
    },
    a.isChildrenSortable = function(a) {
      return ! 0;
    },
    a.handleDataBoxChange = function(a) {
      a.kind === 'remove' ? delete this._expandMap[a.data.getId()] : a.kind === 'clear' && (this._expandMap = {}),
      this.invalidateModel();
    },
    a.isExpanded = function(a) {
      return this._expandMap[a.getId()] === 1;
    },
    a.expand = function(a) {
      if (this.isExpanded(a)){ return;}
      var b = a.getParent();
      while (b != null && b !== this._rootData) {
        this._expandMap[b.getId()] = 1,
          b = b.getParent();
      }
      this._expandMap[a.getId()] = 1,
      this.invalidateModel();
    },
    a.collapse = function(a) {
      if (!this.isExpanded(a)) {return;}
      delete this._expandMap[a.getId()],
      this.invalidateModel();
    },
    a.expandAll = function() {
      this._box.forEach(function(a) {
        this._expandMap[a.getId()] = 1;
      },
      this),
      this.invalidateModel();
    },
    a.collapseAll = function() {
      this._expandMap = {},
      this.invalidateModel();
    },
    a._handleClick = function(a) {
      this.isFocusOnClick() && _tool.setFocus(this._view);
      if (this._isValidating){ return;}
      var b;
      if (a.target._expandData) {b = a.target._expandData,
      this.isExpanded(b) ? (this.collapse(b), this.fireInteractionEvent({
        kind: 'collapse',
        data: b
      })) : (this.expand(b), this.fireInteractionEvent({
        kind: 'expand',
        data: b
      }));}
      else if (a.target._selectData || a.target.parentNode._selectData) {
        this._handlePressSelection(a.target._selectData || a.target.parentNode._selectData, a);
        if (this.isCheckMode()) {
          var d = this.getRowIndexAt(a);
          d >= 0 && this.__handleClick(a);
        }
      } else {
        this._treeColumn?
        (b = this.getDataAt(a), b && (this.isCheckMode() ? a.target._checkData || this.__handleClick(a) : this._handlePressSelection(b, a)))
        :
        this.isCheckMode() && !a.target._checkData && this.__handleClick(a);
      }
      this._currentEditor && !this._isCommitting && (this._isCommitting = !0, this.commitEditValue(this._currentEditor._editInfo, this._currentEditor)),
      this.updateCurrentEditor && this.updateCurrentEditor(a);
    },
    a.__handleClick = function(a) {
      var b = this.getDataAt(a),
        c = this.getRowIndexByData(b);
      if (this._focusedRow !== c) {
        var d = this._rowDatas.get(this._focusedRow);
        this._focusedRow = c,
        d && this.invalidateData(d),
        this.invalidateData(b);
      }
    },
    a.handleChange = function(a) {
      if (this._isCommitting || this._isCanceling || this._isValidating) {return;}
      var b = a.target._checkData;
      if (b) {
        var c = this.isSelected(b),
          e = this.getSelectionModel(),
          f;
        if (this._checkMode === 'default') {c ? e.removeSelection(b) : e.appendSelection(b);}
        else if (this._checkMode === 'children') {f = new List(b),
        f.addAll(b.getChildren());}
        else if (this._checkMode === 'descendant') {f = new List,
        _tool.fillDescendant(b, f);}
        else if (this._checkMode === 'descendantAncestor') {
          f = new List,
          _tool.fillDescendant(b, f);
          if (!c) {
            var g = b.getParent();
            while (g){ f.add(g),
            g = g.getParent();}
          }
        }
        c ? e.removeSelection(f) : e.appendSelection(f);
      }
      a.target._editInfo && this.commitEditValue && (this._isCommitting = !0, this.commitEditValue(a.target._editInfo, a.target));
    },
    a.onLabelRendered = function(a, b, c, d, e, f) {},
    this._renderTree = function(_dom, _element, c, e) {
      var f = this._levelMap[_element.getId()],
        g = this.getToggleImage(_element),
        h = this.__spanPool.get();
      g ? h.style.width = this._indent * f + 'px' : h.style.width = this._indent * (f + 1) + 'px',
        h.style.display = 'inline-block',
        _dom.appendChild(h);
      if (g) {
        var i = this.__imagePool.get();
        i.setAttribute('src', _element.getImageSrc(g)),
          i.style.verticalAlign = 'middle',
          i._expandData = _element,
          _dom.appendChild(i);
      }
      var j = this.isCheckable(_element),
        k = this.getUncheckableStyle() === 'disabled';
      if (j || k) {
        var l = this._addCheckBox(_dom, _element, e);
        l.disabled = !j;
      }
      var m = this.getIcon(_element);
      if (m) {
        var n = this.isCheckMode() || this._treeColumn ? null : _element;
        this._addIcon(_dom, _element, m, n);
      }
      var o = this.getLabel(_element);
      o && (h = this.__textPool.get(),
      h.style.whiteSpace = 'nowrap',
      h.style.verticalAlign = 'middle',
      h.style.padding = '1px 2px 1px 2px',
      _tool.setText(h, o, this._treeColumn ? this._treeColumn.isInnerText() : this._innerText),
      !this.isCheckMode() && !this._treeColumn ?
      (h._selectData = _element, h.style.backgroundColor = e ? this.getSelectColor(_element) : '')
      :
      this._focusedRow === c && (h.style.backgroundColor = this.getSelectColor(_element)),
      this.onLabelRendered(h, _element, o, c, f, e), _dom.appendChild(h));
    };
};

__tree._checkMap = {
  'default': 1,
  children: 1,
  descendant: 1,
  descendantAncestor: 1
};

module.exports = __tree;
