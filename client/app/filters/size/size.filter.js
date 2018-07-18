import {
  FileTypes,
}
from './size.types';
import _ from 'lodash';

const getNextFileType = unit => FileTypes[FileTypes.indexOf(unit) + 1];
const isNext = size => size > 1000;
const isFloatSize = size => size > 600;
const toFloat = size => parseFloat((size / 1000).toFixed(3));
const capitallize = unit => unit.charAt(0).toUpperCase() + unit.slice(1);

const getType = (size, unit) => {
  let result = {
    size,
    unit,
  };

  if (isNext(size)) {
    size = size / 1000;
    result = getType(size, getNextFileType(unit));
  } else if (isFloatSize(size)) {
    result = {
      size: toFloat(size),
      unit: getNextFileType(unit),
    };
  }

  return result;
};

/*@ngInject*/
const SizeFilter = SizeFilterConfig => {
  return (input, unitType) => {
    if(!_.isNumber(input)) return '';

    if (_.isUndefined(unitType)) {
      unitType = SizeFilterConfig.getDefaultUnit();
    }

    const data = (() => {
      let result = {};

      try {
        result = getType(input, unitType);
      } catch (e) {
        console.log('ngFileSizeFilter: ', e);

        result = {
          input,
          unit: unitType,
        };
      }

      result.unit = capitallize(result.unit);

      return result;
    })();

    return `${Math.round(data.size * 100) / 100} ${data.unit}`;
  };
};

export default SizeFilter;
