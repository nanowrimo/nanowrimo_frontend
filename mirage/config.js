import { Response } from 'ember-cli-mirage';

export default function() {

  // Config

  this.urlPrefix = 'https://api.nanowrimo.org';
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  // Authentication

  this.resource('users', { only: ['index','update'] });
  this.post('users', () => {
    return new Response(201);
  });
  this.post('users/sign_in', () => {
    return {
      auth_token: 'token'
    };
  });
  this.get('/users/uniqueness', (schema, request) => {
    let queryParams = request.queryParams;

    if (queryParams.email) {
      return { available: queryParams.email !== "taken@example.com" };
    }
    if (queryParams.name) {
      return { available: queryParams.username !== "taken" };
    }

    return new Response(400);
  });
  this.get('/users/current', ({users}) => {
    return users.find(1);
  });
  this.get('/users/:name', ({users}, request) => {
    let name = request.params.name;
    let user = users.findBy({ name });
    return user || new Response(404);
  });

  this.get('/fundometer', ({fundometers}) => {
    return fundometers.find(1);
  });

  // CRUD

  this.resource('groups', { only: ['index'] });
  this.get('groups/:slug',({groups}, request) => {
    let slug = request.params.slug;
    let group = groups.findBy({ slug });
    return group || new Response(404);
  });
  this.resource('group-users', { only: ['index'] });
  this.post('group-users', function({groupUsers}){
    let attrs = this.normalizedRequestAttrs();
    let groupUser = groupUsers.create(attrs);
    return groupUser;
  });
  
  //this.resource('locations', { only: ['index'] });
  
  this.resource('challenges', { only: ['index'] });
  this.resource('external-links', { only: ['create', 'update'] });
  this.del('external-links/:id', ({ externalLinks }, request) => {
    let id = request.params.id;
    externalLinks.find(id).destroy();
    return { meta: {} };
  });
  this.resource('favorite-authors', { only: ['create', 'update'] });
  this.del('favorite-authors/:id', ({ favoriteAuthors }, request) => {
    let id = request.params.id;
    favoriteAuthors.find(id).destroy();
    return { meta: {} };
  });
  this.resource('favorite-books', { only: ['create', 'update'] });
  this.del('favorite-books/:id', ({ favoriteBooks }, request) => {
    let id = request.params.id;
    favoriteBooks.find(id).destroy();
    return { meta: {} };
  });
  this.resource('genre', { except: ['delete'] });
  this.del('genres/:id', ({ genres }, request) => {
    let id = request.params.id;
    genres.find(id).destroy();
    return { meta: {} };
  });
  this.resource('project', { only: ['index'] });
  this.get('projects/:slug',({projects}, request) => {
    let slug = request.params.slug;
    let project = projects.findBy({ slug });
    return project || new Response(404);
  });
  this.post('projects', function({ projects, projectGenres }) {
    let attrs = this.normalizedRequestAttrs();
    let genreIds = attrs.genreIds;
    delete attrs.genreIds;
    let project = projects.create(attrs);
    if (genreIds) {
      for (let i=0; i<genreIds.length; i++) {
        projectGenres.create({
          projectId: project.attrs.id,
          genreId: genreIds[i]
        });
      }
    }
    return project;
  });
  this.post('/project-challenges', function({projectChallenges}){
    let attrs = this.normalizedRequestAttrs();
    let projectChallenge = projectChallenges.create(attrs);
    
    
    return projectChallenge;
  });
  // Google

  this.urlPrefix = 'https://www.googleapis.com';
  this.passthrough();
  
}
