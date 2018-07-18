export default class {
  /*@ngInject*/
  constructor(JobsStorage) {
    this.JobsStorage = JobsStorage;
    this.haveNewUnseenJobs = false;

    this.JobsStorage.on('JOB_CREATED', ({job}) => {
      this.haveNewUnseenJobs = true;
    });
  }

  isRunning() {
    return this.JobsStorage.isRunning();
  }

  haveJobs() {
    return this.JobsStorage.getJobs().length > 0;
  }

  openList() {
    this.haveNewUnseenJobs = false;
    this.activeList = !this.activeList;
  }
}
