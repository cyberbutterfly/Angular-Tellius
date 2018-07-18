import _ from 'lodash';
import '../../api/wrapper/wrapper';
import md5 from 'md5';

class DatafileService {
	/*@ngInject*/
	constructor($http, $auth, $localStorage, DatasetAPI, $state, $mdToast, ApiWrapper, $q, DatasetStorageService, LOAD_API_ENDPOINT,VIEW_API_ENDPOINT,FUNCTIONS_API_ENDPOINT,TRANSFORM_API_ENDPOINT, THUMBNAIL_API_ENDPOINT, DATASET_DESCRIPTION) {
		this.api = ApiWrapper;
		this.DatasetAPI = DatasetAPI;
		this.$mdToast = $mdToast;
		this.id = '';
		this.$q = $q;
		this.xColumns = [];
		this.yColumns = [];
		this.cache = [];
		var parentThis = this;
		this.filePath;
		this.filterString = '';
		this.dateColumns = ['cdatetime', 'cdate2', 'ctime'];
		this.DatasetStorageService = DatasetStorageService;
		var list = this.DatasetStorageService.getList();
		var currentDataset = this.DatasetStorageService.currentDataset;
		angular.forEach(list,(value) => {
			if(value.id == currentDataset.sourceId) {
				this.filePath = 'file:'+ value.dataSourceName;
			}
		});

		if(this.DatasetStorageService.isSaved()) {
			try {
				this.fileId = this.DatasetStorageService.getRoot().datasetId;
			} catch (e) {
				this.fileId = this.DatasetStorageService.getCurrent();
			}
		}
		this.hierarchyArr = [];
		this.getDatasetDescription().then(function(success){
			if(success.hierarchies.length > 0) {
				angular.forEach(success.hierarchies[0].columns, function(h){
					let tempObj = {
						hierarchy: h,
						current: false
					}
					parentThis.hierarchyArr.push(tempObj);
				});
			}
	  },function(error){
	      console.log('error',error);
	  });
	}

	listColumns() {
		this.xColumns = [];
		this.yColumns = [];
		if (this.DatasetStorageService.isSaved()) {
			try {
				this.fileId = this.DatasetStorageService.getRoot().datasetId;
			} catch (e) {
				this.fileId = this.DatasetStorageService.getCurrent();
			}
		}

		const featureStats = this.DatasetStorageService.getDataset().featurestats;

		_.each(featureStats, value => {
			if (value.featureType === 'measure') {
        this.yColumns.push(value.columnName);
      } else {
        this.xColumns.push(value.columnName);
      }
		});
	}

	getAggregatedId(requestObj) {
		const defer = this.$q.defer();

		this.api.post('functions', requestObj)
			.then(response => {
				defer.resolve(response);
			}, error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	getAggregatedData(requestObj) {
		const defer = this.$q.defer();

		this.api.post('functions', requestObj)
			.then(success => {
				const payload = {
					'id': success.id,
					'viewtype': 'data',
				};

				this.api.post('view', payload)
					.then(resp => {
						defer.resolve(resp);
					}, error => {
						defer.reject(error);
					});
			}, error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	getFileId(externalPath, sourcetype) {
		const defer = this.$q.defer();
		const payload = {
			'sourcetype': sourcetype,
			'options': {
				'header': 'true',
				'path': externalPath,
			},
			'name': Math.random()+' ',
			'location': 'default',
		};

		this.api.post('load', payload)
			.then(success => {
				defer.resolve(success);
			}, error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	getData(id) {
		const defer = this.$q.defer();
		const payload = {
			'id': id,
			'viewtype': 'data',
		};

		this.api.post('view', payload)
			.then(response => {
				defer.resolve(response);
			}, error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	getTransformedData(sourceId, filters) {
		const defer = this.$q.defer();
		const payload = {
			'sourceid': sourceId,
			'transformationtype': 'filter',
			'options': {
				'condition': filters,
			},
		};

		this.api.post('transform', payload)
			.then(success => {
				defer.resolve(success);
			}, error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	getColStats(reqObj) {
		const defer = this.$q.defer();

		this.api.post('view', reqObj)
			.then(success => {
				defer.resolve(success);
			}, error => {
				defer.reject(error);
			});

		return defer.promise;
	}

	getThumbnail(id) {
		const defer = this.$q.defer();
		this.api.get('/thumbnail/'+id).then(function(response){
			defer.resolve(response);
		}, function(error){
			defer.reject(error);
		});

		return defer.promise;

	}
	getDatasetDescription(){
		const defer = this.$q.defer();
		const datasetId = this.fileId;
		this.hierarchyArr = [];

		this.api.get('dataset/'+datasetId).then(function(success){
			defer.resolve(success);
		},function(error){
			defer.reject(error);
		})

		return defer.promise;
	}

	updateDatasetDescription(data){
		const defer = this.$q.defer();
		const datasetId = this.fileId;

		this.api.put('dataset/'+datasetId, data).then(function(success){
			defer.resolve(success);
		},function(error){
			defer.reject(error);
		})

		return defer.promise;
	}
	extendedSqlObj(reqObj) {
		const defer = this.$q.defer();
		let headers = {};

		if(this.DatasetStorageService.isSaved()) {
			try {
				reqObj.datasetId = this.DatasetStorageService.getRoot().datasetId;
			} catch (e) {
				reqObj.datasetId = this.DatasetStorageService.getCurrent();
			}
		}
		reqObj.from = "`"+reqObj.datasetId+"`";

		if (this.cache.hasOwnProperty(md5(JSON.stringify(reqObj)))) {
			defer.resolve(this.cache[md5(JSON.stringify(reqObj))])
		} else {
			this.api.post('/extendedSQL', reqObj, headers, false).then(success => {
        this.cache[md5(JSON.stringify(reqObj))] = success;
				defer.resolve(success);
			}, error => {
				defer.reject(error);
			});
		}

		return defer.promise;
	}
}
export default DatafileService;
