define("canvax/event/handler/mouse",["canvax/core/Base","canvax/display/Point","canvax/event/CanvaxEvent"],function(a,b,c){var d=function(){};return d.prototype={init:function(){var b=0,c=this,d=this.canvax;_.each(["click","dblclick","mousedown","mousemove","mouseup","mouseout"],function(e){a.addEvent(d.el,e,function(a){if(d.updateRootOffset(),"mousemove"==a.type){if(1>b)return void b++;b=0}c.__mouseHandler(a)})})},__mouseHandler:function(a){var d=this,e=d.canvax;d.curPoints=[new b(c.pageX(a)-e.rootOffset.left,c.pageY(a)-e.rootOffset.top)];var f=d.curPoints[0],g=d.curPointsTarget[0];if("mousedown"==a.type){if(!g){var h=e.getObjectsUnderPoint(f,1)[0];h&&(d.curPointsTarget=[h])}g=d.curPointsTarget[0],g&&g.dragEnabled&&(d._touching=!0)}var i=document.compareDocumentPosition?function(a,b){return b?!!(16&a.compareDocumentPosition(b)):!1}:function(a,b){return b?b!==b&&(a.contains?a.contains(b):!0):!1};if(("mouseup"==a.type||"mouseout"==a.type&&!i(e.el,a.toElement||a.relatedTarget))&&(1==d._draging&&(d._dragEnd(a,g,0),g.fire("dragEnd",{point:f})),d._draging=!1,d._touching=!1),"mouseout"==a.type)i(e.el,a.toElement||a.relatedTarget)||d.__getcurPointsTarget(a,f);else if("mousemove"==a.type)if(d._touching&&"mousemove"==a.type&&g){if(d._draging){d._dragHander(a,g,0),g._notWatch=!0,g.fire("dragIng",{point:f}),g._notWatch=!1;var j=e._hoverStage.getChildById(g.id);j.context.x=g.context.x,j.context.y=g.context.y}else g.dragBegin&&g.dragBegin(a),g.context.visible=!1,d._clone2hoverStage(g,0),g.fire("dragBegin",{point:f});d._draging=!0}else d.__getcurPointsTarget(a,f);else{var k=g;k||(k=e),d.__dispatchEventInChilds(a,[k]),d._cursorHander(k)}e.preventDefault&&(a&&a.preventDefault?a.preventDefault():window.event.returnValue=!1)},__getcurPointsTarget:function(a,b){var d=this,e=d.canvax,f=d.curPointsTarget[0],a=new c(a);if("mousemove"==a.type&&f&&f._hoverClass&&f.pointChkPriority&&f.getChildInPoint(b))return a.target=a.currentTarget=f,a.point=f.globalToLocal(b),void f.dispatchEvent(a);var g=e.getObjectsUnderPoint(b,1)[0];if(f&&f!=g||"mouseout"==a.type){if(!f)return;d.curPointsTarget[0]=null,a.type="mouseout",a.toTarget=g,a.target=a.currentTarget=f,a.point=f.globalToLocal(b),f.context.visible||(f.context.visible=!0),f.dispatchEvent(a)}g&&f!=g&&(d.curPointsTarget[0]=g,a.type="mouseover",a.fromTarget=f,a.target=a.currentTarget=g,a.point=g.globalToLocal(b),g.dispatchEvent(a)),"mousemove"==a.type&&g&&(a.target=a.currentTarget=f,a.point=f.globalToLocal(b),f.dispatchEvent(a)),d._cursorHander(g,f)},_cursorHander:function(a,b){a||b||this._setCursor("default"),a&&b!=a&&this._setCursor(a.context.cursor)},_setCursor:function(a){this._cursor!=a&&(this.canvax.el.style.cursor=a,this._cursor=a)}},d});