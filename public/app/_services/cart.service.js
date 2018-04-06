(function () {
  angular.module('cartService', [])
    .factory('cartService', cartService);

  cartService.$inject = ['$http'];
  function cartService(http) {
    return {
      get: get,
      update: update,
      checkout: checkout
    };

    function get() {
      return http.get('/api/cart').then(function (result) {
        return result.data;
      });
    }

    function update(cart) {
      http.put('/api/cart/update', cart)
        .catch(function (err) {
          console.log(err);
        });
    }

    function checkout() {
      http.get('/simplecheckout');
    }
  }
})();