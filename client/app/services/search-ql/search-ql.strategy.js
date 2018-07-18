import EventEmitter from 'eventemitter3';
import _ from 'lodash';

export class SearchQLStrategy extends EventEmitter {
  /*@ngInject*/
  constructor($state, SearchqlService, DatasetStorageService, ApiWrapper) {
    super();

    this.$state = $state;
    this.SearchqlService = SearchqlService;
    this.DatasetStorageService = DatasetStorageService;
    this.api = ApiWrapper;

    this.FormData = null;

    this.options = new Map();
    this._setOptions();
  }

  exec({
    type,
    data,
  }) {
    let result = false;

    if (this.options.has(type)) {
      result = this.options.get(type)(data);
    }

    return result;
  }

  _barChartHandler(data) {
    this.SearchqlService.setData(data);
    this.$state.go('app.explore', {}, {
      reload: true,
    });
  }

  _transformHandler(data) {
    data = _.omit(data, 'responseType');

    try {
      data.options = JSON.parse(data.options);
    } catch (e) {
      data.options = {};
    }

    return this.api.post('transform', data)
      .then(res => {
        this.DatasetStorageService.setCurrent(res.sourceId);
        this.$state.go('app.transform.grid', {}, {
          reload: true,
        });

        return res.sourceId;
      });
  }

  _errorHandler(data) {
    console.error(data.msg);
  }

  _setOptions() {
    this.options.set('bar chart', data => this._barChartHandler(data));
    this.options.set('chart', data => this._barChartHandler(data));
    this.options.set('transformAPI', data => this._transformHandler(data));
    this.options.set('error', data => this._errorHandler(data));
  }

}
