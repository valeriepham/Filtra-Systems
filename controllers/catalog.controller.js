const PRODUCT = require('../models/product');

function allSeries(req, res) {
  PRODUCT.distinct("series").exec(function (err, seriesList) {
    if (err) {
      console.log('Error creating distinct list');
    }
    else {
      let chunks = [];
      let chunkSize = 2;
      for (let i = 0; i < seriesList.length; i += chunkSize) {
        chunks.push(seriesList.slice(i, i + chunkSize));
      }
      console.log(seriesList);
      console.log(chunks);
      res.render('catalog', { seriesList: seriesList, chunks: chunks });
    }
  });
}

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
}

module.exports = { allSeries, findSeries };