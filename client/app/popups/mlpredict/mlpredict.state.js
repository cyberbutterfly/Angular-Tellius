class Controller {
  /*@ngInject*/
  constructor($scope, DatasetStorageService) {
    console.log('ctrl popup', this, $scope);
    $scope.datasets = DatasetStorageService.getList();
    $scope.currentDataset = DatasetStorageService.getDataset();
  }
}

/*@ngInject*/
const popup = ($state, ngDialog) => {
  ngDialog.open({
    template: `<ml-predict-popup
      close-this-dialog="closeThisDialog"></ml-predict-popup>`,
    className: 'ngdialog-theme-default big',
    plain: true,
    controller: Controller,
  });
};

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.analytics.list.predict', {
    onEnter: popup,
    params: { model: null },
  });
};

export default State;

export class MLPredictService {
  /*@ngInject*/
  constructor($rootScope, ngDialog) {
    this.$rootScope = $rootScope;
    this.ngDialog = ngDialog;
  }

  useModelPopup(model) {
    const scope = this.$rootScope.$new(true);
    scope.model = model;

    this.ngDialog.open({
      template: `<ml-predict-popup
        model="model"
        close-this-dialog="closeThisDialog"></ml-predict-popup>`,
      className: 'ngdialog-theme-default big',
      plain: true,
      controller: Controller,
      scope,
    });
  }
}
