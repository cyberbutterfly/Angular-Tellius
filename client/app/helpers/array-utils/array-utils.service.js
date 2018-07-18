import angular from 'angular';
import _ from 'lodash';

export class ArrayUtils {
  /*@ngInject@*/
  constructor() {
    this.union = _.union.bind(this);
  }

  intersec(arr1, arr2) {
    let arr3 = [];

    if (angular.isArray(arr1) && angular.isArray(arr2)) {
      for (let item of arr1) {
        if (arr2.indexOf(item) !== -1) {
          arr3.push(item);
        }
      }
    }

    return arr3;
  }

  move(arr, fromIndex, toIndex) {
    let element = arr[fromIndex];

    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);

    return arr;
  }

  moveNext(column, columns) {
    let index = columns.indexOf(column);
    let result = null;

    if (index === -1 || columns.length === index + 1) {
      result = columns;
    } else {
      result = this.move(columns, index, index + 1);
    }

    return result;
  }

  moveBefore(column, columns) {
    let index = columns.indexOf(column);
    let result = null;

    if (index < 1 || columns.length === index - 1) {
      result = columns;
    } else {
      result = this.move(columns, index, index - 1);
    }

    return result;
  }

  moveAfterColumn(column, target, columns) {
    let index = columns.indexOf(column);
    let targetIndex = columns.indexOf(target);
    let result = null;

    if (index === -1 || targetIndex === -1 || columns.length === index - 1) {
      result = columns;
    } else {
      result = this.move(columns, index, targetIndex);
    }

    return result;
  }

  moveBeforeColumn(column, target, columns) {
    let index = columns.indexOf(column);
    let targetIndex = columns.indexOf(target);
    let result = null;

    if (index === -1 || targetIndex === -1 || columns.length === index - 1) {
      result = columns;
    } else {
      result = this.move(columns, index, targetIndex - 1);
    }

    return result;
  }

}
