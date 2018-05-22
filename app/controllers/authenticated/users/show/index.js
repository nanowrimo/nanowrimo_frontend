import Controller from '@ember/controller';
import { alias, not }  from '@ember/object/computed';

export default Controller.extend({
  user: alias('model'),

  bioExpanded: false,

  showBioReadMore: not('bioExpanded')
});
