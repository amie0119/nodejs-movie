var User = require('../models/user');

//signup
exports.signup = function(req, res) {
    var _user = req.body.user;
    /**
    var _user = req.body.user;
    req.param('user')这种方式和body都能拿到user 不同的是params是对不同方式的封装。路径/:id 可通过params.id?=111是req.query.id
    params是三种方式都可以 有优先级
    */
    //检测是否已经存在该用户名
    User.findOne({name: _user.name}, function(err, user) {
      if (err) {
      console.log("注册失败" + err);
      }
      if (user) {
        console.log("已经存在" + err);
        //return res.redirect('/');
        return res.redirect('/signin')
      } 
      else {
        var user = new User(_user);

        user.save(function(err, user){
          if (err) {
            console.log("存入失败" + err);
          }
          //res.redirect('/admin/userlist');
          res.redirect('/')
        })
      }
    })
  }
  //signin
  exports.signin = function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    //检测是否已经存在该用户名,不存在直接返回
    User.findOne({name: name}, function(err, user) {
      if (err) {
      console.log(err);
      }
      if (!user) {
        console.log('用户不存在！');
        return res.redirect('/');
      } 
      else {
        user.comparePassword(password, function(err, isMatch) {
          if (err) {
            console.log(err);
          }
          if (isMatch) {
            //保持用户状态
            req.session.user = user;
            return res.redirect('/');
          }
          else {
            console.log("password is invalid")
          }
        })
      }
    })
  }

  //logout
  exports.logout = function(req, res) {
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');
  }

  //userlist page
  exports.list = function(req, res) {
    User.fetch(function(err, users) {
      if (err) {
        console.log(err);
      }
      res.render('userlist', {
      title: '用户列表页',
      users: users
      })
    }) 
  }