import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal }  from '@ember/object/computed';
import { htmlSafe }  from '@ember/string';

export default Component.extend({
  percent: 0,

  goalMet: equal('percent', 100),

  fillStyle: computed('percent', function() {
    return htmlSafe(`width:${this.get('percent')}%`);
  })
});
