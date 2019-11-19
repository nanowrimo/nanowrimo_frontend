import Component from '@ember/component';
import { computed } from '@ember/object';
import ENV from 'nanowrimo/config/environment';
import fetch from 'fetch';

export default Component.extend({
  
  classNames: ['nw-card'],
  classNameBindings: ['flexSize'],
  
  actions: {
  }
  
});
