import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';


export default Model.extend({
  group_id: attr('number'),
  user_id: attr('number'),
  createdAt: attr('date'),
  content: attr('string'),
  group: belongsTo('group'),
  user: belongsTo('user'),
  sender_avatar_url: attr('string'),
  sender_name: attr('string'),
  sender_slug: attr('string'),
  official: attr('boolean'),
});
