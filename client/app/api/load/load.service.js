import _ from 'lodash';
import EventEmitter from 'eventemitter3';
import 'aws-sdk';

class LoadAPI extends EventEmitter {
  /*@ngInject*/
  constructor($q, ApiWrapper) {
    super();
    this.$q = $q;
    this.api = ApiWrapper;
  }

  getS3List({
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
  }) {
    let defer = this.$q.defer();

    AWS.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
    });

    const s3bucket = new AWS.S3({
      params: {
        Bucket: bucket,
      },
    });

    s3bucket.listObjects((error, data) => {
      if (error) {
        defer.resolve([]);
      } else {
        defer.resolve(data.Contents);
      }
    });

    return defer.promise;
  }

  getFileExt({
    url,
  }) {
    const ext = (url = url
      .substr(1 + url.lastIndexOf('/'))
      .split('?')[0])
      .substr(url.lastIndexOf('.'))
      .split(/\#|\?/g)[0]
      .substr(1);

    return ext;
  }

  load({
    name,
    sourcetype,
    files,
    ...options,
  }) {
    const dfd = this.$q.defer();

    if (
      _.isString(options.accessKeyId) &&
      _.isString(options.secretAccessKey) &&
      _.isString(options.s3path)) {
      options.path =
        `s3n://${options.accessKeyId}:${options.secretAccessKey}@${options.s3path}`;

      options = _.omit(options, ['accessKeyId', 'secretAccessKey', 's3path']);
    }

    if (sourcetype === 'mongodb') {
      if (options.username.length > 0 && options.password.length > 0) {
        options.credentials = `${options.username},${options.password}`;
      }
      options.host = `${options.host}:${options.port}`;
      options = _.omit(options, ['username', 'password', 'port']);
    }

    options = _.reduce(options, (prev, value, key) => {
      prev[key] = value + '';
      return prev;
    }, {});

    const data = {
      name,
      sourcetype,
      options,
    };

    const payload = _(data)
      .omit(_.isUndefined)
      .omit(_.isNull)
      .value();

    if (_.isUndefined(files)) {
      this._makeLoadRequest({
        payload,
      })
        .then(res => {
          dfd.resolve({
            sourceId: res.id,
          });
        })
        .catch(err => dfd.reject(err));
    } else {
      this._file({
        payload,
        files,
      })
        .then(res => {
          dfd.resolve(res);
        })
        .catch(err => dfd.reject(err));
    }

    return dfd.promise;
  }

  _file({
    payload,
    files,
  }) {
    const formData = new FormData();

    payload = JSON.stringify(_.omit(payload, 'files'));

    formData.append('metadata', payload);
    formData.append('content', files[0]);

    return this.api.uploadFile({
      payload: formData,
    })
      .then(res => {
        return {
          sourceId: res.id,
        };
      });
  }

  _makeLoadRequest({
    url = 'load',
    payload,
    headers,
  }) {
    return this.api.post(url, payload, headers);
  }

}

export default LoadAPI;
