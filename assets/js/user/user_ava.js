$(function() {
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

	// 为上传按钮添加点击方法
	$('#btnChooseImage').on('click', function() {
		$('#file').click();
		console.log('点击了上传按钮');
	});

	// 为文件选择框添加change事件
	$('#file').on('change', function(e) {
		var filelist = e.target.files;
		if(filelist.length === 0) {
			return layer.msg('请选择图片！');
		}
		// 1. 拿到用户选择的文件
		var file = filelist[0];
		// 2.将文件转换为路径
		var ImgURL = URL.createObjectURL(file);
		// 3.重新初始化裁剪区域
		$image.cropper('destroy').attr('src', ImgURL).cropper(options);
	});

	// 为确定按钮绑定点击事件
	$('#btnUpload').on('click', function() {
		// 1. 拿到用户裁剪之后的图像
		var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
				width: 100,
				height: 100
			}).toDataURL('image/png');       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
		// 2.调用接口，讲图片上传到服务器
		$.ajax({
			method: 'POST',
			url: '/my/update/avatar',
			data: {
				avatar: dataURL
			},
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg('更换头像失败！');
				}
				layer.msg('更换头像成功！');
				window.parent.getUserInfo();
			}
		})
	})
});

