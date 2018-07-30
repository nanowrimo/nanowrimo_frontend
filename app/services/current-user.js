import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve }  from 'rsvp';

export default Service.extend({
  session: service(),
  store: service(),

  user: null,

  load() {
    if (this.get('session.isAuthenticated')) {
      return this.get('store').queryRecord('user', 
      { current: true, include: 'projects,groups,group-users' }).then((user) => {
        this.set('user', user);
        
        //get the current user's projects 
        return this.get('store').query('project',
        { 
          filter: { user_id: user.id },
          include: 'genres,challenges,project-challenges,project-sessions'
          
        });
        
        
      });
    } else {
      return resolve();
    }
  }
});