import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  shouldSerializeHasMany(snapshot, key, relationship) {
    if (relationship.key === 'projects') {
      return false;
    }
    this._super(...arguments);
  }
});
