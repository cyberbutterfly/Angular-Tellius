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
const State = $stateProvider => {
  $stateProvider
    .state('app.dataset.wizard.csv', {
      url: '/csv',
      template: `<create-dataset-csv options="options"></create-dataset-csv>`,
      controller: Controller,
      params: {
        options: null,
      },
    });
};

export default State;
