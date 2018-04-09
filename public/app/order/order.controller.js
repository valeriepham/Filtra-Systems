(function () {
  angular.module('order')
    .controller('order', orderController);

  orderController.$inject = ['$log', '$http', 'orderService'];
  function orderController($log, $http, orderService) {
    let vm = this;
    vm.userId;
    loadOrders(vm.userId);

    function loadOrders(uid) {
      orderService.getOrdersById(uid).then(function(data, err) {
        if (err) {
          console.log('Error when loading orders', err);
        } else {
          console.log(data);
          vm.orders = data;
        }
      });
    }
  }
})();