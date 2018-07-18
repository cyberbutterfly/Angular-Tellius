/*@ngInject*/
class Controller {
  constructor($scope, DatasetStorageService) {
    const dataset = DatasetStorageService.getDataset();
    $scope.dataset = dataset;
  }
}

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.transform.list', {
      url: '/list',
      template: `<grid-list-view dataset="dataset"></grid-list-view>`,
      controller: Controller,
    });
};

export default State;
