class SettingsGroupsController {
  /*@ngInject*/
  constructor ($scope, $mdDialog, GroupsModel, ConfirmService) {
    this.GroupsModel            = GroupsModel;
    this.ConfirmService         = ConfirmService;
    this.$scope                 = $scope;
    this.$mdDialog              = $mdDialog;
    this.selectedGroup          = null;
  }

  $onInit () {
    if (this.groups.length > 0) {
      this.selectGroup(this.groups[0]);
    }
  }

  selectGroup (group) {
    angular.forEach(this.groups, (groupIterator) => {
      groupIterator.selected = false;
    });
    group.selected = true;
    this.selectedGroup = group;
    this.$scope.$broadcast('SelectedGroupChanged');
  }

  addGroup ($event) {
    this.$mdDialog.show({
      targetEvent: $event,
      template:
        '<md-dialog>' +
        '  <md-dialog-content>' +
        '    <h3>Add Group</h3>' +
        '    <md-input-container>' +
        '      <label>Name</label>' +
        '      <input type="text" ng-model="data.name">' +
        '    </md-input-container>' +
        '  </md-dialog-content>' +
        '  <md-dialog-actions>' +
        '    <md-button ng-click="submit()" class="md-primary">' +
        '      Add Group' +
        '    </md-button>' +
        '    <md-button ng-click="cancel()" class="transparent">' +
        '      Cancel' +
        '    </md-button>' +
        '  </md-dialog-actions>' +
        '</md-dialog>',
      controller: ($scope, $mdDialog) => {
        $scope.submit = () => {
          $mdDialog.hide($scope.data);
        };
        $scope.cancel = () => {
          $mdDialog.cancel();
        };
      },
      locals: { data: {}}
    }).then(groupData => {
      return this.GroupsModel.createGroup(groupData);
    }).then(() => {
      this.__refreshGroups();
    });
  }

  deleteGroup (group) {
    this.ConfirmService.open({
      label: 'Delete',
    })
      .then(() => {
        return this.GroupsModel.deleteGroup({
          id: group.id,
        });
      })
      .then(() => {
        this.__refreshGroups();
      });
  }

  refreshSelectedGroup () {
    return this.GroupsModel.getGroup({id: this.selectedGroup.id}).then((res) => {
      this.selectedGroup = res;
      this.$scope.$digest();
    });
  }

  __refreshGroups () {
    this.GroupsModel.getGroups({}).then((res) => {
      this.groups = res.groups;
      this.$scope.$digest();
    });
  }
}

export default SettingsGroupsController;
