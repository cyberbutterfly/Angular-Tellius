import {
  TelliscriptController,
}
from './telliscript.controller';
import template from './telliscript.jade';
import './telliscript.scss';

export class TelliscriptComponent {
  constructor() {
    this.scope = {};
    this.template = template;
    this.controller = TelliscriptController;
    this.controllerAs = 'vm';
    this.bindToController = true;
  }
}
