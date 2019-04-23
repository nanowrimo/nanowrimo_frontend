import Component from '@ember/component';

export default Component.extend({
  classNames: ["nw-flippy-card"],
  classNameBindings: ['nw-flipped'],
  actions: {
    toggleSubcard() {
      this.toggleProperty('nw-flipped');
    }
  }
});