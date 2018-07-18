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
  $stateProvider.state('app.dataset.wizard.mongodb', {
    url: '/mongodb',
    template: '<mongodb-view-model options="options"></mongodb-view-model>',
    params: {
      options: {
        host: 'ds033757.mlab.com',
        port: '33757',
        database: 'database4test',
        collection: 'tellius',
        username: 'tellius',
        password: 'tellius',
      },
    },
    controller: Controller,
  });
};

export default State;
