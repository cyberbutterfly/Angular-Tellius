class SettingsGroupsPermissionsController {
  /*@ngInject*/
  constructor(UserService) {
    this.UserService = UserService;

    this.permissionsList = [{
      "id": "1",
      "name": "Can import dataset",
      "enabled": true
    },{
      "id": "2",
      "name": "Can Train ML models",
      "enabled": true
    },
    {
      "id": "3",
      "name": "Can create indicators",
      "enabled": false
    },
    {
      "id": "4",
      "name": "Can create and schedule DataFlow",
      "enabled": true
    }];

  }

}

export default SettingsGroupsPermissionsController;
