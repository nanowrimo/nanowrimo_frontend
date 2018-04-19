import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  router: service(),
  session: service(),
  store: service(),
  error: null,

  signInAttempt: null,
  
  init(){
    this._super(...arguments);
    let sia = this.get('store').createRecord('sign-in-attempt');
    this.set('signInAttempt', sia);
  }
});
