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
    .state('app.ml.wizard.selection', {
      url: '/train',
      template: `<ml-selection-view-model
      options="options"
      form-state="formState"></ml-selection-view-model>`,
      controller: Controller,
      resolve: {
        $formState: /*@ngInject*/ ($timeout, $state, MLWizard) => {
          return new Promise((resolve, reject) => {
            $timeout(() => {
              const state = MLWizard.getState({type: 'selection'});

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
