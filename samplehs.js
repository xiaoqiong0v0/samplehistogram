/**
 * afubek 2018/11/15
 * @function init(content,data,title) 初始化 
 * @param content html节点对象
 * @param data 图表数据 [{name:'',value:0}]
 * @param title 图表标题
 * @function refresh(data) 更新图表数据
 * @param data 图表数据 [{name:'',value:0}]
 * @function refreshNames(names) 更新左侧行名
 * @param names 左行名数组['a','b','c']
 * @function refreahValues(values) 更新右侧值
 * @param values 值数组[1,2,3]
 */

var SMHS = {
	data: {
		added: false,
		content: null,
		colors: [{
			r: 255,
			g: 0,
			b: 0
		}, {
			r: 255,
			g: 165,
			b: 0
		}, {
			r: 255,
			g: 255,
			b: 0
		}, {
			r: 0,
			g: 255,
			b: 0
		}, {
			r: 0,
			g: 127,
			b: 255
		}, {
			r: 0,
			g: 0,
			b: 255
		}, {
			r: 139,
			g: 0,
			b: 255
		}],
		head: "<style>.histogram-content {width: 100%;background-color: gray;border: 1px groove #333;border-radius: 5px;box-shadow: 0 0 15px #333;}.histogram-title {width: 100%;text-align: center;padding: 0.5em 0;font-size: 1.5em;font-weight: bold;border-bottom: 1px solid #333;}.histogram {display: flex;width: 100%;flex-direction: row;}.h-left {flex: 1;font-size: 1em;}.h-left ul {list-style-type: none;border-right: 1px solid #333;padding: 0.5em 0;text-align: right;}.h-left li {margin: 1em 0;height: 1.5em;}	.h-left li:after {float: right;display: block;content: '';width: 1em;height: 1px;background-color: purple;position: relative;top: 0.5em;background-color: rgba(33, 33, 33, 0.5);right: -0.5em;}.h-right {flex: 9;font-size: 1em;}.h-right ul {width: 100%;list-style-type: none;padding: 0.5em 0;margin-left: 0.8em;}.h-right li {text-align: left;margin: 1em 0;height: 1.5em;}.h-right span {display: block;float: left;width: 80%;min-width: 1%;max-width: 80%;height: 1em;background-color: red;margin-right: 1%;border: 1px solid #333;border-top: none;border-left: none;transition: width 2s, background-color 2s;-webkit-transition: width 2s, background-color 2s;-moz-transition: width 2s, background-color 2s;-ms-transition: width 2s, background-color 2s;}</style>",
		title: '==========',
		body: function() {
			var _this = this;
			var bd = "<div class=\"histogram-content\"><div class=\"histogram-title\">"
			bd += _this.title;
			bd += "</div><div class=\"histogram\"><div class=\"h-left\"><ul>"
			for(var i = 0; i < _this.names.length; i++) {
				bd += "<li>" + _this.names[i] + "</li>";
			}
			bd += "</ul></div><div class=\"h-right\"><ul>"
			for(var i = 0; i < _this.values.length; i++) {
				bd += "<li><span></span><i>" + _this.values[i] + "</i>";
			}
			bd += "</ul></div></div></div>";
			return bd;
		},
		spans: [],
		is: [],
		lis:[],
		values: [],
		names: [],
		data: []
	},
	//values=>{name:'',value:''}
	init: function(content, data, title) {
		if(undefined != content && '' != content) {
			var _this = this;
			if(false == _this.data.added) {
				_this.data.added = true;
				_this.data.data = data;
				for(var i = 0; i < data.length; i++) {
					_this.data.values.push(data[i].value);
					_this.data.names.push(data[i].name);
				}
				undefined != title && (_this.data.title = title);
				_this.data.content = content;
				document.head.innerHTML += _this.data.head;
				content.innerHTML = _this.data.body();
			}
			var items = content.getElementsByClassName('h-right')[0]
				.getElementsByTagName('ul')[0]
				.getElementsByTagName('li');
			_this.data.lis = content.getElementsByClassName('h-left')[0]
				.getElementsByTagName('ul')[0]
				.getElementsByTagName('li');
			if(undefined != items) {
				for(var i = 0; i < items.length; i++) {
					_this.data.spans.push(items[i].getElementsByTagName('span')[0]);
					_this.data.is.push(items[i].getElementsByTagName('i')[0])
				}
				setTimeout(function(){
					_this.refreshValues();
				}, 500);
			} else {
				setTimeout(_this.init(content, values), 200);
			}
		}
	}
	,
	refresh:function(data){
		var _this = this;
		var names = [];
		var values = [];
		for(var i = 0; i < data.length; i++) {
			values.push(data[i].value);
			names.push(data[i].name);
		}
		_this.refreshNames(names);
		_this.refreshValues(values);
	}
	,
	//values=>[1,2]
	refreshValues:function(values) {
		var _this = this;
		if(undefined == values) {
			values = _this.data.values;
		}else{
			_this.data.values = values;
		}
		var spans = _this.data.spans;
		var is = _this.data.is;
		var colors = _this.data.colors;
		var max = 0;
		var sorts = [];
		for(var i = 0; i < values.length; i++) {
			if(values[i] > max) {
				max = values[i];
			}
			sorts.push({
				index: i,
				value: values[i]
			})
		}
		for(var i = 0; i < values.length; i++) {
			spans[i].style.width = (values[i] / max) * 79 + '%';
			is[i].innerText = values[i];
		}
		sorts.sort(function(a, b) {
			if(a.value > b.value) {
				return -1;
			} else if(a.value < b.value) {
				return 1;
			} else {
				return 0;
			}
		});
		var color_p = 255/(sorts.length-7);
		for(var i = 0; i < sorts.length; i++) {
			var intI = Math.floor(i / 7);
			var mi = i % 7;
			if(intI == 0) {
				spans[sorts[i].index].style.backgroundColor = 'rgb(' + colors[mi].r + ',' + colors[mi].g + ',' + colors[mi].b + ')';
			} else {
				var r = colors[mi].r - colors[mi].r * color_p * intI / 255;
				var g = colors[mi].g - colors[mi].g * color_p * intI / 255;
				var b = colors[mi].b - colors[mi].b * color_p * intI / 255;
				r = Math.round(r);
				g = Math.round(g);
				b = Math.round(b);
				spans[sorts[i].index].style.backgroundColor = 'rgb(' + (r > 0 ? r : 0) + ',' + (g > 0 ? g : 0) + ',' + (b > 0 ? b : 0) + ')';
			}
		}
	},
	//names=>['A','B']
	refreshNames:function(names){
		var _this = this;
		if(undefined ==names){
			names =_this.data.names;
		}else{
			_this.data.names = names;
		}
		for(var i=0;i<_this.data.lis.length;i++){
			var item = _this.data.lis[i];
			item.innerText = names[i];
		}
	}
}