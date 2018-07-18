import FormCtrl from '../../model.class';
import _ from 'lodash';

export class RidgeRegressionController extends FormCtrl {
  /*@ngInject*/
  constructor($scope, MLAPI, MLStorageService, MLWizard) {
    super($scope, MLAPI, MLStorageService, MLWizard);
    this.MLAPI                 = MLAPI;
    this.MLStorageService      = MLStorageService;
    this.MLWizard              = MLWizard;
  }

  $onInit() {
    this.bindEvents({
      modelName: 'ridgeRegressionWithSGD',
    });

    const state = this.MLWizard.getState({type: 'selection'});
    let FormData;

    try {
      FormData = state.formState.ridgeRegressionWithSGD;
    } catch (e) {
      FormData = {};
    }

    this.FormData = {
      numofiteration: 20,
      regparam: 0.01,
      elasticnetparam: 0.0,
      modelname: 'RidgeRegression',
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
    if (this._validate()) {
      const FormData = this.formDataToString(this.FormData);
      const options  = {
        label: labelIndex,
        featurescolumn: featuresColumns.join(','),
        ...FormData,
      };

      return this.MLAPI.ridgeRegressionWithSGD({
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
            algorithm: 'ridgeRegressionWithSGD',
          });
        })
        .catch(e => Promise.reject(e));
    } else { //eslint-disable-line no-else-return
      return Promise.reject('ridgeRegressionWithSGD: wrong arguments');
    }
  }

  _validate() {
    this.errors = [];

    if (_.isUndefined(this.FormData.numofiteration)) {
      this.errors.push({
        field: 'numofiteration',
        description: 'Number of iteration is required',
      });
    }

    if (!_.isNumber(this.FormData.numofiteration)) {
      this.errors.push({
        field: 'numofiteration',
        description: 'Number of iteration is a number field',
      });
    }

    if (_.isUndefined(this.FormData.regparam)) {
      this.errors.push({
        field: 'regparam',
        description: 'Reg param is required',
      });
    }

    if (!_.isNumber(this.FormData.regparam)) {
      this.errors.push({
        field: 'regparam',
        description: 'Reg param is a number field',
      });
    }

    if (_.isUndefined(this.FormData.elasticnetparam)) {
      this.errors.push({
        field: 'elasticnetparam',
        description: 'Elasticnetparam is required',
      });
    }

    if (!_.isNumber(this.FormData.elasticnetparam)) {
      this.errors.push({
        field: 'elasticnetparam',
        description: 'elasticnetparam is a number field',
      });
    }

    return this.errors.length === 0;
  }
}
