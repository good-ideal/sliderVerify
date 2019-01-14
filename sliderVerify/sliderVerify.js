layui.define(['jquery','layer','form'], function (exports) {
	"use strict";
  	var $ = layui.jquery,
  	form = layui.form,
  	layer = layui.layer,
  	device = layui.device()
  	
  	,sliderVerify = {
  		
  	}
  	,dom = function(d){
  		return d[0];
  	}
  	,thisSliderVerify = function() {
		var that = this;
		return {
			isOk : function(){
				return that.isOk.call(that);
			}
		}
	}
  	
  	,MOD_NAME = 'sliderVerify',MOD_BTN = 'slider-btn',MOD_BG = 'slider-bg',MOD_TEXT = 'slider-text',MOD_NEXT = 'layui-icon-next',MOD_OK = 'layui-icon-ok-circle',MOD_BTN_SUCCESS = 'slider-btn-success',

  	
  	Class = function(option) {
  		var that = this;
	   	that.config = $.extend({}, that.config, option);
	   	that.render();
  	};
  	
  	//默认配置
  	Class.prototype.config = {
  		elem : '',
  		onOk : null,
  		isOk : false,
  		isAutoVerify : true,
  		bg : 'layui-bg-green',//默认滑块颜色
  		text : '请拖动滑块解锁'
  	};
  	
  	Class.prototype.render = function() {
  		var that = this,
  		option = that.config,
  		elem = $(option.elem);
  		option.domid = that.createIdNum();
  		var sliderVerify = $(`<div id="${option.domid}" ${option.isAutoVerify ? 'lay-verify="sliderVerify"' : ''} class="slider-item">
  								<div class="${MOD_BG} ${option.bg}"></div>
  								<div class="${MOD_TEXT} ${MOD_TEXT}-init">${option.text}</div>
  								<div class="${MOD_BTN} layui-icon layui-icon-next"></div>
  							</div>`)
  		elem.hide().after(sliderVerify);
  		option.domid = $('#'+option.domid);
  		
  		that.events();
  		//自动验证
  		if(option.isAutoVerify){
  			form.verify({
			    sliderVerify: function(value){
			      if(!value){
			        return option.text;
			      }
			    }
	   		});
  		}
  	};
  	Class.prototype.isMobile = function(){
  		return (device.os == 'ios' || device.os == 'android');
  	}
  	Class.prototype.createIdNum = function(){
  		return MOD_NAME+(+new Date()).toString()+(Math.random().toString()).substr(2,7);
  	};
  	//验证是否验证成功
  	Class.prototype.isOk = function() {
  		return this.config.isOk;
  	};
  	
  	Class.prototype.error = function(msg) {
  		return layer.msg(msg,{
  			icon : 5
  		});
  	};
  	//取消动画
  	Class.prototype.cancelTransition = function() {
  		var container = this.config.container;
  		container.btn.style.transition = "";
  		container.bg.style.transition = "";
  	};
  	//按下
  	Class.prototype.down = function(e){
  		var that = this,
  		option = that.config,
  		container = option.container,
  		e = e || window.event,
  		//按下的坐标
  		downX = e.clientX || e.touches[0].clientX;
  		//每次将过渡去掉
  		that.cancelTransition();
  		var move = function(e){that.move(downX,e)};
  		that.events.move = move;
  		
  		//mobile移动
  		if( that.isMobile() ){
  			document.addEventListener('touchmove',that.events.move);
  		}else{
  			//pc移动
  			document.onmousemove = move;
  		}
  	}
  	//移动
  	Class.prototype.move = function(down,e){
  		var that = this,
  		option = that.config,
  		container = option.container;
  		var e = e || window.event;
        //1.获取鼠标移动后的水平位置
        let moveX = e.clientX || e.touches[0].clientX;
        //2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
        var offsetX = moveX - down;

        //3.在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
        if( offsetX > container.distance ){
            offsetX = container.distance;//如果滑过了终点，就将它停留在终点位置
        }else if( offsetX < 0 ){
            offsetX = 0;//如果滑到了起点的左侧，就将它重置为起点位置
        }
		container.btn.style.left = offsetX + "px";
		container.bg.style.width = offsetX + "px";
		
		//如果鼠标的水平移动距离 = 滑动成功的宽度
        if( offsetX == container.distance ){
        	
            //1.设置滑动成功后的样式
            container.text.innerHTML = "验证通过";
            container.text.style.color = "#fff";
			var com = window.getComputedStyle ? window.getComputedStyle(container.bg,null) : container.bg.currentStyle;
			container.btn.style.border = '1px solid '+com.backgroundColor;
			container.btn.style.color = com.backgroundColor;
            container.btn.classList.remove(MOD_NEXT);
            container.btn.classList.add(MOD_OK,MOD_BTN_SUCCESS);
			option.isOk = true;
			container.box.value = true;
			//成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
            //干掉mobile事件
            if( that.isMobile() ){
            	container.btn.removeEventListener('touchstart',that.events.down,false);
            	document.removeEventListener('touchmove',that.events.move,false);
            }else{
            	container.btn.onmousedown = null;
            	document.onmousemove = null;
            }
            //最后调用回调
			option.onOk && typeof option.onOk == 'function' && option.onOk();
			return ;
        }
        if( that.isMobile() ){
        	document.addEventListener('touchend',function(e){that.stop(e)})
        }else{
        	document.onmouseup = function(e){that.stop(e)};
        }
  	}
  	//放开
  	Class.prototype.stop = function(e){
  		var that = this,
  		option = that.config,
  		container = option.container;
        //鼠标松开，如果滑到了终点，则验证通过
        if(that.isOk()){
            return;
        }else{
            container.btn.style.left = 0;
            container.bg.style.width = 0;
            container.btn.style.transition = "left 1s ease";
            container.bg.style.transition = "width 1s ease";
        }
        //鼠标松开了，此时不需要拖动就清除鼠标移动和松开事件。
        document.onmousemove = null;
        document.onmouseup = null;
    }
  	//事件
  	Class.prototype.events = function() {
  		var that = this,
  		option = that.config;
  		if( !option.domid ) return that.error('创建滑块验证失败');
  		
  		var btn = option.domid.find('.' +MOD_BTN),
  		bg = option.domid.find('.' + MOD_BG),
  		text = option.domid.find('.' +MOD_TEXT),
  		container = {
  			box : dom(option.domid),
  			btn : dom(btn),
  			bg  : dom(bg),
  			text: dom(text)
  		}
  		var distance = container.box.offsetWidth - container.btn.offsetWidth;//滑动成功的宽度（距离）
  		container.distance = distance;
  		option.container = container;
  		var down = function(e){that.down(e)};
		that.events.down = down;
		
		if( that.isMobile() ){
            container.btn.addEventListener('touchstart', that.events.down)	
        }else{
        	container.btn.onmousedown = down;
        }
  	};
  	
  	sliderVerify.render = function(option) {
  		var inst = new Class(option);
  		return thisSliderVerify.call(inst);
  	}
  	
  	exports(MOD_NAME, sliderVerify);
})