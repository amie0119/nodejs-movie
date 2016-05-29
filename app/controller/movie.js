var _ = require('underscore');
var Movie = require('../models/movie');
  //detail page
  exports.detail = function(req, res) {
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
  }

  //adimin new movie page
  exports.new = function(req, res) {
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
  }

  //admin update movie
  exports.update = function(req, res) {
    var id = req.params.id;

    if (id) {
      Movie.findById(id, function(err, movie) {
        res.render('admin', {//直接渲染
          title: '后台更新页',
          movie: movie
        })
      })
    }
  }

  //admin post movie
  exports.save = function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (id !== 'undefined') { //在数据库中已经存在进行更新
      Movie.findById(id, function(err, movie) {
        if (err) {
          console.log(err);
        }
        //用新的字段替换老的字段
        _movie = _.extend(movie, movieObj);
        _movie.save(function(err, movie) {
          if (err) {
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
        if (err) {
            console.log(err);
          }
        res.redirect('/movie/' + movie._id);
      })
    }
  }

  //list page
  exports.list = function(req, res) {
    Movie.fetch(function(err, movies) {
      if (err) {
        console.log(err);
      }
      res.render('list', {
      title: '列表页',
      movies: movies
      })
    }) 
  }

  exports.del = function(req, res) {
    var id = req.query.id;

    if (id) {
      Movie.remove({_id: id}, function(err, movie) {
        if (err) {
          console.log(err);
        }
        else {
          res.json({success: 1});
        }
      })
    }
  }
