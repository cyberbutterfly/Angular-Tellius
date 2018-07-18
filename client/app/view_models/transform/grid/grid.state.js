import _ from 'lodash';

class Controller {
  /*@ngInject*/
  constructor($scope, $rootScope, TransformAPI,
    DatasetStorageService) {
    $scope.dataset = DatasetStorageService.getDataset();

    let initialColumns = undefined;
    const getInitialCols = $scope.$watch('selectedColumns', (cols) => {
      if (_.isArray(cols)) {
        initialColumns = cols;
        getInitialCols();
      }
    });

    const listener = $rootScope.$on('$stateChangeStart', (
      event,
      toState,
      toParams,
      fromState) => {
      listener();
      if (toState.name.indexOf(fromState.name) !== 0 && toState.name !==
        'app.transform.grid' && initialColumns !== $scope.selectedColumns
      ) {
        TransformAPI.columnSelect({
            columns: $scope.selectedColumns.join(','),
          })
          .then(res => {
            DatasetStorageService.setCurrent(res);
          });
      }

      return;
    });

    $scope.$on('$destroy', () => {
      listener();
    });
  }
}

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.transform.grid', {
      url: '/grid',
      template: `<transform-grid
      dataset="dataset"
      selected-columns="selectedColumns"></transform-grid>`,
      controller: Controller,
    });
};

export default State;
