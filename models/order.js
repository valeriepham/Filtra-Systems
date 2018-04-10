let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User'},
  cart: {type: Object, required: true, default: null},
  shippingAddress: {
    street: {type: String, required: true, default: 'Test Street'},
    state: {type: String, required: true, default: 'Test State'},
    zip: {type: Number, required: true, default: 11111}
  },
  billingAddress: {
    street: {type: String, required: true, default: 'Test Street2'},
    state: {type: String, required: true, default: 'Test State2'},
    zip: {type: Number, required: true, default: 22222}
  },
  name: {type: String, required: true, default: 'Test Name'},
  paymentId: {type: String, required: true, default: 'Test PaymentID'},
  date: { type: Date, default: Date.now },
});

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;