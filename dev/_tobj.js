'use strict';

//////////////////////////////
/**
 * 内部配置
 * @author ilex
 * @description 2016-11-05 11:56:12
 */
//////////////////////////////
var Tobj = {
  version: '2.1.0',
  zIndex_Container: 1,
  zIndex_Link: 2,
  zIndex_Node: 3,
  SceneMode: {
    normal: 'normal',
    drag: 'drag',
    edit: 'edit',
    select: 'select'
  },
  MouseCursor: {
    normal: 'default',
    pointer: 'pointer',
    top_left: 'nw-resize',
    top_center: 'n-resize',
    top_right: 'ne-resize',
    middle_left: 'e-resize',
    middle_right: 'e-resize',
    bottom_left: 'ne-resize',
    bottom_center: 'n-resize',
    bottom_right: 'nw-resize',
    move: 'move',
    open_hand: 'url(./styles/cur/openhand.cur) 8 8, default',
    closed_hand: 'url(./styles/cur/closedhand.cur) 8 8, default'
  }
};

module.exports = Tobj;
//# sourceMappingURL=_tobj.js.map