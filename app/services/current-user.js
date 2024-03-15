import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve }  from 'rsvp';
import { computed } from '@ember/object';

export default Service.extend({
  session: service(),
  store: service(),

  user: null,
  email: null,
  isLoaded: false,
  groupUsersLoaded: false,
  load() {
    if (this.get('session.isAuthenticated')) {
      return this.get('store').queryRecord('user',
      { current: true, include: 'projects,timers,stopwatches'}).then((user) => {
        this.set('email', user.email);
        this.set('user', user);
        this.set('isLoaded', true);
        user.loadHomeRegion();
        //get the current user's projects
        return this.get('store').query('project',
        {
          filter: { user_id: user.id },
          include: 'genres,challenges,project-challenges'
        }).then(() => {
            // do nothing?
        });
      });
    } else {
      return resolve();
    }
  },
  
  // should social items be displayed?
  displaySocial: computed("user.isNotConfirmed","user.isOver18", function(){
		let user = this.get('user');
		if (user) {
			let notConfirmed = this.get('user.isNotConfirmed');
			let isOver18 = this.get('user.isOver18');
			return (!notConfirmed && isOver18);
		} else {
			return false;
		}
	})
  
});
