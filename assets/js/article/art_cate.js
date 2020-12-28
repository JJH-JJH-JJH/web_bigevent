$(function() {
	var layer = layui.layer;
	var form = layui.form;

	initArtCateList();



	// 获取文章分类的列表
	function initArtCateList() {
		$.ajax({
			method: 'GET',
			url: '/my/article/cates',
			success: function(res) {
				// console.log(res);
				var htmlStr = template('tpl-table', res);
				// console.log(htmlStr);
				$('tbody').html(htmlStr)
			}
		})
	}

	// 为添加按钮增加一个点击事件
	var indexAdd = null;
	$('#btnAddCate').on('click', function() {
		indexAdd = layer.open({
			type: 1,
			area: ['500px', '300px'],
			title: '添加文章分类',
			content: $('#dialog-add').html()
		})
	});

	// 通过代理的形式，为form-add表单添加submit事件
	// 因为该表单是动态添加的
	$('body').on('submit', '#form-add', function(e) {
		e.preventDefault();
		// console.log('ok');
		$.ajax({
			method: 'POST',
			url: '/my/article/addcates',
			data: $(this).serialize(),
			success: function(res) {
				// console.log(res);
				if (res.status !== 0) {
					return layer.msg('新增分类失败！');
				}
				initArtCateList();
				layer.msg('新增分类成功！');
				// 根据索引关闭对应的弹出层
				layer.close(indexAdd);
			}
		})
	});

	// 用代理的方式，为编辑按钮绑定点击事件
	var indexEdit = null;
	$('tbody').on('click', '.btn-edit', function() {
		// 弹出一个修改文章信息的层
		indexEdit = layer.open({
			type: 1,
			area: ['500px', '300px'],
			title: '修改文章分类',
			content: $('#dialog-edit').html()
		});
		var id = $(this).attr('data-id');
		// 发起请求，获取对应分类数据
		$.ajax({
			method: 'GET',
			url: '/my/article/cates/' + id,
			success: function(res) {
				console.log(res.data);
				form.val('form-edit', res.data)
			}
		})
	});

	// 通过代理的形式，为修该分类的表单添加submit事件
	$('body').on('submit', '#form-edit', function(e) {
		e.preventDefault();
		$.ajax({
			method: 'POST',
			url: '/my/article/updatecate',
			data: $(this).serialize(),
			success: function(res) {
				console.log(res);
				if(res.status !== 0) {
					return layer.msg('更新分类数据失败！');
				}
				layer.msg('更新分类数据成功！');
				layer.close(indexEdit);
				// 更新表单
				initArtCateList();
			}
		})
	});

	// 通过代理的形式为删除按钮绑定点击事件
	$('body').on('click', '.btn-delete', function() {
		var id = $(this).attr('data-id');
		// 弹出询问是否删除的layer层
		layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
			//do something
			$.ajax({
				method: 'GET',
				url: '/my/article/deletecate/' + id,
				success: function(res) {
					if(res.status !== 0) {
						return layer.msg('删除分类失败！');
					}
					layer.msg('删除分类成功！');
					layer.close(index);
					initArtCateList();
				}
			});

		});
	})


});