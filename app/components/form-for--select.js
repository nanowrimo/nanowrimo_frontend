import Component from '@ember/component';
import { isArray } from '@ember/array';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { next } from '@ember/runloop';


export default Component.extend({
  changeset: null,
  hasAttemptedSubmit: false,
  label: '',
  options: null,
  property: null,
  value: null,
  initialValue: null,
  hasChange: false,
  showSelect: true,
  
  name: reads('property'),
  
  //track some changes
  didChange: computed('changeset.changes.[]', function(){
    //the changeset changed, is it now pristine?
    let isPristine = this.get('changeset.isPristine');
    
    if (isPristine && this.get('hasChange') ) {
      this.set('value', this.get('initialValue') );
      this._resetShowSelect();
    }
    
    let cc = this.get('changeset.changes');
    cc.forEach((c)=>{
      if (c.key == this.get('property')) {
        this.set('hasChange', true);
      }
    });
    
    return "";
  }),
  
  normalizedOptions: computed('options.[]','viewReset', function() {
    return this.get('options').map(function(option) {
      return (typeof option === 'string') ? { name: option, value: option } : option;
    });
  }),
  
  valueAsString: computed('value', function() {
    let value = this.get('value').toString();
    return value;
  }),
  
  init() {
    this._super(...arguments);
    assert('Must pass options array into {{form-for--select}}', isArray(this.get('options')));
    //set the initial value that we need to track
    let v = this.get(`changeset.${this.get('property')}`);
    this.set('value', v);
    this.set('initialValue', v);
  },
  
  actions: {
    valueChanged: function(value){
      this.set(`changeset.${this.get('property')}`, value);
      this.set('value', value);
    }
  },
  _resetShowSelect: function() {
    this.set('showSelect', null);
    //wait a bit and set the pc to the proper value
    next(()=>{
      this.set('showSelect', true);
    });
  }
});
