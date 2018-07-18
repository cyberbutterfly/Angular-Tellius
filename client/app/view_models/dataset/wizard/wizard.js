import angular from 'angular';
import State from './wizard.state';

import MongoDB from './mongodb/mongodb';
import Oracle from './oracle/oracle';
import S3 from './s3/s3';
import JSON from './json/json';
import CSV from './csv/csv';
import XML from './xml/xml';
import Name from './name/name';
import Measures from './measures/measures';
import Schema from './schema/schema';
import Cassandra from './cassandra/cassandra';
import Hadoop from './hadoop/hadoop';

import './wizard.scss';

const module = angular.module('Tellius.dataset.wizard', [
  Name.name,
  Measures.name,
  JSON.name,
  CSV.name,
  XML.name,
  S3.name,
  MongoDB.name,
  Schema.name,
  Cassandra.name,
  Oracle.name,
  Hadoop.name,
]);

module.config(State);
module.component('datasetWizard', {
  template: `<ui-view></ui-view>`,
});
export default module;
