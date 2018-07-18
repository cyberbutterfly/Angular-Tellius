import EventEmitter from 'eventemitter3';

export class ModulesModel extends EventEmitter {
  /*@ngInject*/
  constructor (ApiWrapper) {
    super(ApiWrapper);

    this.api = ApiWrapper;
  }

  getModules (queryParams) {
    let queryStringArray = [];
    for(var p in queryParams) {
      if (queryParams.hasOwnProperty(p)) {
        queryStringArray.push(encodeURIComponent(p) + "=" + encodeURIComponent(queryParams[p]));
      }
    }
    const queryString = queryStringArray.join("&");
    return this.api.get('/modules?' + queryString, {}, false);
  }

  getModule ({
    name,
    }) {
    name = encodeURIComponent(name);
    return this.api.get(`/modules/${name}`, {}, false);
  }
}

export default ModulesModel;
