
var testApp = angular.module('myApp', ['testApp.sharedServices'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/pages/:currPageNum', { templateUrl: 'tpl/page.html',  controller: pageCtrl
        })
        .when('/passport', { templateUrl: 'tpl/form.html', controller: UserFormCtrl
        })
        .otherwise({redirectTo: '/pages/1'});
}])