import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import LinkComponent from '@ember/routing/link-component';

export default LinkComponent.extend({
  nanoMenuService: service(),

  click() {
    get(this, "nanoMenuService").toggleSideMenu();
  }
});