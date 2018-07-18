import FormCtrl from '../../model.class';

export default class GBTClassifierController extends FormCtrl {
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
      FormData = state.formState.gbtclassifier;
    } catch (e) {
      FormData = {};
    }
    this.bindEvents({
      modelName: 'gbtclassifier',
    });

    this.FormData = {
      modelname: 'gbtclassifier',
      maxbins: '100',
      maxdepth: '10',
      impurity: 'gini',
      subsamplingRate: '1',
      stepSize: '0.1',
      maxIter: '20',
      ...FormData,
    };

    this.inpurityOptions = ['gini', 'entropy'];
  }

  onSubmit({
    sourceId,
    initialSourceId,
    labelIndex,
    pipelineIds,
    featuresColumns,
  }) {
      const FormData = this.formDataToString(this.FormData);
      const options = {
        label: labelIndex,
        featurescolumn: featuresColumns.join(','),
        ...FormData,
      };

      return this.MLAPI.gbtclassifier({
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
            algorithm: 'gbtclassifier',
          });
        });
  }
}
