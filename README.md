#### 可配置的网络爬虫

	可以通过配置 spider.json 来获取json或者html对象。 version (0.0.2) 测试版
	

#####安装方式

	通过 npm install webspider 进行安装。
	
	
##### 使用简介


方式一、	


		webspider  ~/User/../../spider.json
	

方式二、	 

<pre>
	
	var spider = require('webspider');
	spider([{
		"description": "百度图片",
		"content": {
			"nid": ".data[0..n].abs"
		},
		"targetUrls": [
			"http://image.baidu.com/channel/listjson?fr=channel&tag1=%E7%BE%8E%E5%A5%B3&tag2=%E5%85%A8%E9%83%A8&sorttype=0"
		],
		"page": {
			"pageKey": "pn",
			"countKey": "rn",
			"count": 10,
			"start": 0,
			"end": 10,
			"type": "startIndex"
		},
		"pageType": "json"
	}]).on('data',function(data, config){
		
	}).on('end',function(err){
	
	}).excute();
			
</pre>	
##### spider.json配置
方式一使用配置
<pre>
	{
		"items": [{
			"description": "百度图片",
			"content": {
				"nid": ".data[0..n].abs"
			},
			"targetUrls": [
				"http://image.baidu.com/channel/listjson?fr=channel&tag1=%E7%BE%8E%E5%A5%B3&tag2=%E5%85%A8%E9%83%A8&sorttype=0"
			],
			"page": {
				"pageKey": "pn",
				"countKey": "rn",
				"count": 10,
				"start": 0,
				"end": 10,
				"type": "startIndex"
			},
			postUrl:'http://127.0.0.1/form/'
			"pageType": "json"
		}, {
			"description": "网易",
			"content": {
				"nid": ".hx"
			},
			"targetUrls": [
				"http://www.163.com/index.html"
			],
			"pageType": "html",
			"charset": "GBK"
		}],
		interval:600000
	}
</pre>

1. items [Array] 被爬网站的参数
	
	1.1  description [String] 被爬网站的简单描述
	
	1.2  content [JSON] 需要爬的内容的描述，如果是所爬的网页内容是json，则可配置成 '.data[0..n].abs';如果是html则可配置成 selector|method|attrname,例如： 获取选择器.hx对象的text可配置成:.hx|text,或许input的值可配置为 input|val,获取div的data-xx属性可配置为 div|attr|data-xxx
	
	1.3  targetUrls [Array] 被爬网站的url地址
	
	1.4  page [JSON] 上图配置可以理解成分页参数为 pn=(countKey*当前页数)&rn=10,如果不设置type，则理解为 pn=当前页数&rn=10
	
	1.5  postUrl [String] 每当一个content的内容被爬下来的时候就将content的内容提交给postUrl，不设置则在控制台显示。
	
	1.6  pageType [String] 设置被爬页面的type类型（html|json）,默认为html
	
	1.7  charset [String] 被爬网站的编码方式，默认为UTF-8
	
		
2. interval [Number] 每隔多少ms执行一次，不填则执行一次
	
	
		