import FormCtrl from '../../model.class';
import _ from 'lodash';

export class LinearRegressionModelController extends FormCtrl {
  /*@ngInject*/
  constructor($scope, MLAPI, MLStorageService, MLWizard) {
    super($scope, MLAPI, MLStorageService, MLWizard);
    this.MLAPI            = MLAPI;
    this.MLStorageService = MLStorageService;
    this.MLWizard         = MLWizard;
  }

  $onInit() {
    const state = this.MLWizard.getState({type: 'selection'});
    let FormData;

    try {
      FormData = state.formState.linearregression;
    } catch (e) {
      FormData = {};
    }

    this.bindEvents({
      modelName: 'linearregression',
    });

    this.FormData = {
      numofiteration: 20,
      modelname: 'LinearRegression',
      ...FormData,
    };
  }

  onSubmit(
    {
      sourceId,
      initialSourceId,
      labelIndex,
      pipelineIds,
      featuresColumns,
    }
  ) {
    const FormData = this.formDataToString(this.FormData);
    const options  = {
      label: labelIndex,
      featurescolumn: featuresColumns.join(','),
      ...FormData,
    };

    return this.MLAPI.linearRegression({
      id: sourceId,
      options,
    })
      .then(data => {
        return this.trainPipeline({
          sourceId: initialSourceId,
          pipelineIds: pipelineIds,
          modelName: this.FormData.modelname,
          modelData: data,
          FormData: this.FormData,
          algorithm: 'linearregression',
        });
      })
      .catch(e => {
        return Promise.reject(e.message);
      });
  }

  _validate() {
    this.errors = [];

    if (!_.isUndefined(this.FormData.numofiteration) &&
      this.FormData.numofiteration < 0) {
      this.errors.push({
        field: 'numofiteration',
        description: 'numofiteration shoud be a positive number',
      });
    }

    if (!_.isUndefined(this.FormData.elasticnetparam) &&
      this.FormData.elasticnetparam < 0) {
      this.errors.push({
        field: 'elasticnetparam',
        description: 'elasticnetparam shoud be a positive number',
      });
    }

    if (!_.isUndefined(this.FormData.regparam) &&
      this.FormData.regparam < 0) {
      this.errors.push({
        field: 'regparam',
        description: 'numofiteration shoud be a positive number',
      });
    }

    return this.errors.length === 0;
  }
}
