import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
    nanoMenuService: service(),

    classNames: ["nano-side-menu-toggle"],

    click() {
      get(this, "nanoMenuService").toggleSideMenu();
    }
});