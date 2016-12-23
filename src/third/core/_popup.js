const _cons = require('./../constants');
const Bd = _cons.Bd;

/**
 * 提示、弹出框
 */
const popup = {
  toolTipDiv: null,
  getToolTipDiv: function() {
    if (!popup.toolTipDiv) {
      popup.toolTipDiv = document.createElement('div');
      var a = Bd,
        b = popup.toolTipDiv.style;
      b.position = 'absolute',
        b.color = a.TOOLTIP_COLOR,
        b.background = a.TOOLTIP_BACKGROUND,
        b.fontSize = a.TOOLTIP_FONT_SIZE,
        b.padding = a.TOOLTIP_PADDING,
        b.border = a.TOOLTIP_BORDER,
        b.borderRadius = a.TOOLTIP_BORDER_RADIUS,
        b.boxShadow = a.TOOLTIP_BOX_SHADOW,
        b.zIndex = a.TOOLTIP_ZINDEX,
        b.setProperty && b.setProperty('-webkit-box-shadow', a.TOOLTIP_BOX_SHADOW, null);
    }
    return popup.toolTipDiv;
  },
  isToolTipVisible: function() {
    return popup.getToolTipDiv().parentNode ? !0 : !1;
  },
  hideToolTip: function() {
    popup._clearTimeout(),
      popup._clearDismiss();
    if (!popup.isToolTipVisible()) {return;}
    var a = popup.getToolTipDiv();
    a.parentNode && a.parentNode.removeChild(a);
  },
  showToolTip: function(a, b) {
    if (!a || !b) {
      popup.hideToolTip();
      return;
    }
    popup.isToolTipVisible() || popup._reshow_timeout ? popup._showToolTip(a, b) : (popup._clearTimeout(), popup._show_timeout = setTimeout(popup._showToolTip, Bd.TOOLTIP_INITIAL_DELAY, a, b));
  },
  _showToolTip: function(a, b) {
    var c, d, e;
    a.target ? (c = a.clientX, d = a.clientY) : (c = a.x, d = a.y),
      e = popup.getToolTipDiv(),
      e.innerHTML = b,
      e.style.left = c + Bd.TOOLTIP_XOFFSET + 'px',
      e.style.top = d + Bd.TOOLTIP_YOFFSET + 'px',
      e.parentNode || document.body.appendChild(e),
      popup._clearDismiss(),
      popup._dismiss_timeout = setTimeout(popup.hideToolTip, Bd.TOOLTIP_DISMISS_DELAY),
      popup._clearReshow(),
      popup._reshow_timeout = setTimeout(popup._clearReshow, Bd.TOOLTIP_RESHOW_DELAY);
  },
  _clearDismiss: function() {
    popup._dismiss_timeout && (clearTimeout(popup._dismiss_timeout), popup._dismiss_timeout = null);
  },
  _clearReshow: function() {
    popup._reshow_timeout && (clearTimeout(popup._reshow_timeout), popup._reshow_timeout = null);
  },
  _clearTimeout: function() {
    popup._show_timeout && (clearTimeout(popup._show_timeout), popup._show_timeout = null);
  },
  resetToolTip: function() {
    popup.hideToolTip(),
      popup.toolTipDiv = null;
  }
};

module.exports = popup;
