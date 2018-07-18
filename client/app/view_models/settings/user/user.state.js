/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.settings.user', {
      url: '/user',
      bindings: {
        'profile': '<',
      },
      controller: /*@ngInject*/ ($scope, $profile) => {
        $scope.profile = $profile;
      },
      resolve: {
        /*@ngInject*/
        $profile: (UsersModel, UserService) => {
          const currentUserAuthData = UserService.getCurrentUserAuthData();
          return UsersModel.getUser({id: currentUserAuthData.id});
        },
      },
      template: `<settings-user-view-model profile="profile"></settings-user-view-model>`,
    });
};

export default State;
