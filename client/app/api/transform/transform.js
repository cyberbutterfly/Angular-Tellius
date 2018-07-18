import angular from 'angular';
import {
  TransformAPI,
}
from './transform.api';

const module = angular.module('Tellius.api.TransformAPI', []);
module.service('TransformAPI', TransformAPI);

export default module;

import EventEmitter from 'eventemitter3';

export class TransformModel extends EventEmitter {
  /*@ngInject*/
  constructor(ApiWrapper, DatasetStorageService, DatasetAPI) {
    super();
    this.DatasetAPI = DatasetAPI;
    this.DatasetStorageService = DatasetStorageService;
    this.api = ApiWrapper;
  }

  makeRequest(payload) {
    return this.api.post('view', payload)
      .then((res) => {
        return res;
      }, (err) => {
        return err;
      });
  }

  makeTransformRequest(payload) {
    const event = {
      type: payload.transformationtype,
      ids: {
        before: payload.sourceid,
        after: '',
      },
      options: payload.options,
    };

    this.DatasetAPI.emit('DATASET_MODIFIED', {
      payload,
    });

    return this.api.post('transform', payload)
      .then(res => {
        return res.sourceId;
      })
      .then(sourceId => {
        event.ids.after = sourceId;
        this.DatasetStorageService.setCurrent(sourceId, {
          typeStats: true,
          data: true,
          metadata: true,
          schema: true,
        });
        this.DatasetAPI.emit('TRANSFORM_EVENT', event);
        return sourceId;
      });
  }
}
