class SettingsAppController {
  /*@ngInject*/
  constructor(UserService) {
    this.UserService = UserService;
    
    this.appList = [{"id":"1","name":"Database"}, {"id":"2","name":"Dataset Attributes"}];
    this.selectedAppId = "1";
    this.selectedAppName = "Database";
    
    this.databasesList = [{"name":"Database 1"}, {"name":"Database 2"}, {"name":"Database 3"}];

    this.FormData = {};
    this.columns = ["age", "workclass", "fnlwgt", "education", "education_num", "marital_status", "occupation", "raltionship", "race", "sex", "capital_gain", "capital_loss", "hours_per_week", "native_country", "salary"];
    this.groupBySelectedItem = null;
    this.groupBySearchText = null;
    this.FormData.groupBy = [];
    this.FormData.aggregationColumns = [];


  }

  selectApp(app){
    this.selectedAppId = app.id;
    this.selectedAppName = app.name;
  }

}

export default SettingsAppController;
