layui.define(['jquery','layer','form'], function (exports) {
	"use strict";
  	var $ = layui.jquery,
  	form = layui.form,
  	layer = layui.layer
  	//自定义验证规则
	  /*form.verify({
	    sliderVerify: function(value){
	      if(value.length < 5){
	        return '请先滑动通过验证';
	      }
	    }
	  })*/
  	,sliderVerify = {
  		
  		
  	}
  	,dom = function(d){
  		return d[0];
  	}
  	,thisSliderVerify = function() {
		var that = this;
		return {
			isOk : that.isOk.call(that)
		}
	}
  	
  	,MOD_NAME = 'sliderVerify',MOD_BTN = '.slider-btn',MOD_BG = '.slider-bg',MOD_TEXT = '.slider-text',MOD_NEXT = 'layui-icon-next',MOD_OK = 'layui-icon-ok-circle',

  	
  	Class = function(option) {
  		var that = this;
	   	that.config = $.extend({}, that.config, option);
	   	that.render();
  	};
  	
  	//默认配置
  	Class.prototype.config = {
  		elem : '',
  		onOk : null,
  		text : '请拖动滑块解锁'
  	};
  	
  	Class.prototype.render = function() {
  		var that = this,
  		option = that.config,
  		elem = $(option.elem);
  		option.domid = that.createIdNum();
  		var sliderVerify = $('<div id="'+option.domid+'" class="slider-item"><div class="slider-bg slider-bg-success"></div><div class="slider-text slider-text-init">'+option.text+'</div><div class="slider-btn layui-icon layui-icon-next"></div></div>')
  		elem.hide().after(sliderVerify);
  		option.domid = $('#'+option.domid);
  		
  		that.events();
  	};
  	
  	Class.prototype.createIdNum = function(){
  		return MOD_NAME+(+new Date()).toString()+(Math.random().toString()).substr(2,7);
  	};
  	//验证是否验证成功
  	Class.prototype.isOk = function() {
  		return false;
  	};
  	
  	Class.prototype.error = function(msg) {
  		return layer.msg(msg,{
  			icon : 5
  		});
  	};
  	//很遗憾的是暂不支持手机
  	Class.prototype.onmousedown = function(e) {
  		var that = this,
  		option = that.config,
  		container = option.container,
  		e = e || window.event,
  		//按下的坐标
  		downX = e.clientX;
  		
  		container.btn.style.transition = "";
  		container.bg.style.transition = "";
  		document.onmousemove = function(e){
  			var e = e || window.event;
            //1.获取鼠标移动后的水平位置
            let moveX = e.clientX;
            //2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
            var offsetX = moveX - downX;

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
                container.btn.classList.remove(MOD_NEXT);
                container.btn.classList.add(MOD_OK)
                /*container.btn.style.color = "green";*/
                /*container.bg.style.backgroundColor = "lightgreen";*/

                //成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
                container.btn.onmousedown = null;
                document.onmousemove = null;

            }
  		}
  	};
  	
  	Class.prototype.events = function() {
  		var that = this,
  		option = that.config;
  		if( !option.domid ) return that.error('创建滑块验证失败');
  		
  		var btn = option.domid.find(MOD_BTN),
  		bg = option.domid.find(MOD_BG),
  		text = option.domid.find(MOD_TEXT),
  		container = {
  			box : dom(option.domid),
  			btn : dom(btn),
  			bg  : dom(bg),
  			text: dom(text)
  		}
  		var distance = container.box.offsetWidth - container.btn.offsetWidth;//滑动成功的宽度（距离）
  		container.distance = distance;
  		option.container = container
		
		container.btn.onmousedown = function(e){that.onmousedown(e);}
  	};
  	
  	sliderVerify.render = function(option) {
  		var inst = new Class(option);
  		return thisSliderVerify.call(inst);
  	}
  	
  	
  	exports(MOD_NAME, sliderVerify);
})