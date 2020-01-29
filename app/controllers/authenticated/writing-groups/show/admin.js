import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  group: alias('model'),
  currentUser: service(),
  
  isAdmin: computed('currentUser.user.name', function() {
    return true;//((this.get('currentUser.user.name')=="Dave Beck")||(this.get('currentUser.user.name')=="Jezra"));
  }),
});
