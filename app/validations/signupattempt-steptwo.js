import {
  validateInclusion,
  validatePresence
} from 'ember-changeset-validations/validators';
import and from 'ember-changeset-hofs/utils/and'
import validateUniqueness from 'nanowrimo/validators/uniqueness';
import TimeZones from 'nanowrimo/lib/time-zones';

export default {
  username: and(
    validatePresence(true),
    validateUniqueness('username')
  ),
  timeZone: [
    validateInclusion({ list: TimeZones.map(z => z.value) })
  ]
};
