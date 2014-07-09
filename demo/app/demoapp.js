var app = angular.module('DemoApp', ['angular-simple-native-datepicker']);

app.controller('DemoController', function($scope, CalendarUtil) {

    // single month example

    // override default options and set listeners for date selections, ..
    $scope.singleMonthOptions = {
        firstDayOfWeek: 0,
        dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                     'August', 'September', 'October', 'November', 'December']
        // daySelected: function(date) { console.log('selected', date); },
        // dayUnSelected: function(date) { console.log('unselected', date); },
        // showPrevMonthBtn: true,
        // showNextMonthBtn: true,
        // moveMonth: function(diff) { }
    };
    $scope.singleMonthMonth = 1;  // the month shown
    $scope.singleMonthYear = 2014  // the year shown
    $scope.singleMonthSelectedDates = []; // is populated when dates are selected/unselected
    $scope.singleMonthVersionNumber = 1; // changing this will refresh the calendar

    
    // multi month example

    $scope.calendars = [
        CalendarUtil.currentYearMonth(),
        CalendarUtil.rollYearMonth(CalendarUtil.currentYearMonth(), 1),
        CalendarUtil.rollYearMonth(CalendarUtil.currentYearMonth(), 2)
    ];

    $scope.selectedDates = [];
    $scope.versionNumber = 1; // triggers refresh for all calendars

    var moveMonth = function(diff) {
        for (var i = $scope.calendars.length - 1; i >= 0; i--) {
            CalendarUtil.rollYearMonth($scope.calendars[i], diff);
        };
        $scope.versionNumber = 1 + $scope.versionNumber;
    };

    $scope.options = [
        { 
            daySelected: function(date) { console.log("Hooray! selected from cal 1", date); },
            showPrevMonthBtn: true,
            showNextMonthBtn: false,
            moveMonth: moveMonth
        },
        {
            showPrevMonthBtn: false,
            showNextMonthBtn: false
        },
        {
            showPrevMonthBtn: false,
            showNextMonthBtn: true,
            moveMonth: moveMonth
        }
    ];

    

});