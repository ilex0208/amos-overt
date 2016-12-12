'use strict';

var Constants = {
  COLORS: ['#6495ED', '#FFFF00', '#00FFFF', '#FF0000', '#7FFF00', '#E0A580', '#5FC0CB', '#FA00F0', '#A1BC50', '#FFD700', '#4169E1', '#E5A5F5', '#1E90FF', '#696969', '#FF6347', '#00BFEF', '#80E090', '#5F9EA0', '#A000FF', '#7FAF00', '#228BA2', '#FF00FF', '#7FFFD4', '#800000', '#0000CD', '#20B2AA', '#D2691E', '#6495BD', '#DC143C', '#F0A8AF', '#008B8B', '#800080', '#B8860B', '#4B0082', '#00FF00', '#FFA500', '#FF4500', '#9ACD32', '#00008B', '#FF1493', '#ADFF2F', '#4682B4', '#00C0B1'],
  NODE_WIDTH: 50,
  NODE_HEIGHT: 50,
  ALARM: [{ color: '#FF0000', name: 'Critical', nickName: 'C', level: 1 }, { color: '#FFA000', name: 'Major', nickName: 'M', level: 2 }, { color: '#FFFF00', name: 'Minor', nickName: 'm', level: 3 }, { color: '#00FFFF', name: 'Warning', nickName: 'W', level: 4 }, { color: '#C800FF', name: 'Indeterminate', nickName: 'N', level: 5 }, { color: '#00FF00', name: 'Cleared', nickName: 'R', level: 6 }],
  SMALL: 25,
  MIDDLE: 35,
  LARGE: 50,
  DEFAULT: 32
};

module.exports = Constants;
//# sourceMappingURL=_constants.js.map