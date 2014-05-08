/* jshint strict:false, globalstrict:false */
/* global describe, it, beforeEach, inject, module */

describe('CollectionUtil', function () {
  var collectionUtil;
  var calendarUtil;

  beforeEach(angular.mock.module('angular-simple-native-datepicker'));

  beforeEach(inject(function (CollectionUtil, CalendarUtil) {
    collectionUtil = CollectionUtil;
    calendarUtil = CalendarUtil;
  }));
  
  it('should know how to map values', function() {
      var fn = function(val) { return val + 1; };
      var result = collectionUtil.map([1,2], fn);

      assert.deepEqual([2,3], result);
  });

  it('should know how to filter values', function() {
      var fn = function(val) { return val <= 2; };
      var result = collectionUtil.filter([1,2,3,4], fn);

      assert.deepEqual([1,2], result);
  });

  it('should provide foreach', function() {
      var result = [{val: 1}, {val: 2}, {val: 3}, {val: 4}];
      
      collectionUtil.foreach(result, function(item) { item.val = item.val + 1; });
      
      assert.deepEqual([{val: 2}, {val: 3}, {val: 4}, {val: 5}], result);
  });

  it('should provide contains', function() {
      var items = [new Date(2013, 0, 1), new Date(2013, 0, 2)];
      var comparisonFn = calendarUtil.equalDateWithoutTime;

      assert.isTrue(collectionUtil.contains(items, new Date(2013, 0, 1), comparisonFn));
      assert.isFalse(collectionUtil.contains(items, new Date(2013, 0, 3), comparisonFn));
  });

});
