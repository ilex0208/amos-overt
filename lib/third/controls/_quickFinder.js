var _third=require("./../core/_third"),List=require("./../core/_list"),invokeExtends=require("./../core/_ext"),QuickFinder=function(t,e,i,r,a){if(this._map={},!t)throw"dataBox can not be null";if(!e)throw"propertyName can not be null";this._dataBox=t,this._propertyName=e,this._propertyType=i||"accessor","accessor"===this._propertyType&&(this._getter=_third.getter(e)),this._valueFunction=r||this.getValue,this._filterFunction=a||this.isInterested,this._dataBox.forEach(this._addData,this),this._dataBox.addDataBoxChangeListener(this.handleDataBoxChange,this,!0),this._dataBox.addDataPropertyChangeListener(this.handleDataPropertyChange,this,!0),this._NULL_="third-null-key",this.getValueFunction=function(){return this._valueFunction},this.getFilterFunction=function(){return this._filterFunction},this.handleDataBoxChange=function(t){"add"===t.kind?this._addData(t.data):"remove"===t.kind?this._removeData(t.data):"clear"===t.kind&&(this._map={})},this.handleDataPropertyChange=function(t){if(this._filterFunction.call(this,t.source)&&("accessor"===this._propertyType&&this._propertyName===t.property||"style"===this._propertyType&&t.source.IStyle&&"S:"+this._propertyName===t.property||"client"===this._propertyType&&"C:"+this._propertyName===t.property)){var e=this._getMap(t.oldValue);e&&e.remove(t.source),this._addData(t.source)}},this._getMap=function(t){return t=null==t?this._NULL_:t,this._map[t]},this.find=function(t){var e=this._getMap(t);return e?e.toList():new List},this.findFirst=function(t){var e=this._getMap(t);return!e||e.isEmpty()?null:e.get(0)},this._addData=function(t){if(this._filterFunction.call(this,t)){var e=this._valueFunction.call(this,t),i=this._getMap(e);i||(i=new List,e=null==e?this._NULL_:e,this._map[e]=i),i.add(t)}},this._removeData=function(t){if(this._filterFunction.call(this,t)){var e=this._valueFunction.call(this,t),i=this._getMap(e);i&&(i.remove(t),i.isEmpty()&&(e=null==e?this._NULL_:e,delete this._map[e]))}},this.dispose=function(){this._dataBox.removeDataBoxChangeListener(this.handleDataBoxChange,this),this._dataBox.removeDataPropertyChangeListener(this.handleDataPropertyChange,this),delete this._dataBox},this.getDataBox=function(){return this._dataBox},this.getPropertyType=function(){return this._propertyType},this.getPropertyName=function(){return this._propertyName},this.isInterested=function(t){return!("style"===this._propertyType&&!t.IStyle)&&!("accessor"===this._propertyType&&this._valueFunction===this.getValue&&!t[this._getter])},this.getValue=function(t){return"accessor"===this._propertyType?t[this._getter]():"style"===this._propertyType&&t.getStyle?t.getStyle(this._propertyName):"client"===this._propertyType&&t.getClient?t.getClient(this._propertyName):null}};invokeExtends("third.QuickFinder",Object,QuickFinder),QuickFinder.prototype.getClassName=function(){return"third.QuickFinder"},module.exports=QuickFinder;