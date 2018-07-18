import {
  isNull,
}
from 'lodash/lang';

class Controller {
  /*@ngInject*/
  constructor($scope, $state, $stateParams) {
    if (isNull($stateParams.options)) {
      $state.go('app.dataset.create');
    } else {
      $scope.options = $stateParams.options;
    }
  }
}

/*@ngInject*/
const State = ($stateProvider) => {
  $stateProvider.state('app.dataset.wizard.hadoop', {
    url: '/hadoop',
    template: `<hadoop-component options="options"></hadoop-component>`,
    params: {
      options: {
        path: '/mnt/test_data/parquet_data/test.parquet',
      },
    },
    controller: Controller,
  });
};

export default State;
