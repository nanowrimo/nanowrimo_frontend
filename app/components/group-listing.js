import Component from '@ember/component';
import { computed } from '@ember/object';
import {inject as service} from '@ember/service';

export default Component.extend({
  store: service(),
  group: null,
  isRegion: computed('group.groupType', function() {
    let gt = this.get('group.groupType');
    if (gt=='region') {
      return true;
    } else {
      return false;
    }
  }),
  isWritingGroup: computed('group.groupType', function() {
    let gt = this.get('group.groupType');
    if (gt=='writing group') {
      return true;
    } else {
      return false;
    }
  }),
});
