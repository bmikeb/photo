
var testApp = angular.module('testApp', ['testApp.sharedServices'])
testApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/pages/:currPageNum', {templateUrl: 'page.html', controller: pageCtrl})
//        .when('/details', {templateUrl: 'infopanel.html', controller: SortableTableCtrl})
        .otherwise({redirectTo: '/pages/1'});
}])