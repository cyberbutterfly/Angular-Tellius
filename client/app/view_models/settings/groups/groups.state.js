/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.settings.groups', {
      url: '/groups',
      bindings: {
        'groups': '<',
      },
      controller: /*@ngInject*/ ($scope, $groups) => {
        $scope.groups = $groups;
        $scope.selectedGroup = null;
      },
      resolve: {
        /*@ngInject*/
        $groups: GroupsModel => {
          return GroupsModel.getGroups({}).then( groupsResult => {
            return groupsResult.groups;
          });
        },
      },
      redirectTo: 'app.settings.groups.members',
      template: '<settings-groups-view-model groups="groups"></settings-groups-view-model>',
    });
};

export default State;
