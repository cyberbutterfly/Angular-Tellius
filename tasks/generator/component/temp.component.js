import template from './<%= name %>.jade';
import controller from './<%= name %>.controller';
import './<%= name %>.styl';

/**
 * @ngdoc directive
 * @name <%= upCaseName %>Component
 * @public
 */
class <%= upCaseName %>Component {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.template = template;
    this.controller = controller;
    this.controllerAs = 'vm';
    this.bindToController = true;
  }
}

export default <%= upCaseName %>Component;
