class AnalyticsListController {
  /*@ngInject*/
  constructor($state, $scope, $timeout, MLAPI, ConfirmService) {
    this.$scope         = $scope;
    this.$state         = $state;
    this.$timeout       = $timeout;
    this.MLAPI          = MLAPI;
    this.ConfirmService = ConfirmService;
  }

  useModelPopup(module) {
    this.$state.go('app.analytics.list.predict', {model: module});
  }

  removeModel(model) {
    this.ConfirmService.open({
      label: 'Delete',
    })
      .then(() => {
        console.log('removeModel', model);
        return this.MLAPI.deleteModel({
          modelname: model.modelname,
        });
      })
      .then(() => {
        this.__updateModels();
      });
  }

  __updateModels() {
    this.MLAPI.list({ids: 'all'}).then((res) => {
      this.$timeout(() => {
        this.models = res.results;
        this.$scope.$digest();
      });
    });
  }
}

export default AnalyticsListController;
