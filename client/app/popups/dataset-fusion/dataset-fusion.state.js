class Controller {
  /*@ngInject*/
  constructor($scope, DatasetStorageService) {
    $scope.datasets = DatasetStorageService.getList();
    $scope.currentDataset = DatasetStorageService.getDataset();
  }
}

/*@ngInject*/
const popup = ($state, ngDialog) => {
  let cbValue = null;

  ngDialog.open({
      template: `<dataset-fusion-popup
      current-dataset="currentDataset"
      datasets="datasets"
      close-this-dialog="closeThisDialog"></dataset-fusion-popup>`,
      className: 'ngdialog-theme-default big',
      plain: true,
      preCloseCallback: (value) => {
        cbValue = value;
        return true;
      },
      controller: Controller,
    })
    .closePromise.then(() => {
      if (cbValue !== 'redirect') {
        $state.go('^');
      }
    });
};

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.transform.grid.fusion', {
    url: '/fusion',
    onEnter: popup,
  });
};

export default State;
