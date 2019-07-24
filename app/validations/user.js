import {
  validateFormat,
  validatePresence,
  validateLength
} from 'ember-changeset-validations/validators';
import and from 'nanowrimo/lib/ember-changeset-validations-and'
import validateUniqueness from 'nanowrimo/validators/uniqueness';

export default {
  name: and(
    validatePresence(true),
    validateUniqueness('name')
  ),
  email: and(
    validateFormat({ type: 'email' }),
    validateUniqueness('email')
  ),
  newPassword: [
    validateLength({ min: 8 }),
    validateLength({ max: 128 })
  ],
  
};
