import EventEmitter from 'eventemitter3';

export class SaveModel extends EventEmitter {
  /*@ngInject*/
  constructor(ApiWrapper, JobsStorage) {
    super();

    this.api = ApiWrapper;
    this.JobsStorage = JobsStorage;
  }

  memsql({
    sourceId,
    datasetName,
    rootId,
    sync = false,
  }) {
    const payload = {
      'sourceid': sourceId,
      'outputtype': 'memsql',
      'options': {
        'tablename': rootId,
        'datasetname': datasetName,
        'sync': sync.toString(),
      },
    };

    return this._saveRequest({
      payload,
    });
  }

  _saveRequest({
    payload,
    url = 'save',
  }) {
    return this.api.post(url, payload)
      .then( res => {
        this.JobsStorage.emit('JOB_CREATED', res);
        return res;
      });
  }
}
