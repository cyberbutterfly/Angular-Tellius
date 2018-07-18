import angular from 'angular';
import {
  TransformModel,
}
from '../transform/transform';
import _ from 'lodash';

class ColumnAPI extends TransformModel {
  /*@ngInject*/
  constructor($q, ApiWrapper, DatasetStorageService, DatasetAPI) {
    super(ApiWrapper, DatasetStorageService, DatasetAPI);

    this.$q = $q;
    this.DatasetAPI = DatasetAPI;
    this.DatasetStorageService = DatasetStorageService;
    this.api = ApiWrapper;
  }

  addColumn(options) {
    let sourceId = this.DatasetStorageService.getCurrent();

    let payload = {
      sourceid: sourceId,
      transformationtype: 'addcolumn',
      options,
    };

    return this.makeTransformRequest(payload);
  }

  moveColumn(columns) {
    if (!angular.isArray(columns)) {
      return this.$q.reject();
    }

    let sourceId = this.DatasetStorageService.getCurrent();

    let payload = {
      sourceid: sourceId,
      transformationtype: 'columnselect',
      options: {
        'select': 'true',
        'columnnames': columns.join(','),
      },
    };

    return this.makeTransformRequest(payload);
  }

  getColStats({
    sourceId = this.DatasetStorageService.getCurrent(),
      columnNames,
  }) {
    const payload = {
      'id': sourceId,
      'viewtype': 'colstats',
      'options': {
        'columnnames': columnNames,
      },
    };
    return this.api.post('view', payload);
  }

  uniqueValueCount({
    sourceId = this.DatasetStorageService.getCurrent(),
      columnNames,
      numofranges = '50',
  }) {
    if (!_.isString(sourceId) || !_.isString(columnNames)) {
      return this.$q.reject('Wrong arguments');
    }
    const payload = {
      'id': sourceId,
      'viewtype': 'uniquevaluecount',
      'options': {
        'columnnames': columnNames,
        'numofranges': numofranges + '',
      },
    };

    return this.api.post('view', payload);
  }

  sort(columnname, type) {
    let sortType = type ? 'asc' : 'desc';
    let sourceId = this.DatasetStorageService.getCurrent();

    let payload = {
      'sourceid': sourceId,
      'transformationtype': 'sort',
      'options': {
        'sortorder': sortType,
        'columnname': columnname,
      },
    };

    return this.makeTransformRequest(payload);
  }

  delete(columnnames) {
    let columnNames = columnnames;
    let sourceId = this.DatasetStorageService.getCurrent();

    if (angular.isString(columnNames)) {
      columnNames = [columnnames];
    }

    if (!angular.isArray(columnNames)) {
      return this.$q.reject('Wrong arguments');
    }

    let payload = {
      'sourceid': sourceId,
      'transformationtype': 'deletecolumn',
      'options': {
        'columnnames': columnNames.join(','),
      },
    };

    return this.makeTransformRequest(payload);
  }

  replace(options) {
    let sourceId = this.DatasetStorageService.getCurrent();

    if (angular.isArray(options.columnnames)) {
      options.columnnames = options.columnnames.join(',');
    }

    let payload = {
      sourceid: sourceId,
      transformationtype: 'findandreplace',
      options,
    };

    return this.makeTransformRequest(payload);
  }

  filter(condition) {
    let sourceId = this.DatasetStorageService.getCurrent();

    let payload = {
      sourceid: sourceId,
      transformationtype: 'filter',
      options: {
        condition,
      },
    };

    return this.makeTransformRequest(payload);
  }

  handleNull(columnnames, handlewith) {
    let columnNames = columnnames;
    let sourceId = this.DatasetStorageService.getCurrent();

    if (angular.isString(columnNames)) {
      columnNames = [columnnames];
    }

    if (!angular.isArray(columnNames)) {
      return this.$q.reject('Wrong arguments');
    }

    let payload = {
      sourceid: sourceId,
      transformationtype: 'handlenull',
      options: {
        columnnames: columnNames.join(','),
        handlewith: handlewith,
      },
    };

    return this.makeTransformRequest(payload);
  }

  handleColumns({
    sourceId = this.DatasetStorageService.getCurrent(),
      columnNames,
      handlewith,
      columntype = 'string',
  }) {
    const columnnames = _.isArray(columnNames) ? columnNames.join(',') : columnNames;
    const payload = {
      'sourceid': sourceId,
      'transformationtype': 'handlecolumns',
      'options': {
        'columnnames': columnnames,
        handlewith,
        columntype,
      },
    };

    return this.makeTransformRequest(payload);
  }

  splitrows(columnname, delimiter) {
    let sourceId = this.DatasetStorageService.getCurrent();

    if (!angular.isString(columnname) || !angular.isString(delimiter)) {
      return this.$q.reject('Wrong arguments');
    }

    let payload = {
      'sourceid': sourceId,
      'transformationtype': 'splitrows',
      'options': {
        columnname,
        delimiter,
      },
    };

    return this.makeTransformRequest(payload);
  }

  mergeColumns(columnnames, mergedcolumnname) {
    let sourceId = this.DatasetStorageService.getCurrent();
    let columnNames = columnnames;

    if (angular.isUndefined(columnnames)) {
      this.$q.reject('Wrong arguments');
    }

    if (angular.isString(columnNames)) {
      columnNames = [columnnames];
    }

    columnNames = columnNames.join(',');

    let payload = {
      'sourceid': sourceId,
      'transformationtype': 'mergecolumns',
      'options': {
        columnnames: columnNames,
      },
    };

    if (angular.isString(mergedcolumnname)) {
      payload.options.mergedcolumnname = mergedcolumnname;
    }

    return this.makeTransformRequest(payload);
  }

  splitcolumn(columnname, delimiter) {
    let sourceId = this.DatasetStorageService.getCurrent();

    if (!angular.isString(columnname) || !angular.isString(delimiter)) {
      return this.$q.reject('Wrong arguments');
    }

    let payload = {
      'sourceid': sourceId,
      'transformationtype': 'splitcolumn',
      'options': {
        columnname,
        delimiter,
      },
    };

    return this.makeTransformRequest(payload);
  }

  renameColumn(columnname, renameto) {
    if (!columnname || !renameto) {
      return this.$q.reject('Wrong arguments');
    }

    let sourceId = this.DatasetStorageService.getCurrent();

    let data = {
      'sourceid': sourceId,
      'transformationtype': 'renamecolumn',
      'options': {
        columnname,
        renameto,
      },
    };

    const event = {
      type: 'renamecolumn',
      ids: {
        before: sourceId,
        after: '',
      },
      options: {
        columnname,
        renameto,
      },
    };

    return this.api.post('transform', data)
      .then((res) => {
        event.ids.after = res.sourceId;
        this.DatasetStorageService.setCurrent(res.sourceId, {
          data: true,
          schema: true,
          typeStats: true,
          featureStats: true,
        });
        this.DatasetAPI.emit('TRANSFORM_EVENT', event);
        return res;
      });
  }
}

export default ColumnAPI;
