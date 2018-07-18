import EventEmitter from 'eventemitter3';

export class DataflowAPI extends EventEmitter {
  /*@ngInject*/
  constructor(ApiWrapper) {
    super();

    this.api = ApiWrapper;
  }

  getData({
    sourceId,
  }) {
    let payload = {
      'id': sourceId,
      'viewtype': 'dataflow',
    };
    return this._makeEvaluateRequest({
      payload,
    });
  }

  _makeEvaluateRequest({
    url = 'ml/evaluatemodel',
      payload,
  }) {
    return this.api.post(url, payload);
  }
}
