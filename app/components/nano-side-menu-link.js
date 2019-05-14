import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  nanoMenuService: service(),
  menuItem:null,

  click() {
    this.get("nanoMenuService").toggleSideMenu();
  }
});
