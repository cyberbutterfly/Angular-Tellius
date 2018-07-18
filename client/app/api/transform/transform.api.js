import {
  isString,
  isArray,
}
from 'lodash/lang';

export class TransformAPI {
  /*@ngInject*/
  constructor($q, ApiWrapper, DatasetStorageService) {
    this.$q = $q;
    this.api = ApiWrapper;
    this.DatasetStorageService = DatasetStorageService;
  }

  handleNull({
    sourceId,
    columnNames,
    handleWith,
  }) {
    if (!isString(columnNames)) {
      return this.$q.reject('Wrong arguments');
    }

    const payload = {
      sourceid: sourceId,
      transformationtype: 'handlenull',
      options: {
        columnnames: columnNames,
        handlewith: handleWith,
      },
    };

    return this._makeTransformRequest(payload);
  }

  cast({
    id = this.DatasetStorageService.getCurrent(),
      column,
      type,
      format,
  }) {
    if (!isString(column)) {
      return this.$q.reject('Wrong arguments');
    }

    const payload = {
      'sourceid': id,
      'transformationtype': 'cast',
      'options': {
        columnnames: column,
        datatype: type,
        format,
      },
    };

    return this._makeTransformRequest(payload);
  }

  columnSelect({
    id = this.DatasetStorageService.getCurrent(),
      columns,
      select = 'true',
  }) {
    let columnnames = null;

    if (!isArray(columns) && !isString(columns)) {
      return this.$q.reject('Wrong arguments');
    }

    if (isArray(columns)) {
      columnnames = columns.join(', ');
    }

    if (isString(columns)) {
      columnnames = columns;
    }

    const payload = {
      'sourceid': id,
      'transformationtype': 'columnselect',
      'options': {
        select,
        columnnames,
      },
    };

    return this._makeTransformRequest(payload);
  }

  _makeTransformRequest(payload) {
    return this.api.post('transform', payload)
      .then(res => {
        return res.sourceId;
      });
  }
}
