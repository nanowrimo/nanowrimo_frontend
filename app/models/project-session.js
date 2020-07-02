import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { inject as service } from '@ember/service';

export default Model.extend({
  store: service(),
  
  count: attr('number'),
  start: attr('date'),
  end: attr('date'),
  where: attr('number'),
  how: attr('number'),
  feeling: attr('number'),
  createdAt: attr('date'),
  unitType: attr('number'),
  project_challenge_id: attr('number'),
  project: belongsTo('project'),
  projectChallenge: belongsTo('projectChallenge'),
  user: belongsTo('user'),
  
  //override save
  save() {
    let pcid = this.get('projectChallenge.id');
    return this._super().then(() => {
      // reload the projectChallenge
      let s = this.get('store');
      return s.findRecord('projectChallenge', pcid);
    });
  }
});
