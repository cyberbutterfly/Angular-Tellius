import {
  NavSidebarController,
}
from './nav-sidebar.controller';
import template from './nav-sidebar.jade';
import './nav-sidebar.scss';

export class NavSidebarComponent {
    constructor() {
        this.scope = {};
        this.template = template;
        this.controller = NavSidebarController;
        this.controllerAs = 'vm';
        this.bindToController = true;
    }
}
