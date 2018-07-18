import popupTemplate from './column-type.popup.jade';

export class ColumnTypeCtrl {
  /*@ngInject*/
  constructor($scope, TransformAPI, DatasetStorageService, ngDialog,
    DATE_FORMATS, COLUMN_TYPES) {
    this.$scope = $scope;
    this.TransformAPI = TransformAPI;
    this.DatasetStorageService = DatasetStorageService;
    this.ngDialog = ngDialog;

    this.columnTypes = COLUMN_TYPES;
    this.dateFormats = DATE_FORMATS;

    this.FormData = {
      fileType: this.fileType,
    };

    this.errors = [];
  }

  onChange() {
    if (this.FormData && this.FormData.fileType && this.FormData.fileType ===
      'DateType') {
      this.ngDialog
        .open({
          template: popupTemplate(),
          plain: true,
          scope: this.$scope,
        })
        .closePromise.then(() => {
          this.FormData.fileType = this.fileType;
        });
    } else {
      this.save(false);
    }
  }

  save(isDialog) {
    const FileType = this._normalizeFileType(this.FormData.fileType);
    this.errors = [];

    return this.TransformAPI.cast({
        column: this.columnName,
        type: FileType,
        format: this.FormData.dateFormat,
      })
      .then(sourceId => {
        this.DatasetStorageService.setCurrent(sourceId, {
          typeStats: true,
          data: true,
          metadata: true,
          schema: true,
        });
      })
      .then(() => {
        if (isDialog !== false) {
          this.ngDialog.closeAll();
        }
      })
      .catch(err => {
        this.errors.push(err);
      });
  }

  _normalizeFileType(str) {
    return str.substr(0, str.length -
        4)
      .toLowerCase();
  }

}
