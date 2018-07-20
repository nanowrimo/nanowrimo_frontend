import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize() {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);
    
    if (json.included) {
      json.data.relationships = this._relationships(json.included);
    }

    return json;
  },
  
  
  _relationships(included) {
    let relationships = {};

    ['projects', 'external-links', 'favorite-authors', 'favorite-books'].forEach(type => {
      relationships[type] = this._buildRelationship(type, included);
    });

    return relationships;
  },

  _buildRelationship(type, included) {
    let response = {};

    response.data = included.filter(i => i.type === type).map(i => {
      return { id: i.id, type }
    });

    return response;
  }
});
