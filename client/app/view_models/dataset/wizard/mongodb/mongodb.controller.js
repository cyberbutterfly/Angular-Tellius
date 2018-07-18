import {
  isString,
}
from 'lodash/lang';

export class MongoDBController {
  /*@ngInject*/
  constructor($state, LoadAPI) {
    this.$state = $state;
    this.LoadAPI = LoadAPI;

    this.FormData = {
      sourcetype: 'mongodb',
      ...this.options,
    };

    this.errors = [];
  }

  onSubmit() {
    if (this._validate()) {
      this.$state.go('app.dataset.wizard.name', {
        options: {
          ...this.FormData,
        },
      });
    }
  }

  _validate() {
    this.errors = [];

    if (!isString(this.FormData.host) || this.FormData.host.length === 0) {
      this.errors.push({
        field: 'host',
        value: 'host is a string',
      });
    }

    if (!isString(this.FormData.port) || this.FormData.port.length === 0) {
      this.errors.push({
        field: 'port',
        value: 'port is a string',
      });
    }

    if (!isString(this.FormData.database) || this.FormData.database.length ===
      0) {
      this.errors.push({
        field: 'database',
        value: 'database is a string',
      });
    }

    if (!isString(this.FormData.username) || this.FormData.username.length ===
      0) {
      this.errors.push({
        field: 'username',
        value: 'username is a string',
      });
    }

    if (!isString(this.FormData.password) || this.FormData.password.length ===
      0) {
      this.errors.push({
        field: 'password',
        value: 'password is a string',
      });
    }

    if (!isString(this.FormData.collection) || this.FormData.collection.length ===
      0) {
      this.errors.push({
        field: 'collection',
        value: 'collection is a string',
      });
    }

    return this.errors.length === 0;
  }
}
