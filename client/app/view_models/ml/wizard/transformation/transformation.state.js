import _ from 'lodash';

class Controller {
  /*@ngInject*/
  constructor($scope, $formState) {
    $scope.options = $formState.options;
    $scope.formState = $formState.formState;
  }
}

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.ml.wizard.transformation', {
      url: '/transformation',
      template: `<ml-transformation
      options="options"
      form-state="formState"></ml-transformation>`,
      controller: Controller,
      resolve: {
        $formState: /*@ngInject*/ ($timeout, $state, MLWizard) => {
          return new Promise((resolve, reject) => {
            $timeout(() => {
              const state = MLWizard.getState({type: 'transformation'});

              if (_.isEmpty(state)) {
                reject();
                $state.go('app.ml.create');
              } else {
                resolve({
                  ...state,
                });
              }
            });
          });
        },
      },
    });
};

export default State;
