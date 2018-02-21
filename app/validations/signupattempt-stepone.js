import {
  validateFormat,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';
import validateUniqueness from 'nanowrimo/validators/uniqueness';

export default {
  email: [
    validatePresence(true),
    validateFormat({ type: 'email' }),
    validateUniqueness('email')
  ],
  password: [
    validatePresence(true),
    validateLength({ min: 6 }), // Devise default
    validateLength({ max: 128 }) // Devise default
  ]
};
