export

class Controller {
  /*@ngInject*/
  constructor($scope, $stateParams) {
    $scope.options = $stateParams.options;
  }
}

/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.dataset.wizard.oracle', {
    url: '/oracle',
    template: `<create-dataset-oracle options='options'></create-dataset-oracle>`,
    params: {
      options: {
        sourcetype: 'jdbc',
        url: 'jdbc:oracle:thin:@ec2-52-90-155-134.compute-1.amazonaws.com:1521:XE',
        dbtable: 'temp_table',
        driver: 'oracle.jdbc.driver.OracleDriver',
        user: 'external_oracle_user',
        password: 'sparkDEVoracle',
      },
    },
    controller: Controller,
  });
};

export default State;
