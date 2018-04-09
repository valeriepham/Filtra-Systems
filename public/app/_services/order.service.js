(function () {
  angular.module('orderService', [])
    .factory('orderService', orderService);

  orderService.$inject = ['$http'];
  function orderService(http) {
    return {
      getOrdersById: getOrdersById,
    };

    function getOrdersById(id) {
      return http.get('/api/orders/user/' + id).then(function (result) {
        return result.data;
      });
    }
  }
})();