import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias, filterBy, not }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  currentUser: service(),


  region: alias('model'),


});
