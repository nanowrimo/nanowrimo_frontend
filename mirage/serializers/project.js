import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(){
    let json = JSONAPISerializer.prototype.serialize.apply(this, arguments);
    if (Array.isArray(json.data)) {
      json.data.forEach((data, i) => {
        if (json.data[i].relationships) {
          json.data[i].relationships.genres.data = this.genreSerialize(data);
          json.data[i].relationships['project-sessions'].data = this.projectSessionSerialize(data);
          json.data[i].relationships.challenges.data = this.challengeSerialize(data);
          //if there is no user relationship, create one
          if (!json.data[i].relationships.user) {
            json.data[i].relationships.user = {data:{}};
          }
          json.data[i].relationships.user.data = this.userSerialize(data);
        }
      });
    } else {
      if (json.data.relationships) {
        json.data.relationships.genres.data = this.genreSerialize(json.data);
        json.data.relationships.challenges.data = this.challengeSerialize(json.data);
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

  projectSessionSerialize(data) {
    return data.relationships['project-sessions'].data.map(projectSession => ({
      id: projectSession.id,
      type: 'project-session',
    }));
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
  userSerialize(data) {
    return {
      id: this.registry.schema.projects.find(data.id).userId,
      type: 'user'
    };
  },

  includedAssociations(included) {
    return included.map(projectAssociation => {
      switch(projectAssociation.type) {
        case 'project-genres': {
          let genreId = this.registry.schema.projectGenres.find(projectAssociation.id).genreId;
          let genre = this.registry.schema.genres.find(genreId);
          return {
            id: genre.id,
            type: 'genre',
            attributes: {
              name: genre.name
            }
          }
        }
        case 'project-challenges': {
          let challengeId = this.registry.schema.projectChallenges.find(projectAssociation.id).challengeId;
          let challenge = this.registry.schema.challenges.find(challengeId);
          return {
            id: challenge.id,
            type: 'challenge',
            attributes: {
              type: challenge.type,
              name: challenge.name,
              'required-goal': challenge.requiredGoal,
              'starts-on': challenge.startsOn,
              'ends-on': challenge.endsOn
            }
          }
        }
        case 'project-sessions': {
          let session = this.registry.schema.projectSessions.find(projectAssociation.id);
           return {
            id: session.id,
            type: 'project-session',
            attributes: {
              count: session.count,
              start: session.start,
              end: session.end,
              where: session.where,
              feeling: session.feeling,
              'created-at': session.createdAt,
              'unit-ype': session.unitType,
            }
          }
        }
      }
      
    });
  }
});
