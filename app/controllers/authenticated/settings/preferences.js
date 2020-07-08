import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ENV from 'nanowrimo/config/environment';

export default Controller.extend({
  error: null, // String OR object
  currentUser: service(),

  user: computed('currentUser.user',function() {
    return this.get('currentUser.user');
  }),
  
  forumsEmailPreferencesUrl: computed('user.discourseUsername', function(){
    let du = this.get('user.discourseUsername');
    if (du) {
      return `${ENV.forumsUrl}/u/${du}/preferences/emails`;
    } else {
      return 0;
    }
  })
  
});
