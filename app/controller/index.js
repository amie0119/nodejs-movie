var Movie = require('../models/movie');
//负责和首页的交互
//index page
exports.index = function(req, res) {
    //测试session是否存在 express 4.x自动做了持久化
    //console.log("user in session" + req.session.user);
    
    Movie.fetch(function(err, movies) {
      if (err) {
        console.log(err);
      }
      res.render('index', {
        title: '首页',
        movies: movies,
        //user: _user
      })
    })
  }