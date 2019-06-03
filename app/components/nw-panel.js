import Component from '@ember/component';

export default Component.extend({
  classNames: ["nw-panel"],
  currentPanel: '',
  actions: {
    switchSection(val) {
      this.set('currentPanel',val.target.id);
      val.target.className='nw-active-tab';
    }
  }
});