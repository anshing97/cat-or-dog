app = angular.module('CatOrDog', []);

// wrote something so I can look at the backend
app.controller('BackEndController', ['$scope', 'apiService', function($scope, apiService){

    apiService.getPeople();
    apiService.getPreferences();

    $scope.people = apiService.people;
    $scope.preferences = apiService.preferences;

    $scope.addPersonInfo = function() {

        apiService.create(
            {'height': $scope.height, 'preference': $scope.preference }
        );
        $scope.height = '';
        $scope.preference = '';
    }

}]);

// the main story machine
app.controller('MainController', ['$scope', '$timeout', 'apiService', function($scope, $timeout, apiService){

    var MAX_HEIGHT = 96,
        MIN_HEIGHT = 48,
        START_STAGE = 'intro';

    $scope.stages = [
        'intro',
        'height',
        'guess',
        'thanks'
    ];
    $scope.currentUser = {
        height: 72,
        watsonGuess: '',
        clipClass: '',
        guessPrase: '',
        guessConfirmText: ''
    };
    $scope.currentStage = START_STAGE;

    function resetUserData() {
        $scope.currentUser.watsonGuess = '';
        $scope.currentUser.clipClass = '';
        $scope.currentUser.guessConfirmText = '';
        $scope.currentUser.height = 72;
    }

    $scope.advance = function (stage) {
        console.log('advance to ' + stage);
        $scope.currentStage = stage;
    };

    $scope.increaseHeight = function() {
        $scope.currentUser.height++;
        if ( $scope.currentUser.height > MAX_HEIGHT ) {
            $scope.currentUser.height = MAX_HEIGHT;
        }
    }

    $scope.decreaseHeight = function () {
        $scope.currentUser.height--;
        if ( $scope.currentUser.height < MIN_HEIGHT ) {
            $scope.currentUser.height = MIN_HEIGHT;
        }
    }

    $scope.showGuessResults = function() {
        if ( $scope.currentUser.watsonGuess === 'cat' ) {
            $scope.currentUser.guessConfirmText = 'Mew! I am a cat person!';
            $scope.$apply();
        } else if ( $scope.currentUser.watsonGuess == 'dog') {
            $scope.currentUser.guessConfirmText = 'Woof! I am a dog person!';
            $scope.$apply();
        }
    }

    $scope.canShowGuess = function () {
        return $scope.currentUser.guessConfirmText !== '';
    }

    $scope.confirmGuess = function ( confirmed ) {
        var userAnswer = confirmed ? $scope.currentUser.watsonGuess : ( ( $scope.currentUser.watsonGuess === 'cat') ? 'dog' : 'cat' );
        apiService.create(
            {'height': $scope.currentUser.height, 'preference': userAnswer }
        );

        resetUserData();
    }

    // setup watchers
    $scope.$watch('currentUser.height',function(newValue, oldValue){
        $scope.heightPercentage = (newValue - MIN_HEIGHT) * (100 - 0) / (MAX_HEIGHT - MIN_HEIGHT);
    });

    // sometimes we need to do some special things when the stage changes
    // write them here
    $scope.$watch('currentStage',function(newValue, oldValue){

        if ( newValue === 'guess') {
            apiService.guess({'height': $scope.currentUser.height}).then(function(obj){
                $scope.currentUser.watsonGuess = obj.data.guess;
                if ( $scope.currentUser.watsonGuess === 'cat' ) {
                    $scope.currentUser.clipClass = 'clip-block--select-right';
                } else if ( $scope.currentUser.watsonGuess == 'dog') {
                    $scope.currentUser.clipClass = 'clip-block--select-left';

                }
            });
        };

        if ( newValue === 'height') {
            function focusOnHeightInput() {
                var heightInput = angular.element(document.querySelector('#height-input'));
                if ( heightInput.length > 0 ) {
                    heightInput[0].focus()
                }
            }

            // tech-debt: this is really hacky, need of a better way to do this some other time
            $timeout(focusOnHeightInput, 100);
        };
    })

    // execute these
    resetUserData();

}]);


// services
app.factory('apiService', ['$http', function($http){
    var service = {
        people: [],
        preferences: [],
        getPeople: getPeople,
        getPreferences: getPreferences,
        preference: preference,
        guess: guess,
        create: create
    }

    function getPeople() {
        return $http.get('/people').success(function(obj){
            angular.copy(obj.people, service.people);
        });
    }

    function getPreferences() {
        return $http.get('/preferences').success(function(obj){
            angular.copy(obj.preferences, service.preferences);
        });
    }

    function create(post) {
        return $http.post('/create_person',post).success(function(obj){
            service.people.push(obj.person);
        });
    }

    function guess(getParams) {
        var config = {
            params: getParams
        };
        return $http.get('/guess',config).success(function(obj){
            console.log('guess object', obj);
            return obj;
        });
    }

    function preference(getParams) {
        var config = {
            params: getParams
        };
        return $http.get('/preference',config).success(function(obj){
            console.log('preference object', obj);
            return obj;
        });
    }

    return service;
}]);

// filters and directives
app.filter('imperialHeight', function() {
  return function(input) {
    var feet = Math.floor(input / 12),
        inches = input % 12;

    return feet + 'ft ' + inches + 'in';
  }
});

app.directive('ngKeepFocus', function() {
    return function(scope, element, attrs) {
        element.bind('blur',function(){
            if ( attrs.shouldKeepFocus === 'true') {
                element[0].focus();
            }
        });
    };
})

// I DIDN'T WRITE THE CODE BELOW

// copied from http://demo.sodhanalibrary.com/angular/directive/mouse-wheel-event.html
app.directive('ngMouseWheelUp', function() {
    return function(scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {

            // cross-browser wheel delta
            var event = window.event || event; // old IE support
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

            if(delta > 0) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngMouseWheelUp);
                });

                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if(event.preventDefault) {
                    event.preventDefault();
                }

            }
        });
    };
});

app.directive('ngMouseWheelDown', function() {
    return function(scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {

            // cross-browser wheel delta
            var event = window.event || event; // old IE support
            var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

            if(delta < 0) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngMouseWheelDown);
                });

                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if (event.preventDefault)  {
                    event.preventDefault();
                }

            }
        });
    };
});

// https://codepen.io/asxelot/pen/XJzYNm
app.directive('animationend', function() {
    return {
        restrict: 'A',
        scope: {
            animationend: '&'
        },
        link: function(scope, element) {
            var callback = scope.animationend(),
                  events = 'animationend webkitAnimationEnd MSAnimationEnd' +
                        'transitionend webkitTransitionEnd';

            element.on(events, function(event) {
                callback.call(element[0], event);
            });
        }
    };
});
