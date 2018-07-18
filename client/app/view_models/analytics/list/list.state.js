/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.analytics.list', {
    url: '/list',
    bindings: {
      'models': '<',
    },
    controller: /*@ngInject*/ ($scope, $models) => {
      $scope.models = $models;
    },
    resolve: {
      /*@ngInject*/
      $models: (MLAPI) => {
        return MLAPI.list({ids: 'all'}).then(({
          results,
        }) => {
          return results;
        });
      },
    },
    template: '<analytics-list-view-model models="models"></analytics-list-view-model>',
  });
};

export default State;
