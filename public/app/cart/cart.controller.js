(function () {
  angular.module('cart')
    .controller('cartController', cartController);

  cartController.$inject = ['$log', '$http', 'productsService']
  function cartController($log, $http, productsService) {
    let vm = this;
    getProducts()
    vm.name = 'cart';
    vm.options = {

    };
    vm.products = [];

    function getProducts() {
      productsService.get().then(function (data) {
        vm.products = data;
      });
    }
  }
})();