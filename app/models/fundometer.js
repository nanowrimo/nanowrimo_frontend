import DS from 'ember-data';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default DS.Model.extend({
  goalNumber: DS.attr('number'),
  raisedNumber: DS.attr('number'),
  donorNumber: DS.attr('number')
});
