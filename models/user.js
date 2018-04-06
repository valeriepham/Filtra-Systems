const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const schema = mongoose.Schema({  
  email: {type: String, require: true, trim: true, unique: true},
  password: {type: String, require: true},
  level: {type: Number ,require: false, default:0}
});

schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  
schema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

const User = mongoose.model('users', schema);
module.exports = User;