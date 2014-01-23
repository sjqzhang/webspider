#!/usr/bin/env node

var fs = require('fs');
var request = require('request');
var spider = require('./spider.js').spider;

var argv = process.argv.splice(2);
var configPath = argv[0] || process.env.NODE_PATH + 'node-spider/spider.json';


fs.readFile(configPath, 'UTF-8', function(err, data) {
	var config = JSON.parse(data.toString()),
		interval = config.interval;
	var spiderObj = spider(config.items).on('data', function(data, config) {
		if (config.postUrl) {
			request.post(config.postUrl, {
				form: data
			}, function(err) {
				console.log("无法提交到指定的postUrl");
				console.log(data);
				console.log(err);
			});
		} else {
			console.log(data);
		}
	}).on('end', function(errs) {
		var err = errs.shift();
		while (err) {
			err = errs.shift();
			console.log(err);
		}
		if (interval) {
			setTimeout(function() {
				spiderObj.excute();
			}, interval);
		}
	}).excute();

});