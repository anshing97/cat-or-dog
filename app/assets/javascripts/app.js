app = angular.module('CatOrDog', []);

// wrote something so I can look at the backend
app.controller('BackEndController', ['$scope', 'apiService', function($scope, apiService){

    apiService.getPeople();
    apiService.getPreferences();

    $scope.people = apiService.people;
    $scope.preferences = apiService.preferences;

    function addPersonInfo() {

        apiService.create(
            {'height': $scope.height, 'preference': $scope.preference }
        );
        $scope.height = '';
        $scope.preference = '';

        // get preferences again, since this will update
        apiService.getPreferences();
    }

    $scope.addPersonInfo = addPersonInfo;

}]);

// the main story machine
app.controller('MainController', ['$scope', '$timeout', 'apiService', function($scope, $timeout, apiService){

    var MAX_HEIGHT = 96,
        MIN_HEIGHT = 48,
        DEFAULT_HEIGHT = 72,
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
        guessConfirmText: '',
        finalHeading: '',
        finalParagraph: ''
    };
    var oldPreference = null,
        newPreference = null;

    $scope.currentStage = START_STAGE;

    function resetUserData () {
        $scope.currentUser.watsonGuess = '';
        $scope.currentUser.clipClass = '';
        $scope.currentUser.guessConfirmText = '';
        $scope.currentUser.height = DEFAULT_HEIGHT,
        $scope.currentUser.finalHeading = '';
        $scope.currentUser.finalParagraph = '',
        oldPreference = null,
        newPreference = null;
    }

    function advance (stage) {
        console.log('advance to ' + stage);
        $scope.currentStage = stage;
    };

    function increaseHeight () {
        $scope.currentUser.height++;
        if ( $scope.currentUser.height > MAX_HEIGHT ) {
            $scope.currentUser.height = MAX_HEIGHT;
        }
    }

    function decreaseHeight () {
        $scope.currentUser.height--;
        if ( $scope.currentUser.height < MIN_HEIGHT ) {
            $scope.currentUser.height = MIN_HEIGHT;
        }
    }

    function showGuessResults () {
        if ( $scope.currentUser.watsonGuess === 'cat' ) {
            $scope.currentUser.guessConfirmText = 'Mew! I am a cat person!';
            $scope.$apply();
        } else if ( $scope.currentUser.watsonGuess == 'dog') {
            $scope.currentUser.guessConfirmText = 'Woof! I am a dog person!';
            $scope.$apply();
        }
    }

    function canShowGuess () {
        return $scope.currentUser.guessConfirmText !== '';
    }

    function formatThanksMessage (confirmed, preference) {
        apiService.preference({'height': $scope.currentUser.height}).then(function(obj){
            if ( obj.data.response === 'ok') {

                var oldPercentage,
                    newPercentage;

                newPreference = obj.data.preference;

                if ( confirmed ) {
                    $scope.currentUser.finalHeading = 'We told you Watson was smart!';
                } else {
                    $scope.currentUser.finalHeading = 'Bummer. Watson can\'t be right all the time';
                }

                console.log("old preference", oldPreference);
                console.log("new preference", newPreference);


                oldPercentage = Math.round(oldPreference[preference] * 100) + '%';
                newPercentage = Math.round(newPreference[preference] * 100) + '%';


                $scope.currentUser.finalParagraph =
                    'He now knows that people that are ' + imperialHeight($scope.currentUser.height) + ' prefer ' + preference + 's ' + newPercentage + ' of the time instead of ' + oldPercentage;

                // show the final message
                $scope.advance('thanks');
            }
        });
    }

    function catOrDog() {


    }

    function confirmGuess ( confirmed ) {
        userPreference = confirmed ? $scope.currentUser.watsonGuess : ( ( $scope.currentUser.watsonGuess === 'cat') ? 'dog' : 'cat' );
        apiService.create(
            {'height': $scope.currentUser.height, 'preference': userPreference }
        );

        // set a time out for API to update the preference calculation
        $timeout(formatThanksMessage, 250, true, confirmed, userPreference);
    }



    // setup watchers

    $scope.$watch('currentUser.height',function(newValue, oldValue){
        $scope.heightPercentage = (newValue - MIN_HEIGHT) * (100 - 0) / (MAX_HEIGHT - MIN_HEIGHT);
    });

    // sometimes we need to do some special things when the stage changes
    $scope.$watch('currentStage',function(newValue, oldValue){

        if ( newValue === 'guess') {
            apiService.guess({'height': $scope.currentUser.height}).then(function(obj){
                if ( obj.data.response === 'ok') {
                    $scope.currentUser.watsonGuess = obj.data.guess;
                    if ( $scope.currentUser.watsonGuess === 'cat' ) {
                        $scope.currentUser.clipClass = 'clip-block--select-right';
                    } else if ( $scope.currentUser.watsonGuess == 'dog') {
                        $scope.currentUser.clipClass = 'clip-block--select-left';
                    }
                }
            });
            apiService.preference({'height': $scope.currentUser.height}).then(function(obj){
                if ( obj.data.response === 'ok') {
                    oldPreference = obj.data.preference
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
    });

    // expose these to front end
    $scope.resetUserData = resetUserData;
    $scope.advance = advance;
    $scope.increaseHeight = increaseHeight;
    $scope.decreaseHeight = decreaseHeight;
    $scope.showGuessResults = showGuessResults;
    $scope.canShowGuess = canShowGuess;
    $scope.confirmGuess = confirmGuess;

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
            return obj;
        });
    }

    function preference(getParams) {
        var config = {
            params: getParams
        };
        return $http.get('/preference',config).success(function(obj){
            return obj;
        });
    }

    return service;
}]);

// use this as well
function imperialHeight(input) {
    var feet = Math.floor(input / 12),
        inches = input % 12;

    return feet + ' ft ' + inches + ' in';
}

// filters and directives
app.filter('imperialHeight', function() {
  return imperialHeight;
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
