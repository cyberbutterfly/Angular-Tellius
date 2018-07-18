'use strict';

const express      = require('express');
const requestProxy = require('express-request-proxy');
const fallback     = require('express-history-api-fallback');

const searchQLUrl   = 'http://54.208.18.209:8082/';
const middlewareUrl = 'http://54.208.18.209:8080/';
const SparkURL      = 'http://ec2-52-23-241-22.compute-1.amazonaws.com:8082/';

module.exports = () => {
  const app = express();
  const root = __dirname + '/../dist';

  app.set('port', 3000);

  app.disable('x-powered-by');
  app.use(express.static(root));
  app.use(express.static(__dirname + '/../client'));

  app.all([
    '/thumbnail',
  ], requestProxy({
    url: `${middlewareUrl}thumbnail`,
  }));
  app.all([
    '/thumbnail/*',
  ], requestProxy({
    url: `${middlewareUrl}thumbnail/*`,
  }));
  app.all([
    '/vizpad',
  ], requestProxy({
    url: `${middlewareUrl}vizpad`,
  }));
  app.all([
    '/vizpad/*',
  ], requestProxy({
    url: `${middlewareUrl}vizpad/*`,
  }));
  app.all([
    '/viz',
  ], requestProxy({
    url: `${middlewareUrl}viz`,
  }));
  app.all([
    '/users',
  ], requestProxy({
    url: `${middlewareUrl}users`,
  }));
  app.all([
    '/users/*',
  ], requestProxy({
    url: `${middlewareUrl}users/*`,
  }));
  app.all([
    '/group',
  ], requestProxy({
    url: `${middlewareUrl}group`,
  }));
  app.all([
    '/group/*',
  ], requestProxy({
    url: `${middlewareUrl}group/*`,
  }));
  app.all([
    '/groups',
  ], requestProxy({
    url: `${middlewareUrl}groups`,
  }));
  app.all([
    '/groups/*',
  ], requestProxy({
    url: `${middlewareUrl}groups/*`,
  }));
  app.all([
    '/viz/*',
  ], requestProxy({
    url: `${middlewareUrl}viz/*`,
  }));
  app.all([
    '/colorPaletteDataColors',
  ], requestProxy({
    url: `${middlewareUrl}colorPaletteDataColors`,
  }));

  app.all([
    '/meta/pipeline',
  ], requestProxy({
    url: `${middlewareUrl}pipeline`,
  }));

  app.all([
    '/meta/pipeline/*',
  ], requestProxy({
    url: `${middlewareUrl}pipeline/*`,
  }));

  app.all([
    '/api/datasetAttributes',
  ], requestProxy({
    url: `${middlewareUrl}datasetAttributes`,
  }));

  app.all([
    '/api/datasetAttributes/*',
  ], requestProxy({
    url: `${middlewareUrl}datasetAttributes/*`,
  }));
  app.all([
    '/api/dataset',
  ], requestProxy({
    url: `${middlewareUrl}dataset`,
  }));
  app.all([
    '/api/dataset/*',
  ], requestProxy({
    url: `${middlewareUrl}dataset/*`,
  }));

  app.post([
    '/api/ml/predict',
  ], requestProxy({
    url: `${SparkURL}ml/predict`,
  }));

  app.all([
    '/api/login',
  ], requestProxy({
    url: `${middlewareUrl}login`,
  }));

  app.post([
    '/ml/*',
  ], requestProxy({
    url: `${SparkURL}ml/*`,
  }));
  app.post([
    '/load',
  ], requestProxy({
    url: `${SparkURL}load`,
  }));
  app.post([
    '/view',
  ], requestProxy({
    url: `${SparkURL}view`,
  }));
  app.post([
    '/transform',
  ], requestProxy({
    url: `${SparkURL}transform`,
  }));
  app.post([
    '/functions',
  ], requestProxy({
    url: `${SparkURL}functions`,
  }));
  app.post([
    '/pipeline/*',
  ], requestProxy({
    url: `${SparkURL}pipeline/*`,
  }));

  app.all([
    '/api/*',
  ], requestProxy({
    url: `${SparkURL}api/*`,
  }));

  app.all([
    '/searchQL',
  ], requestProxy({
    timeout: 100000,
    url: `${searchQLUrl}searchQL`,
  }));
  app.all([
    '/history',
  ], requestProxy({
    timeout: 100000,
    url: `${searchQLUrl}history`,
  }));
  app.all([
    '/extendedSQL',
  ], requestProxy({
    timeout: 100000,
    url: `${searchQLUrl}extendedSQL`,
  }));

  app.use(fallback('index.html', {
    root,
  }));

  return app;
};
