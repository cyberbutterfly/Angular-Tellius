import _ from 'lodash';

export class EvaluateController {
  /*@ngInject*/
  constructor($state, $scope, $timeout, MeasuresModel, EvaluateAPI) {
    this.$state        = $state;
    this.$scope        = $scope;
    this.$timeout      = $timeout;
    this.EvaluateAPI   = EvaluateAPI;
    this.MeasuresModel = MeasuresModel;
  }

  $onInit() {
    this.FormData = {
      selectedModels: [],
      selectedModelsSelectedItem: '',
      selectedModelsSearchText: '',
      ...this.formState,
    };

    const selectedModels = [];

    for (const model of this.options.models) {
      selectedModels.push(_.find(this.modelList, i => {
        return model.modelname === i.modelname;
      }));
    }

    this.FormData.selectedModels = selectedModels;

    this.__listener = this.$scope.$watchCollection(
      '$ctrl.FormData.selectedModels', (models, prev) => {
        if (_.isEmpty(models)) return false;
        const selectedModelsList = models
        .filter(i => !_.isUndefined(i))
        .map((
          {
            id, modelname,
          }
        ) => {
          return {
            id,
            modelname,
          };
        });

        if (!_.isEqual(models, prev)) {
          this.MeasuresModel.getMeasures({
            subsetSourceId: this.options.subsetSourceId,
            models: selectedModelsList,
            labelIndex: this.options.labelIndex,
            featuresColumns: this.options.featuresColumns,
            modelType: this.options.modelType,
          })
            .then(data => {
              this.measuresData = data;
              this.$scope.$digest();
            })
            .catch(err => {
              console.log('err', err);
            });
        }
      });
  }

  $onDestroy() {
    this.__listener();
  }

  next() {
    this.$state.go('app.ml.wizard.use', {
      models: this.FormData.selectedModels,
    });
  }

  prev() {
    this.$state.go('app.ml.wizard.selection');
  }

}
