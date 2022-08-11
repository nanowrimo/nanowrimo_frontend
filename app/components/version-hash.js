import Component from '@ember/component';
import ENV from 'nanowrimo/config/environment';


export default Component.extend({
 versionHash: null, 
 
  init(){
    this._super(...arguments);
    let versionParts = ENV.APP.version.split("+");
    this.set("versionHash", versionParts[1]);
  },
});
