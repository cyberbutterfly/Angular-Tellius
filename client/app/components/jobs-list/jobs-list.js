class JobsListController {
  /*@ngInject*/
  constructor($scope, JobsStorage) {
    this.JobsStorage = JobsStorage;

    this.__opened = false;
    this.jobs = this.JobsStorage.getJobs();

    this.JobsStorage.on('JOBS_UPDATED', ({jobs}) => {
      this.jobs = jobs;
      $scope.$digest();
    });
  }

  isOpen() {
    return !!this.activeList;
  }

  selectItem(job) {
    this.closeThis();
  }

  closeThis() {
    this.activeList = false;
  }
}

export default JobsListController;
