var mongoose = require('mongoose');

var schema = mongoose.Schema({
  model: Number,
  title: String,
  description: String,
  qty: Number,
  series: String,
  pricing: {
    retail: Number
  },
  order_information: {
    bag_quantity: Number,
    bag_size: Number,
    material: String,
    max_pressure_psi: Number,
    connection: Number,
    connection_type: String
  }
})

var Product = mongoose.model('products', schema);

module.exports = Product;