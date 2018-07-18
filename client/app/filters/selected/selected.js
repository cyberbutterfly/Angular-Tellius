import angular from 'angular';

const module = angular.module('Tellius.filters.selected', []);

module.filter('selected', function(filterFilter) {
  return function(input, filterEach, exclude) {
    filterEach.forEach(function(item) {
      if (angular.equals(item, exclude)) { return; }
      input = filterFilter(input, '!'+item);
    });
    return input;
  };
});

export default module;
