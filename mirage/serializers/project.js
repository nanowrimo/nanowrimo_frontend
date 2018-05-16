import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(){
    let json = JSONAPISerializer.prototype.serialize.apply(this, arguments);

    if (Array.isArray(json.data)) {
      json.data.forEach((data, i) => {
        if (json.data[i].relationships) {
          json.data[i].relationships.genres.data = this.genreSerialize(data);
          json.data[i].relationships.challenges.data = this.challengeSerialize(data);
        }
      });
    } else {
      if (json.data.relationships) {
        json.data.relationships.genres.data = this.genreSerialize(json.data);
        json.data.relationships.challenges.data = this.challengeSerialize(json.data);
      }
    }

    if (Array.isArray(json.included)) {
      json.included = this.includedAssociations(json.included);
    }

    return json;
  },

  genreSerialize(data) {
    return data.relationships.genres.data.map(projectGenre => ({
      id: this.registry.schema.projectGenres.find(projectGenre.id).genreId,
      type: 'genre',
    }));
  },
  challengeSerialize(data) {
    return data.relationships.challenges.data.map(projectChallenge => ({
      id: this.registry.schema.projectChallenges.find(projectChallenge.id).challengeId,
      type: 'challenge',
    }));
  },

  includedAssociations(included) {
    return included.map(projectAssociation => {
      switch(projectAssociation.type) {
        case 'project-genres':
          let genreId = this.registry.schema.projectGenres.find(projectAssociation.id).genreId;
          let genre = this.registry.schema.genres.find(genreId);
          return {
            id: genre.id,
            type: 'genre',
            attributes: {
              name: genre.name
            }
          }
          break;
        case 'project-challenges':
          let challengeId = this.registry.schema.projectChallenges.find(projectAssociation.id).challengeId;
          let challenge = this.registry.schema.challenges.find(challengeId);
          return {
            id: challenge.id,
            type: 'challenge',
            attributes: {
              name: challenge.name,
              'required-goal': challenge.requiredGoal,
              'starts-on': challenge.startsOn
            }
          }
          break;
      }
      
    });
  }
});
