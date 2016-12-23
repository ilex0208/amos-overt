let _touch = {
  scrollLeft: function() {
    return _touch._filterResults(window.pageXOffset ? window.pageXOffset : 0, document.documentElement ? document.documentElement.scrollLeft : 0, document.body ? document.body.scrollLeft : 0);
  },
  scrollTop: function() {
    return _touch._filterResults(window.pageYOffset ? window.pageYOffset : 0, document.documentElement ? document.documentElement.scrollTop : 0, document.body ? document.body.scrollTop : 0);
  },
  _filterResults: function(a, b, c) {
    let d = a ? a : 0;
    return b && (!d || d > b) && (d = b),
      c && (!d || d > c) ? c : d;
  },
  isSingleTouch: function(a) {
    return a.touches && a.touches.length == 1;
  },
  isMultiTouch: function(a) {
    return a.touches && a.touches.length > 1;
  },
  getDistance: function(a) {
    if (!_touch.isMultiTouch(a)) {
      return 0;
    }
    let b = a.touches[0],
      c = a.touches[1];
    return Math.sqrt(Math.pow(b.clientX - c.clientX, 2) + Math.pow(b.clientY - c.clientY, 2));
  }
};

module.exports = _touch;
