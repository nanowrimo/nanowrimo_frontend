import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';


export default Model.extend({
  isAdmin: attr('boolean', { defaultValue: '0' }),
  invitedById: attr('number'),
  invitationAccepted: attr('number', { defaultValue: '1' }),
  entryAt: attr('date'),
  entryMethod: attr('string'),
  exitAt: attr('date'),
  exitMethod: attr('string'),
  primary: attr('number'),
  group_id: attr('number'),
  user_id: attr('number'),
  groupType: attr('string'),
  group: belongsTo('group'),
  user: belongsTo('user'),
  
});
