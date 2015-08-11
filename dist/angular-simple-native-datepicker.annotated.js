angular.module('angular-simple-native-datepicker', []).service('CollectionUtil', function () {
  'use strict';
  this.filter = function (values, predicate) {
    var result = [];
    for (var i = 0; i < values.length; i++) {
      if (predicate(values[i])) {
        result.push(values[i]);
      }
    }
    return result;
  };
  this.map = function (values, fn) {
    var result = [];
    for (var i = 0; i < values.length; i++) {
      result.push(fn(values[i]));
    }
    return result;
  };
  this.foreach = function (values, fn) {
    for (var i = 0; i < values.length; i++) {
      fn(values[i]);
    }
  };
  this.toSubArrays = function (values, chunkSize) {
    var result = [];
    for (var i = 0; i < values.length; i += chunkSize) {
      result.push(values.slice(i, i + chunkSize));
    }
    return result;
  };
  this.toObjects = function (values, objectKey) {
    return this.map(values, function (item) {
      var object = {};
      object[objectKey] = item;
      return object;
    });
  };
  this.contains = function (values, item, comparisonFn) {
    for (var i = values.length - 1; i >= 0; i--) {
      if (comparisonFn(values[i], item)) {
        return true;
      }
    }
    return false;
  };
  this.remove = function (values, item, comparisonFn) {
    for (var i = values.length - 1; i >= 0; i--) {
      if (comparisonFn(values[i], item)) {
        values.splice(i, 1);
      }
    }
    return false;
  };
}).service('CalendarUtil', [
  'CollectionUtil',
  function (cu) {
    'use strict';
    var copyDate = function (date) {
      var copiedDate = new Date(date.getTime());
      copiedDate.setDate(copiedDate.getDate());
      return copiedDate;
    };
    var rollMutableDate = function (date, days) {
      date.setDate(date.getDate() + days);
      return date;
    };
    this.currentYearMonth = function () {
      var date = new Date();
      return {
        year: date.getFullYear(),
        month: date.getMonth()
      };
    };
    this.rollYearMonth = function (yearMonth, diff) {
      var date = new Date(yearMonth.year, yearMonth.month, 1);
      date.setMonth(date.getMonth() + diff);
      yearMonth.year = date.getFullYear();
      yearMonth.month = date.getMonth();
      return yearMonth;
    };
    var assertValidDayNumber = function (dayNumber) {
      if (dayNumber < 0 || dayNumber > 6) {
        throw Error('illegal day number ' + dayNumber + ', expecting a day between 0 and 6');
      }
    };
    var moveToDayNumber = function (date, targetDayNumber, direction) {
      assertValidDayNumber(targetDayNumber);
      var day = date.getDay();
      var rolledDate = copyDate(date);
      while (rolledDate.getDay() != targetDayNumber) {
        rollMutableDate(rolledDate, direction);
      }
      return rolledDate;
    };
    this.rollMutableDate = rollMutableDate;
    this.reverseToDayNumber = function (date, targetDayNumber, direction) {
      return moveToDayNumber(date, targetDayNumber, -1);
    };
    this.forwardToDayNumber = function (date, targetDayNumber, direction) {
      return moveToDayNumber(date, targetDayNumber, 1);
    };
    this.dateRangeBetween = function (startDate, endDate) {
      if (startDate.getTime() > endDate.getTime()) {
        throw 'start after end';
      }
      var result = [];
      var rolledDate = copyDate(startDate);
      while (rolledDate.getTime() <= endDate.getTime()) {
        result.push(copyDate(rolledDate));
        this.rollMutableDate(rolledDate, 1);
      }
      return result;
    };
    var lastDayNumberOfWeek = function (firstDayNumberOfWeek) {
      assertValidDayNumber(firstDayNumberOfWeek);
      var lastDayNumber = firstDayNumberOfWeek + 6;
      // for monday (1) the last day is sunday (6)        
      return lastDayNumber > 6 ? lastDayNumber - 7 : lastDayNumber;
    };
    this.equalYearMonth = function (d1, d2) {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
    };
    this.equalDateWithoutTime = function (d1, d2) {
      return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    };
    // January = 0, ... and Sunday = 0, Monday = 1, ...
    this.getMonth = function (year, month, firstDayOfWeek, selectedDates) {
      var firstDate = this.reverseToDayNumber(new Date(year, month, 1), firstDayOfWeek);
      var lastDateOfMonth = this.rollMutableDate(new Date(year, month + 1, 1), -1);
      var lastDate = this.forwardToDayNumber(lastDateOfMonth, lastDayNumberOfWeek(firstDayOfWeek));
      var dateRange = cu.toObjects(this.dateRangeBetween(firstDate, lastDate), 'date');
      var self = this;
      var selectedDatesOfDateRange = cu.filter(dateRange, function (day) {
          return cu.contains(selectedDates, day.date, self.equalDateWithoutTime);
        });
      cu.foreach(selectedDatesOfDateRange, function (day) {
        day.selected = true;
      });
      var yearMonth = new Date(year, month, 1);
      var outOfMonthDates = cu.filter(dateRange, function (day) {
          return !self.equalYearMonth(yearMonth, day.date);
        });
      cu.foreach(outOfMonthDates, function (day) {
        day.outOfMonth = true;
      });
      return { 'weeks': cu.toObjects(cu.toSubArrays(dateRange, 7), 'days') };
    };
  }
]).directive('simpleNativeDatepicker', [
  'CalendarUtil',
  'CollectionUtil',
  function (CalendarUtil, cu) {
    'use strict';
    return {
      restrict: 'A',
      template: '<div class="simpleNativeDatepicker" ng-mouseleave="onMouseLeave()" ng-mouseup="onMouseUp()">' + '<span ng-show="showPrevMonthBtn" ng-click="moveMonth(-1)" class="prevMonthBtn">&lt;</span>' + '<span class="header">{{monthStr}} {{year}}</span>' + '<span ng-show="showNextMonthBtn" ng-click="moveMonth(1)" class="nextMonthBtn">&gt;</span>' + '<table>' + '<thead>' + '<tr>' + '<th ng-repeat="dayName in orderedDayNames">{{dayName}}</th>' + '</tr>' + '</thead>' + '<tbody>' + '<tr ng-repeat="week in calMonth.weeks">' + '<td ng-class="{outOfMonth: day.outOfMonth, selected: day.selected}" ng-mousedown="onMouseDown(day, $event)" ng-mouseenter="onMouseEnter(day, $event)" ng-repeat="day in week.days">{{day.date.getDate()}}</td>' + '</tr>' + '</tbody>' + '</table>' + '</div>',
      scope: {
        year: '=',
        month: '=',
        versionNumber: '=',
        selectedDates: '=',
        options: '='
      },
      link: function (scope, elem, attrs) {
        var defaultOptions = {
            firstDayOfWeek: 1,
            dayNames: [
              'Su',
              'Ma',
              'Ti',
              'Ke',
              'To',
              'Pe',
              'La'
            ],
            monthNames: [
              'Tammikuu',
              'Helmikuu',
              'Maaliskuu',
              'Huhtikuu',
              'Toukokuu',
              'Kes\xe4kuu',
              'Hein\xe4kuu',
              'Elokuu',
              'Syyskuu',
              'Lokakuu',
              'Marraskuu',
              'Joulukuu'
            ],
            daySelected: function (date) {
              console.log('selected', date);
            },
            dayUnSelected: function (date) {
              console.log('unselected', date);
            },
            showPrevMonthBtn: true,
            showNextMonthBtn: true,
            moveMonth: function (diff) {
              var yearMonth = {
                  year: scope.year,
                  month: scope.month
                };
              CalendarUtil.rollYearMonth(yearMonth, diff);
              scope.year = yearMonth.year;
              scope.month = yearMonth.month;
              scope.versionNumber += 1;
            }
          };
        var options = angular.extend(defaultOptions, scope.options);
        // a list of day names starting with the first day which is probably Sunday or Monday
        scope.orderedDayNames = options.dayNames.slice(options.firstDayOfWeek).concat(options.dayNames.slice(0, options.firstDayOfWeek));
        // holds the state of mouse to detect when user is selecting multiple dates
        scope.mouseDown = false;
        // if the user of this directive did not spesify the year attribute, we can use current year
        if (scope.year === undefined) {
          scope.year = CalendarUtil.currentYearMonth().year;
        }
        if (scope.month === undefined) {
          scope.month = CalendarUtil.currentYearMonth().month;
        }
        scope.onMouseLeave = function () {
          scope.mouseDown = false;
          scope.versionNumber += 1;  // refresh           
        };
        scope.onMouseUp = function () {
          scope.mouseDown = false;
          scope.versionNumber += 1;  // refresh
        };
        scope.onMouseDown = function (day, $event) {
          scope.mouseDown = true;
          toggleDateSelection(day);
          angular.element($event.target).addClass('selecting');
        };
        scope.onMouseEnter = function (day, $event) {
          if (scope.mouseDown) {
            toggleDateSelection(day);
            angular.element($event.target).addClass('selecting');
          }
        };
        var toggleDateSelection = function (day) {
          if (cu.contains(scope.selectedDates, day.date, CalendarUtil.equalDateWithoutTime)) {
            cu.remove(scope.selectedDates, day.date, CalendarUtil.equalDateWithoutTime);
            options.dayUnSelected(day.date);
          } else {
            scope.selectedDates.push(day.date);
            options.daySelected(day.date);
          }
        };
        scope.moveMonth = options.moveMonth;
        scope.showPrevMonthBtn = options.showPrevMonthBtn;
        scope.showNextMonthBtn = options.showNextMonthBtn;
        var refresh = function (year, month, selectedDates) {
          scope.calMonth = [];
          scope.calMonth = CalendarUtil.getMonth(year, month, options.firstDayOfWeek, selectedDates);
          scope.monthStr = options.monthNames[month];
        };
        scope.$watch('versionNumber', function (newVal, oldVal) {
          if (newVal) {
            refresh(scope.year, scope.month, scope.selectedDates);
          }
        });
      }
    };
  }
]);