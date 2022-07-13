import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed} from '@ember/object';

export default Controller.extend({
  currentUser: service(),
  isLoaded: computed("currentUser.isLoaded", function() {
    return this.get('currentUser.isLoaded');
  }),
});
