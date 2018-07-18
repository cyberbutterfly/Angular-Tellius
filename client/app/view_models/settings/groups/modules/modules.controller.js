class SettingsGroupsModulesController {
  /*@ngInject*/
  constructor ($scope, GroupsModel) {
    this.$scope                  = $scope;
    this.GroupsModel             = GroupsModel;
    this.selectedGroupDetails    = this.$scope.$parent.$ctrl.selectedGroup;
  }

  $onInit () {
    this.initializeModuleSelections();
  }

  initializeModuleSelections () {
    const savedThis = this;
    angular.forEach(this.modules, module => {
      const foundIndex = savedThis.selectedGroupDetails.modulesAccesses.findIndex(module.name);
      if (foundIndex < 0) {
        module.selected = false;
      } else {
        module.selected = true;
      }
    });
  }

  updateModuleAccesses () {
    const savedThis = this;
    const selectedModules = _.map(_.filter(savedThis.modules, {selected: true}), module => { return module.name });

    this.GroupsModel.updateGroup({
      id: this.selectedGroupDetails.id,
      modulesAccesses: selectedModules,
    }).then(() => {
      this.$scope.$parent.$ctrl.refreshSelectedGroup().then(() => {
        initializeModuleSelections();
      });
    });
  }
}

export default SettingsGroupsModulesController;
