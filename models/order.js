let mongoose = require('mongoose');

let orderSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User'},
  cart: {type: Object, required: true, default: null},
  email: {type: String, required: true, default: 'Default Email'},
  shippingAddress: {
    street: {type: String, required: true, default: 'Default Address'},
    state: {type: String, required: true, default: 'Default State'},
    city: {type: String, required: true, default: 'Default City'},
    zip: {type: Number, required: true, default: 11111}
  },
  billingAddress: {
    street: {type: String, required: true, default: 'Default Address2'},
    state: {type: String, required: true, default: 'Default State2'},
    city: {type: String, required: true, default: 'Default City'},
    zip: {type: Number, required: true, default: 22222}
  },
  name: {type: String, required: true, default: 'Default Name'},
  paymentId: {type: String, required: true, default: 'Default Payment'},
  date: {type: Date, default: Date.now},
  shippingMethod: {type: Number, required: true, default: 0.15}
});

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;