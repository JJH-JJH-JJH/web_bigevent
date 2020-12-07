// 每次调用$.get()或者$.ajax()时，会先调用ajaxPrefilter这个函数
// 在这个函数中，我们可以拿到给ajax的配置对象
$.ajaxPrefilter(function(options) {
	console.log(options.url);
	options.url = 'http://ajax.frontend.itheima.net' + options.url;
	console.log(options.url);
})