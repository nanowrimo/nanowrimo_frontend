import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  percent: 0,
  goalMet: computed("percent", function() {
    let p = this.get('percent');
    if (p) {
      return p === 100;
    } else {
      return false;
    }
  })
});
