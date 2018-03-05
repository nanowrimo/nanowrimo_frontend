import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  shouldSerializeHasMany(snapshot, key, relationship) {
    if (relationship.key === 'projects') {
      return false;
    }
    this._super(...arguments);
  }
});
