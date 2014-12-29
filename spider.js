var request = require('request'),
	$ = require('jquery');
var iconv = require('iconv-lite');


//将url后面的参数转成json
var parseParams = function(paramsString) {
	var paramMap = {};
	if (paramsString) {
		var paramsKeyValueStringArray = paramsString.split("&");
		for (var i = 0, item; item = paramsKeyValueStringArray[i]; i++) {
			var temp = item.split("=");
			paramMap[temp[0]] = temp[1];
		}
	}
	return paramMap;
};


var mixedURL = function(targetUrl, params) {
	var urlArr = targetUrl.split('?'),
		url = urlArr[0],
		urlObj = {
			url: url,
			params: parseParams(urlArr[1])
		};
	params = $.extend(params, urlObj.params);
	var paramArr = [];
	for (var i in params) {
		paramArr.push(i + '=' + params[i]);
	}
	if (paramArr.length) {
		return urlObj.url + '?' + paramArr.join("&");
	}
	return urlObj.url;
}

var parseJSON = function(data, config, requestUrl, spider) {
	var targetData = [],
		content = config.content;
	for (var contentKey in content) {
		var handlers = content[contentKey].split('[0..n]');
		var tempData = data;
		var parseHandler = function(data, handlers, index) {
			var handler = handlers.shift();
			if (!handlers.length) {
				targetData[index] || (targetData[index] = {})
				if (handler == '') {
					targetData[index] = data;
				} else if (handler) {
					var value = eval("data" + handler);
					targetData[index][handler.substring(1)] = value || "";
				}
				return;
			}
			data = eval("data" + handler);
			for (var i = 0, itemData; itemData = data[i]; i++) {
				parseHandler(itemData, [].concat(handlers), i);
			}
		};
		parseHandler(data, handlers);
	}
	for (var i = 0, data; data = targetData[i]; i++) {
		spider.fire('data', [data, config]);
	}
};

var parseHTML = function(doc, config, requestUrl, spider) {
	var targetData = [],
		content = config.content;
	for (var contentKey in content) {
		var splitArr = content[contentKey].split('|'),
			value, selector = splitArr[0];
		var method = "text";
		splitArr[1] && (method = splitArr[1]);
		$(selector, doc).each(function(index, item) {
			if (splitArr[2]) {
				value = $(item)[method](splitArr[2]);
			} else {
				value = $(item)[method]();
			}
			targetData[index] || (targetData[index] = {});
			targetData[index][contentKey] = value;
		});
	}
	for (var i = 0, data; data = targetData[i]; i++) {
		spider.fire('data', [data, config]);
	}

};

var spider = function(configArr) {
	if (!(this instanceof spider)) {
		return new spider(configArr);
	}
	this.events = {};
	this.configArr = configArr;
};



spider.prototype = {
	excute: function(configArr) {
		var that = this;
		configArr = configArr || this.configArr;
		var len = configArr.length;
		var allCount = 0,
			backCount = 0; //已返回的请求数


		// 重新整理配置，将配置拆散
		var requestUrls = [];
		for (var i = 0, config; config = configArr[i]; i++) {
			var pageConfig = config.page;
			if (pageConfig) {
				for (var x = 0, targetUrl; targetUrl = config.targetUrls[x]; x++) {
					for (var j = pageConfig.start; j <= pageConfig.end; j++) {
						var extendOption = {};
						extendOption[pageConfig['pageKey']] = j;
						if (pageConfig['type'] == "startIndex") {
							extendOption[pageConfig.pageKey] = pageConfig.count * j;
						}
						if (pageConfig.countKey) {
							extendOption[pageConfig.countKey] = pageConfig.count;
						}
						var requestUrl = mixedURL(targetUrl, extendOption);
                        console.log(requestUrl);
						var obj = {
							config: config,
							url: requestUrl
						};
						requestUrls.push(obj);
					}
				}
			} else {
				for (var x = 0, targetUrl; targetUrl = config.targetUrls[x]; x++) {
					var obj = {
						config: config,
						url: targetUrl
					};
					requestUrls.push(obj);
				}
			}
		}


		err = [];
		var callBackIndex = 0; //请求回调计数
		for (var i = 0, requestObj; requestObj = requestUrls[i]; i++) {
			(function(url, config) {
				request({
					url: url,
					method: 'GET',
					encoding: 'binary'
				}, function(error, response, data) {
                    console.log(response);
                    console.log(error);
                    console.log(data);
					callBackIndex++;
					var hasError = false;
					try {
						data = iconv.decode(data, (config.charset || "utf-8")).toString();
					} catch (e) {
						err.push({
							"config": config,
							"e": e,
							"targetUrl": url
						});
					}
					if (config.pageType == 'json') {
						try {
							data = JSON.parse(data.toString());
						} catch (e) {
							err.push({
								"config": config,
								"e": e,
								"targetUrl": url
							});
							hasError = true;
						}
						if (!hasError) {
							parseJSON(data, config, url, that);
						}
					} else {
						var htmlNode;
						try {
							htmlNode = $(data.toString());
						} catch (e) {
							err.push({
								"config": config,
								"e": e,
								"targetUrl": url
							});
							hasError = true;
						}
						if (!hasError) {
							parseHTML(htmlNode, config, url, that);
						}
					}
					if (callBackIndex == requestUrls.length) {
						that.fire('end', [err]);
					}
				});
			})(requestObj.url, requestObj.config);

		}
        console.log(this);
		return this;
	},
	on: function(key, fn) {
		this.events[key] || (this.events[key] = []);
		this.events[key].push(fn);
		return this;
	},
	fire: function(key, params) {
		var callbacks = this.events[key] || [];
		for (var i = 0, fn; fn = callbacks[i]; i++) {
			fn.apply(this, params);
		}
	}
};

exports.spider = spider;
