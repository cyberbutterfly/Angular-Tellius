import {
  PIPELINE_STAGE_TYPES,
  PIPELINE_STAGE_METADATA
} from './pipeline.types';
import _ from 'lodash';
import uuid from 'uuid';

/* tasks */
export class Task {
  constructor(options) {
    this._uuid = uuid.v4();
    this._label = '';
    this._options = options;
    this._timestamps = {
      created: new Date(),
    };
  }

  getName() {
    return this.title();
  }

  getType() {
    return this.constructor.name;
  }

  getOptions() {
    return JSON.stringify(this._options);
  }

  created() {
    return this._timestamps.created;
  }

  title() {
    return 'task did not override title()';
  }

  id() {
    return this._options.ids.after;
  }

  uuid() {
    return this._uuid;
  }
}
export class TransformationTask extends Task {
  constructor(options) {
    super(options);
    console.log('new transform task: ', options);
  }

  title() {
    let response = '';
    switch (this._options.type) {
      case 'renamecolumn':
        response = 'Renamed column ' + this._options.options.columnname + ' to ' + this._options.options.renameto;
        break;
      case 'addcolumn':
        response = 'Added column ' + this._options.options.columnname;
        break;
      case 'splitcolumn':
        response = 'Split column by ' + this._options.options.columnname + ' by "' + this._options.options.delimiter + '"';
        break;
      default:
        response = 'slug: ' + this._options.type;
        break;
    }
    return response;
  }
}

/* stages */
export class Stage {
  constructor(options) {
    this._options = options;
    this._uuid = uuid.v4();
    this._tasks = [];
    this._type = PIPELINE_STAGE_TYPES.UNKNOWN_STAGE;
    this._parent = '';
    this._name = '';
    this._visual = {
      x: null,
      y: null,
    };
  }

  setUUID(uuid) {
    this._uuid = uuid;
  }

  addTask(task) {
    if (!PIPELINE_STAGE_METADATA.get(this._type).children) {
      return false;
    }
    if (!task instanceof Task) {
      return false;
    }
    this._tasks.push(task);
    return true;
  }

  removeTask(uuid) {
    _.remove(this._tasks, function(value, index, array) {
      return value.uuid() === uuid;
    });
  }

  moveTask(from, to) {
    this._tasks.splice(to, 0, this._tasks.splice(from, 1)[0]);
  }

  getStageType() {
    return PIPELINE_STAGE_METADATA.get(this._type).api;
  }

  setName(newName) {
    this._name = newName;
  }

  getName() {
    if(this._name) {
      return this._name;
    }
    return this.title();
  }

  setParent(uuid) {
    this._parent = uuid;
  }

  type(string = true) {
    if (!string) {
      return this._type;
    }
    let meta = PIPELINE_STAGE_METADATA.get(this._type);
    return meta.css;
  }

  getTasks() {
    return this._tasks;
  }

  tasks() {
    if (!PIPELINE_STAGE_METADATA.get(this._type).children) {
      return false;
    }
    return this._tasks;
  }

  title() {
    return PIPELINE_STAGE_METADATA.get(this._type).name;
  }

  numOfTasks() {
    return this._tasks.length;
  }

  uuid() {
    return this._uuid;
  }

  getParent() {
    return this._parent;
  }

  getOptions() {
    return this._options;
  }

  hasChildren() {
    return PIPELINE_STAGE_METADATA.get(this._type).children;
  }

  serialize() {
    let stageObj = {
      stagetype: this.type(true),
      parentIds: [],
      taskIds: [],
    };

    for (var i = 0; i < this._tasks.length; ++i) {
      let task = this._tasks[i];
      stageObj.taskIds.push(task.id());
    }

    return stageObj;
  }
}
export class LoadStage extends Stage {
  constructor(options) {
    super(options);
    this._ids = {
      after: options,
    };
    this._type = PIPELINE_STAGE_TYPES.LOAD_STAGE;
  }

  source() {
    return this._ids.after.id;
  }

  title() {
    return 'Loaded file';
  }

  id() {
    return this._options.id;
  }
}
export class TransformStage extends Stage {
  constructor(options) {
    super(options);
    this._type = PIPELINE_STAGE_TYPES.TRANSFORM_STAGE;
    console.log('new transformation stage');
  }

  title() {
    return 'Transform Action';
  }
}
export class TrainStage extends Stage {
  constructor(options) {
    super(options);
    this._type = PIPELINE_STAGE_TYPES.MLTRAIN_STAGE;
  }

  title() {
    return 'ML Training';
  }
}
export class PredictStage extends Stage {
  constructor(options) {
    super(options);
    this._type = PIPELINE_STAGE_TYPES.MLPREDICT_STAGE;
  }
}
export class FusionStage extends Stage {
  constructor(options) {
    super(options);
    this._type = PIPELINE_STAGE_TYPES.FUSION_STAGE;
  }
}
export class SplitStage extends Stage {
  constructor(options) {
    super(options);
    this._type = PIPELINE_STAGE_TYPES.SPLIT_STAGE;
  }
}
export class AggregateStage extends Stage {
  constructor(options) {
    super(options);
    this._type = PIPELINE_STAGE_TYPES.AGGREGATE_STAGE;
  }
}
export class SaveStage extends Stage {
  constructor(options) {
    super(options);
    console.log(options);
    this._type = PIPELINE_STAGE_TYPES.SAVE_STAGE;
  }

  title() {
    return 'Saved';
  }

  serialize() {
    let stageObj = {
      stagetype: this.type(true),
      parentIds: [],
      taskIds: [],
    };
    console.log(this._options);
    stageObj.taskIds.push(this._options.ids.after.id);
    return stageObj;
  }
}
export class UnknownStage extends Stage {
  constructor(options) {
    super();
    this._type = PIPELINE_STAGE_TYPES.UNKNOWN_STAGE;
  }
}


/* pipeline */
export class Pipeline {
  constructor() {
    this._stages = [];
    this._uuid = uuid.v4();
    this._name = '';
    this._createdAt = new Date();
    this._metaID = '';
  }

  addStage(stage, parent = 'auto') {
    if (!stage instanceof Stage) {
      return false;
    }

    if (parent === 'auto') {
      if (this._stages.length > 0) {
        let lastNode = this.getCurrentStage().uuid();
        stage.setParent(lastNode);
      }
    } else {
      stage.setParent(parent);
    }

    this._stages.push(stage);
    return true;
  }

  removeStage(uuid) {
    _.remove(this._stages, function (value, index, array) {
      return value.uuid() === uuid;
    });
  }

  getCurrentStage() {
    if (this._stages.length > 0) {
      return this._stages[this._stages.length - 1];
    }
    return false;
  }

  getStages() {
    return this._stages;
  }

  getStage(uuid) {
    for(let i = 0; i < this._stages.length; ++i) {
      if(this._stages[i].uuid() === uuid) {
        return this._stages[i];
      }
    }
  }

  numOfStages() {
    return this._stages.length;
  }

  datasetId() {
    if (this._stages.length > 0) {
      // get load stage id
      return this._stages[0].id();
    }
  }

  setName(newName) {
    this._name = newName;
  }

  getName() {
    return this._name;
  }

  uuid() {
    return this._uuid;
  }

  setUUID(uuid) {
    this._uuid = uuid;
  }
  
  setMetaID(id) {
    this._metaID = id;
  }
  
  getMetaID() {
    return this._metaID;
  }

}
