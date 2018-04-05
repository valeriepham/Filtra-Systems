(function () {
  angular.module('cart')
    .component('cartProduct', {
      templateUrl: './app/cart/product.html',
      controller: 'cartProductController',
    });
})();