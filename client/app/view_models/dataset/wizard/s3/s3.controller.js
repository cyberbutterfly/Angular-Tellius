import {
  Regions,
}
from './s3.regions';

import {
  isString,
}
from 'lodash/lang';

export class CreateDatasetController {
  /*@ngInject*/
  constructor($scope, $state, $timeout, LoadAPI) {
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.LoadAPI = LoadAPI;

    this.FormData = {
      ...this.options,
    };

    this.Regions = Regions;
    this.bucketFiles = [];
  }

  _validate() {
    this.errors = [];

    if (!isString(this.FormData.accessKeyId)) {
      this.errors.push('Access key is not defined');
    }

    if (!isString(this.FormData.secretAccessKey)) {
      this.errors.push('Secret access key is not defined');
    }

    return this.errors.length === 0;
  }

  browseBucket() {
    return this.LoadAPI.getS3List({
        accessKeyId: this.FormData.accessKeyId,
        secretAccessKey: this.FormData.secretAccessKey,
        region: this.FormData.region,
        bucket: this.FormData.bucket,
      })
      .then(res => {
        this.$timeout(() => {
          this.bucketFiles = res
        });
        return res;
      });
  }

  selectFile(file) {
    const s3path = this.FormData.bucket + '/' + file.Key;
    const ext = this.LoadAPI.getFileExt({
      url: s3path,
    });
    const data = {
      sourcetype: ext,
      accessKeyId: this.FormData.accessKeyId,
      secretAccessKey: this.FormData.secretAccessKey,
      s3path: s3path,
    };

    this.$state.go(`app.dataset.wizard.${data.sourcetype}`, {
      options: {
        ...data,
      },
    });
  }
}
