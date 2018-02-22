import {
  validateFormat,
  validateLength
} from 'ember-changeset-validations/validators';
import and from 'ember-changeset-hofs/utils/and'
import validateUniqueness from 'nanowrimo/validators/uniqueness';

export default {
  email: and(
    validateFormat({ type: 'email' }),
    validateUniqueness('email')
  ),
  password: [
    validateLength({ min: 6 }), // Devise default
    validateLength({ max: 128 }) // Devise default
  ]
};
