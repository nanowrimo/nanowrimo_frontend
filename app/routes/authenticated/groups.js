import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
export default Route.extend({
  currentUser: service(),
  
  observeCurrentUser: observer('currentUser.user', function(){
    let cu = this.get('currentUser.user');
    if (cu) {
      // redirect to the user's slug
      this.transitionTo('authenticated.users.show.groups', cu.slug);
    }
  }),
  
  model() {
    let user = this.get('currentUser.user');
  }
});
