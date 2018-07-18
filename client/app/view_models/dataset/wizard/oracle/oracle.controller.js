import _ from 'lodash';

export class Controller {
  /*@ngInject*/
  constructor($state) {
    this.$state = $state;

    this.FormData = {
      ...this.options,
    };
  }

  onSubmit() {
    const data = {
      options: {
        ...this.FormData,
      },
    };

    if (this._validate()) {
      this.$state.go('app.dataset.wizard.name', data);
    }
  }

  _validate() {
    this.errors = [];

    if (!_.isString(this.FormData.url)) {
      this.errors.push({
        field: 'url',
        value: 'url is required',
      });
    }

    if (!_.isString(this.FormData.dbtable)) {
      this.errors.push({
        field: 'dbtable',
        value: 'dbtable is required',
      });
    }

    if (!_.isString(this.FormData.driver)) {
      this.errors.push({
        field: 'driver',
        value: 'driver is required',
      });
    }

    if (!_.isString(this.FormData.user)) {
      this.errors.push({
        field: 'user',
        value: 'user is required',
      });
    }

    if (!_.isString(this.FormData.password)) {
      this.errors.push({
        field: 'password',
        value: 'password is required',
      });
    }

    return this.errors.length === 0;
  }
}
