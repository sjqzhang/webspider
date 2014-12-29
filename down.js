
	var spider = require('webspider').spider;
    var $=require('jquery');

    //console.dir(spider);
    //return;

	spider([{
			"description": "网易",
			"content": {
				"nid": "form[name=downloadForm]|html"
			},
			"targetUrls": [
				"http://wenku.baidu.com/view/0100d40c52ea551810a68724.html"
			],
			"pageType": "html",
			"charset": "gbk"
	}]).on('data',function(data, config){


        var pd='';
          var m=  data.nid.match(/name="(\w+)"\s*value="(\w+)"/ig);

          console.log(m);
          for(var i=0;i<m.length;i++)
        {
           var item= m[i].replace(/name\=|value\=|\"/ig,'').replace(/\s+/ig,'=');
           pd+=item+'&'
        }


      var curl='curl "http://wenku.baidu.com/user/submit/download" -H "Cookie: BAIDUID=C11930F744F172C982BEF6EBA35F2010:FG=1; BDUSS=VNdGxsR1h2NTNKQnljbFpGb2VSUkJKTDVZMU1PNlhMOVQtNFJOZnNrbGpjWTVUQVFBQUFBJCQAAAAAAAAAAAEAAAAJD94Ac19qcXpoYW5nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGPkZlNj5GZTTn; bdshare_firstime=1399429314830; grownupTaskFinish=s_jqzhang"%"7C0; viewedPg=cb9e773410661ed9ad51f3b6"%"3D9"%"7C0"%"26a91469d9a58da0116c17493a"%"3D5"%"7C0"%"26b9cc985a3b3567ec102d8a89"%"3D7"%"7C0"%"269cd6f92f0066f5335a81210b"%"3D4"%"7C0"%"26a1c6254dc850ad02de80416b"%"3D1"%"7C0"%"26f5d1549151e79b89680226b5"%"3D1"%"7C0"%"269a41dcc2aa00b52acfc7ca91"%"3D11"%"7C0"%"26236b726db84ae45c3b358c7a"%"3D3"%"7C-1342"%"269309f50b763231126edb11ce"%"3D6"%"7C0"%"26e872856e011ca300a6c39042"%"3D7"%"7C0; BDSFRCVID=7gLsJeCCxG0B8vJ6r1vZXMpN-hMAhrAsu_sx3J; H_BDCLCKID_SF=tRk8oDtXtDvbfP0k-4QEbbQH-UnLq5bMBT7Z0lOnMp02ECnCy6jKDJKlW-cjWDr3Bm63Qqjbbx75JKO_e4bK-Tr0jNAJtf5; NBID=6C7D0913BB43838FFEA82365471EE760:FG=1; WK_daily_signIn=735f6a717a68616e67; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; H_PS_PSSID=6194_1439_5224_6505_7057_7037_4760_6018_6998_6931_6861_6983; Hm_lvt_d8bfb560f8d03bbefc9bdecafc4a4bf6=1401945805,1402378670,1402534864,1402547274; Hm_lpvt_d8bfb560f8d03bbefc9bdecafc4a4bf6=1402557028" -H "Origin: http://wenku.baidu.com" -H "Accept-Encoding: gzip,deflate,sdch" -H "Accept-Language: zh-CN,zh;q=0.8" -H "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36" -H "Content-Type: application/x-www-form-urlencoded" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" -H "Cache-Control: max-age=0" -H "Referer: http://wenku.baidu.com/view/0100d40c52ea551810a68724.html" -H "Connection: keep-alive"';

    console.log(curl+' --data "'+ pd+ '" -L > aa.pdf');

	}).on('end',function(err){
        //console.log(err);

	}).excute();

