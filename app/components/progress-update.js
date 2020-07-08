import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  currentUser: service(),
  session: service(),
  
  projectSession: null,
  
  // Get the end date
  formattedEnd: computed("projectSession.end", function(){
    let e = this.get('projectSession.end');
    let cu = this.get('currentUser.user');
    if (e) {
      return cu.shortDateStringInTimeZone(e);
    } else {
      return null;
    }
  }),
  
  actions: {
    // 
    deleteProjectSession() {
      // get the session
      let ps = this.get('projectSession');
      // Destroy it
      ps.destroyRecord();
    }
  }

});
