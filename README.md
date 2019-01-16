## 滑块验证
没错，闲暇时光玩玩小东西，此插件仅提供学习交流
## 快速上手

获得 layui 后，将其完整地部署到你的项目目录（或静态资源服务器），你只需要引入下述一个文件：

```
./sliderVerify/sliderVerify.js
```

入门案例：

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
		<meta name="renderer" content="webkit">
	  	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	  	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="stylesheet" href="layui/css/layui.css" />
		</head>
		<body>
			<form class="layui-form" action="">
				<div class="layui-form-item">
					<label class="layui-form-label">输入框</label>
					<div class="layui-input-block">
						<input type="text" name="title" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
					</div>
				</div>
				<div class="layui-form-item">
					<label class="layui-form-label">滑动验证</label>
					<div class="layui-input-block">
						<div id="slider"></div>
					</div>
				</div>
				<div class="layui-form-item">
					<div class="layui-input-block">
						<button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
						<button type="reset" class="layui-btn layui-btn-primary">重置</button>
					</div>
				</div>
			</form>
<script src="../layui/layui.js"></script>
<script>
		//一般直接写在一个js文件中
		layui.config({
			base: 'dist/sliderVerify/'
		}).use(['sliderVerify', 'jquery', 'form'], function() {
			var sliderVerify = layui.sliderVerify,
				form = layui.form;
			var slider = sliderVerify.render({
				elem: '#slider',
				onOk: function(){//当验证通过回调
					layer.msg("滑块验证通过");
				}
			})
			//监听提交
			form.on('submit(formDemo)', function(data) {
				if(slider.isOk()){//用于表单验证是否已经滑动成功
					layer.msg(JSON.stringify(data.field));
				}else{
					layer.msg("请先通过滑块验证");
				}
				return false;
			});
			
		})
</script> 
</body>
</html>
```

如果你想按照自己的风格定义样式你可以这样：

```js
	var slider = sliderVerify.render({
		elem: '#slider',
		isAutoVerify:false,//关闭自动验证
		bg : 'layui-bg-red',//自定义背景样式名
		text : '滑动',
		onOk: function(){//当验证通过回调
			layer.msg("滑块验证通过");
		}
	})
```