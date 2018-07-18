/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.dataset.wizard.cassandra', {
    url: '/cassandra',
    template: `<create-dataset-cassandra options="options"></create-dataset-cassandra>`,
    params: {
      options: {
        sourcetype: 'cassandra',
        keyspace: 'tellius',
        table: 'test3',
      },
    },
    controller: ($scope, $stateParams) => {
      $scope.options = $stateParams.options;
    },
  });
};

export default State;
