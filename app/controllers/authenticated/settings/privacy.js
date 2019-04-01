import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import User from 'nanowrimo/models/user';
import { next }  from '@ember/runloop';

export default Controller.extend({
  error: null, // String OR object
  currentUser: service(),
  showForm: false,
  
  init(){
    this._super(...arguments);
    this.set('showFormRadios', true);
  },
  user: computed('currentUser.user',function() {
    return this.get('currentUser.user');
  }),
  
  optionsForPrivacyAccount: computed(function(){
    return User.optionsForPrivacyAccount;
  }),

  optionsForPrivacyProjects: computed(function() {
    return User.optionsForPrivacyProjects;
  }),
  optionsForPrivacyBuddies: computed(function() {
    return User.optionsForPrivacyBuddies;
  }),
  actions:{
    resetCallback(){
      this.set('showFormRadios', false);
      next(()=>{  this.set('showFormRadios', true) });
    }
  }

});
