import EventEmitter from 'eventemitter3';
import _ from 'lodash';
import {
  PREDICTION_TYPES,
}
from './ml-storage.types';

export class MLStorageService extends EventEmitter {
  constructor() {
    super();

    this._models = [];
  }

  getModels() {
    return this._models;
  }

  getTypes() {
    return PREDICTION_TYPES;
  }

  getEvaluatorByModelType(modelType) {
    let evaluator = '';

    if (modelType === 'classification') {
      evaluator = 'classificationevaluator';
    } else {
      evaluator = 'regressionevaluator';
    }

    return evaluator;
  }

  getMetricsByEvaluator(evaluator) {
    let result = '';

    if (evaluator === 'regressionevaluator') {
      result = 'rmse,mse,r2,mae';
    } else {
      result = 'areaUnderROC,areaUnderPR,TP,FP,F1,recall,precision,roccurve,confusionMatrix';
    }

    return result;
  }

  addModel(model) {
    if (!_.find(this._models, model) && !_.isUndefined(model)) {
      this._models.push(model);
    }
  }

  getCategories(modelType) {
    const MODEL_TYPES = {
      'classification': () => {
        return [{
          name: 'decisiontreeclassifier',
          prettyName: 'Decision Tree Classifier',
        },
        {
          name: 'randomforestclassifier',
          prettyName: 'Random forest classifier',
        },
        {
          name: 'gbtclassifier',
          prettyName: 'GBT classifier',
        },
      ];
      },
      'regression': () => {
        return [{
          name: 'linearregression',
          prettyName: 'Linear Regression',
        }, {
          name: 'decisiontreeregressor',
          prettyName: 'Tree Regresssion',
        }, {
          name: 'ridgeregressionwithsgd',
          prettyName: 'Linear regression with Regularization',
        }];
      },
      'clustering': () => {
        return [{
          name: 'kmeans',
          prettyName: 'K Clustering',
        }];
      },
    };

    try {
      return MODEL_TYPES[modelType]();
    } catch (e) {
      return MODEL_TYPES.classification();
    }
  }

  resetModels() {
    this._models = [];
  }
}
