var Tnode=require("./_tNode"),_third=require("./../core/_third"),invokeExtends=require("./../core/_ext"),Follower=function o(t){this._isUpdatingFollower=!1,this._isUpdatingLocation=!1,o.superClass.constructor.call(this,t),this._host=null,this.getHost=function(){return this._host},this.setHost=function(o){if(this!==o&&this._host!==o){var t=this._host;t&&t._removeFollower(this),this._host=o,this._host&&this._host._addFollower(this),this.firePropertyChange("host",t,o),this.onHostChanged(t,o)}},this.onStyleChanged=function(t,i,r){o.superClass.onStyleChanged.call(this,t,i,r),o.IS_INTERESTED_FOLLOWER_STYLE[t]&&this.updateFollower(null)},this.setLocation=function(){this._isUpdatingLocation||(this._isUpdatingLocation=!0,o.superClass.setLocation.apply(this,arguments),this._isUpdatingLocation=!1)},this.onHostChanged=function(o,t){this.updateFollower(null)},this.handleHostPropertyChange=function(o){this.updateFollower(o)},this.updateFollower=function(o){this._isUpdatingFollower||_third.isDeserializing||(this._isUpdatingFollower=!0,this.updateFollowerImpl(o),this._isUpdatingFollower=!1)},this.isHostOn=function(t){if(!t)return!1;for(var i={},r=this._host;r&&r!=this&&!i[r.getId()];){if(r===t)return!0;i[r.getId()]=r,r=r instanceof o?r.getHost():null}return!1},this.isLoopedHostOn=function(o){return this.isHostOn(o)&&o.isHostOn(this)}};Follower.IS_INTERESTED_HOST_GRID_PROPERTY={location:1,width:1,height:1,"S:grid.row.count":1,"S:grid.column.count":1,"S:grid.row.percents":1,"S:grid.column.percents":1,"S:grid.border":1,"S:grid.border.left":1,"S:grid.border.right":1,"S:grid.border.top":1,"S:grid.border.bottom":1,"S:grid.padding":1,"S:grid.padding.left":1,"S:grid.padding.right":1,"S:grid.padding.top":1,"S:grid.padding.bottom":1},Follower.IS_INTERESTED_FOLLOWER_STYLE={"follower.row.index":1,"follower.column.index":1,"follower.row.span":1,"follower.column.span":1,"follower.padding":1,"follower.padding.left":1,"follower.padding.right":1,"follower.padding.top":1,"follower.padding.bottom":1},invokeExtends("third.Follower",Tnode,Follower),Follower.prototype.getClassName=function(){return"third.Follower"},module.exports=Follower;