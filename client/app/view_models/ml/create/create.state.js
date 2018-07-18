import {
  isNull,
}
from 'lodash/lang';

class Controller {
  /*@ngInject*/
  constructor($scope, $state, $stateParams) {
    if (!isNull($stateParams.targetVariable)) {
      $scope.targetVariable = $stateParams.targetVariable;
    }
  }
}

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.ml.create', {
    url: '/create',
    template: '<ml-create-view-model target-variable="targetVariable"></ml-create-view-model>',
    controller: Controller,
    params: {
      targetVariable: null,
    },
  });
};

export default State;
