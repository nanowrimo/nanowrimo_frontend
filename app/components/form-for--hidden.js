import Component from '@ember/component';
import { reads } from '@ember/object/computed';
import { assert } from '@ember/debug';

export default Component.extend({
  changeset: null,
  property: '',
  name: reads('property'),
  initial_value: null,
  //override init
  init() {
    this._super(...arguments);
    let iv = this.get('initial_value');
    let n = this.get('name');
    assert('Must pass an initial_value into {{form-for--hidden}}', iv);
    //add the initial value to the changeset 
    this.get('changeset').set(n, iv);
  }

});
