import { ngTabsController } from './tabs.controller';
import template from './tabs.jade';
import './tabs.styl';

export class TabsComponent {
  constructor() {
    this.restrict         = 'E';
    this.scope            = {
      options: '=',
    };
    this.transclude       = true;
    this.template         = template;
    this.controller       = ngTabsController;
    this.controllerAs     = 'vm';
    this.bindToController = true;
  }
}
