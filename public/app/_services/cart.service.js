(function () {
  angular.module('cartService', [])
    .factory('cartService', cartService);

  cartService.$inject = ['$http'];
  function cartService(http) {
    return {
      get: get,
      update: update
    };

    function get() {
      return http.get('/api/cart').then(function (result) {
        return result.data;
      });
    }
    function update() {
      return http.get('/api/cart/update').then(function (result) {
        return result.data
      })
    }
  }
})();