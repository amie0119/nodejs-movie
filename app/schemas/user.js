//模式文件
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.pre('save', function(next){
  var user = this;
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else {
    this.meta.updateAt = Date.now();
  }
  //生成随机的盐 
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if (err) return next("error1" + err);

    bcrypt.hash(user.password, salt, function(err, hash){
      if (err) return next("error2" + err);

      user.password = hash;
      next();
    })
  })
})
//实例方法
UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if(err) return cb(err);

      cb(null, isMatch);
    })
  }
}
//静态方法
UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id,cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema;
