import Component from '@ember/component';
import ENV from 'nanowrimo/config/environment';

export default Component.extend({
  
  forumsUrl: computed(function() {
    return ENV.forumsUrl;
  }),
  
});
