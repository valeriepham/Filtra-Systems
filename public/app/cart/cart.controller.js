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
    vm.remove = remove;
    vm.update = update;
    vm.checkout = checkout;
    
    function remove(id) {
      delete vm.cart.items[id];
      update();
    }
    function update() {
      for (const id in vm.cart.items) {
        console.log('checking item:', vm.cart.items[id]);
        if (vm.cart.items[id].quantity < 1 || !vm.cart.items[id].quantity) {
          console.log('invalid quantity!');
          delete vm.cart.items[id];
        }
      }
      cartService.update(vm.cart).then(function() {
        getCart();
      });
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