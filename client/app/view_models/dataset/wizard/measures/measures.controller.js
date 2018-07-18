import _ from 'lodash';

export class DatasetMeasuresController {
  /*@ngInject*/
  constructor($scope, $state, DatasetDescriptionModel, DATE_FORMATS) {
    this.$scope = $scope;
    this.$state = $state;

    this.DatasetDescriptionModel = DatasetDescriptionModel;
    this.dateFormats = DATE_FORMATS;

    this.FormData = {
      dimensions: this.columnTypes.dimension || [],
      measures: this.columnTypes.measure || [],
      geo: [{ groupName: null, latColumn: null, longColumn: null }],
      ...this.options,
    };

    this.errors = [];
  }

  addGeoGrouping() {
    this.FormData.geo.push({ groupName: null, latColumn: null, longColumn: null });
    console.log('added blank row to geo');
  }

  removeGeoGrouping(removeIndex) {
    _.remove(this.FormData.geo, (value, index) => {
      return index === removeIndex;
    });

    if (this.FormData.geo.length === 0) {
      this.addGeoGrouping();
    }
  }

  onSubmit() {
    const {
      sourceId,
    } = this.options;

    const mapColumns = [];

    for (let i = 0; i < this.FormData.geo.length; ++i) {
      let group = this.FormData.geo[i];
      if (group.groupName && group.groupName.length > 0 && group.latColumn && group.longColumn) {
        mapColumns.push({
          name: group.groupName,
          latitude: group.latColumn,
          longitude: group.longColumn,
        });
      }
    }

    this.DatasetDescriptionModel.update({
        sourceId,
        dateFormat: this.FormData.dateFormat,
          dateColumn: this.FormData.dateColumn,
          dimensions: this.FormData.dimensions,
          measures: this.FormData.measures,
          mapColumns: mapColumns,
      })
      .then(() => {
        this.$state.go('app.transform.grid');
      })
      .catch(err => {
        this.errors.push({
          field: 'backend',
          description: err,
        });

        this.$scope.$digest();
      });
  }

  moveToMesures(item) {
    this.FormData.dimensions.splice(this.FormData.dimensions.indexOf(item), 1);
    this.FormData.measures.push(item);
  }

  moveToDimensions(item) {
    this.FormData.measures.splice(this.FormData.measures.indexOf(item), 1);
    this.FormData.dimensions.push(item);
  }

}
