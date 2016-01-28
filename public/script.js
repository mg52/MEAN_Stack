'use strict';

var app = angular.module('mean_stack', ['ngRoute']);

app.config(function($routeProvider) {
    var checkLogin = function($q, $http, $location) {
        var deferred = $q.defer();
        $http.get('/getUserDetails').success(function(user) {
            if (user.username !== '') {
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/');
            }
        });
        return deferred.promise;
    };
    var checkSignup = function($http, $location) {
        $http.get('/getUserDetails').success(function(user) {
            if (user.username == '') {
                $location.url('/signup');
            } else {
                $location.url('/main');
            }
        });
    };
    $routeProvider
        .when('/', {
            templateUrl: 'login.html',
            controller: 'loginController',
            //resolve: {
            //    loggedin: checkLogin
            //}
        })
        .when('/signup', {
            templateUrl: 'signup.html',
            controller: 'signupController',
            resolve: {
                loggedin: checkSignup
            }
        })
        .when('/main', {
            templateUrl: 'main.html',
            controller: 'mainController',
            resolve: {
                loggedin: checkLogin
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.controller('loginController', function($scope, $http, $location) {
    //$scope.user = {};
    //$scope.message = '';
    $scope.login = function() {
        $http.post('/login', {
                username: $scope.username,
                password: $scope.password
            })
            .success(function(user) {
                if (user.username == $scope.username) {
                    $location.url('/main');
                } else {
                    $scope.message = 'Bad username or password.';
                }
            })
            .error(function() {
                $location.url('/');
            });
    };
});
app.controller('signupController', function($scope, $http, $location) {
    //$scope.user = {};
    //$scope.message="";
    $scope.signup = function() {
        $http.post('/signup', {
                username: $scope.username,
                password: $scope.password,
                email: $scope.email
            })
            .success(function(user) { /*???*/
                if (user.username == $scope.username) {
                    $location.url('/signup');
                    $scope.message = $scope.username + ' added.';
                } else {
                    $scope.message = 'This username is used by someone else!';
                }
            })
            .error(function() {
                $location.url('/');
            });
    }
});
app.controller('mainController', function($scope, $http, $location) {
    $http.get('/getMainDetails')
        .success(function(user) {
            $scope.username = user.username;
            $scope.password = user.password;
            $scope.email = user.email;
        })
        .error(function() {
            $scope.message = "";
        });

    $scope.send = function() {
        console.log($scope.name);
        $http.post('/send', $scope.name).success(function(response) {
            console.log(response);
            $scope.message = response;
        });
    };

    $scope.logout = function() {
        $http.post('/logout')
            .success(function(data) {
                console.log('logout');
                $location.url('/');
            })
            .error(function(data) {
                console.log(data);
            });
    };
});
