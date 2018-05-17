import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  nanoMenuService: service(),
  storeLinks: alias("nanoMenuService.storeLinks"),
  helpLinks: alias("nanoMenuService.helpLinks")
});
