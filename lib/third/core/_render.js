var _third=require("./../core/_third"),_render={_string:function(e,t,l,i){var n=l._stringPool.get();n.style.whiteSpace="nowrap",n.style.verticalAlign="middle",n.style.padding="0px 2px",_third.setText(n,e,i),n.setAttribute("title",e),t.appendChild(n)},_boolean:function(e,t,l){var i=l._booleanPool.get();t._editInfo?(i._editInfo=t._editInfo,delete t._editInfo,i.disabled=!1):i.disabled=!0,i.keepDefault=!0,i.type="checkbox",i.style.margin="0px 2px",i.style.verticalAlign="middle",i.checked=e,t.appendChild(i),""===t.style.textAlign&&(t.style.textAlign="center")},_color:function(e,t,l){var i=l._colorPool.get();i.style.width="100%",i.style.height="100%",i.style.backgroundColor=e,i.setAttribute("title",e),t.appendChild(i)},render:function(e,t,l,i,n){if(null!=t){var r=_render["_"+e];r?r(t,l,i,n):"boolean"==typeof t?_render._boolean(t,l,i,n):_render._string(t,l,i,n)}}};module.exports=_render;