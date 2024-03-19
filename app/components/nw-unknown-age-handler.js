import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  currentUser: service(),
  session: service(),
	termsText: null,
  init(){
    this._super(...arguments);
  },
  displayBanner: computed('currentUser.user.birthday', function(){
		// do we know the user's age?
		let bday = this.get('currentUser.user.birthday');
		return  bday == null;
	})

});
