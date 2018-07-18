import angular from 'angular';
import EventEmitter from 'eventemitter3';
import {
  StandardTypes,
  TimeSeriesTypes,
} from './function.types';

export class FunctionAPI extends EventEmitter {
  /*@ngInject*/
  constructor($q, ApiWrapper, DatasetStorageService) {
    super();

    this.$q                    = $q;
    this.api                   = ApiWrapper;
    this.DatasetStorageService = DatasetStorageService;
  }

  getAggregationTypes(type = 'standard') {
    let types = [];

    if (type === 'standard') {
      types = StandardTypes;
    } else if (type === 'time-series') {
      types = TimeSeriesTypes;
    }

    return types;
  }

  aggregate(data) {
    const sourceId = this.DatasetStorageService.getCurrent();

    let groupby           = data.groupBy;
    let aggregationColumns = data.aggregationColumns;

    let options = {
      groupby: groupby.join(','),
      aggregationcolumns: aggregationColumns.join(','),
    };

    if (angular.isDefined(data['aggtype-standard'])) {
      options['aggtype-standard'] = data['aggtype-standard'];
    } else {
      options['aggtype-timeseries'] = data['aggtype-timeseries'];
    }

    if (
      !angular.isArray(groupby) || !angular.isArray(aggregationColumns)) {
      return this.$q.reject('Wrong arguments');
    }

    const payload = {
      id: sourceId,
      functiontype: 'aggregate',
      options,
    };

    return this.makeAggregateRequest(payload);
  }

  makeAggregateRequest(payload) {
    return this.api.post('functions', payload)
      .then(res => {
        return res.id;
      })
      .then(sourceId => {
        this.DatasetStorageService.setCurrent(sourceId, {
          typeStats: true,
          data: true,
          metadata: true,
          schema: true,
        });
        return sourceId;
      });
  }
}
