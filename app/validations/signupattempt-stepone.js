import {
  validateFormat,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  email: [
    validatePresence(true),
    validateFormat({ type: 'email' })
  ],
  password: [
    validatePresence(true),
    validateLength({ min: 6 }), // Devise default
    validateLength({ max: 128 }) // Devise default
  ]
};
