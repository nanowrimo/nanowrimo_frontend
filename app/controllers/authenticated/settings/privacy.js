import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import User from 'nanowrimo/models/user';
export default Controller.extend({
  error: null, // String OR object
  currentUser: service(),

  user: computed('currentUser.user',function() {
    return this.get('currentUser.user');
  }),
  
  optionsForPrivacyViewProfile: computed(function() {
    return User.optionsForPrivacyViewProfile;
  }),
  optionsForPrivacyViewProjects: computed(function() {
    return User.optionsForPrivacyViewProjects;
  }),
  optionsForPrivacyViewBuddies: computed(function() {
    return User.optionsForPrivacyViewBuddies;
  }),
  optionsForPrivacyViewSearch: computed(function() {
    return User.optionsForPrivacyViewSearch;
  }),
  optionsForPrivacySendNanomessages: computed(function() {
    return User.optionsForPrivacySendNanomessages;
  }),
});
