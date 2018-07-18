import { PaneController } from './pane.controller';
import template from './pane.jade';
import './pane.styl';

export class PaneComponent {
  constructor() {
    this.restrict         = 'AE';
    this.template         = template;
    this.scope            = {
      title: '@',
    };
    this.require          = '^ngTabs';
    this.transclude       = true;
    this.controllerAs     = 'vm';
    this.controller       = PaneController;
    this.bindToController = true;
    this.link             = (scope, element, attrs, TabsController) => {
      TabsController.addPane(scope);
    };
  }
}
