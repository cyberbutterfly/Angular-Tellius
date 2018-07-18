import {
  isUndefined,
  isString,
}
from 'lodash/lang';

const EvaluatorTypes = new Set([
  'regressionevaluator',
  'classificationevaluator',
]);

export class CompareAPI {
  /*@ngInject*/
  constructor($q, ApiWrapper) {
    this.$q = $q;
    this.api = ApiWrapper;
  }

  compare({
    id,
    modelName,
    compareModelName,
    evaluator,
    options,
  }) {
    if (isUndefined(id) ||
      !isString(modelName) ||
      !isString(compareModelName) ||
      !EvaluatorTypes.has(evaluator) ||
      isUndefined(options)) {
      return this.$q.reject('Wrong arguments');
    }

    const payload = {
      'id': id,
      'modelname': modelName,
      'comparemodelname': compareModelName,
      'evaluator': evaluator,
      options,
    };

    return this._makeCompareRequest({
      payload,
    });
  }

  _makeCompareRequest({
    url = '/ml/compare',
      payload,
  }) {
    return this.api.post(url, payload);
  }
}
