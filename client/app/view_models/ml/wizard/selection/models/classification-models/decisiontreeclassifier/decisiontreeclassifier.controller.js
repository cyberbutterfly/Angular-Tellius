import FormCtrl from '../../model.class';

export class DecisionTreeClassifierController extends FormCtrl {
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
      FormData = state.formState.decisiontreeclassifier;
    } catch (e) {
      FormData = {};
    }

    this.bindEvents({
      modelName: 'decisiontreeclassifier',
    });

    this.FormData = {
      modelname: 'DecisionTreeClassifier',
      maxbins: '100',
      maxdepth: '10',
      impurity: 'gini',
      ...FormData,
    };

    this.inpurityOptions = [
      'gini',
      'entropy',
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

      return this.MLAPI.decisiontreeclassifier({
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
            algorithm: 'decisiontreeclassifier',
          });
        });
  }
}
