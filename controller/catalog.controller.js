const PRODUCT = require('../models/product');

function allProducts(req, res) {
  PRODUCT.distinct( "series" ).exec(function (err, serieslist) {
    if (err) {
      console.log('Error creating distinct list');
    }
    else {
      console.log(serieslist);
      let series = []
      for (let serie of serieslist) {
        PRODUCT.findOne({ 'series': serie }).exec(function (err, product) {
          if (err) {
            console.log('Error finding product for series: ' + serie);
          }
          else {
            console.log(product.series, ' appended');
            series.push(product);
          }
        });
      }
      console.log(series);
      res.render('catalog', {products: serieslist});
    }
  });
};

function findSeries(req, res) {
  let series = req.params.series;
  PRODUCT.find({ 'series': series }).exec(function (err, product) {
    console.log(series);
    if (err) {
      console.log('Error when fetching product');
      res.render('500', { err: err });
    }
    else {
      res.render('products', {
        title: 'Product Page',
        products: product
      });
    }
  });
};

module.exports = { allProducts, findSeries };