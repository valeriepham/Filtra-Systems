var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
  model: String,
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
  },
  dimensions: Array,
  specifications: Array,
  img: String
})

var Product = mongoose.model('products', productSchema);

module.exports = Product;