import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  groups: alias('model'),
  _longitude: 45.00,
  longitude: computed('_longitude',function() {
    return this.get('_longitude');
  }),
  _latitude: 45.00,
  latitude: computed('_latitude',function() {
    return this.get('_latitude');
  }),
  actions: {
    remapCenter(longitude, latitude) {
      this.set('_longitude', longitude);
      this.set('_latitude', latitude);
    }
  }
  
});
