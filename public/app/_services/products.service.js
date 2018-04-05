(function () {
  angular.module('productsService', [])
    .factory('productsService', productsService);

  productsService.$inject = ['$http'];
  function productsService(http) {
    return {
      get: get
    };

    function get() {
      return http.get('/api/products').then(function (err, result) {
        if (err) {
          console.log(err)
        } else {
          return result.data;
        }
      });
    }
  }
})();