// import headerCellTemplate from './headerCell.jade';

class ColorPaletteService {
  /*@ngInject*/
  constructor(ApiWrapper, $q, $rootScope, $location, VizpadDataService) {
    this.api = ApiWrapper;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.VizpadDataService = VizpadDataService;
    this.vizObj = {};
    var parentThis = this;
    this.getDataColors().then(function(success){
      parentThis.colorPaletteData = success.colorPaletteDataColors;
    }, function(error){
      console.log('Error in ColorPaletteService', error);
    });

  }

  getDataColors() {
    var defer = this.$q.defer();
    var promise = this.api.get('/colorPaletteDataColors');

    promise.then(function(success) {
      defer.resolve(success);
    }, function(error) {
      defer.reject(error);
    });
    return defer.promise;
  }
}

export default ColorPaletteService;
