import { Response } from 'ember-cli-mirage';

export default function() {

  // Config

  this.urlPrefix = 'https://api.nanowrimo.org';
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  // Authentication

  this.post('auth/register', () => {
    return new Response(201);
  });
  this.post('auth/login', () => {
    return {
      access_token: 'token'
    };
  });
  this.get('uniqueness', (schema, request) => {
    let queryParams = request.queryParams;

    if (queryParams.email) {
      return { available: queryParams.email !== "taken@example.com" };
    }
    if (queryParams.username) {
      return { available: queryParams.username !== "taken" };
    }

    return new Response(400);
  });

  // CRUD

  this.resource('genre', { except: ['delete'] });
  this.del('genres/:id', ({ genres }, request) => {
    let id = request.params.id;
    genres.find(id).destroy();
    return { meta: {} };
  });
  this.resource('project', { only: ['index'] });
  this.post('projects', function({ projects, projectGenres }) {
    let attrs = this.normalizedRequestAttrs();
    let genreIds = attrs.genreIds;
    delete attrs.genreIds;
    let project = projects.create(attrs);
    for (let i=0; i<genreIds.length; i++) {
      projectGenres.create({
        projectId: project.attrs.id,
        genreId: genreIds[i]
      });
    }
    return project;
  });

  // Google

  this.urlPrefix = 'https://www.googleapis.com';
  this.passthrough();
}
