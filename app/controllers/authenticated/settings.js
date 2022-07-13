import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
import TimeZones from 'nanowrimo/lib/time-zones';
import $ from 'jquery';

export default Controller.extend({
  currentUser: service(),
  isLoaded: computed("currentUser.isLoaded", function() {
    return this.get('currentUser.isLoaded');
  }),
});
