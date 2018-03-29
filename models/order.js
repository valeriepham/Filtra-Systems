let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  cart: {type: Object, required: true},
  address: {type: String, required: true},
  name: {type: String, required: true},
  paymentId: {type: String, required: true}
})

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;