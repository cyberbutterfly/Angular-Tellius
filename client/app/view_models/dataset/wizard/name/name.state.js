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
    .state('app.dataset.wizard.name', {
      url: '/name',
      template: '<dataset-name-view-model options="options"></dataset-name-view-model>',
      params: {
        options: null,
      },
      controller: Controller,
    });
};

export default State;
