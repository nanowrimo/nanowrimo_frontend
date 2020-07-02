import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { inject as service } from '@ember/service';

export default Model.extend({
  store: service(),
  currentUser: service(),
  
  count: attr('number'),
  start: attr('date'),
  end: attr('date'),
  where: attr('number'),
  how: attr('number'),
  feeling: attr('number'),
  createdAt: attr('date'),
  unitType: attr('number'),
  project_challenge_id: attr('number'),
  project_id: attr('number'),
  project: belongsTo('project'),
  projectChallenge: belongsTo('projectChallenge'),
  user: belongsTo('user'),
  
  //override save
  save() {
    let pcid, pid;
    if (this.isDeleted) { 
      //the record is being deleted
      pcid = this.get('project_challenge_id');
      pid = this.get('project_id');
    } else {
      pcid = this.get('projectChallenge.id');
      pid = this.get('project.id');
    }
   
    return this._super().then(() => {
      // get the store, there are queries to make
      let s = this.get('store');
      
      // reload the projectChallenge
      s.findRecord('projectChallenge', pcid,{reload: true});
      
      //reload the project 
      s.findRecord('project', pid, { reload: true } );
      
      //reload the user's stats

      this.get('currentUser.user').refreshStats();
      
    });
  }
});
