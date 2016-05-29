var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var logger = require('morgan');//express 4.x将logger迁出

var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

var mongoose = require('mongoose');
//var mongoStore = require('connect-mongo') (cookieSession);
var port = process.env.PORT || 3000;
var dbUrl = 'mongodb://localhost/movie';

var app = express();

mongoose.connect(dbUrl);

//设置视图的根目录、模块引擎
app.set('views', './app/views/pages');
app.set('view engine', 'jade');
//将表单数据进行格式化
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
//请求页面过来的请求中有样式文件过来去public中查找
//app.use(express.static(path.join(__dirname + 'public')));
//app.use('/public', express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use(cookieParser());
app.use(cookieSession({
  secret: 'movie',
  /*store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })*/
}));
app.locals.moment = require('moment');

if ('development' === app.get('env')) {
  app.set('showStackError', true);
  //app.use(logger(':method :url :status'));//这样可以打印出请求的具体信息
  app.locals.pretty = true;//现在网站发布的源码都是压缩过的 为了增强可读性
  mongoose.set('debug', true);
}

require('./config/routes.js')(app);//要传入app 就是向routes.js传入了express的实例

app.listen(port);
console.log('start!' +  port);
//在bower安装bootstrap的时候回查找是否有libs文件夹 有的话安装到libs下面 。bowerrc

