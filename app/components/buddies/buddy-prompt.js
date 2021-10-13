import Component from '@ember/component';
import { computed }  from '@ember/object';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  
  forumsUrl: computed(function() {
    return ENV.forumsUrl;
  }),
  
});
