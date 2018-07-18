import {
  isString,
} from 'lodash/lang';

export class CreateController {
  /*@ngInject*/
  constructor($state, $q, UploadService, LoadAPI) {
    this.$state = $state;
    this.$q = $q;
    
    this.LoadAPI = LoadAPI;
    this.UploadService = UploadService;

    this.errors = [];

    this.files = [];
    this.resourceUrl = '';
  }

  upload() {
    this.changeFiles(this.files);
  }

  changeFiles(files) {
    this.UploadService.files = files;
    this.UploadService.getFiletype()
      .then((filetype) => {
        const data = {
          options: {
            sourcetype: filetype,
          },
        };

        this.$state.go(`app.dataset.wizard.${filetype}`, data);
      }, (error) => {
        this.hasError = true;
        this.error = error.message;
      });
  }

  uploadByUrl() {
    if (isString(this.httpurl)) {
      const ext = this.LoadAPI.getFileExt({
        url: this.httpurl,
      });

      if (isString(ext) && ext.length > 0) {
        this.$state.go(`app.dataset.wizard.${ext}`, {
          options: {
            sourcetype: ext,
            httpurl: this.httpurl,
          },
        });
      } else {
        this.errors.push({
          field: 'httpurl',
          value: 'Unknown ext',
        });
      }
    }
  }
}
