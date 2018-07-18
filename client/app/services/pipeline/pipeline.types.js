import Enum from 'es6-enum';
import ds from 'datastructures-js';
import uuid from 'uuid';

export const PIPELINE_STAGE_TYPES = new Enum(
  'LOAD_STAGE',
  'TRANSFORM_STAGE',
  'FUSION_STAGE',
  'SPLIT_STAGE',
  'AGGREGATE_STAGE',
  'MLTRAIN_STAGE',
  'MLPREDICT_STAGE',
  'SAVE_STAGE',
  'UNKNOWN_STAGE',
);
export const PIPELINE_STAGE_METADATA = new Map();
PIPELINE_STAGE_METADATA.set(PIPELINE_STAGE_TYPES.LOAD_STAGE, {
  name: 'Load Dataset',
  css: 'load',
  children: false,
  api: 'load'
});
PIPELINE_STAGE_METADATA.set(PIPELINE_STAGE_TYPES.TRANSFORM_STAGE, {
  name: 'Transform Dataset',
  css: 'transform',
  children: true,
  api: 'transform',
});
PIPELINE_STAGE_METADATA.set(PIPELINE_STAGE_TYPES.MLTRAIN_STAGE, {
  name: 'Training ML Model',
  css: 'mltrain',
  children: false,
  api: 'mltrain',
});
PIPELINE_STAGE_METADATA.set(PIPELINE_STAGE_TYPES.SAVE_STAGE, {
  name: 'Save Stage',
  css: 'save',
  children: false,
  api: 'save',
});
PIPELINE_STAGE_METADATA.set(PIPELINE_STAGE_TYPES.FUSION_STAGE, {
  name: 'Fusion Stage',
  css: 'fusion',
  children: false,
  api: 'fusion',
});
PIPELINE_STAGE_METADATA.set(PIPELINE_STAGE_TYPES.SPLIT_STAGE, {
  name: 'Split Stage',
  css: 'split',
  children: false,
  api: 'split',
});
PIPELINE_STAGE_METADATA.set(PIPELINE_STAGE_TYPES.MLPREDICT_STAGE, {
  name: 'Predict Stage',
  css: 'mlpredict',
  children: false,
  api: 'mlpredict',
});
PIPELINE_STAGE_METADATA.set(PIPELINE_STAGE_TYPES.AGGREGATE_STAGE, {
  name: 'Aggregate Stage',
  css: 'aggregate',
  children: false,
  api: 'aggregate',
});
PIPELINE_STAGE_METADATA.set(PIPELINE_STAGE_TYPES.UNKNOWN_STAGE, {
  name: 'Unknown Stage',
  css: 'unknown',
  children: false,
  api: 'unknown',
});
