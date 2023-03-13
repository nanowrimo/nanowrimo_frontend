import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  currentUser: service(),
  session: service(),
  tagName: '',
  projectSession: null,
  afterDelete: null,
  
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
      //get the id
      let id = ps.id;
      // Destroy it
      ps.destroyRecord();
      // run the afterDelete
      let ad=this.get('afterDelete');
      ad(id);
    }
  }
});
