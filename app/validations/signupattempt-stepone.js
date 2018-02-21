import {
  validateFormat,
  validateLength
} from 'ember-changeset-validations/validators';
import validateUniqueness from 'nanowrimo/validators/uniqueness';

export default {
  email: validateUniqueness('email', [
    validateFormat({ type: 'email' })
  ]),
  password: [
    validateLength({ min: 6 }), // Devise default
    validateLength({ max: 128 }) // Devise default
  ]
};
