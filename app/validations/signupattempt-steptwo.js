import {
  validateInclusion,
  validatePresence
} from 'ember-changeset-validations/validators';
import TimeZones from 'nanowrimo/lib/time-zones';

export default {
  username: [
    validatePresence(true),
  ],
  timeZone: [
    validateInclusion({ list: TimeZones.map(z => z.value) })
  ]
};
