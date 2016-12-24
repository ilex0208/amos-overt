const Constants = {
  COLORS: ['#6495ED', '#FFFF00', '#00FFFF', '#FF0000', '#7FFF00', '#E0A580', '#5FC0CB', '#FA00F0', '#A1BC50', '#FFD700', '#4169E1', '#E5A5F5',
    '#1E90FF', '#696969', '#FF6347', '#00BFEF', '#80E090', '#5F9EA0', '#A000FF', '#7FAF00', '#228BA2', '#FF00FF', '#7FFFD4', '#800000',
    '#0000CD', '#20B2AA', '#D2691E', '#6495BD', '#DC143C', '#F0A8AF', '#008B8B', '#800080', '#B8860B', '#4B0082', '#00FF00', '#FFA500', '#FF4500',
    '#9ACD32', '#00008B', '#FF1493', '#ADFF2F', '#4682B4', '#00C0B1'
  ],
  NODE_WIDTH: 50,
  NODE_HEIGHT: 50,
  ALARM: [{
    color: '#FF0000',
    name: 'Critical',
    nickName: 'C',
    level: 1
  }, {
    color: '#FFA000',
    name: 'Major',
    nickName: 'M',
    level: 2
  }, {
    color: '#FFFF00',
    name: 'Minor',
    nickName: 'm',
    level: 3
  }, {
    color: '#00FFFF',
    name: 'Warning',
    nickName: 'W',
    level: 4
  }, {
    color: '#C800FF',
    name: 'Indeterminate',
    nickName: 'N',
    level: 5
  }, {
    color: '#00FF00',
    name: 'Cleared',
    nickName: 'R',
    level: 6
  }],
  SMALL: 25,
  MIDDLE: 35,
  LARGE: 50,
  DEFAULT: 32,
  ROOT_ICON: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMoSURBVDhPdZNdbAxRFMdP6yOhUh8hSHxFIjyIJ1IvEglPBCFENAgSISIR0lBFhKKNSnloUk1UhVaLkm6VVqtd2T5gFVtbn7tru1/a3e5nd+bOOXNnhrujEYKb/F4m93fOvf85Nwv+saq6YfX4XMgfPQZWZGXDBIODWyWwhEJw68QGCP/LMb/VvIDl9z6DpT2SFXkuTUn20qKEU10S71HmJ2ypCfGHfvhY9w4Kq5ph/F9Fqntgo9jg65Hn6T7tgPqNl3Iv7iO3spM8ym7yYD6+V/OUZ/GxSsMnuF3SApN/Fblqg7yM3Kcu5Sm9TTe+8++ZFaOHmkvegV/ZfvSyg4LD5OabZVsqh+r7oHLLFhiVKZLV+AUsr5VZPKk/1kxzZEWpiXvk/dgvFwiOCo6hXz5FbnWT3B7OTtS8grUguq/qiIwKu/h64kbslyzxPt3PTmK/VIh+6bTgzAhnMSgX4xu2mBrdUA23HCI7aXrSRVtpSG3gEnfqUXrAfXKRkIuEVIyBdCkG05cE5SahdIXIZRe2hMAODR/A9ZYWxN24g1zydnTLe/GrdAh90ikMSBdMYUCuxDC7jhHl5k9YHYWohD0N5wTgzicYcKgL46Iiedg+EdQRU/ZL54V8GQeFOIT1GFXvY0xtElgEjyiq32DWoWlhqHdCd48yO+ZR9lAmaTMocd9gukzI1zBKdzDGmzGhtQqeYFJrx5RmpahRg08HJ36B63YosKXGxdy0TfHKhylz94B0DkNSBUawzuya1NoEHZjSOwVdmNZf0DejWLX0QxuUt8LMzIS958uYjx0VBU6K0ErEvatE97sY549G5C4hWzFt2FA2npMjvVK70QtF5jCJP1FoTYxlHnWrHJDOUzB9ceT498WxRXez80+ZGW8pqJ3WLN7RzopOmGsWKLsJOQ0f4Xb3cA561Hw5JJVThNVSTG2hlNaJw3o3SYadmPGSgvys3hrMHbxqh3V/vIfLVphU/wEqMxPmYMsooBZgVK9mSaOJJYxGGtDLNcfwGsPizXZW2WH9f1+kCHVdZsJaxZB0RaYGbNF54c6BGa5mH7TV9sHxKx0w53f5BzLSm4YuwFCOAAAAAElFTkSuQmCC',
  DEFAULT_ICON: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAMCAYAAABSgIzaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk1NjMyRTY1QzUzNzExRTZBQjc0RUVEQ0FDRUEwMkZDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk1NjMyRTY2QzUzNzExRTZBQjc0RUVEQ0FDRUEwMkZDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTU2MzJFNjNDNTM3MTFFNkFCNzRFRURDQUNFQTAyRkMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTU2MzJFNjRDNTM3MTFFNkFCNzRFRURDQUNFQTAyRkMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4QKYhjAAAAxklEQVR42mJ0+u/EAAJdsz79B9H///9n+PfvH5iuyhJiZMABWGCajNNOIwnvBpMNEwr+NxRIYNXMeGamyX9+OVsg8yEWaXmGR5e3MPz9+xeMQS759/8fmM1weobxf1LBmiqR/ywgUxgYZgExMwNx4C/D79+/GaAaIQLEgj9//iBp/PmLOF3sbGA/soA9CgLfvxGtEWQZwsavRGoUEIBoJNlGIEDVSKwfoamLEZTkiptv/4dFLMg0WIQj88GRD2WnzZjBCBBgAD7bve1bkrjzAAAAAElFTkSuQmCC',
  UNEXPAND:'data:image/gif;base64,R0lGODlhEAASAIcAADFKY0L/QpSlvZylvZytxqW11qm92r3GxrnK5MbGxsbW69jh8efv9+vz/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAMAAAEALAAAAAAQABIAAAhfAAMIHEiwoMGDCBMqXMjQ4AICEAcMECDgwEECDjJmbMAAwEWNDjgi8GgQ40YGCwyQLDjAAYCXL1UeFBAS5QIFBVYSFMBxwU0EOWcyUIDAQIGjOgcegMnUYsOnUKMiDAgAOw=='
};



module.exports = Constants;
