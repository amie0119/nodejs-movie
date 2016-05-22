var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie')
var User = require('./models/user')
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/movie')
//设置视图的根目录、模块引擎
app.set('views', './views/pages');
app.set('view engine', 'jade');
//将表单数据进行格式化
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
//请求页面过来的请求中有样式文件过来去public中查找
//app.use(express.static(path.join(__dirname + 'public')));
//app.use('/public', express.static(__dirname + '/public'));
app.use(express.static('public'));
app.locals.moment = require('moment');
app.listen(port);

console.log('start!' +  port);
//在bower安装bootstrap的时候回查找是否有libs文件夹 有的话安装到libs下面 。bowerrc

//index page
app.get('/', function(req, res) {
  Movie.fetch(function(err, movies) {
    if(err) {
      console.log(err);
    }
    res.render('index', {
      title: '首页',
      movies: movies
    })
  })
})
//signup
app.post('/user/signup', function(req,res) {
  var _user = req.body.user;
  //var _user = req.body.user;
  //req.param('user')这种方式和body都能拿到user 不同的是params是对不同方式的封装。路径/:id 可通过params.id?=111是req.query.id
  //params是三种方式都可以 有优先级
  var user = new User(_user);
  //检测是否已经存在该用户名
  User.find({name: _user.name}, function(err, user) {
    if(err) {
    console.log(err);
    }
    if(user) {
      return res.redirect('/');
    } 
    else {
      user.save(function(err, user){
        if(err) {
          console.log("signup" + err);
        }
        res.redirect('/admin/userlist');
      })
    }
  })
})

//userlist page
app.get('/admin/userlist', function(req, res) {
  User.fetch(function(err, users) {
    if(err) {
      console.log(err);
    }
    res.render('userlist', {
    title: '用户列表页',
    users: users
    })
  }) 
})

//detail page
app.get('/movie/:id', function(req, res) {
  var id = req.params.id;
  
  Movie.findById(id, function(err, movie) {
    if(err) {
      console.log(err);
    }
    res.render('detail', {
      title: '详情' + movie.title,
      movie: movie
    })
  })  
})

//adimin page
app.get('/admin/movie', function(req, res) {
  res.render('admin', {
    title: '后台录入页',
    movie: {
      director: '',
      country: '',
      title: '',
      year: '',
      poster: '',
      language: '',
      flash: '',
      summary: ''
    }
  })
})
//admin update movie
app.get('/admin/update/:id', function(req, res) {
  var id = req.params.id;

  if(id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {//直接渲染
        title: '后台更新页',
        movie: movie
      })
    })
  }
})
//admin post movie
app.post('/admin/movie/new', function(req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;

  if(id !== 'undefined') { //在数据库中已经存在进行更新
    Movie.findById(id, function(err, movie) {
      if(err) {
        console.log(err);
      }
      //用新的字段替换老的字段
      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie) {
        if(err) {
          console.log(err);
        }

        res.redirect('/movie/' + movie._id);
      })
    })
  }
  else {
    _movie = new Movie({
      director:movieObj.director,
      title:movieObj.title,
      country:movieObj.country,
      language:movieObj.language,
      year:movieObj.year,
      poster:movieObj.poster,
      summar:movieObj.summary,
      flash:movieObj.flash
    })

    _movie.save(function(err, movie){
      if(err) {
          console.log(err);
        }
      res.redirect('/movie/' + movie._id);
    })
  }
})

//list page
app.get('/admin/list', function(req, res) {
  Movie.fetch(function(err, movies) {
    if(err) {
      console.log(err);
    }
    res.render('list', {
    title: '列表页',
    movies: movies
    })
  }) 
})

app.delete('/admin/list', function(req, res) {
  var id = req.query.id;

  if(id) {
    Movie.remove({_id: id}, function(err, movie) {
      if (err) {
        console.log(err);
      }
      else {
        res.json({success: 1});
      }
    })
  }
})
