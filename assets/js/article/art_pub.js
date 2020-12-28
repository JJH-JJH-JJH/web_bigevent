$(function() {
	var layer = layui.layer;
	var form = layui.form;
	initCate();

	// 初始化富文本编辑器
	initEditor();

	//定义加载文章分类的方法
	function initCate() {
		$.ajax({
			method: "GET",
			url: '/my/article/cates',
			success: function(res) {
				if(res.status !== 0) {
					return layer.msg('初始化文章分类失败！');
				}

				// 调用模板引擎，渲染分类的下拉菜单
				// console.log(res);
				var htmlStr = template('tpl-cate', res);
				// console.log(htmlStr);
				$('[name=cate_id]').html(htmlStr);
				form.render();
			}
		})
	}


	// 1.1 获取裁剪区域的 DOM 元素
	var $image = $('#image');
	// 1.2 配置选项
	const options = {
		// 纵横比
		aspectRatio: 1,
		// 指定预览区域
		preview: '.img-preview'
	};

	// 1.3 创建裁剪区域
	$image.cropper(options);

	// 为选择封面的按钮，绑定点击事件处理函数
	$('#btnChooseImage').on('click', function() {
		$('#coverFile').click();
	});

	// 监听coverFile的change事件，获取用户选择的文件列表
	$('#coverFile').on('change', function(e) {
		// 获取文件的列表数组
		var files = e.target.files;
		// 判断用户是否选择了文件
		if (files.length === 0) {
			return
		}

		//根据文件创建对应的url地址
		var newImgURL = URL.createObjectURL(files[0]);
		// 为裁剪区域重新设置图片
		$image
			.cropper('destroy')      // 销毁旧的裁剪区域
			.attr('src', newImgURL)  // 重新设置图片路径
			.cropper(options)        // 重新初始化裁剪区域
	});

	var art_state = '已发布';

	// 为存为草稿的按钮绑定点击事件处理函数
	$('#btnSave2').on('click', function() {
		art_state = '存为草稿';
	});

	// 为表单绑定submit提交事件
	$('#form-pub').on('submit', function(e) {
		// 1. 阻止表单的默认提交事件
		e.preventDefault();
		// 2. 基于form表单，快速创建一个FormData对象
		var fd = new FormData($(this)[0]);
		// 3. 将文章的发布状态追加到fd中
		fd.append('state', art_state);
		// 4. 将封面裁剪过后的图片输出为一个文件对象
		$image
			.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
				width: 400,
				height: 280
			})
			.toBlob(function(blob) {
				// 将 Canvas 画布上的内容，转化为文件对象
				// 得到文件对象后，进行后续的操作
				// 5.将文件对象存储到fd中
				fd.append('cover_img', blob);
				// 6. 发起ajax数据请求
				publishArticle(fd);
			});


		fd.forEach(function(v,k) {
			console.log(v,k);
		})
	});

	function publishArticle(fd) {
		console.log('11');

		$.ajax({
			method: 'POST',
			url: '/my/article/add',
			data: fd,
			// 注意：如果向服务器提交的是FormData格式的数据，
			// 必须添加一下两个配置项
			contentType: false,
			processData: false,
			success: function(res) {
				console.log('11');
				console.log(res);
				if(res.status !== 0) {
					return layer.msg('发布文章失败！');
				}

				layer.msg('发布文章成功！');


				// location.href= '../../../article/art_list.html';
			}
		})
	}



})