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
      { current: true, include: 'projects,group-users,groups' }).then((user) => {
        this.set('user', user);
        
        //get the current user's groups 
        return this.get('store').query('groupUser',
        { 
          filter: { user_id: user.id },
          include: 'groups'
        }).then(() => {
          //get the current user's projects
          return this.get('store').query('project',
          { 
            filter: { user_id: user.id },
            include: 'user,genres,challenges,project-challenges,project-sessions'
          
          }).then(() => {
            //get the current user's buddies 
            return this.get('store').query('group',
            { 
              filter: { group_type: 'buddies' },
              include: 'group-users,users'
            });
          });
        });
        
      });
    } else {
      return resolve();
    }
  }
});