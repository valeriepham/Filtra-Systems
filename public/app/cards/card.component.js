(function () {
  angular.module('card', ['cardService'])
    .component('card', {
      templateUrl: './app/card/card.html',
      controller: 'cardController'
    });
})();