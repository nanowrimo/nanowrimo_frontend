import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  currentUser: service(),
  session: service(),
	termsText: null,
	user: null,
  init(){
    this._super(...arguments);
    this.set('user', this.get('currentUser.user'));
  },
  displayBanner: computed('currentUser.birthdate' , function(){
		// do we know the user's age?
		let bday = this.get('currentUser.birthdate');
		return  bday == null;
	})

});
