class Controller {
  /*@ngInject*/
  constructor () {
    angular.forEach(this.candidateDatasets, datasetIterator => {
      datasetIterator.selected = false;
    });
    this.selectedDatasets = [];
  }

  selectDataset(dataset) {
    dataset.selected = !dataset.selected;
    if (dataset.selected) {
      this.selectedDatasets.push(dataset);
    } else {
      _.remove(this.selectedDatasets, { id: dataset.id });
    }
  }

}

export default Controller;
