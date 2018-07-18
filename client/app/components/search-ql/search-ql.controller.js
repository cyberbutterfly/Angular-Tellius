export class SearchQLController {
  /*@ngInject*/
  constructor(DatasetStorageService, SearchQLStrategy) {
    this.DatasetStorageService = DatasetStorageService;
    this.SearchQLStrategy = SearchQLStrategy;
  }

  $onInit() {
    this.selectedDataset = {};
    this.isActiveSearch = false;

    this.datasets = this.DatasetStorageService.getList();
  }

  onChangeDataset(dataset) {
    this.SearchQLStrategy.emit('DATASET_CHANGED', {
      dataset,
    });
    this.SearchQLStrategy.lastResponse = null;
    this.SearchQLStrategy.FormData = null;
  }

  toggleActiveSearch(status) {
    this.isActiveSearch = status;
  }
}
