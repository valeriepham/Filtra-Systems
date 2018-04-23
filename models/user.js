const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Order = require('./order');

const schema = mongoose.Schema({
  email: { type: String, require: true, trim: true, unique: true },
  password: { type: String, require: true },
  level: { type: Number, require: true, default: 0 },
  customer_id: { type: String, require: true, default: null},
});

schema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


schema.methods.pullOrders = function () {
  console.log('pullOrders is', this._id);
  return Order.find({ user: this._id }).exec(function (err, orders) {
    if (err) {
      console.log('Error when fetching products');
      return 'error';
    } else {
      console.log('orders fetched', orders);
      return orders;
    }
  });
};

const User = mongoose.model('users', schema);
module.exports = User;