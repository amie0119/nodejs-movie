var _ = require('underscore');
var Index = require('../app/controller/index');
var User = require('../app/controller/user');
var Movie = require('../app/controller/movie');

module.exports = function(app){
  //pre handle user
  //本地存储一个user 不用每个页面都获取了
  app.use(function(req, res, next) {
    var _user = req.session.user;
      app.locals.user = _user;
      next(); 
  })
  //index page
  app.get('/', Index.index);

  //user
  app.post('/user/signup', User.signup);
  app.post('/user/signin', User.signin);
  app.get('/logout', User.logout);
  //用户列表 admin代表后台
  app.get('/admin/userlist', User.list);

  //detail page
  app.get('/movie/:id', Movie.detail);

  //admin
  app.get('/admin/update/:id', Movie.update);
  app.get('/admin/new', Movie.new);
  app.post('/admin/movie', Movie.save);
  app.get('/admin/list', Movie.list);
  app.delete('/admin/list', Movie.del);
}

