app = angular.module('CatOrDog', []);

app.controller('MainController', ['$scope', 'peopleService', function($scope, peopleService){
    $scope.test = 'Hello Dog or Cat World!';
    $scope.preferences = [
        {
            'height': 48,
            'preference': {'cat': 0.3, 'dog': 0.7}
        },
        {
            'height': 49,
            'preference': {'cat': 0.3, 'dog': 0.7}
        },
        {
            'height': 50,
            'preference': {'cat': 0.5, 'dog': 0.5}
        },
        {
            'height': 68,
            'preference': {'cat': 0.13, 'dog': 0.87}
        }
    ];


    peopleService.getAll();
    $scope.people = peopleService.people;


    $scope.addPersonInfo = function() {

        peopleService.create(
            {'height': $scope.height, 'preference': $scope.preference }
        );
        $scope.height = '';
        $scope.preference = '';

    }

}]);

app.factory('peopleService', ['$http', function($http){
    var service = {
        people: [
            { 'height': 80, 'preference':'cat'},
            { 'height': 80, 'preference':'dog'},
            { 'height': 50, 'preference':'cat'}
        ]
    }
    service.getAll = function () {
        return $http.get('/people').success(function(obj){
            angular.copy(obj, service.people);
        });
    }
    service.create = function (post) {
        return $http.post('/create_person',post).success(function(obj){
            console.log('create got this!!');
            console.log(obj);
            service.people.push(obj);
        });
    }

    return service;
}]);
