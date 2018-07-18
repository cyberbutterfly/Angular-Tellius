import _ from 'lodash';
export default class HandleColumnsPopupController {
  /*@ngInject*/
  constructor(ColumnAPI) {
    this.ColumnAPI = ColumnAPI;
  }

  $onInit() {
    this.FormData = {};
  }

  onSubmit() {
    let handlewith = this.FormData.type;

    if (this.FormData.type === 'value' && _.isString(this.FormData.value)) {
      handlewith = this.FormData.value;
    }

    this.ColumnAPI.handleColumns({
        columnNames: this.columnName,
        handlewith,
      })
      .then(() => {
        this.closeThisDialog();
      })
      .catch(error => {
        this.error = error;
      });
  }
}
