$(function() {
	var layer = layui.layer;
	var form = layui.form;

	// 定义美化时间的过滤器
	template.defaults.imports.dataFormat = function(data) {
		const dt = new Date(data);

		var y = dt.getFullYear();
		var m = padZero(dt.getMonth() + 1);
		var d = padZero(dt.getDate());

		var hh = padZero(dt.getHours());
		var mm = padZero(dt.getMinutes());
		var ss = padZero(dt.getSeconds());

		return y + '-' + 'm' + '-' + 'd' + ' ' + 'hh' + ':' + 'mm' + ':' + 'ss';
	};

	// 定义补零函数
	function padZero(n) {
		return n > 9 ? n : '0' + n;
	}

//	定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
	var q = {
		pagenum: 1, //页码值
		pagesize: 2, // 每页显示几条数据，默认为2
		cate_id:  '', // 文章的分类id
		state: ''  // 文章的发布状态
	};


	initTable();
	initCate();

	// 获取文章列表数据的方法
	function initTable() {
		$.ajax({
			method: 'GET',
			url: '/my/article/list',
			data: q,
			success: function(res) {
				if(res.status !== 0) {
					return layer.msg('获取文章列表失败');
				}
				console.log(res);
				// 使用模板引擎渲染页面的数据
				var htmlStr = template('tpl-table', res);

				// console.log(htmlStr);
				$('tbody').html(htmlStr);
			}
		})
	};

	// 初始化文章分类的方法
	function initCate() {}
	$.ajax({
		method: 'GET',
		url: '/my/article/cates',
		success: function(res) {
			if (res.status !== 0) {
				return layer.msg('获取分类数据失败！');
			}
			// 调用模板引擎熏染分类的可选项
			console.log(res);
			var htmlStr = template('tpl-cate', res);
			// console.log(htmlStr);
			// console.log($('[name="cate_id"]').html());
			$('[name="cate_id"]').html(htmlStr);
			// console.log('--------');
			// console.log($('[name="cate_id"]').html());
			// 通知layui重新渲染表单区域的ui结构
			form.render();
		}
	});

	// 为筛选表单绑定sibmit()事件
	$('#form-search').on('submit', function(e) {
		e.preventDefault();
		//获取表单中选定项的值
		var cate_id = $('[name=cate_id]').val();
		var state = $('[name=state]').val();
		// 为查询参数对象q中对应的属性赋值
		q.cate_id = cate_id;
		q.state = state;
		// 根据最新的筛选条件，重新渲染表格的数据
		initTable();
	})
})