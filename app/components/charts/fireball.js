import Component from '@ember/component';

export default Component.extend({
  streak: null,
  classNames: ['nw-square-80','chart-fireball'],
  
  init(){
    this._super(...arguments);
  },
  
});
