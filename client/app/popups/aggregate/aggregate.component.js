import { AggregateController } from './aggregate.controller';
import template from './aggregate.jade';

export class AggregateComponent {
  constructor() {
    this.restrict = 'E';
    this.scope = {
      closeThisDialog: '&',
    };
    this.template = template;
    this.controller = AggregateController;
    this.controllerAs = 'vm';
    this.bindToController = true;
  }
}
