import angular from 'angular';

const module = angular.module('Tellius.filters.exclude', []);

module.filter('exclude', [() => {
  return (input, exclude, prop) => {
    if (!angular.isArray(input)) {
      return input;
    }

    if (!angular.isArray(exclude)) {
      exclude = [];
    }

    return input.filter(function byExclude(item) {
      return exclude.indexOf(prop ? item[prop] : item) === -1;
    });
  };
}]);

export default module;
