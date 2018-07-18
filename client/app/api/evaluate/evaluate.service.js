import {
  isUndefined,
  isObject,
  isString,
}
from 'lodash/lang';

const EvaluatorTypes = new Set([
  'regressionevaluator',
  'classificationevaluator',
]);

export class EvaluateAPI {
  /*@ngInject*/
  constructor($q, ApiWrapper) {
    this.$q = $q;
    this.api = ApiWrapper;
  }

  evaluateModel({
    id,
    modelName,
    evaluatorType,
    options,
  }) {
    if (isUndefined(id) ||
      !isString(modelName) ||
      !EvaluatorTypes.has(evaluatorType) ||
      !isObject(options)) {
      return this.$q.reject('Wrong arguments');
    }

    const payload = {
      id,
      'modelname': modelName,
      'evaluator': evaluatorType,
      options,
    };

    return this._makeEvaluateRequest({
      payload,
    });
  }

  getMeasures({
    id,
    modelName,
    modelType,
    label,
    featuresColumns,
  }) {
    const metric = this._getMetrics({
        modelType,
      })
      .join(',');

    const payload = {
      id,
      modelName,
      evaluatorType: modelType + 'evaluator',
        options: {
          label,
          metric,
          'featurescolumn': featuresColumns,

        },
    };
    return this.evaluateModel(payload)
      .then(res => {
        return res;
        // return reduce(res.measures, (prev, value, key) => {
        //   if (!isNaN(parseInt(value * 100, 10))) {
        //     prev.categories.push(key);
        //     prev.data.push(parseInt(value * 100, 10));
        //   }
        //
        //   return prev;
        // }, {
        //   categories: [],
        //   data: [],
        //   ...res,
        // });
      });
  }

  _getMetrics({
    modelType,
  }) {
    const types = {
      'regression': () => {
        return [
          'rmse',
          'mse',
          'r2',
          'mae',
        ];
      },
      'classification': () => {
        return [
          'areaUnderROC',
          'areaUnderPR',
          'TP',
          'FP',
          'F1',
          'recall',
          'precision',
          'roccurve',
          'confusionMatrix',
        ];
      },
    };

    try {
      return types[modelType]();
    } catch (e) {
      return [];
    }
  }

  _makeEvaluateRequest({
    url = '/ml/evaluatemodel',
      payload,
  }) {
    return this.api.post(url, payload);
  }
}
