import _ from 'lodash';

export default class MeasuresModel {
  /*@ngInject*/
  constructor(EvaluateAPI, CompareAPI, MLStorageService) {
    this.EvaluateAPI = EvaluateAPI;
    this.CompareAPI = CompareAPI;
    this.MLStorageService = MLStorageService;
  }

  getMeasures({
    subsetSourceId,
    models,
    labelIndex,
    featuresColumns,
    modelType,
  }) {
    const series = [];

    for (const model of models) {
      const promise = this.__evaluateModel({
        subsetSourceId,
        model,
        labelIndex,
        featuresColumns,
        modelType,
      });

      series.push(promise);
    }

    return new Promise((resolve, reject) => {
      Promise.all(series)
        .then(data => {
          const modelObj = _.reduce(data, (prev, value) => {
            const modelName = Object.keys(value)[0];
            prev[modelName] = value[modelName];
            return prev;
          }, {});

          resolve(modelObj);
        })
        .catch(reject);
    });
  }

  __evaluateModel({
    subsetSourceId,
    model,
    labelIndex,
    featuresColumns,
    modelType,
  }) {
    const payload = {
      id: subsetSourceId,
      modelType: modelType,
      modelName: model.modelname,
      label: labelIndex,
      featuresColumns: featuresColumns.join(','),
    };

    return this.EvaluateAPI.getMeasures(payload)
      .then(({
        measures,
      }) => {
        return {
          [model.modelname]: measures,
        };
      });
  }
}
