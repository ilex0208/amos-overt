const canvasUtil = require('./../core/canvasUtil');
const _third = require('./../core/_third');

function Tree(scene) {
  this._rootVisible = true,
  this.initialize = function() {

  },
    this.renderData = function(a, b, c, d) {
      this._renderTree(a, b, c, d);
    },
    this._initTree = function() {
      this._rootData = null,
      this._expandMap = {},
      this._levelMap = {};
    },
    this.validateModel = function() {
      this._rowDatas.clear(),
      this._levelMap = {},
      this._dataRowMap = {},
      this._currentLevel = 0,
      this._rootData ? this._rootVisible ? this.isVisible(this._rootData) && this._buildData(this._rootData) : this._buildChildren(this._rootData) : this._buildChildren(),
      delete this._currentLevel;
    },
    this._buildData = function(_element) {
      this._dataRowMap[_element.getId()] = this._rowDatas.size(),
      this._rowDatas.add(_element),
      this._levelMap[_element.getId()] = this._currentLevel,
      this.isExpanded(_element) && (this._currentLevel++, this._buildChildren(_element), this._currentLevel--);
    },
    this._buildChildren = function(_element) {
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
    this._addIcon = function(_dom, ele, nodeType, data) {
      let imgAsset = ele.getImageAsset(nodeType),
        innerColor = this.getInnerColor(ele),
        alarmColor = this.getAlarmFillColor(ele),
        _canvas;
      if (imgAsset && imgAsset.getImage()) {
        var _width = imgAsset.getWidth(),
          _height = imgAsset.getHeight();
        _canvas = ele.getCanvas(),
          _canvas.style.verticalAlign = 'middle',
          _canvas.setAttribute('width', _width),
          _canvas.setAttribute('height', _height);
        var ctx = _canvas.getContext('2d');
        ctx.clearRect(0, 0, _width, _height),
          ctx.drawImage(imgAsset.getImage(innerColor), 0, 0, _width, _height),
          alarmColor && (
            ctx.fillStyle = canvasUtil.createRadialGradient(ctx, alarmColor, 'white', 1, _height - 9, 8, 8, .75, .25),
            ctx.beginPath(),
            ctx.arc(5, _height - 5, 4, 0, Math.PI * 2, !0),
            ctx.closePath(),
            ctx.fill()
          );
      } else {
        _canvas = this.__imagePool.get(),
          _canvas.style.verticalAlign = 'middle',
          _canvas.setAttribute('src', ele.getImageSrc(nodeType));
      }
      _canvas.style.margin = '0 1px 0 1px',
        _canvas._selectData = data,
        _dom.appendChild(_canvas);
    },
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
      o && (h = this.__textPool.get(), h.style.whiteSpace = 'nowrap', h.style.verticalAlign = 'middle', h.style.padding = '1px 2px 1px 2px', _third.setText(h, o, this._treeColumn ? this._treeColumn.isInnerText() : this._innerText), !this.isCheckMode() && !this._treeColumn ? (h._selectData = _element, h.style.backgroundColor = e ? this.getSelectColor(_element) : '') : this._focusedRow === c && (h.style.backgroundColor = this.getSelectColor(_element)), this.onLabelRendered(h, _element, o, c, f, e), _dom.appendChild(h));
    };
}

module.exports = Tree;
