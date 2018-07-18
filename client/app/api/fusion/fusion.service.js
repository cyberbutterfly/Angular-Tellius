import _ from 'lodash';
import EventEmitter from 'eventemitter3';

export class FusionAPI extends EventEmitter {
  /*@ngInject*/
  constructor($q, ApiWrapper, DatasetStorageService) {
    super();

    this.$q = $q;
    this.DatasetStorageService = DatasetStorageService;
    this.api = ApiWrapper;
  }

  makeRequest({
    ids,
    datasetname,
    columnNames,
    joinType,
    joinKeys1,
    joinKeys2,
  }) {
    const defer = this.$q.defer();

    const errors = this._validate({
      ids,
      datasetname,
      columnNames,
      joinKeys1,
      joinKeys2,
      joinType,
    });
    console.log({
      ids,
      datasetname,
      columnNames,
      joinType,
      joinKeys1,
      joinKeys2,
    });

    columnNames = _.isArray(columnNames) ? columnNames.join(',') : 'all';

    if (errors.length !== 0) {
      defer.reject(errors);
    } else {
      const payload = {
        ids,
        datasetname,
        joinkeys1: joinKeys1,
          joinkeys2: joinKeys2,
          jointype: joinType,
          columnnames: columnNames,
      };

      const event = {
        ids,
        options: payload,
      };

      this.api.post('fusion', payload)
        .then((res) => {
          event.after = res.id;
          this.DatasetStorageService.emit('FUSION_EVENT', event);
          this.DatasetStorageService.setCurrent(res.id, {
            data: true,
            metadata: true,
            schema: true,
            typeStats: true,
          });
          return res.id;
        })
        .then((id) => defer.resolve(id));
    }

    return defer.promise;
  }

  _validate({
    ids,
    datasetname,
    columnNames,
    joinKeys1,
    joinType,
  }) {
    let errors = [];

    const JOIN_TYPES = [
      'inner',
      'outer',
      'left_outer',
      'right_outer',
    ];

    if (!_.isString(datasetname)) {
      errors.push('Dataset name required');
    }

    if (!_.isString(ids)) {
      errors.push('Select a dataset');
    }

    if (!_.isString(joinKeys1)) {
      errors.push('Select a join keys');
    }

    if (!JOIN_TYPES.includes(joinType)) {
      errors.push('Select a join type');
    }

    if (!_.isString(columnNames) && !_.isArray(columnNames)) {
      errors.push('Select a columns');
    }

    return errors;
  }
}
