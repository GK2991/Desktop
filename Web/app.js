(function(angular) {
  'use strict';
angular.module('app', ['ngComponentRouter', 'users'])

.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
})

.value('$routerRootComponent', 'app')

.component('app', {
  template: '<ng-outlet></ng-outlet>',
  $routeConfig: [
    {path: '/users/...', name: 'Users', component: 'users', useAsDefault: true}
  ]
});
})(window.angular);