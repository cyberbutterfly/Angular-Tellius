class SettingsGroupsMembersController {
  /*@ngInject*/
  constructor ($scope, $mdToast, UsersModel, ConfirmService, ngDialog) {
    this.$scope                = $scope;
    this.$mdToast              = $mdToast;
    this.UsersModel            = UsersModel;
    this.ConfirmService        = ConfirmService;
    this.ngDialog              = ngDialog;
    this.members               = [];
  }

  $onInit () {
    this.$scope.$on('SelectedGroupChanged', this.__refreshMembers.bind(this));
    this.__refreshMembers();
  }

  removeMember (member) {
    this.ConfirmService.open({
      label: 'Delete',
    })
      .then(() => {
        const selectedGroup     = this.$scope.$parent.$ctrl.selectedGroup;
        _.remove(member.groups, { 'id': selectedGroup.id });

        return this.UsersModel.updateMemberGroups({
          id: member.id,
          groups: member.groups,
        });
      })
      .then(() => {
        this.__refreshMembers();
        this.$mdToast.show(
          this.$mdToast.simple()
            .content('Selected member removed successfully!')
            .hideDelay(3000)
        );
      });
  }

  addMembers () {
    const selectedGroup     = this.$scope.$parent.$ctrl.selectedGroup;
    if (!selectedGroup) {
      return;
    }

    const savedThis = this;
    this.getMembersThatCanBeAdded().then(candidateMembers => {
      this.ngDialog.open({
        template: `<settings-groups-add-members-popup candidate-members="candidateMembers" submit-selected-members="submitSelectedMembers(selectedMembers)"></settings-groups-add-members-popup>`,
        plain: true,
        controller: ($scope) => {
          $scope.candidateMembers = candidateMembers;
          $scope.submitSelectedMembers = (selectedMembers) => {
            $scope.closeThisDialog(selectedMembers);
          };
        },
        className: 'ngdialog-theme-default',
      }).closePromise.then((selectedMembers) => {
          let promises = [];
          angular.forEach(selectedMembers.value, (selectedMember) => {
            selectedMember.groups.push(selectedGroup);
            const promise = savedThis.UsersModel.updateMemberGroups({
              id: selectedMember.id,
              groups: selectedMember.groups,
            });
            promises.push(promise);
          });
          Promise.all(promises).then(() => {
            savedThis.__refreshMembers();
            savedThis.$mdToast.show(
              savedThis.$mdToast.simple()
                .content('Selected users added successfully!')
                .hideDelay(3000)
            );
          }).catch((err) => {
            savedThis.$mdToast.show(
              savedThis.$mdToast.simple()
                .content(err.message)
                .hideDelay(3000)
            );
          });
      });
    });
  }

  getMembersThatCanBeAdded () {
    const savedThis = this;
    return this.UsersModel.getUsers({}).then(allMembersResult => {
      const membersResult = _.filter(allMembersResult.users, (memberIterator) => {
        return (_.findIndex(savedThis.members, { id: memberIterator.id }) < 0);
      });
      return membersResult;
    });
  }

  __refreshMembers () {
    const selectedGroup = this.$scope.$parent.$ctrl.selectedGroup;
    if (selectedGroup) {
      this.UsersModel.getUsers({ groupId: selectedGroup.id }).then(groupMembersResult => {
        this.members = groupMembersResult.users;
        this.$scope.$digest();
      });
    }
  }
}

export default SettingsGroupsMembersController;
