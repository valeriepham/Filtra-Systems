(function () {
  angular.module('cart')
    .controller('cartController', cartController);

  cartController.$inject = ['$log', '$http', 'cartService']
  function cartController($log, $http, cartService) {
    let vm = this;
    getCart()
    vm.name = 'cart';
    vm.options = {

    };
    vm.cart;
    vm.remove = function (id) {

    }
    vm.update = function () {
      cartService.update().then(function(data, err) {
        vm.name = data;
      })
    }
    function getCart() {
      cartService.get().then(function (data, err) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
          vm.cart = data;
        }
      });
    }
  }
})();