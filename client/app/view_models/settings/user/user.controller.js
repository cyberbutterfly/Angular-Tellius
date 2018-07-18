import md5 from 'md5';

class SettingsUserController {
  /*@ngInject*/
  constructor ($mdToast, UsersModel) {
    this.UsersModel             = UsersModel;
    this.$mdToast               = $mdToast;
    this.FormData               = {...this.profile};
  }

  openAvatarUploadModal () {

  }

  saveUserDetails () {
    this.FormData.password = md5(this.FormData.newPassword);
    delete this.FormData.newPassword;
    delete this.FormData.confirmNewPassword;
    delete this.FormData.datasetAccesses;
    delete this.FormData.groups;

    this.UsersModel.updateUser(this.FormData).then((response) => {
      this.FormData = response;
      this.$mdToast.show(
        this.$mdToast.simple()
          .content('User Info Updated Successfully!')
          .hideDelay(3000)
      );
    });
  }
}

export default SettingsUserController;
