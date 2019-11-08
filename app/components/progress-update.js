import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from "moment"
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  
  // Get the project challenge as a variable
  projectSession: null,
  
  // Get the end date
  formattedEnd: computed("projectSession.end", function(){
    let e = this.get('projectSession.end');
    if (e) {
      let time = moment(e);
      if (time.month()===4) {
        //may does not need to be formatted with a period
        return time.format("MMM DD, YYYY");
      } else {
        return time.format("MMM. DD, YYYY");
      }
    }
  }),
  
  
  // Get the total words
  totalWords: computed('projectSession.count',function() {
    let pcid = this.get('projectSession.project_challenge_id');
    let postDate = this.get('projectSession.end');
    let store = this.get('store');
    let pss = store.peekAll('projectSession');
    let total = 0;
    if (pss) {
      pss.forEach((ps)=>{
        if ((ps.project_challenge_id==pcid) && (ps.end<=postDate)) {
          total += ps.count;
        }
      });
    }
    return total;
  }),
  
  actions: {
    // For deleting nanomessages
    deleteProjectSession() {
      // get the message
      let ps = this.get('projectSession');
      // Delete it
      ps.deleteRecord();
      ps.save().then(()=>{
        this.onDelete();
      });
    },
  }
  
  
  
});
