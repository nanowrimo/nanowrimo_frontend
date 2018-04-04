import {
  validateFormat,
  validateInclusion,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';
import and from 'ember-changeset-hofs/utils/and'
import validateUniqueness from 'nanowrimo/validators/uniqueness';
import TimeZones from 'nanowrimo/lib/time-zones';

export default {
  email: and(
    validateFormat({ type: 'email' }),
    validateUniqueness('email')
  ),
  password: [
    validateLength({ min: 8 }), // Devise default
    validateLength({ max: 128 }) // Devise default
  ],
  username: and(
    validatePresence(true),
    validateUniqueness('name')
  ),
  timeZone: validateInclusion({ list: TimeZones.map(z => z.value) })
};
