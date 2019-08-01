import {
  validateFormat,
  validatePresence,
  validateLength
} from 'ember-changeset-validations/validators';

export default {
  name:
    validatePresence(true)
  ,
  email: 
    validateFormat({ type: 'email' })
  ,
  newPassword: [
    validateLength({ min: 6 }),
    validateLength({ max: 128 })
  ],
  
};
