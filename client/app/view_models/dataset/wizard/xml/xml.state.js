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
    .state('app.dataset.wizard.xml', {
      url: '/xml',
      template: `<create-dataset-xml options="options"></create-dataset-xml>`,
      controller: Controller,
      params: {
        options: null,
      },
    });
};

export default State;
