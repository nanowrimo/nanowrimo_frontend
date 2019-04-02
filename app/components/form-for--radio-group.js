import Component from '@ember/component';

export default Component.extend({
  changeset: null,
  hasAttemptedSubmit: false,
  options: null,
  property: null,
  initialValue: null,
  
  init(){
    this._super(...arguments);
    //set the initial value as a string for later comparison
    let v = this.get('changeset').get( this.get('property') );
    this.set('initialValue', v.toString());
  },
  
  actions: {
    clicked(val) {
      this.get('changeset').set(this.get('property'), val);
      let rccb = this.get('radioClickedCallback');
      if (rccb) {
        rccb(this.get('changeset').get('changes') );
      }
    }
  },
});
