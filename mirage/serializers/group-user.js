import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(){
    let json = JSONAPISerializer.prototype.serialize.apply(this, arguments);
    if (Array.isArray(json.data)) {
      json.data.forEach((data, i) => {
        if (json.data[i].relationships) {
          //if there is no group relationship, create one
          if (!json.data[i].relationships.group) {
            json.data[i].relationships.group = {data:{}};
          }
          json.data[i].relationships.group.data = this.groupSerialize(data);
          //if there is no user relationship, create one
          if (!json.data[i].relationships.user) {
            json.data[i].relationships.user = {data:{}};
          }
          json.data[i].relationships.user.data = this.userSerialize(data);
        }
      });
    } else {
      if (json.data.relationships) {
        //if there is no group relationship, create one
        if (!json.data.relationships.group) {
          json.data.relationships.group = {data:{}};
        }
        json.data.relationships.group.data = this.groupSerialize(json.data);
        //if there is no user relationship, create one
        if (!json.data.relationships.user) {
          json.data.relationships.user = {data:{}};
        }
        json.data.relationships.user.data = this.userSerialize(json.data);
      }
    }

    if (Array.isArray(json.included)) {
      json.included = this.includedAssociations(json.included);
    }

    return json;
  },

  userSerialize(data) {
    return {
      id: this.registry.schema['group-users'].find(data.id).userId,
      type: 'user'
    };
  },
  groupSerialize(data) {
    return {
      id: this.registry.schema['group-users'].find(data.id).userId,
      type: 'group'
    };
  },

});
