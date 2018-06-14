import {
  validateFormat,
  validateInclusion,
  validateNumber,
  validatePresence
} from 'ember-changeset-validations/validators';
import Project from 'nanowrimo/models/project';

export default {
  pinterestUrl: validateFormat({ allowBlank: true, type: 'url' }),
  playlistUrl: validateFormat({ allowBlank: true, type: 'url' }),
  privacy: validateInclusion({ list: Project.optionsForPrivacy }),
  status: validateInclusion({ list: Project.optionsForStatus }),
  title: validatePresence(true),
  wordCount: validateNumber({ allowBlank: true, integer: true }),
  writingType: validateInclusion({ list: Project.optionsForWritingType })
};
