var app = angular.module('DemoApp', ['angular-simple-native-datepicker']);

app.controller('DemoController', function($scope, CalendarUtil) {
    
    $scope.options = {
        daySelected: function(date) { console.log("Hooray! Selected", date); }
    };

    $scope.calendars = [
        CalendarUtil.currentYearMonth(),
        CalendarUtil.rollYearMonth(CalendarUtil.currentYearMonth(), 1)
    ];

    $scope.selectedDates = [];
    $scope.versionNumber = 1;

    $scope.moveMonth = function(diff) {
        for (var i = $scope.calendars.length - 1; i >= 0; i--) {
            CalendarUtil.rollYearMonth($scope.calendars[i], diff);
        };
        $scope.versionNumber = 1 + $scope.versionNumber;
    }

});