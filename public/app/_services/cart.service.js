(function () {
  angular.module('cartService', [])
    .factory('cartService', cartService);

  cartService.$inject = ['$http'];
  function cartService(http) {
    return {
      get: get,
      update: update,
      checkout: checkout,
      getStoredPrice: getStoredPrice
    };

    function get() {
      return http.get('/api/cart').then(function (result) {
        return result.data;
      });
    }

    function update(cart) {
      return http.put('/api/cart/update', cart)
        .then(function (result) {
          console.log('RESULT',result.data);
          return result.data;
        })
        .catch(function (err) {
          console.log(err);
        });
    }

    function checkout() {
      http.get('/simplecheckout');
    }
    function getStoredPrice() {
      return http.get('api/cart/get');
    }
  }
})();