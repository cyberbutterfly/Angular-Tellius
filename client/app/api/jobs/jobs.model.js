class JobsModel {
  /*@ngInject*/
  constructor(ApiWrapper) {
    this.api = ApiWrapper;
  }

  getJob({
    jobId,
  }) {
    return this.api.get(`jobs/${jobId}`, {}, false);
  }

  getList() {
    return this.api.get('jobs/list', {}, false)
      .then(res => {
        return res.results;
      });
  }
}

export default JobsModel;
