import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

const UserBadge = Model.extend({
  user_id: attr('number'),
  badge_id: attr('number'),
  project_id: attr('number'),
  project_challenge_id: attr('number'),
  created_at: attr('date'),
  user: belongsTo('user'),
  badge: belongsTo('badge'),
  project: belongsTo('project'),
  projectChallenge: belongsTo('project-challenge'),
});

UserBadge.reopenClass({
});

export default UserBadge;
