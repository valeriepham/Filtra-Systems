(function () {
  angular.module('cart', ['cartService'])
    .component('cart', {
      templateUrl: './app/cart/cart.html',
      controller: 'cartController'
    });
})();