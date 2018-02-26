import { Response } from 'ember-cli-mirage';

export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  this.urlPrefix = 'https://api.nanowrimo.org';
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
  */

  this.post('users');
  this.post('auth/login', () => {
    return {
      access_token: 'token'
    };
  });
  this.get('uniqueness', (schema, request) => {
    let queryParams = request.queryParams;

    if (queryParams.email) {
      return queryParams.email === "taken@example.com" ? new Response(200) : new Response(404);
    }
    if (queryParams.username) {
      return queryParams.username === "taken" ? new Response(200) : new Response(404);
    }

    return new Response(400);
  });

  this.urlPrefix = 'https://www.googleapis.com';
  this.passthrough();
}
