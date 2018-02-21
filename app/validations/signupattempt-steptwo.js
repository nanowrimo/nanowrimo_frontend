import {
  validateInclusion,
  validatePresence
} from 'ember-changeset-validations/validators';
import validateUniqueness from 'nanowrimo/validators/uniqueness';
import TimeZones from 'nanowrimo/lib/time-zones';

export default {
  username: validateUniqueness('username', [
    validatePresence(true)
  ]),
  timeZone: [
    validateInclusion({ list: TimeZones.map(z => z.value) })
  ]
};
