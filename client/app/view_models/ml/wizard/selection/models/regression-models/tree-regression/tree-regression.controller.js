import FormCtrl from '../../model.class';

export class TreeRegresssionController extends FormCtrl {
  /*@ngInject*/
  constructor($scope, MLAPI, MLStorageService, MLWizard) {
    super($scope, MLAPI, MLStorageService, MLWizard);
    this.MLStorageService = MLStorageService;
    this.MLAPI            = MLAPI;
    this.MLWizard         = MLWizard;
  }

  $onInit() {
    const state = this.MLWizard.getState({type: 'selection'});
    let FormData;

    try {
      FormData = state.formState.decisiontreeregressor;
    } catch (e) {
      FormData = {};
    }

    this.inpurityOptions = [
      'gini',
      'option2',
    ];

    this.FormData = {
      maxdepth: 10,
      maxbins: 942,
      modelname: 'decisiontreeregressor',
      impurity: 'gini',
      ...FormData,
    };

    this.bindEvents({
      modelName: 'TreeRegresssion',
    });
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

      return this.MLAPI.treeRegression({
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
          algorithm: 'decisiontreeregressor',
        });
      });
  }

}
