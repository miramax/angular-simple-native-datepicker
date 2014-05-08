/* jshint strict:false, globalstrict:false */
/* global describe, it, beforeEach, inject, module */

describe('CalendarUtil', function () {
  var calendarUtil;

  beforeEach(angular.mock.module('angular-simple-native-datepicker'));

  beforeEach(inject(function (CalendarUtil) {
    calendarUtil = CalendarUtil;
  }));

  
  it('should roll date', function() {
      var date = new Date(2013, 0, 1);

      calendarUtil.rollMutableDate(date, 2);

      assert.equal(3, date.getDate());
  });

  it('should return date ranges', function() {
      var range = calendarUtil.dateRangeBetween(new Date(2013, 0, 1), new Date(2013, 0, 5));

      assert.equal(5, range.length);
  });

  var formattedDate = function(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  };

  it('should return a calendar month', function() {
      var year = 2014;
      var month = 0; // january
      var firstDayOfWeek = 1; // monday
      var selectedDates = [new Date(2013, 11, 30)];
      
      var calMonth = calendarUtil.getMonth(year, month, firstDayOfWeek, selectedDates);

      assert.equal(5, calMonth.weeks.length);
      var firstDay = calMonth.weeks[0].days[0];
      var lastDay = calMonth.weeks[4].days[6];
      assert.equal('2013-12-30', formattedDate(firstDay.date));
      assert.equal('2014-2-2', formattedDate(lastDay.date));
      assert.isTrue(firstDay.selected);
      assert.isUndefined(calMonth.weeks[0].days[3].selected);
      assert.isUndefined(lastDay.selected);
  });

  it('should provide utils to resolve first and last date for a calendar month', function() {
      var get = function(year, month, date, firstDayOfWeek) {
        return formattedDate(calendarUtil.reverseToDayNumber(new Date(year, month-1, date), firstDayOfWeek));
      }

      var firstDayOfWeek = 1; // monday

      assert.equal('2014-4-28', get(2014, 5, 1, firstDayOfWeek));
      assert.equal('2014-5-26', get(2014, 6, 1, firstDayOfWeek));
  });

  it('should provide date comparison', function() {
      assert.isTrue(calendarUtil.equalDateWithoutTime(new Date(2013, 0, 1), new Date(2013, 0, 1)));
      assert.isFalse(calendarUtil.equalDateWithoutTime(new Date(2013, 0, 1), new Date(2013, 0, 2)));
  });


});
