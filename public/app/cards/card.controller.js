(function () {
  angular.module('card')
    .controller('cardController', cardController);

  cardController.$inject = ['$log', '$http', 'cartService'];
  function cardController($log, $http, cardService) {
    let vm = this;
  }
})();