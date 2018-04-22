let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User'},
  cart: {type: Object, required: true, default: null},
  email: {type: String, required: true, default: 'Test Email'},
  shippingAddress: {
    street: {type: String, required: true, default: 'Test Address'},
    state: {type: String, required: true, default: 'Test State'},
    city: {type: String, required: true, default: 'Test City'},
    zip: {type: Number, required: true, default: 11111}
  },
  billingAddress: {
    street: {type: String, required: true, default: 'Test Address2'},
    state: {type: String, required: true, default: 'Test State2'},
    city: {type: String, required: true, default: 'Test City'},
    zip: {type: Number, required: true, default: 22222}
  },
  name: {type: String, required: true, default: 'Test Name'},
  paymentId: {type: String, required: true, default: 'Test Payment'},
  date: {type: Date, default: Date.now}
});

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;