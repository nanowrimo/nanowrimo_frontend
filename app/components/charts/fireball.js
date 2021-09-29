import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  streak: null,
  classNames: ['nw-square-80','chart-fireball'],
  
  init(){
    this._super(...arguments);
  },
  
});
