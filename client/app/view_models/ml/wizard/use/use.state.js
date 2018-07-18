import _ from 'lodash';

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.ml.wizard.use', {
    url: '/use',
    template: `<ml-use-view-model models="models"></ml-use-view-model>`,
    controller: /*@ngInject*/ ($scope, $models) => {
      $scope.models = $models;
    },
    resolve: {
      $models: /*@ngInject*/ ($timeout, $state, $stateParams) => {
        return new Promise((resolve, reject) => {
          const {
            models,
          } = $stateParams;

          $timeout(() => {
            if (_.isNull(models)) {
              $state.go('app.ml.wizard.evaluate');
              reject();
            } else {
              resolve(models);
            }
          });
        });
      },
    },
    params: {
      models: null,
    },
  });
};

export default State;
