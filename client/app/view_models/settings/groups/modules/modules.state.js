/*@ngInject*/
const State = $stateProvider => {
  $stateProvider
    .state('app.settings.groups.modules', {
      url: '/modules',
      bindings: {
        modules: '<',
      },
      controller: /*@ngInject*/ ($scope, $modules) => {
        $scope.modules = $modules;
      },
      resolve: {
        /*@ngInject*/
        $modules: ModulesModel => {
          return ModulesModel.getModules({}).then(modulesResult => {
            return modulesResult.modules;
          });
        },
      },
      template: `<settings-groups-modules-view-model modules="modules"></settings-groups-modules-view-model>`,
    });
};

export default State;
