import _ from 'lodash';
import '../../api/wrapper/wrapper';

class UploadService {
  /*@ngInject*/
  constructor($q, ApiWrapper) {
    this.$q = $q;
    this.api = ApiWrapper;
  }

  load({
    name,
    sourcetype,
    location,
    externalpath,
    ...options,
  }) {
    location = location || name + Math.ceil(Math.random() * 1000);

    if (
      _.isString(options.accessKeyId) &&
      _.isString(options.secretAccessKey) &&
      _.isString(options.s3path)) {
      externalpath =
        `s3n://${options.accessKeyId}:${options.secretAccessKey}@${options.s3path}`;

      options = _.omit(options, ['accessKeyId', 'secretAccessKey', 's3path']);
    }

    options = _.reduce(options, (prev, value, key) => {
      prev[key] = value + '';
      return prev;
    }, {});

    const data = {
      name,
      sourcetype,
      location,
      externalpath,
      options,
    };

    const payload = _(data)
      .omit(_.isUndefined)
      .omit(_.isNull)
      .value();

    return this._makeLoadRequest({
        payload,
      })
      .then(res => {
        return {
          sourceId: res.id,
        };
      });
  }

  getFiletype() {
    let filetypes = [];
    let filetype = null;

    this.files.forEach((item) => {
      filetypes.push(item.type);

      switch (item.type) {

        case 'application/json':
          filetype = 'json';
          break;

        case 'text/xml':
          filetype = 'xml';
          break;

        case 'text/csv':
          filetype = 'csv';
          break;

        default:
          return;
      }
    });

    return this.$q((resolve, reject) => {
      if (new Set(filetypes)
        .size > 1) {
        reject({
          error: true,
          message: 'Only one file type',
        });
      } else {
        resolve(filetype);
      }
    });
  }
}

export default UploadService;
