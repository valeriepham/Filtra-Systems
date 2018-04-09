(function () {
  angular.module('cart')
    .controller('cartController', cartController);

  cartController.$inject = ['$log', '$http', 'cartService'];
  function cartController($log, $http, cartService) {
    let vm = this;
    getCart();
    vm.name = 'cart';
    vm.options = {

    };
    vm.cart;
    vm.remove = remove;
    vm.update = update;
    vm.checkout = checkout;
    
    function remove() {

    }
    function update() {
      cartService.update(vm.cart);
    }
    function checkout() {
      cartService.update(vm.cart);
      cartService.checkout();
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