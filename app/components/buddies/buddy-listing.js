import Component from '@ember/component';
import { computed }  from '@ember/object';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';

export default Component.extend({
  
  store: service(),

  pingService: service(),
  
  //group: null,
  buddy: null,
  isActive: null,
  user: null,
  classNames: ['nw-flex-center','nw-user-card'],
  classNameBindings: ['nwDropShadow','nwHighlightShadow'],
  nwDropShadow: true,
  nwHighlightShadow: false,
  showData: 'Overall Progress',
  updatedAt: null,
  
  // Flashes the green outline when a buddy has updates
  buddyDataChanged: observer('pingService.updateCount', function(){
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('buddy.id'));
    if (pps && updateCount) {
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
  }),
  
  // Displays the project title
  displayTitle: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('buddy.id'));
    return (pps && updateCount) ? pps.project_title : '';
  }),
  
  // Returns the event type for the current challenge or null if no challenge found
  eventType: computed('pingService.updateCount', function() {
    const updateCount = this.get('pingService.updateCount');
    const pps = this.get('pingService').primaryProjectState(this.get('buddy.id'));
    return (pps && updateCount) ? pps.event_type : null;
  }),
  
});
