import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';

export default Component.extend({
  currentUser: service(),
  primaryProject: null,
  initialValue: oneWay('primaryProject.unitCount'),
  
  init() {
    this._super(...arguments);
    //get the current user's primaryProject
    let user = this.get('currentUser').get('user');
    let project = user.primaryProject;
    this.set('primaryProject', project);
  },

  actions: {
    formSubmit(v) {
      console.log(v);
    }
  }
});
