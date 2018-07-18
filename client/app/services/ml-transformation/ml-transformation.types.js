export const TRANSFORM_TYPES = {
  'categorical': [{
    name: 'One hot encoding',
    value: 'oneHotEncoding',
  }, {
    name: 'Indexing',
    value: 'index',
  }],
  'string': [{
    name: 'Indexing',
    value: 'index',
  }, {
    name: 'One hot encoding',
    value: 'oneHotEncoding',
  }],
  'continuous': [{
    name: 'No scalar',
    value: 'noScalar',
  }, {
    name: 'Standard scalar',
    value: 'standardScalar',
  }, {
    name: 'Min max scalar',
    value: 'minmaxScalar',
  }],
  'text': [{
    name: 'Indexing',
    value: 'index',
  }, {
    name: 'One hot encoding',
    value: 'oneHotEncoding',
  }],
};

export const NULL_TYPES = [{
  name: 'Mean',
  value: 'mean',
}, {
  name: 'Zero',
  value: 'zero',
}, {
  name: 'Ignore',
  value: 'ignore',
}];
