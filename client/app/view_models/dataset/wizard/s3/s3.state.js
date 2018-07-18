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
  $stateProvider.state('app.dataset.wizard.s3', {
    url: '/s3',
    template: `<create-dataset-s3 options="options"></create-dataset-s3>`,
    params: {
      options: {
        accessKeyId: 'AKIAI5IJKUUFSJZCNKPA',
        secretAccessKey: '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',
        region: 'eu-west-1',
        bucket: 'com.maxbarinov.bucket',
      },
    },
    controller: Controller,
  });
};

export default State;
