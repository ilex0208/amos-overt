
/**
 * 判断浏览器类型private
 */
const _userAgent = function() {
  let _agent = {},
    compareAgent = navigator.userAgent.toLowerCase();
  return _agent.isOpera = /opera/.test(compareAgent),
  _agent.isIE = /msie/.test(compareAgent) || /trident/.test(compareAgent),
  _agent.isFirefox = /firefox/i.test(compareAgent),
  _agent.isChrome = /chrome/i.test(compareAgent),
  _agent.isSafari = !_agent.isChrome && /safari/i.test(compareAgent),
  _agent.isIPhone = /iphone/.test(compareAgent),
  _agent.isIPod = /ipod/.test(compareAgent),
  _agent.isIPad = /ipad/.test(compareAgent),
  _agent.isAndroid = /android/i.test(compareAgent),
  _agent.isWebOS = /webos/i.test(compareAgent),
  _agent.isMSToucheable = navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1,
  _agent.isTouchable = 'ontouchend' in document || _agent.isMSToucheable,
  _agent;
};

const UserAgent = _userAgent();

module.exports = UserAgent;
