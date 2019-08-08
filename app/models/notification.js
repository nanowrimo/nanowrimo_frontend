import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';


export default Model.extend({
  user_id: attr('number'),
  displayAt: attr('date'),
  headline: attr('string'),
  content: attr('string'),
  actionType: attr('string'),
  actionId: attr('string'),
  imageUrl: attr('string'),
  user: belongsTo('user'),
  dataCount: attr('number'),
  lastViewedAt: attr('date'),
});
