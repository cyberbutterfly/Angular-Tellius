/*@ngInject*/
const State = $stateProvider => {
  $stateProvider.state('app.settings.groups.members.addMembers', {
    url: '/add-members',
  });
};

export default State;
