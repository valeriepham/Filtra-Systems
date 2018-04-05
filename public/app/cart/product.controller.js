(function () {
  angular.module('cart')
    .controller('cartProductController', cartProductController);

  function cartProductController($log, $http) {
    let vm = this;
    vm.name = 'prod';
  }
})();