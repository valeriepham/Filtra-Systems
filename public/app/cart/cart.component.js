(function () {
  angular.module('cart', ['productsService'])
    .component('cart', {
      templateUrl: './app/cart/cart.html',
      controller: 'cartController'
    });
})();