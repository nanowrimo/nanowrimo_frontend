import { JSONAPISerializer } from 'ember-cli-mirage';
 
export default JSONAPISerializer.extend({
  serialize(){
    let json = JSONAPISerializer.prototype.serialize.apply(this, arguments);
 
    if (Array.isArray(json.data)) {
      json.data.forEach((data, i) => {
        json.data[i].relationships.users.data = this.userSerialize(data);
      });
    } else {
      json.data.relationships.users.data = this.userSerialize(json.data);
    }
 
    return json;
  },
 
  userSerialize(data) {
    return data.relationships.users.data.map(groupUser => ({
      id: this.registry.schema.groupUsers.find(groupUser.id).userId,
      type: 'user',
    }));
  }
});