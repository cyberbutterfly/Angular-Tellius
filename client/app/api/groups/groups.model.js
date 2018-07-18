import EventEmitter from 'eventemitter3';

export class GroupsModel extends EventEmitter {
  /*@ngInject*/
  constructor (ApiWrapper) {
    super(ApiWrapper);

    this.api = ApiWrapper;
  }

  getGroups (queryParams) {
    let queryStringArray = [];
    for(var p in queryParams) {
      if (queryParams.hasOwnProperty(p)) {
        queryStringArray.push(encodeURIComponent(p) + "=" + encodeURIComponent(queryParams[p]));
      }
    }
    const queryString = queryStringArray.join("&");
    return this.api.get('/groups?' + queryString, {}, false);
  }

  getGroup ({
    id,
    }) {
    return this.api.get(`/groups/${id}`, {}, false);
  }

  createGroup ({
    name
  }) {
    return this.api.post('/groups', {
      name: name,
      permissions: [],
    });
  }

  updateGroup ({
    id,
    name,
    datasetAccesses,
    permissions,
  }) {
    return this.api.put(`/groups/${id}`, {
      name,
      datasetAccesses,
      permissions,
    });
  }

  deleteGroup ({
    id,
    }) {
    return this.api.delete(`/groups/${id}`);
  }
}

export default GroupsModel;
