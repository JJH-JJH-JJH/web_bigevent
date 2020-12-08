// 每次调用$.get()或者$.ajax()时，会先调用ajaxPrefilter这个函数
// 在这个函数中，我们可以拿到给ajax的配置对象
$.ajaxPrefilter(function(options) {
	// 在发起真正的ajax请求前， 统一拼接请求的根路径
	options.url = 'http://ajax.frontend.itheima.net' + options.url;

	// 统一为有权限的接口设置header请求头
	if (options.url.indexOf('/my/') !== -1) { // 利用字符串的索引判断是否含有'/my/'
		options.headers = {
			Authorization: localStorage.getItem('token') || ''
		}
	}

	// 全局统一挂载complete函数
	options.complete = function(res) {
		if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
			// 1. 强制清空token
			localStorage.removeItem('token');
			// 2. 强制跳转到登录页面
			location.href = './login.html';
		}
	}

});