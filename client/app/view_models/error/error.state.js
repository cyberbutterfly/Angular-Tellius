class Controller {
  /*@ngInject*/
  constructor($scope, $stateParams) {
    $scope.error = $stateParams.error;
  }
}

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('error', {
      url: '/error',
      template: `<error-component error="error"></error-component>`,
      controller: Controller,
      params: {
        error: null,
      },
    });
};

export default State;
