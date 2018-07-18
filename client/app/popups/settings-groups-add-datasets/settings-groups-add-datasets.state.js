/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.settings.groups.members.addDatasets', {
    url: '/add-datasets',
  });
};

export default State;
