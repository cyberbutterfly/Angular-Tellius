import _ from 'lodash';

export class TelliscriptController {
  /*@ngInject*/ 
  constructor($state, PipelineService) {
    this.$state = $state;
    this.PipelineService = PipelineService;

    this.PipelineService.on('PIPELINE_UPDATED', (message) => this.onPipelineChange());

    this.active = this.PipelineService.isActive();
    this.name = {
      value: '',
      disabled: true,
    };

    this.error = {
      code: 0,
      message: ''
    };

    angular.element(document.querySelector('.ly-telliscript')).removeClass('disabled');

    this.stages = [];

    this.sortable = {
      orderChanged: (event) => {
        let stageUUID = event.source.itemScope.element.attr('data-stage-uuid');
        let sourceIndex = event.source.index;
        let destIndex = event.dest.index;
        this.PipelineService.moveTask(stageUUID, sourceIndex, destIndex);
      }
    };
  }

  isActive() {
    return this.PipelineService.isActive();
  }

  onPipelineChange() {
    this.stages = this.PipelineService.stages();
    this.stages.map((c, i, a) => {
      c.public_tasks = c.tasks(true);
    });
/*    console.log('===> telliscript <===');
     console.log(this.stages);
     console.log('===> end telliscript <====');*/
  }

  onRecord() {

    this.name.disabled = false;
    if (!this.PipelineService.setActive(this.active)) {

    }
    this.PipelineService.setName(this.name.value);
  }

  onSave() {
    this.PipelineService.savePipeline(this.name.value);
  }

  onDelete(id) {
    ;
  }

  onDestroy() {
    this.active = false;
    this.PipelineService.reset();
  }

  onChangePipelineName() {
    this.PipelineService.setName(this.name.value);
  }

  list() {
    let stages = this.PipelineService.stages();
    if (stages !== false) {
      return stages;
    }
    return [];
  }

  isEmpty() {
    return !this.PipelineService.stageHasTasks();
  }

  isVisible() {
    let side = angular.element(document.querySelector('.ly-telliscript'));
    if (side.hasClass('disabled')) {
      side.removeClass('disabled');
    }

    if (this.$state.current.name === 'app.transform.grid') {
      return true;
    }
    return false;
  }

  addStageTask() {
    this.PipelineService.addStageTask();
  }

  removeStage(stageId) {
    this.PipelineService.deleteStage(stageId);
  }

  removeTask(stageId, taskId) {
    this.PipelineService.deleteTask(stageId, taskId);
  }

  getStageTasks() {
    return this.PipelineService.getStageTasks();
  }

  deleteStage(uuid) {
    console.log('deleting ' + uuid);
    this.PipelineService.deleteStage(uuid);
  }

  deleteTask(stageUUID, taskUUID) {
    this.PipelineService.deleteTask(stageUUID, taskUUID);
  }

  startNewPipeline() {
    this.PipelineService.startOver();
  }
}
