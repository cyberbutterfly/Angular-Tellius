import {
  FileTypes as __FileTypes,
}
from './size.types';

export default class SizeFilterConfig {
  /*@ngInject*/
  constructor() {
    this.defaultUnit = 'b';
    this.__FileTypes = __FileTypes;
  }

  setDefaultUnit(unit) {
    if (this.__FileTypes.indexOf(unit) !== -1) {
      this.defaultUnit = unit;
    } else {
      console.error('ngFileSizeFilter: unit does not supported.');
    }
  }

  getDefaultUnit() {
    return this.defaultUnit;
  }

  setFileTypes(fileTypes) {
    this.FileTypes = fileTypes;
  }

  /*@ngInject*/
  $get() {
    return {
      getDefaultUnit: () => this.getDefaultUnit(),
      setFileTypes: (data) => this.setFileTypes(data),
    };
  }
}
