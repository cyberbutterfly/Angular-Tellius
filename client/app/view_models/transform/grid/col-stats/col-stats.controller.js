export class ColStatsController {
  /*@ngInject*/
  constructor($scope, $q, ColumnAPI) {
    this.$scope = $scope;
    this.$q = $q;
    this.ColumnAPI = ColumnAPI;

    this.stats = null;

    this.$scope.$watch('$ctrl.selectedStatsColumn', this.onChangeHandler.bind(
      this));
  }

  onChangeHandler(value) {
    if (value) {
      this.ColumnAPI.getColStats({
          columnNames: value,
        })
        .then((data) => {
          return data.colstats[0];
        })
        .then(data => {
          return this.ColumnAPI.uniqueValueCount({
              columnNames: value,
            })
            .then(res => {
              return {
                uniqueValueCount: res.uniquevaluecount,
                ...data,
              };
            });
        })
        .then(data => {
          this.stats = data;
          try {
            this.uniqueValueCount = this.stats.uniqueValueCount[0].stats;
          } catch (e) {
            this.uniqueValueCount = [];
          }
          this.$scope.$apply();
        });
    }
  }

  hide() {
    this.selectedStatsColumn = null;
    this.stats = null;
  }

}
