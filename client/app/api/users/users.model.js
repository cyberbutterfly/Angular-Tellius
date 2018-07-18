import EventEmitter from 'eventemitter3';

export class UsersModel extends EventEmitter {
  /*@ngInject*/
  constructor (ApiWrapper) {
    super(ApiWrapper);

    this.api = ApiWrapper;
  }

  getUsers (queryParams) {
    let queryStringArray = [];
    for(var p in queryParams) {
      if (queryParams.hasOwnProperty(p)) {
        queryStringArray.push(encodeURIComponent(p) + "=" + encodeURIComponent(queryParams[p]));
      }
    }
    const queryString = queryStringArray.join("&");
    return this.api.get('/users?' + queryString, {}, false);
  }

  updateMemberGroups ({
    id,
    groups,
    }) {
    return this.api.put(`/users/${id}`, {
      groups,
    });
  }

  getUser ({
    id,
    }) {
    return this.api.get(`/users/${id}`, {}, false);
  }

  createUser ({
    firstName,
    lastName,
    email,
    password,
    avatarUrl,
  }) {
    return this.api.post('/users', {
      firstName,
      lastName,
      email,
      password,
      avatarUrl,
    });
  }

  updateUser ({
    id,
    firstName,
    lastName,
    email,
    password,
    avatarUrl,
  }) {
    return this.api.put(`/users/${id}`, {
      firstName,
      lastName,
      email,
      password,
      avatarUrl,
    });
  }

  deleteUser ({
    id,
    }) {
    return this.api.delete(`/users/${id}`);
  }
}

export default UsersModel;
