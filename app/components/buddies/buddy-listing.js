import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  
  store: service(),
  //currentUser: service(),
  pingService: service(),
  
  group: null,
  user: null,
  overallProgress: 80,
  dailyProgress: 50,
  classNames: ['nw-flex-center','nw-user-card','nw-drop-shadow'],
  showData: 'Overall Progress',
  
  init() {
    this._super(...arguments);
  },
  
  buddy: computed('group.groupUsers','user', function() {
    const gus = this.get('group.groupUsers');
    const cu = this.get('user');
    const store = this.get('store');
    let b = null;
    gus.forEach(function(gu) {
      if (gu.user_id) {
        let u = store.peekRecord('user', gu.user_id);
        if ((u) && (u.id!=cu.id) && (gu.exitAt==null)) {
          b = u;
        }
      }
    });
    return b;
  }),
  
  // Retrieves the primary project state from the ping service
  primaryProjectState: computed('pingService.buddiesData.{[],@each.updated_at}', 'buddy.id', function() {
    alert('p');
    const buddiesData = this.get('pingService.buddiesData');
    const buddyId = this.get('buddy.id');
    let pps = null;
    for (let i = 0; i<buddiesData.length; i++) {
      if (buddiesData[i].user_id == buddyId) {
        pps = JSON.parse(buddiesData[i].primary_project_state);
      }
    }
    return pps;
  }),
  
  eventType: computed('primaryProjectState.updated_at', function() {
    const pps = this.get('primaryProjectState');
    if (pps) {
      return pps.event_type;
    } else {
      return null;
    }
  }),
  
  overallCount: computed('primaryProjectState', function() {
    const pps = this.get('primaryProjectState');
    if (pps) {
      return pps.current_word_count;
    } else {
      return 0;
    }
  }),
  
  overallGoal: computed('primaryProjectState', function() {
    const pps = this.get('primaryProjectState');
    if (pps) {
      return pps.goal_total;
    } else {
      return 50000;
    }
  }),
  
  dailyCount: computed('primaryProjectState.updated_at', function() {
    const ppsua = this.get('primaryProjectState.updated_at');
    const pps = this.get('primaryProjectState');
    if (pps) {
      return pps.daily_total;
    } else {
      return 0;
    }
  }),
  
  dailyGoal: computed('primaryProjectState', function() {
    const pps = this.get('primaryProjectState');
    if (pps) {
      return pps.event_type;
    } else {
      return null;
    }
    return Math.round(pps.goal_total/pps.challenge_days);
  }),
  
  overallProgress: computed('overallCount', 'overallGoal', function() {
    return Math.round((this.get('overallCount')/this.get('overallGoal'))*100);
  }),
  
  dailyProgress: computed('dailyCount', 'dailyGoal', function() {
    const pps = this.get('primaryProjectState');
    if (pps) {
      return Math.round((this.get('dailyCount')/(this.get('dailyGoal')/pps.challenge_days))*100);
    } else {
      return 0;
    }

  }),
  
  updatedAt: computed('primaryProjectState.updated_at', function() {
    const ppsua = this.get('primaryProjectState.updated_at');
    alert(ppsua);
    const pps = this.get('primaryProjectState');
    if (pps) {
      return pps.updated_at;
    } else {
      return null;
    }
  }),
  
  streak: computed('primaryProjectState', function() {
    const pps = this.get('primaryProjectState');
    if (pps) {
      return pps.streak_days;
    } else {
      return 0;
    }
  }),
  
  isActive: computed('group.groupUsers', function() {
    const gus = this.get('group.groupUsers');
    let active = true;
    gus.forEach(function(gu) {
      if (gu.user_id) {
        if (gu.invitationAccepted=='0') {
          active = false;
        }
      }
    });
    return active;
  }),

  conversationSlug: computed('group', function() {
    let g = this.get('group');
    return g.get('slug');
  }),
  
});
