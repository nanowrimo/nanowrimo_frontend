import {
  validateFormat,
  validateInclusion,
  validateNumber,
  validatePresence
} from 'ember-changeset-validations/validators';
import Group from 'nanowrimo/models/group';

export default {
  name: validatePresence(true),
  startDate: validatePresence(true),
  startTime: validatePresence(true),
  //hours: validateInclusion({ list: Group.optionsForHours })
};
