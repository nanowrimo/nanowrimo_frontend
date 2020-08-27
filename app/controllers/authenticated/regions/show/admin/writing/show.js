import Controller from '@ember/controller';
import { computed }  from '@ember/object';
import { alias }  from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  session: service(),
  currentUser: service(),
  router: service(),
  group: alias('model.group'),
  activeTab: 'members',
  reorder: false,
  resize: true,
  columns: computed(function() {
    const a = [
        {
          name: `User`,
          valuePath: `name`
        },
        {
          name: `Homed?`,
          valuePath: `homed`
        },
        {
          name: `Win?`,
          valuePath: `win`
        },
        {
          name: `Word Count`,
          valuePath: `wordcount`
        },
        {
          name: `Goal`,
          valuePath: `goal`
        },
        {
          name: `Last update`,
          valuePath: `update`
        },
      ];
    return a;
  }),
  sorts: computed(function() {
    const a = [
        {
          valuePath: 'name',
          isAscending: false,
        },
        {
          valuePath: 'homed',
          isAscending: false,
        },
        {
          valuePath: 'win',
          isAscending: false,
        },
        {
          valuePath: 'wordcount',
          isAscending: false,
        },
        {
          valuePath: 'goal',
          isAscending: false,
        },
        {
          valuePath: 'update',
          isAscending: false,
        },
      ];
    return a;
  }),
  
  challengeSortingDesc: Object.freeze(['startsAt:desc']),
  
  // Gets all challenges from the store
  availableOptionsForChallenges:  computed('getChallengeOptions', function() {
    return this.get('store').query('challenge',{ available: false});
  }),
 
  optionsForChallenges: sort('availableOptionsForChallenges','challengeSortingDesc'),
  
  // Returns true if the user can edit the region
  canEditGroup: computed('currentUser.user.groupUsersLoaded',function() {
    if (this.get('currentUser.user.groupUsersLoaded')) {
      if (this.get('currentUser.user.adminLevel')) {
        return true;
      } else {
        let uid = this.get('currentUser.user.id');
        let gid = this.get('group.id');
        let gus = this.get('store').peekAll('group-user');
        let found = false;
        gus.forEach((gu)=>{
          if ((gu.user_id==uid)&&(gu.group_id==gid)&&(gu.isAdmin)) {
            found = true;
          }
        });
        return found;
      }
    } else {
      return false;
    }
  }),
  
  
  groupMembers: computed('model.listResults',function() {
    const lr = this.get('model.listResults');
    let a = [];
    let b = [];
    for (const [key, value] of Object.entries(lr)) {
      a.push(value[0]);
      b.push(key);
    }
    return a;
  }),
  
  actions: {
    associateChallengeSelect(challengeId) {
      this.get('router').transitionTo('authenticated.regions.show.admin.writing.show', this.get('group.slug'), challengeId );
    },
  }
  
});
