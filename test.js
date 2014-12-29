
	var spider = require('webspider').spider;
    var $=require('jquery');

    var iconv = require('iconv-lite');


    var SAVE_DIR="/mnt/edriver/wenku";



    var PAGE_COUNT=10;



    var GURLS=[];


    function exec(cmd,cb){
        var exec = require('child_process').exec,
            child;
        child = exec(cmd,
                function (error, stdout, stderr) {
                    if(!error) {
                        cb(error,stdout,stderr);
                    } else {
                        cb(error,stdout,stderr);
                    }
                })
    }


    function login(callback){

        var cmd="curl 'https://passport.baidu.com/v2/api/?login' -H 'Host: passport.baidu.com' -H 'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0 FirePHP/0.7.4' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' -H 'Accept-Language: zh-cn,en-us;q=0.8,zh;q=0.5,en;q=0.3' -H 'Accept-Encoding: gzip, deflate' -H 'Referer: http://wenku.baidu.com/?email=easyphp@163.com&username=&tpl=do&errno=0&auth=&nu_token=62ec646766646661236e62795e716979c149&displayname=ea...p@163.com' -H 'Cookie: BAIDUID=CA53CB5B1D235F579E69C351662299EF:FG=1; SAVEUSERID=016abbe84287029594dc47a44192d1bfd71c4d; BDUT=9kb58E8D70292C5A18EC3D5BA1633D634DDE139dc2c364b6; HOSUPPORT=1; SSUDB=FGeDFtZFVSbn4wLXMwQlhRMVl6U09OSERzeWZOVUp2czZyYWEtfmFGMVZJMlZSQVFBQUFBJCQAAAAAAAAAAAEAAAAJD94Ac19qcXpoYW5nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFWWPVFVlj1Rcm; USERNAMETYPE=2; UBI=fi_PncwhpxZ%7ETaBBC340Ea3SGLySyItfem-fDjispn1puLAMIBfNNiEKwCRtXiQI0xEPTnyqmowK7XPqPt5nvDODZq-o8Imz9FCPGbMA5n3D4J-HcHj47eRUVZClWD-3NXk0i0rLNAmhYfYfm%7EXQnd68ocr-Qvn%7ExYOXgNXRZ6HTmA7z0szeSnfzK6vz3tUnAv2R-gMM9j5JoJO4iKEfvSsAGmv33t%7EWdI7SQ__; HISTORY=be3fa782f727994639a667ef1dd3560843388b0441df20a010c08a401bed0befb4e656986c4bef0867e56f; H_PS_PSSID=6624_7033_1469_5223_6995_6506_7056_7038_4759_6018_6999_7050_6983; Hm_lvt_90056b3f84f90da57dc0f40150f005d5=1402575863,1402575920; Hm_lpvt_90056b3f84f90da57dc0f40150f005d5=1402575920; NEWUSER=1' -H 'x-insight: activate' -H 'Connection: keep-alive' -H 'Content-Type: application/x-www-form-urlencoded' --data 'staticpage=http%3A%2F%2Fwenku.baidu.com%2Fstatic%2Fcommon%2Fhtml%2Fv3Jump.html&charset=gbk&token=6f20a05ceb20ad36a10371b4931e3d7e&tpl=do&subpro=&apiver=v3&tt=1402576040928&codestring=&safeflg=0&u=http%3A%2F%2Fwenku.baidu.com%2F%3Femail%3Deasyphp%40163.com%26username%3D%26tpl%3Ddo%26errno%3D0%26auth%3D%26nu_token%3D62ec646766646661236e62795e716979c149%26displayname%3Dea...p%40163.com&isPhone=&quick_user=0&logintype=dialogLogin&logLoginType=pc_loginDialog&loginmerge=true&splogin=newuser&username=easyphp%40163.com&password=pEiZChpQ9gPXg0AizsBU%2F0C1k%2B3KYitJAbh00S4vOxpMXpaXMSnmzjjOv5%2FHVevI8GXVvMloAsbn1O66r%2BWyGL8jUsyqZvYzIRKb8M2ZePeJg9QQd%2BUfm541pb82UVSKZxCGc3%2FsfoDnjRZzOaPTP8OuPzqKpe8tDFtWUzYQlZ8%3D&verifycode=&mem_pass=on&rsakey=mUNUzaADr1PDGdbtbWFXMmKDywcSuqNj&crypttype=12&ppui_logintime=15914&callback=parent.bd__pcbs__ra4znm'";


        exec(cmd,function(err,stdout,stderr){


           // console.log(err,stdout,stderr);
            callback();

        });

    }



 PAGE_COUNT=  process.argv[3]?process.argv[3]:10;

 login(function(){
       webcatch(process.argv[2],0);
 })
   function webcatch(key,page) {

       var __url="http://wenku.baidu.com/search?word="+ encodeURIComponent(key) +"&lm=0&od=0&pn="+parseInt( page*10)
           console.log(__url);

	spider([{
			"description": "网易",
			"content": {
				"nid": "dl|html"
			},
			"targetUrls": [
				"http://wenku.baidu.com/search?word="+ encodeURIComponent(key) +"&lm=0&od=0&pn="+parseInt( page*10)
			],
			"pageType": "html",
			"charset": "gbk"
	}]).on('data',function(data, config){

        //console.log(data);


       var txt= $(':contains("0下载券")',$(data.nid));

       if(txt.length>0) {
        var txt= $.trim($('.fl>a',$(data.nid)).text());
        var url= $('.fl>a',$(data.nid)).attr('href');
        var ext= $('.ic',$(data.nid)).attr('title');


		txt= iconv.encode(txt,"utf-8").toString();
        txt=txt.replace(/\./ig,'')
        console.log(txt);

        (function(title,url,ext){

        exec('curl -b cookie.txt "'+ url+'"',function(err,stdout,stderr){

            var data=$("form[name=downloadForm]",$(stdout)).html();


            if(!data){
                return;
            }
        var pd='';
          var m=  data.match(/name="(\w+)"\s*value="(\w+)"/ig);

          //console.log(m);
          for(var i=0;i<m.length;i++)
        {
           var item= m[i].replace(/name\=|value\=|\"/ig,'').replace(/\s+/ig,'=');
           pd+=item+'&'
        }


      var curl='curl  -b ./cookie.txt "http://wenku.baidu.com/user/submit/download" --data "'+ pd+'"'+ ' -L -o  ."'+SAVE_DIR+'/' + title+'.'+ext+'"';

            //console.log(curl);

           GURLS.push(curl);


            //exec(curl + ' -c cookie.txt',function(err,stdout,stderr){

            //    console.log(err);

            //})


        })


            })(txt,url,ext)
       }

	}).on('end',function(err){

        if(page<PAGE_COUNT) {
             webcatch(key,page+1);
        }

	}).excute();

   }






setTimeout(function interval(){

download();

},10000);


function download(){


    login(function(){

        if(GURLS.length>0) {
            var cmd= GURLS.shift();
            console.log(cmd);
            exec(cmd,function(err,stdout,stderr){
                download();
            });


        }
    })



}

