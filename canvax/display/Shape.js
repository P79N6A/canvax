/**
 * Canvax
 *
 * @author 释剑 (李涛, litao.lt@alibaba-inc.com)
 *
 * 模拟as3 DisplayList 中的shape 类
 */
import DisplayObject from "./DisplayObject";
import Utils from "../utils/index";
import _ from "../utils/underscore";
import {SHAPE_CONTEXT_DEFAULT, STYLE_PROPS} from "../const";
import Graphics from "../graphics/Graphics";

export default class Shape extends DisplayObject
{
    constructor(opt){

        opt = Utils.checkOpt(opt);
        var _context = _.extend( _.clone(SHAPE_CONTEXT_DEFAULT) , opt.context );
        opt.context = _context;
         
        if( opt.id === undefined && opt.type !== undefined ){
            opt.id = Utils.createId(opt.type);
        };

        super( opt );

        //over的时候如果有修改样式，就为true
        this._hoverClass = false;
        this.hoverCloneEnabled  = true;    //是否开启在hover的时候clone一份到active stage 中 
        this.pointChkPriority = true; //在鼠标mouseover到该节点，然后mousemove的时候，是否优先检测该节点

        this._eventEnabled   = false; //是否响应事件交互,在添加了事件侦听后会自动设置为true

        this.dragEnabled     = opt.dragEnabled || true ;//"dragEnabled" in opt ? opt.dragEnabled : false;   //是否启用元素的拖拽

         //拖拽drag的时候显示在activShape的副本
        this._dragDuplicate = null;

        this.type = this.type || "shape" ;
        
        //处理所有的图形一些共有的属性配置,把除开id,context之外的所有属性，全部挂载到this上面
        this.initCompProperty(opt);

        //如果该元素是clone而来，则不需要绘制
        if( !this.isClone ){
            //如果是clone对象的话就直接
            this.graphics = new Graphics();
            this._draw( this.graphics );
        } else {
            this.graphics = null;
        }

    }

    _draw( graphics )
    {
        if(graphics.graphicsData.length == 0){
            //先设置好当前graphics的style
            graphics.setStyle( this.context );
            this.draw( graphics );
        }
    }

    draw()
    {

    }

    clearGraphicsData()
    {
        this.graphics.clear();
    }

    $watch(name, value, preValue) 
    {
        if( _.indexOf( STYLE_PROPS , name ) > -1 ){
            this.graphics.setStyle( this.context );
        }
        this.watch( name, value, preValue );
    }

    initCompProperty(opt)
    {
        for( var i in opt ){
           if( i != "id" && i != "context"){
               this[i] = opt[i];
           }
        }
    }

   /*
    * 画虚线
    */
   dashedLineTo(graphics, x1, y1, x2, y2, dashLength ) 
   {
         dashLength = typeof dashLength == 'undefined'
                      ? 3 : dashLength;
         dashLength = Math.max( dashLength , this.context.$model.lineWidth );
         var deltaX = x2 - x1;
         var deltaY = y2 - y1;
         var numDashes = Math.floor(
             Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength
         );
         for (var i = 0; i < numDashes; ++i) {
             var x = parseInt(x1 + (deltaX / numDashes) * i);
             var y = parseInt(y1 + (deltaY / numDashes) * i);
             graphics[i % 2 === 0 ? 'moveTo' : 'lineTo']( x , y );
             if( i == (numDashes-1) && i%2 === 0){
                 graphics.lineTo( x2 , y2 );
             }
         }
   }

   /*
    *从cpl节点中获取到4个方向的边界节点
    *@param  context 
    *
    **/
   getRectFormPointList( context )
   {
       var minX =  Number.MAX_VALUE;
       var maxX =  Number.MIN_VALUE;
       var minY =  Number.MAX_VALUE;
       var maxY =  Number.MIN_VALUE;

       var cpl = context.pointList; //this.getcpl();
       for(var i = 0, l = cpl.length; i < l; i++) {
           if (cpl[i][0] < minX) {
               minX = cpl[i][0];
           }
           if (cpl[i][0] > maxX) {
               maxX = cpl[i][0];
           }
           if (cpl[i][1] < minY) {
               minY = cpl[i][1];
           }
           if (cpl[i][1] > maxY) {
               maxY = cpl[i][1];
           }
       };

       var lineWidth;
       if (context.strokeStyle || context.fillStyle  ) {
           lineWidth = context.lineWidth || 1;
       } else {
           lineWidth = 0;
       }
       return {
           x      : Math.round(minX - lineWidth / 2),
           y      : Math.round(minY - lineWidth / 2),
           width  : maxX - minX + lineWidth,
           height : maxY - minY + lineWidth
       };
   }
}