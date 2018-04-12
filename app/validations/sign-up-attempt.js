import {
  validateFormat,
  validateInclusion,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';
import validateUniqueness from 'nanowrimo/validators/uniqueness';
import TimeZones from 'nanowrimo/lib/time-zones';

export default {
  email: [
    validateFormat({ type: 'email' }),
    validateUniqueness('email')
  ],
  password: [
    validateLength({ min: 8 }), 
    validateLength({ max: 128 }) 
  ],
  username: [
    validatePresence(true),
    validateUniqueness('name')
  ],
  timeZone: validateInclusion({ list: TimeZones.map(z => z.value) })
};
