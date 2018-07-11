import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(){
    let json = JSONAPISerializer.prototype.serialize.apply(this, arguments);
    if (Array.isArray(json.data)) {
      json.data.forEach((data, i) => {
        if (json.data[i].relationships) {
          json.data[i].relationships.locations.data = this.locationSerialize(data);
        }
      });
    } else {
      if (json.data.relationships) {
        json.data.relationships.locations.data = this.locationSerialize(json.data);
      }
    }

    if (Array.isArray(json.included)) {
      json.included = this.includedAssociations(json.included);
    }

    return json;
  },

  locationSerialize(data) {
    return data.relationships.locations.data.map(locationGroup => ({
      id: this.registry.schema.locationGroups.find(locationGroup.id).locationId,
      type: 'location',
    }));
  },

  includedAssociations(included) {
    return included.map(groupAssociation => {
      switch(groupAssociation.type) {
        case 'location-groups': {
          let locationId = this.registry.schema.locationGroups.find(groupAssociation.id).locationId;
          let location = this.registry.schema.locations.find(locationId);
          return {
            id: location.id,
            type: 'location',
            attributes: {
              name: location.name,
              longitude: location.longitude,
              latitude: location.latitude
            }
          }
        }
      }
      
    });
  }
});
