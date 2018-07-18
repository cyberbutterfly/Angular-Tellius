import EventEmitter from 'eventemitter3';

class PipelineAPI extends EventEmitter {
  /*@ngInject*/
  constructor(ApiWrapper, $q) {
    super();

    this.api = ApiWrapper;
    this.$q = $q;
  }


  getListEx() {
    const url = '';
    return this._makeGetRequestEx({
      url
    });
  }

  getList() {
    const url = 'view';
    const payload = {
      options: {
        ids: 'all',
      }
    };
    return this._makeRequest({
      url, payload
    });
  }

  load(uuid) {
    return this._makeGetRequestEx({url: '/' + uuid});
  }

  create({
    payload
  }) {
    const url = 'create';
    return this._makeRequest({
      url, payload
    });
  }

  createEx(payload) {
    return this._makeRequestEx(payload);
  }

  deleteEx(uuid) {
    const url = '/meta/pipeline';
    return this._makeDeleteEx(uuid);
  }

  update(id, payload) {
    const url = 'update';
    return this.api.post({
      url, payload
    });
  }

  updateEx(uuid, payload) {
    return this._makePutRequestEx({uuid, payload});
  }

  _makeRequest({url, payload}) {
    return this.api.post('/pipeline/' + url, payload);
  }

  _makePutRequestEx({uuid, payload}) {
    return this.api.put('/meta/pipeline/' + uuid, payload);
  }

  _makeGetRequestEx({url}) {
    return this.api.get('/meta/pipeline' + url);
  }
  _makeRequestEx(payload) {
    return this.api.post('/meta/pipeline', payload);
  }
  _makeDeleteEx(uuid) {
    return this.api.delete('/meta/pipeline/' + uuid);
  }
}

export default PipelineAPI;
