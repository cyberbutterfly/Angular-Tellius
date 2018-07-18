import {
  isString,
  isUndefined,
}
from 'lodash/lang';

import EventEmitter from 'eventemitter3';

export class PredictAPI extends EventEmitter {
  /*@ngInject*/
  constructor($q, ApiWrapper) {
    super();

    this.$q = $q;
    this.api = ApiWrapper;
  }

  predict({
    id,
    modelName,
    options,
  }) {
    if (isUndefined(id) || !isString(modelName)) {
      return this.$q.reject('Wrong arguments');
    }

    const payload = {
      id: id,
      modelname: modelName,
      options: options,
    };

    return this._makePredictRequest({
      payload,
    });
  }

  _makePredictRequest({
    url = 'predict',
      payload,
  }) {
    return this.api.post('ml/' + url, payload);
  }
}
