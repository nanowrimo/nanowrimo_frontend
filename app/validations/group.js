import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  name: validatePresence(true),
  startDate: validatePresence(true),
  startTime: validatePresence(true),
  //hours: validateInclusion({ list: Group.optionsForHours })
};
