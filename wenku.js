
	var spider = require('webspider').spider;
    var $=require('jquery');
    var fs=require('fs')

    var iconv = require('iconv-lite');


    var SAVE_DIR="/mnt/edriver/wenku";

    var START_DOWNLOAD=true;

    var PAGE_COUNT=10;

    var PROJECT_DRI='';

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

        var cmd="curl 'https://passport.baidu.com/v2/api/?login' -H 'Host: passport.baidu.com' -H 'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0 FirePHP/0.7.4' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' -H 'Accept-Language: zh-cn,en-us;q=0.8,zh;q=0.5,en;q=0.3' -H 'Accept-Encoding: gzip, deflate' -H 'Referer: http://www.baidu.com/' -H 'Cookie: BAIDUID=CA53CB5B1D235F579E69C351662299EF:FG=1; SAVEUSERID=016abbe84287029594dc47a44192d1bfd71c4d; BDUT=9kb58E8D70292C5A18EC3D5BA1633D634DDE139dc2c364b6; HOSUPPORT=1; SSUDB=FGeDFtZFVSbn4wLXMwQlhRMVl6U09OSERzeWZOVUp2czZyYWEtfmFGMVZJMlZSQVFBQUFBJCQAAAAAAAAAAAEAAAAJD94Ac19qcXpoYW5nAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFWWPVFVlj1Rcm; USERNAMETYPE=2; UBI=fi_PncwhpxZ%7ETaF7xmul3TI561opblSlCocb2GHf1UPMgYJNPjogmo0DxazRvFzdoZyJKPn4fuBjdxwa5Ac0X8ik7panbGVK3f-s719kPnl-5VwW3rBsVl%7ENEJRjbF6Rgj11wtxGYYXPcuFxnmnigAPXyYN0QcBt12JnBexC3nD5R2fR%7EqnIY9rjgU4bD4neMnwZ1L0EJPPQdinpHJU2u6RVBh%7EZtxvpd9FLQ__; HISTORY=be3fa782f727994639a667ef1dd3560843388b0441df20a010c08a401bed0befb4e656986c4bef0867e56f; Hm_lvt_90056b3f84f90da57dc0f40150f005d5=1402575863,1402575920; NEWUSER=1; NBID=DD1EEEF675CDA0730E787A7DDE4DDEF7:FG=1; BAIDU_WISE_UID=0405556EEDB88B6DDCC9279866E73EAC; BAIDU_WAP_WENKU=512fbc545f0e7cd184253687_1_1_4500_3_1_1_touch_wk; H_PS_PSSID=6624_1469_5223_6995_6506_7056_7038_4759_6018_6999_6861_7134_7050_6983_7107' -H 'x-insight: activate' -H 'Connection: keep-alive' -H 'Content-Type: application/x-www-form-urlencoded' --data 'staticpage=http%3A%2F%2Fwww.baidu.com%2Fcache%2Fuser%2Fhtml%2Fv3Jump.html&charset=UTF-8&token=fa021b561520ee9021c51b75c5fbbd4d&tpl=mn&subpro=&apiver=v3&tt=1402897265582&codestring=&safeflg=0&u=http%3A%2F%2Fwww.baidu.com%2F&isPhone=false&quick_user=0&logintype=dialogLogin&logLoginType=pc_loginDialog&loginmerge=true&splogin=newuser&username=easyphp%40163.com&password=UXQSi0SzRMjGFQvpDiJ1INyIsw5KeNNf7p1K8ADwSiSbxNc3%2BGgsMnRv43O%2F6qO8MBAHZhv4QOG27Ehx2Hh8ME%2BOZR1x2HDJPM%2B9R2YWUVOvaK1hnu%2FVQYRreAEFdgkoookk68gmNmJEG7q8eiW2k4wbn9kgFi%2BZHKsE9yOuhq0%3D&verifycode=&mem_pass=on&rsakey=WtWXjCrYcjwepH72UrZCWoPh9QEJETNh&crypttype=12&ppui_logintime=9901&callback=parent.bd__pcbs__6am791'";


        var cmd=cmd+" -c ./cookie.txt ";


        exec(cmd,function(err,stdout,stderr){


          //  console.log(err,stdout,stderr);
            callback();

        });

    }


var START_INDEX=0;

function process_arg(){
 PAGE_COUNT=  process.argv[3]?process.argv[3]:10;

 if(PAGE_COUNT.split(',').length>1){
    var argv= PAGE_COUNT.split(',');
    START_INDEX=argv[0];
    PAGE_COUNT=argv[1];
 } else {
   PAGE_COUNT=parseInt(PAGE_COUNT);
 }
 login(function(){
       webcatch(process.argv[2],parseInt( START_INDEX));
 })



 PROJECT_DRI=  process.argv[4]?'/'+process.argv[4]:'';

 SAVE_DIR+=PROJECT_DRI;

 console.log("保存目录:"+SAVE_DIR);

 fs.exists(SAVE_DIR,function(exists){
     if(!exists){
        fs.mkdir(SAVE_DIR,function(create){
          if(create) {
            console.log('创建目录:'+SAVE_DIR);
          }
        })
     }
 })
}

process_arg();
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
        txt=txt.replace(/\:|\"|\|\<\>\*|\.|\?/ig,'');
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


        var fn= '"'+SAVE_DIR+'/' + title+'.'+ext+'"';


      var curl='curl  -b ./cookie.txt "http://wenku.baidu.com/user/submit/download" --data "'+ pd+'" -L -o '+ fn;

            //console.log(curl);

            fj={'file':fn,'cmd':curl}

           GURLS.push(fj);

           if(START_DOWNLOAD) {
             download();
             START_DOWNLOAD=false;
           }


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



var Counter=(function(){



    var i=0;

    function count(){
        return ++i;
    }


    return {'count':count}


})();




function init(){
    setTimeout(function interval(){
        download();
    },1000*10);
}



function download(){


    //login(function(){

    //    if(GURLS.length>0) {
    //        var cmd= GURLS.shift();
    //        console.log(cmd);
    //        exec(cmd,function(err,stdout,stderr){
    //            download();
    //        });


    //    }
    //})


    if(GURLS.length>0) {
        var cmd= GURLS.shift();


        console.log(cmd);
        fs.exists(cmd.file.replace(/^\"|\"$/ig,''),function(exists){
              //  console.log(exists);
            if(!exists) {
                exec(cmd.cmd,function(err,stdout,stderr){
                    console.log(stderr);
                    console.log("完成:"+Counter.count());
                    setTimeout(function(){
                        download()
                    },1000*5);
                }
                );
            } else {
                download();
            }
        })
    } else {
      START_DOWNLOAD=true;
    }

}

