import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

const Badge = Model.extend({
  title: attr('string'),
  list_order: attr('number'),
  adheres_to: attr('string'),
  badge_type: attr('string'),
  unawarded: attr('string'),
  awarded: attr('string'),
  description: attr('string'),
  awarded_description: attr('string'),
  generic_description: attr('string'),
  winner: attr('boolean'),
  eventType: attr('number'),
  // Awarded badges
  userBadges: hasMany('user-badge')
  
});

Badge.reopenClass({
});

export default Badge;
