// import Highcharts from 'highcharts';
import $ from 'jquery';

class VizLegendCtrl {
  /*@ngInject*/
  constructor(VizpadDataService, $rootScope, $scope, $mdDialog, $mdMedia, DatafileService, $timeout) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;
  	this.selected = [];
  	this.legends = this.viz.legendsArr;
  	var parentThis = this;
  }

  toggle (item, list) {
  	var idx = this.viz.legendsArr.indexOf(item);
  	if (idx > -1) this.viz.legendsArr.splice(idx, 1);
  	else this.viz.legendsArr.push(item);

  	// this.$rootScope.$broadcast("legendsChanged",{legends: });

  };
  exists (item, list) {

  	if (typeof this.viz.legendsArr != "undefined")
  		return this.viz.legendsArr.indexOf(item) > -1;
  };

}

export default VizLegendCtrl;
