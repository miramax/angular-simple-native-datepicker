angular-simple-native-datepicker
================================

A simple angular directive to pick dates from one or more months.
- Depends only on AngularJS
- Easy to show multiple months
- Easy to pick multiple dates 

# Demo

Check the demo application inside demo/. It's running live [here](https://rawgit.com/janneri/angular-simple-native-datepicker/master/demo/app/index.html).

![screenshot](https://raw.githubusercontent.com/janneri/angular-simple-native-datepicker/master/screenshot.png)


# Usage

```
<html>
<head>

    <script type="text/javascript" src="bower_components/angularjs/angular.min.js"></script>

    <script type="text/javascript" src="bower_components/angular-simple-native-datepicker/dist/angular-simple-native-datepicker.min.js"></script>
    <link rel="stylesheet" type="text/css" href="bower_components/angular-simple-native-datepicker/dist/angular-simple-native-datepicker.min.css">

    <script type="text/javascript">
        var app = angular.module('DemoApp', ['angular-simple-native-datepicker']);

        app.controller('DemoController', function($scope) {

            // single month example

            // override default options and set listeners for date selections, ..
            $scope.singleMonthOptions = {
                firstDayOfWeek: 0, // Sunday is 0 and Monday is 1
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

        });
    </script> 


    <style type="text/css">
        .simpleNativeDatepicker {
            float: left;
            margin-left: 12px;
            margin-top: 12px;
        }

        .clearFloats {
            clear: both;
        }
    </style>
</head>

<body ng-app="DemoApp" ng-controller="DemoController">   
    <h2>Single month</h2>
    <div simple-native-datepicker year="singleMonthYear" month="singleMonthMonth" 
         selected-dates="singleMonthSelectedDates" version-number="singleMonthVersionNumber" 
         options="singleMonthOptions">
    </div>
</body>

</html>
```
