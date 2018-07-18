import FormCtrl from '../../model.class';

export default class RandomForestClassifierController extends FormCtrl {
  /*@ngInject*/
  constructor($scope, MLAPI, MLStorageService, MLWizard) {
    super($scope, MLAPI, MLStorageService);
    this.MLAPI            = MLAPI;
    this.MLWizard         = MLWizard;
    this.MLStorageService = MLStorageService;
  }

  $onInit() {
    const state = this.MLWizard.getState({type: 'selection'});
    let FormData;

    try {
      FormData = state.formState.randomforestclassifier;
    } catch (e) {
      FormData = {};
    }
    this.bindEvents({
      modelName: 'randomforestclassifier',
    });

    this.FormData = {
      modelname: 'randomforestclassifier',
      maxbins: '100',
      maxdepth: '10',
      numtrees: '20',
      impurity: 'variance',
      subsamplingRate: '1',
      featureSubsetStrategy: 'auto',
      ...FormData,
    };

    this.featureSubsetStrategyOptions = [
      'auto',
      'all',
      'onethird',
      'sqrt',
      'log2',
    ];

    this.inpurityOptions = [
      'variance',
      'entropy',
      'gini',
    ];
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

    return this.MLAPI.randomforestclassifier({
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
          algorithm: 'randomforestclassifier',
        });
      });
  }
}
