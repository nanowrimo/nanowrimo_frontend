import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(object) {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    json.data.relationships = this._relationships(object);

    return json;
  },

  _relationships(object) {
    return {
      user: {
        data: {
          id: object.userId,
          type: 'users'
        }
      }
    }
  }
});
