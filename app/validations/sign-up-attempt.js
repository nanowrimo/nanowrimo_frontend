import {
  validateFormat,
  validateInclusion,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';
import validateUniqueness from 'nanowrimo/validators/uniqueness';
import validateThirteen from 'nanowrimo/validators/thirteen';
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
  thirteen: validateThirteen(),
  timeZone: validateInclusion({ list: TimeZones.map(z => z.value) })
};
