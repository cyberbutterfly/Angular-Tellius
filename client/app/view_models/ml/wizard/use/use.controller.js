import _ from 'lodash';

export class UseController {
  /*@ngInject*/
  constructor($state, MLPredictService) {
    this.$state = $state;
    this.MLPredictService = MLPredictService;

    this.selectedModel = null;
    this.selectedModelName = null;
  }

  $onInit() {
    if (this.models.length === 1) {
      this.selectedModel = this.models[0];
    }
  }

  onChange() {
    this.selectedModel = _.find(this.models, model => {
      return this.selectedModelName === model.modelname;
    });
  }

  isSelected() {
    return !_.isNull(this.selectedModel);
  }

  use() {
    this.MLPredictService.useModelPopup(this.selectedModel);
  }
}
