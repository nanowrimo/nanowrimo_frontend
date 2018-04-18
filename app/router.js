import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('authenticated', { path: '' }, function() {
    this.route('genres', function() {
      this.route('new');
      this.route('show', { path: '/:genre_id' });
      this.route('edit', { path: '/:genre_id/edit' });
    });
    this.route('projects', function() {
      this.route('new');
    });
    
    //User 
    this.route('users', function() {
      this.route('show', { path: '/:user_id'});
      this.route('edit');
    });
  });

  //email confirmations
  this.route('confirm-email');

  this.route('index', { path: '/' });
  this.route('sign-up');
  this.route('sign-in');
  this.route('404');
  this.route('not-found', { path: '/*path' });
  this.route('error');
  this.route('forgot-password');
});

export default Router;
