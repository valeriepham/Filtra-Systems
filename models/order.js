let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User'},
  cart: {type: Object, required: true},
  shippingAddress: {
    street: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: Number, required: true}
  },
  billingAddress: {
    street: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: Number, required: true}
  },
  name: {type: String, required: true},
  paymentId: {type: String, required: true}
})

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;