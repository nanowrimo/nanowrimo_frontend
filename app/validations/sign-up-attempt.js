import {
  validateFormat,
  validateInclusion,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';
import and from 'ember-changeset-hofs/utils/and'
import validateUniqueness from 'nanowrimo/validators/uniqueness';
import validateThirteen from 'nanowrimo/validators/thirteen';
import validateTerms from 'nanowrimo/validators/terms';
import TimeZones from 'nanowrimo/lib/time-zones';

export default {
  email: and(
    validateFormat({ type: 'email' }),
    validateUniqueness('email')
  ),
  password: [
    validateLength({ min: 8 }),
    validateLength({ max: 128 })
  ],
  username: and(
    validatePresence(true),
    validateUniqueness('name')
  ),
  thirteen: validateThirteen(),
  terms: validateTerms(),
  timeZone: validateInclusion({ list: TimeZones.map(z => z.value) })
};
