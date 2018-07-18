import '../../api/wrapper/wrapper';
import {
  PIPELINE_STAGE_TYPES,
  PIPELINE_STAGE_METADATA,
} from './pipeline.types';
import {
  Task,
  Stage,
  LoadStage,
  TransformStage,
  TransformationTask,
  SaveStage,
  FusionStage,
  AggregateStage,
  TrainStage,
  PredictStage,
  UnknownStage,
  SplitStage,
  Pipeline,
} from './pipeline.classes';
import _ from 'lodash';
import uuid from 'uuid';
import EventEmitter from 'eventemitter3';

class PipelineService extends EventEmitter {
  /*@ngInject*/
  constructor(DatasetAPI, LoadAPI, DatasetStorageService, PipelineAPI, UserService) {
    super();

    this.UserService = UserService;
    this.DatasetAPI = DatasetAPI;
    this.LoadAPI = LoadAPI;
    this.DatasetStorageService = DatasetStorageService;
    this.PipelineAPI = PipelineAPI;

    /* do we have an active pipeline */
    this._active = false;

    /* local pipeline instance */
    this._pipeline = null;

    this._pipelineIsSaved = false;

    this._status = {

    };

    /* register for events */
    this.DatasetAPI.on('TRANSFORM_EVENT', (message) => this.onTransform(message));
    this.LoadAPI.on('LOAD_EVENT', (message) => this.onLoad(message));
    this.DatasetStorageService.on('SAVE_EVENT', (message) => this.onSave(message));
    this.DatasetStorageService.on('FUSION_EVENT', (message) => this.onFusion(message));
  }

  /* public */

  isActive() {
    return this._active;
  }

  setActive(b) {
    this._active = b;
    let id = this.DatasetStorageService.getCurrent();

    if (this._active === true) {
      if (this._pipeline instanceof Pipeline) {
        console.log('user has a pipeline but wants to resume recording');
        console.log('pipeline dsId: ' + this._pipeline.datasetId());
        console.log('id currently selected: ' + id);
      } else {
        this._pipeline = new Pipeline();
        if (id !== null) {
          this._pipeline.addStage(
            new LoadStage({
              id: id,
            })
          );
          this.raiseEvent();
          return true;
        }
        this.raiseEvent();
        return false
      }
    } else {
      console.log('user wants to disable recording. pipeline remains though');
    }
    this.raiseEvent();
  }

  setName(newName) {
    this._pipeline.setName(newName);
  }

  stages() {
    if (this._pipeline instanceof Pipeline) {
      let stages = this._pipeline.getStages();
      return stages;
    }
    return false;
  }

  startOver() {
    console.log('pipeline.service: clearing out existing pipeline');
    let id = this.DatasetStorageService.getCurrent();
    /* todo: add save logic */
    this._pipeline = new Pipeline();
    this._pipeline.addStage(
      new LoadStage({
        id: id,
      })
    );
    this._active = true;
    this._pipelineIsSaved = false;
    this.raiseEvent();
  }

  reset() {
    console.log('destroying pipeline');
    this._active = false;
    this._pipeline = null;
    this._pipelineIsSaved = false;
    this.raiseEvent();
  }

  persist(n) {
    if (this._active === false || this._pipeline === null) {
      return;
    }

    let req = {
      sourceid: '',
      name: n,
      stages: this._pipeline.getStages(),
    };

    console.log(req);
    console.log('onSave req object: ', req);

    return this.PipelineAPI.create(req);
  }

  inflatePipeline(jsonObject) {
    console.log(JSON.stringify(jsonObject));

    let deflatedPipeline = new Pipeline();


    if(jsonObject.id) {
      this._pipelineIsSaved = true;
      deflatedPipeline.setMetaID(jsonObject.id);
    }

    console.log('inflated pipelineId: ' + jsonObject.uuid);

    deflatedPipeline.setUUID(jsonObject.uuid);
    deflatedPipeline.setName(jsonObject.name);

    /* root node */
    let loadIndex = _.findIndex(jsonObject.stages, (value, index, array) => {
      if (value.type === 'load') {
        return true;
      }
      return false;
    });

    if(loadIndex !== -1) {
      if(jsonObject.stages[loadIndex].hasOwnProperty(''))
      deflatedPipeline.addStage(
        new LoadStage(),
      );
    }

    for (let i = 0; i < jsonObject.stages.length; ++i) {
      let stage = jsonObject.stages[i];
      let stageObject = null
      switch(stage.type) {
        case 'load': stageObject = new LoadStage(); break;
        case 'transform': stageObject = new TransformStage(); break;
        case 'mltrain': stageObject = new TrainStage(); break;
        case 'mlpredict': stageObject = new PredictStage(); break;
        case 'split': stageObject = new SplitStage(); break;
        case 'fusion': stageObject = new FusionStage(); break;
        case 'aggregate': stageObject = new AggregateStage(); break;
        case 'save': stageObject = new SaveStage(); break;
        default: stageObject = new UnknownStage(); break;
      }

      deflatedPipeline.addStage(stageObject);

      stageObject.setUUID(stage.uuid);
      stageObject.setName(stage.name);
      stageObject.setParent(stage.parent);

      if (stage.stagetype === 'transform') {
        for (let j = 0; j < stage.tasks.length; ++j) {
          deflatedPipeline.getCurrentStage().addTask(new TransformationTask({
            ids: {
              after: stage.taskIds[j],
            }
          }));
        }
      }
    }

    console.log(deflatedPipeline);
    this._pipeline = deflatedPipeline;
    this.raiseEvent();
  }

  onTransform(message) {
    if (!this._active) {
      return;
    }
    if (this._pipeline.getCurrentStage().type(false) !== PIPELINE_STAGE_TYPES.TRANSFORM_STAGE) {
      this._pipeline.addStage(new TransformStage());
    }
    this._pipeline.getCurrentStage().addTask(new TransformationTask(message));
    this.raiseEvent();
  }

  onLoad(message) {
    if(!this._pipeline) {
      return false;
    }
    this._pipeline.addStage(new LoadStage(message));
  }

  onSave(message) {
    console.log('onSave message: ', message);
    // this._pipeline.addStage(new SaveStage(message));
    // this.alert();
  }

  onFusion(message) {
    console.log(message);
  }

  list() {
    return this.PipelineAPI.getList().then((res) => {
      console.log(res.results);
      return res.results;
    });
  }

  getPipelines() {
    return this.PipelineAPI.getListEx();
  }

  dataflowize() {
    let structure = {
      'nodes': [],
      'edges': [],
    };

    if (this._pipeline === null) {
      return structure;
    }
    let stages = this.stages();
    if (stages === null) {
      return structure;
    }

    for (let idx = 0; idx < stages.length; ++idx) {
      let stage = stages[idx];

      structure.nodes.push({
        'id': stage.uuid(),
        'type': stage.type(),
        'text': stage.getName(),
        'tasks': '' + stage.numOfTasks(),
      });

      let parentId = stage.getParent();
      if (parentId) {
        structure.edges.push({
          'source': parentId,
          'target': stage.uuid(),
        });
      }
    }
    console.log(structure);
    return structure;
  }

  raiseEvent() {
    this.emit('PIPELINE_UPDATED');
  }

  /* private */

  savePipeline(pipelineName) {
    if(!this._pipeline) {
      return;
    }

    if(pipelineName) {
      this._pipeline.setName(pipelineName);
    } else if(!this._pipeline.getName()) {
      this._pipeline.setName('Untitled pipeline ' + uuid.v4.slice(-12))
    }

    let pipelineMetaObject = {
      uuid: this._pipeline.uuid(),
      name: this._pipeline.getName(),
      ownerId: this.UserService.getCurrentUserAuthData().id,
      stages:[],
    };

    let stages = this._pipeline.getStages();

    for(let i = 0; i < stages.length; ++i) {
      let stage = stages[i];
      let stageMetaObject = {
        uuid: stage.uuid(),
        name: stage.getName(),
        type: stage.getStageType(),
        options: JSON.stringify(stage.getOptions()),
        parent: stage.getParent(),
        visual: {
          x: 0,
          y: 0,
        },
        tasks: [],
      };

      let tasks = this._pipeline.getCurrentStage().getTasks();

      for(let j = 0; j < tasks.length; ++j) {
        let task = tasks[j];
        stageMetaObject.tasks.push({
          uuid: task.uuid(),
          name: task.getName(),
          type: task.getType(),
          options: task.getOptions(),
          datasets: {
            before: '',
            after: '',
          },
          spatial: {
            previous: '',
            next: '',
          },
        });
      }

      pipelineMetaObject.stages.push(stageMetaObject)
    }

    console.log(pipelineMetaObject);
    console.log(JSON.stringify(pipelineMetaObject));
    if(this.isPipelineSaved()) {
      this.PipelineAPI.updateEx(this._pipeline.getMetaID(), pipelineMetaObject).then((res) => {
        console.log('pipeline updated');
        console.log(res);
      }, (res) => {
        console.log('failed to update pipeline');
        console.log(res);
      });
    } else {
      this.PipelineAPI.createEx(pipelineMetaObject).then((res) => {
        console.log('pipeline saved');
        console.log(res);
        this._pipelineIsSaved = true;
      }, (res) => {
        console.log('failed to save pipeline');
        console.log(res);
      });
    }
  }

  deleteTask(stageUUID, taskUUID) {
    this._pipeline.getStage(stageUUID).removeTask(taskUUID);
    this.raiseEvent();
  }

  deleteStage(uuid) {
    console.log(uuid);
    let parentStage = this._pipeline.getStage(uuid).getParent();
    let stages = this._pipeline.getStages();
    for (let i = 0; i < stages.length; ++i) {
      let stage = stages[i];
      if (stage.getParent() === uuid) {
        stage.setParent(parentStage);
      }
    }
    this._pipeline.removeStage(uuid);
    this.raiseEvent();
    console.log(this._pipeline);
  }

  moveTask(stageUUID, sourceIndex, destIndex) {
    let stage = this._pipeline.getStage(stageUUID);
    stage.moveTask(sourceIndex, destIndex);
    this.raiseEvent();
  }

  deletePipeline(uuid) {
    console.log('deleting id: ' + uuid);
    return this.PipelineAPI.deleteEx(uuid);
  }

  onPipelineUpdate(rawData) {
    // console.log('onPipelineUpdate');
    // console.log(rawData);
    if(!this._pipeline) {
      this.startOver();
    }
    if(!rawData) {
      return false;
    }
    /* add new nodes */
    let stages = this._pipeline.getStages();
    for(let i = 0; i < rawData.nodes.length; ++i) {
      let node = rawData.nodes[i];
      let index = _.findIndex(stages, (s) => node.id === s.uuid());
      if(index === -1) {
        let stageObject = null
        switch(rawData.nodes[i].type) {
          case 'load': stageObject = new LoadStage(); break;
          case 'transform': stageObject = new TransformStage(); break;
          case 'mltrain': stageObject = new TrainStage(); break;
          case 'mlpredict': stageObject = new PredictStage(); break;
          case 'split': stageObject = new SplitStage(); break;
          case 'fusion': stageObject = new FusionStage(); break;
          case 'aggregate': stageObject = new AggregateStage(); break;
          case 'save': stageObject = new SaveStage(); break;
        }
        stageObject.setUUID(node.id);
        stageObject.setName(node.text);
        this._pipeline.addStage(stageObject);
      } else {
        stages[index].setName(node.text);
      }
    }

    /* remove anything from pipeline that's no longer in rawData */
    // for(let j = 0; j < stages.length; ++j) {
    //   let stage = stages[j];
    //   console.log('stage: ');
    //   console.log(stage);
    //   console.log('rawData.nodes:');
    //   console.log(rawData.nodes);
    //   console.log('findIndex: ');
    //   console.log(_.findIndex(rawData.nodes, (s) => s.id === stage.uuid()));
    //   if(_.findIndex(rawData.nodes, (s) => s.id === stage.uuid()) === -1) {
    //     console.log('removing ' + stage.uuid());
    //     this._pipeline.removeStage(stage.uuid());
    //   }
    // }

    for(let i = 0; i < rawData.edges.length; ++i) {
      let edge = rawData.edges[i];
      if(this._pipeline.getStage(edge.target) && this._pipeline.getStage(edge.target)) {
        this._pipeline.getStage(edge.target).setParent(edge.source);
      }
    }

    this.raiseEvent();
  }

  setParent(stageUUID, parentUUID) {
    this._pipeline.getStage(stageUUID).setParent(parentUUID);
  }

  removeParent(stageUUID) {
    this._pipeline.getStage(stageUUID).setParent('');
  }

  setStageName(stageUUID, newName) {
    this._pipeline.getStage(stageUUID).setName(newName);
  }

  canBeSetAsParent(stageUUID, parentUUID) {
    let stage = this._pipeline.getStage(stageUUID);
    while((parent = stage.getParent()) !== '') {
      if(parent === parentUUID) {
        return false;
      }
      stage = this._pipeline.getStage(parent);
    }
    return true;
  }

  addAnonStage(anonObject) {
    if(!this._pipeline) {
      this.startOver();
    }

    let index = _.findIndex(this._pipeline.getStages(), (stage) => {
      return anonObject.id === stage.uuid();
    });

    console.log(index);

    if(index !== -1) {
      return;
    }

    let stageObject = null
    switch(anonObject.type) {
      case 'load': stageObject = new LoadStage(); break;
      case 'transform': stageObject = new TransformStage(); break;
      case 'mltrain': stageObject = new TrainStage(); break;
      case 'mlpredict': stageObject = new PredictStage(); break;
      case 'split': stageObject = new SplitStage(); break;
      case 'fusion': stageObject = new FusionStage(); break;
      case 'aggregate': stageObject = new AggregateStage(); break;
      case 'save': stageObject = new SaveStage(); break;
    }
    stageObject.setUUID(anonObject.id);
    stageObject.setName(anonObject.name);
    this._pipeline.addStage(stageObject);
  }

  getPipelineName() {
    return this._pipeline.getName();
  }

  getPipelineUUID() {
    if(this._pipeline) {
      return this._pipeline.uuid();
    }
    return '';
  }

  isPipelineSaved() {
    return this._pipelineIsSaved;
  }

}

export default PipelineService;
