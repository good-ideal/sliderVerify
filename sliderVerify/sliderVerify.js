/**
 * 滑块验证
 * @author good_idea
 * @date 2019年1月11日 上午10:48:41
 */
layui.define(['jquery','layer','form'], function (exports) {
	"use strict";
  	var $ = layui.jquery,
  	form = layui.form,
  	layer = layui.layer,
  	device = layui.device()
  	,sliderVerify = {
	  	read : function(){
	  		var css = `.slider-item{height:40px;line-height:40px;background-color:#e2e2e2;position:relative}.slider-bg{position:absolute;width:40px;height:100%;z-index:100}.slider-bg-success{background-color:#5fb878}.slider-btn{width:40px;height:96%;position:absolute;border:1px solid #ccc;cursor:move;text-align:center;background-color:#fff;user-select:none;color:#666;z-index:120}.slider-btn-success{font-size:26px}.slider-text{position:absolute;text-align:center;width:100%;height:100%;user-select:none;font-size:14px;z-index:120}.slider-text-init{color:#6d6d6d}.slider-text-success{color:#fff}.slider-error{animation:glow 800ms ease-out infinite alternate;border:0 solid;border:1px solid}@keyframes glow{0%{border-color:#e6e6e6}100%{border-color:#ff5722}}`,
			style = document.createElement('style');
			style.innerHTML = css;
			style.type = 'text/css';
			$('head link:last')[0] && $('head link:last').after(style) || $('head').append(style);
	  	}()
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
  	
  	,MOD_NAME = 'sliderVerify',
  	MOD_BTN = 'slider-btn',
  	MOD_BG = 'slider-bg',
  	MOD_TEXT = 'slider-text',
  	MOD_NEXT = 'layui-icon-next',
  	MOD_OK = 'layui-icon-ok-circle',
  	MOD_BTN_SUCCESS = 'slider-btn-success',
  	MOD_DEFAULT_BG = 'layui-bg-green',
  	MOD_ERROR_BORDER = 'slider-error',
  	MOD_CONFIG_TEXT = '请拖动滑块验证',

  	
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
  		bg : MOD_DEFAULT_BG,//默认滑块颜色
  		text : MOD_CONFIG_TEXT
  	};
  	
  	Class.prototype.render = function() {
  		var that = this,
  		option = that.config,
  		elem = $(option.elem);
  		option.domid = that.createIdNum();
  		var sliderDom = $(`<div id="${option.domid}" ${option.isAutoVerify ? 'lay-verify="sliderVerify"' : ''} class="slider-item">
  								<div class="${MOD_BG} ${option.bg}"></div>
  								<div class="${MOD_TEXT} ${MOD_TEXT}-init">${option.text}</div>
  								<div class="${MOD_BTN} layui-icon layui-icon-next"></div>
  							</div>`)
  		elem.hide().after(sliderDom);
  		option.domid = $('#'+option.domid);
  		
  		that.events();
  		//自动验证
  		if(option.isAutoVerify){
  			form.verify({
			    sliderVerify: function(value,dom){
			      if(!value){
			      	dom.classList.add(MOD_ERROR_BORDER);
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
  		this.config.domid[0].classList.remove(MOD_ERROR_BORDER);
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
        var seup = function(e){that.stop(e)};
        that.events.seup = seup;
        if( that.isMobile() ){
        	document.addEventListener('touchend',seup)
        }else{
        	document.onmouseup = seup;
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
         if( that.isMobile() ){
        	document.removeEventListener('touchmove',that.events.move,false);
        	document.removeEventListener('touchend',that.events.seup,false);
        }
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