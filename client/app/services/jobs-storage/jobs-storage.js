import _ from 'lodash';
import EventEmitter from 'eventemitter3';

class JobsStorage extends EventEmitter {
  /*@ngInject*/
  constructor($interval, JobsModel) {
    super();

    this.$interval = $interval;
    this.JobsModel = JobsModel;

    this.__jobs = [];
    this.__localJobs = [];
    this.__loading = false;

    this.on('JOB_CREATED', job => {
      if (_.isUndefined(this.__stop)) {
        this.start();
      }
      this.__localJobs.push(job);
      this.__updateLocalJobs();
    });
  }

  start() {
    this._tickHandler();
    this.__stop = this.$interval(() => {
      this._tickHandler();
    }, 5000);
  }

  stop() {
    if (!_.isUndefined(this.__stop)) {
      this.$interval.stop(this.__stop);
    }
  }

  isRunning() {
    let result = false;

    if (_.isEmpty(this.__localJobs) === false) {
      const runningJobs = _.filter(this.__localJobs, i => i.status ===
        'RUNNING');
      result = !!runningJobs.length;
    }

    return result;
  }

  getJobs() {
    return this.__jobs;
  }

  __updateLocalJobs() {
    const localJobs = this.__localJobs
      .filter(i => i.status === 'RUNNING')
      .map(job => {
        return this.JobsModel.getJob({
            jobId: job.jobId,
          });
      });

    return Promise.all(localJobs)
      .then(updatedJobs => {
        for (const job of updatedJobs) {
            if (job.status !== 'RUNNING') {
              this.__localJobs = _.map(this.__localJobs, i => {
                return (i.jobId === job.jobId) ? job : i;
              });
            }
        }

        const jobs = this.__localJobs.map(i => {
          const title = 'Save jobs is ';

          switch (i.status) {
            case 'FAILURE':
              i.name = title + 'failed';
              break;
            case 'SUCCESS':
              i.name = title + 'completed';
              break;
            default:
              i.name = title + 'running';
          }

          return i;
        });

        if (_.isEmpty(jobs)) {
          this.stop();
        }

        this.__jobs = jobs;
        this.emit('JOBS_UPDATED', {
          jobs: this.__jobs,
        });

        return jobs;
      });
  }

  _tickHandler() {
    if (!this.__loading) {
      this.__loading = true;

      this.__updateLocalJobs()
        .then(() => {
          this.__loading = false;
          if (this.isRunning()) {
            this.emit('JOBS_RUNNING', {
              jobs: this.__jobs,
            });
          }
        })
        .catch(() => {
          this.__loading = false;
        });
    }
  }
}

export default JobsStorage;
