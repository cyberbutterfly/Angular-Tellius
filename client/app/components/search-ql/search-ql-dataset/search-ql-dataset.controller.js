export class SearchQLDatasetController {
  /*@ngInject*/
  constructor($rootScope, DatasetStorageService, SearchQLStrategy) {
    this.SearchQLStrategy = SearchQLStrategy;
    this.DatasetStorageService = DatasetStorageService;
  }

  $onInit() {
    this._reset();

    this.DatasetStorageService.on('ROOT_DATASET_CHANGED', ({
      dataset,
    }) => {
      this.selectDataset(dataset, false);
    });
  }

  selectAll() {
    sessionStorage.setItem('multipleDatasets', true);
    this.onChangeDataset({
      dataset: {
        name: 'All datasets',
        sourceType: 'default',
      },
    });
    this.selectedDataset = {
      name: 'All datasets',
      sourceType: 'default',
    };
    this.SearchQLStrategy.multipleDatasets = true;
  }

  selectDataset(dataset, setRoot = true) {
    sessionStorage.removeItem('multipleDatasets');
    this.onChangeDataset({
      dataset: dataset,
    });
    this.selectedDataset = dataset;
    this.SearchQLStrategy.multipleDatasets = false;
    if (setRoot) {
      this.DatasetStorageService.setRoot(this.selectedDataset, {}, false);
    }
  }

  createDataset($event) {
    $event.preventDefault();
  }

  _reset() {
    this.SearchQLStrategy.multipleDatasets = sessionStorage.getItem(
      'multipleDatasets') || false;

    if (sessionStorage.getItem('multipleDatasets') || !this.DatasetStorageService
      .getRoot()) {
      this.selectedDataset = {
        sourceType: 'default',
        name: 'All datasets',
      };
    } else {
      this.selectedDataset = this.DatasetStorageService.getRoot();
    }
  }
}
