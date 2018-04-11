(function() {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('User',[])
        .component('passwd', {
            //template:'htmlTemplate',
            templateUrl: './passwd.html',
            controller: 'Matchcheck',
            controllerAs: '$ctrl',
            bindings: {
                Binding: '=',
            },
        }); 
})();