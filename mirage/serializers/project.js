import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(){
    let json = JSONAPISerializer.prototype.serialize.apply(this, arguments);

    if (Array.isArray(json.data)) {
      json.data.forEach((data, i) => {
        if (json.data[i].relationships) {
          json.data[i].relationships.genres.data = this.genreSerialize(data);
        }
      });
    } else {
      if (json.data.relationships) {
        json.data.relationships.genres.data = this.genreSerialize(json.data);
      }
    }

    if (Array.isArray(json.included)) {
      json.included = this.includedGenres(json.included);
    }

    return json;
  },

  genreSerialize(data) {
    return data.relationships.genres.data.map(projectGenre => ({
      id: this.registry.schema.projectGenres.find(projectGenre.id).genreId,
      type: 'genre',
    }));
  },

  includedGenres(included) {
    return included.map(projectGenre => {
      let genreId = this.registry.schema.projectGenres.find(projectGenre.id).genreId;
      let genre = this.registry.schema.genres.find(genreId);
      return {
        id: genre.id,
        type: 'genre',
        attributes: {
          name: genre.name
        }
      }
    });
  }
});
