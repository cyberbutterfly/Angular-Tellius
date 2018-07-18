import {
  isNull,
}
from 'lodash/lang';

class Controller {
  /*@ngInject*/
  constructor($state, $stateParams) {
    if (isNull($stateParams.options)) {
      $state.go('app.dataset.create');
    } else {
      $state.go('app.dataset.wizard.name', $stateParams);
    }
  }
}

/*@ngInject*/
const State = ($stateProvider) => {
  $stateProvider.state('app.dataset.wizard.json', {
    url: '/json',
    controller: Controller,
    params: {
      options: null,
    },
  });
};

export default State;
