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

  this.resource('genre');

  // Google

  this.urlPrefix = 'https://www.googleapis.com';
  this.passthrough();
}
