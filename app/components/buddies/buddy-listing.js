import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import { debounce } from '@ember/runloop';

export default Component.extend({
  
  store: service(),
  //currentUser: service(),
  pingService: service(),
  
  group: null,
  user: null,
  classNames: ['nw-flex-center','nw-user-card'],
  classNameBindings: ['nwDropShadow','nwHighlightShadow'],
  nwDropShadow: true,
  nwHighlightShadow: false,
  showData: 'Overall Progress',
  updatedAt: null,
  updateCount: 1,
  
  init() {
    this._super(...arguments);
    this.incrementUpdateCount();
  },
  
  incrementUpdateCount: function(){
    if (this.isDestroyed) {
        return;
    }
    let updateCount = this.get('updateCount');
    this.set('updateCount', updateCount+1);
    const buddiesData = this.get('pingService.buddiesData');
    const buddyId = this.get('buddy.id');
    let pps = null;
    if (buddiesData) {
      for (let i = 0; i<buddiesData.length; i++) {
        if (buddiesData[i].user_id == buddyId) {
          pps = JSON.parse(buddiesData[i].primary_project_state);
        }
      }
      if (pps) {
        if (this.get('updatedAt') != pps.updated_at) {
          if (this.get('updatedAt') == null) {
            this.set('updatedAt',pps.updated_at);
          } else {
            this.set('nwDropShadow', false);
            this.set('nwHighlightShadow', true);
            this.set('updatedAt',pps.updated_at);
          }
        } else {
          this.set('nwDropShadow', true);
          this.set('nwHighlightShadow', false);
        }
      }
    }
    debounce(this, this.incrementUpdateCount, 2000, false);
  },
    
  pps: function() {
    const buddiesData = this.get('pingService.buddiesData');
    const buddyId = this.get('buddy.id');
    let pps = null;
    for (let i = 0; i<buddiesData.length; i++) {
      if (buddiesData[i].user_id == buddyId) {
        pps = JSON.parse(buddiesData[i].primary_project_state);
      }
    }
    return pps;
  },
  
  // Displays the project title
  displayTitle: computed( 'updateCount', function() {
    const updateCount = this.get('updateCount');
    const pps = this.pps();
    if (pps && updateCount) {
      return pps.project_title
    }
    return '';
  }),
  
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
